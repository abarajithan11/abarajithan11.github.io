from pathlib import Path
from datetime import datetime
import re

ROOT = Path(r"d:\blog_github\abarajithan11.github.io")
POSTS_DIR = ROOT / "_posts"
PAGES_DIR = ROOT / "_pages"
DATA_DIR = ROOT / "_data"


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def front_matter_and_body(text: str) -> tuple[list[str], str]:
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not match:
        return [], text
    return match.group(1).splitlines(), match.group(2)


def extract_list(lines: list[str], field: str) -> list[str]:
    items: list[str] = []
    inside = False
    for line in lines:
        if line.strip() == f"{field}:":
            inside = True
            continue
        if inside:
            if line.startswith("  - "):
                items.append(line[4:].strip().strip("'").strip('"'))
            elif line and not line.startswith(" "):
                break
    return items


def extract_scalar(lines: list[str], field: str) -> str:
    prefix = f"{field}:"
    for line in lines:
        if line.startswith(prefix):
            return line[len(prefix):].strip().strip("'").strip('"')
    return ""


def normalize_teaser(value: str) -> str:
    value = value.strip().strip("'").strip('"')
    value = value.replace("{{ site.content_base_url }}", "").replace("{{site.content_base_url}}", "")

    if "/content/" in value:
        value = value.split("/content", 1)[1]

    return value


def extract_first_image(body: str) -> str:
    markdown_match = re.search(r"!\[[^\]]*\]\((.+?)\)", body)
    if markdown_match:
        return normalize_teaser(markdown_match.group(1))

    html_match = re.search(r'<img[^>]+src="([^"]+)"', body)
    if html_match:
        return normalize_teaser(html_match.group(1))

    return ""


def load_posts() -> list[dict]:
    posts = []
    for post_path in POSTS_DIR.glob("*.md"):
        text = post_path.read_text(encoding="utf-8")
        lines, body = front_matter_and_body(text)
        if not lines:
            continue

        title = extract_scalar(lines, "title")
        date_str = extract_scalar(lines, "date")
        teaser = normalize_teaser(extract_scalar(lines, "teaser")) or extract_first_image(body)
        tags = extract_list(lines, "tags")
        permalink = extract_scalar(lines, "permalink")

        try:
            date = datetime.strptime(date_str[:19], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            date = datetime.strptime(date_str[:10], "%Y-%m-%d")

        posts.append(
            {
                "title": title,
                "date": date,
                "tags": tags,
                "teaser": teaser,
                "permalink": permalink,
            }
        )
    return posts


def build_tag_records(posts: list[dict]) -> list[dict]:
    tag_map: dict[str, list[dict]] = {}
    for post in posts:
        for tag in post["tags"]:
            tag_map.setdefault(tag, []).append(post)

    records = []
    for tag, tag_posts in sorted(tag_map.items()):
        tag_posts.sort(key=lambda post: post["date"], reverse=True)
        latest = tag_posts[0]
        records.append(
            {
                "title": tag,
                "slug": slugify(tag),
                "url": f"/tags/{slugify(tag)}/",
                "teaser": latest["teaser"],
                "latest_title": latest["title"],
                "count": len(tag_posts),
            }
        )
    return records


def write_tag_pages(records: list[dict]) -> None:
    for record in records:
        content = (
            "---\n"
            "layout: single\n"
            f'title: "{record["title"]}"\n'
            f'permalink: {record["url"]}\n'
            "author_profile: true\n"
            "---\n\n"
            f'{{% include post-grid.html tag="{record["title"]}" %}}\n'
        )
        (PAGES_DIR / f'tag-{record["slug"]}.md').write_text(content, encoding="utf-8")


def esc(value: str) -> str:
    return value.replace('"', "'")


def write_tag_data(records: list[dict]) -> None:
    lines = []
    for record in records:
        lines.extend(
            [
                f'- title: "{esc(record["title"])}"',
                f'  url: {record["url"]}',
                f'  teaser: "{esc(record["teaser"])}"',
                f'  latest_title: "{esc(record["latest_title"])}"',
                f'  count: {record["count"]}',
            ]
        )
    (DATA_DIR / "tag_pages.yml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    posts = load_posts()
    records = build_tag_records(posts)
    write_tag_pages(records)
    write_tag_data(records)
    print(f"generated {len(records)} tag pages")


if __name__ == "__main__":
    main()
