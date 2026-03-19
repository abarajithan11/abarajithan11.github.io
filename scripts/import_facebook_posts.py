from __future__ import annotations

import datetime as dt
import hashlib
import html
import json
import re
import subprocess
import unicodedata
from pathlib import Path
from zoneinfo import ZoneInfo


REPO_ROOT = Path(__file__).resolve().parents[1]
EXPORT_ROOT = REPO_ROOT / "your_facebook_activity" / "posts"
POSTS_JSON = EXPORT_ROOT / "your_posts__check_ins__photos_and_videos_1.json"
POSTS_DIR = REPO_ROOT / "_posts"
MEDIA_ROOT = REPO_ROOT / "content" / "images" / "2026_from_fb"
TIMEZONE = ZoneInfo("America/Los_Angeles")
CUTOFF = dt.datetime(2022, 6, 1, tzinfo=TIMEZONE)
MIN_CHARS = 750
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".m4v", ".webm"}


def maybe_fix_mojibake(text: str) -> str:
    if not text:
        return text
    if not any(marker in text for marker in ("Ã", "Â", "â")):
        return text
    try:
        candidate = text.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text
    return candidate if candidate.count("â") < text.count("â") else text


def clean_text(text: str) -> str:
    text = maybe_fix_mojibake(text)
    text = html.unescape(text)
    text = text.replace("\u200b", "")
    text = text.replace("\ufeff", "")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"@\[[^:\]]+:\d+:([^\]]+)\]", r"\1", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-") or "facebook-post"


def walk_values(value):
    if isinstance(value, dict):
        yield value
        for nested in value.values():
            yield from walk_values(nested)
    elif isinstance(value, list):
        for item in value:
            yield from walk_values(item)


def extract_main_text(post: dict) -> str:
    texts: list[str] = []
    for node in walk_values(post):
        if not isinstance(node, dict):
            continue
        for key in ("post", "description", "text", "event_description"):
            value = node.get(key)
            if isinstance(value, str) and value.strip():
                texts.append(clean_text(value))
    if not texts:
        return ""
    texts.sort(key=len, reverse=True)
    return texts[0]


def extract_media_sources(post: dict) -> list[Path]:
    by_stem: dict[str, Path] = {}
    seen_uris: set[str] = set()

    for node in walk_values(post.get("attachments", [])):
        if not isinstance(node, dict):
            continue
        media = node.get("media")
        if not isinstance(media, dict):
            continue
        uri = media.get("uri")
        if not isinstance(uri, str) or not uri.strip() or uri in seen_uris:
            continue
        seen_uris.add(uri)

        source = REPO_ROOT / uri
        if not source.exists() or not source.is_file():
            continue

        key = source.stem.lower()
        current = by_stem.get(key)
        if current is None or source.stat().st_size > current.stat().st_size:
            by_stem[key] = source

    return list(by_stem.values())


def split_title_and_body(text: str) -> tuple[str, str]:
    lines = [line.strip() for line in text.splitlines()]
    non_empty_lines = [line for line in lines if line]
    if not non_empty_lines:
        return "Facebook Post", ""

    title = non_empty_lines[0]
    body_lines = lines[:]
    first_non_empty_index = next(i for i, line in enumerate(lines) if line)

    if len(title) <= 140:
        body_lines = lines[first_non_empty_index + 1 :]
        while body_lines and not body_lines[0].strip():
            body_lines.pop(0)
    else:
        sentence_match = re.match(r"(.+?[.!?])(?:\s|$)", title)
        if sentence_match and len(sentence_match.group(1)) <= 120:
            title = sentence_match.group(1).strip()
        elif len(title) > 120:
            title = title[:117].rstrip() + "..."

    body = "\n".join(body_lines).strip()
    if not body:
        body = text.strip()
    return title, body


def media_markdown(relative_path: str) -> str:
    extension = Path(relative_path).suffix.lower()
    web_path = "/" + relative_path.replace("\\", "/")
    if extension in IMAGE_EXTENSIONS:
        return f"![]({web_path})"
    if extension in VIDEO_EXTENSIONS:
        return f'<video controls src="{web_path}" preload="metadata"></video>'
    return f"[Attachment]({web_path})"


def resolve_unique_post_path(date_prefix: str, slug: str) -> Path:
    candidate = POSTS_DIR / f"{date_prefix}-{slug}.md"
    if not candidate.exists():
        return candidate

    index = 2
    while True:
        candidate = POSTS_DIR / f"{date_prefix}-{slug}-{index}.md"
        if not candidate.exists():
            return candidate
        index += 1


def file_sha1(path: Path) -> str:
    digest = hashlib.sha1()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def run_powershell(command: str) -> None:
    subprocess.run(["powershell", "-NoProfile", "-Command", command], check=True)


def ensure_directory(path: Path) -> None:
    run_powershell(f"New-Item -ItemType Directory -Force -Path '{path}' | Out-Null")


def powershell_copy(source: Path, destination: Path) -> None:
    run_powershell(f"Copy-Item -LiteralPath '{source}' -Destination '{destination}' -Force")


def copy_media(sources: list[Path], slug: str) -> list[str]:
    destination_dir = MEDIA_ROOT / slug
    ensure_directory(destination_dir)

    copied_relative_paths: list[str] = []
    used_names: set[str] = set()
    seen_hashes: set[str] = set()

    for source in sources:
        source_hash = file_sha1(source)
        if source_hash in seen_hashes:
            continue
        seen_hashes.add(source_hash)

        base_name = source.name
        stem = source.stem
        suffix = source.suffix.lower()
        candidate_name = base_name
        counter = 2
        while candidate_name in used_names:
            candidate_name = f"{stem}-{counter}{suffix}"
            counter += 1

        used_names.add(candidate_name)
        destination = destination_dir / candidate_name
        if not destination.exists():
            powershell_copy(source, destination)
        copied_relative_paths.append(str(Path("content") / "images" / "2026_from_fb" / slug / candidate_name))

    return copied_relative_paths


def format_front_matter(title: str, date_value: dt.datetime) -> str:
    date_string = date_value.strftime("%Y-%m-%d %H:%M:%S %z")
    return (
        "---\n"
        f"title: {json.dumps(title, ensure_ascii=False)}\n"
        f"date: {date_string}\n"
        f"last_modified_at: {date_string}\n"
        "categories:\n"
        "  - 'Other'\n"
        "tags:\n"
        "  - 'Facebook'\n"
        "---\n"
    )


def build_post_content(post: dict) -> tuple[str, dt.datetime, str, list[str]] | None:
    timestamp = post.get("timestamp")
    if not isinstance(timestamp, int):
        return None

    local_datetime = dt.datetime.fromtimestamp(timestamp, TIMEZONE)
    if local_datetime < CUTOFF:
        return None

    text = extract_main_text(post)
    if len(text) < MIN_CHARS:
        return None

    title, body = split_title_and_body(text)
    slug = slugify(title)
    media_paths = copy_media(extract_media_sources(post), slug)

    body_parts = [body] if body else []
    if media_paths:
        body_parts.append("\n\n".join(media_markdown(path) for path in media_paths))

    content = format_front_matter(title, local_datetime)
    if body_parts:
        content += "\n" + "\n\n".join(part for part in body_parts if part).strip() + "\n"
    return title, local_datetime, content, media_paths


def main() -> None:
    with POSTS_JSON.open("r", encoding="utf-8") as handle:
        posts = json.load(handle)

    imported = []

    for post in posts:
        built = build_post_content(post)
        if not built:
            continue

        title, local_datetime, content, media_paths = built
        slug = slugify(title)
        post_path = resolve_unique_post_path(local_datetime.strftime("%Y-%m-%d"), slug)
        post_path.write_text(content, encoding="utf-8", newline="\n")
        imported.append((post_path.name, title, len(media_paths)))

    print(f"Imported {len(imported)} posts.")
    for filename, title, media_count in imported:
        print(f"{filename} | media={media_count} | {title}")


if __name__ == "__main__":
    main()
