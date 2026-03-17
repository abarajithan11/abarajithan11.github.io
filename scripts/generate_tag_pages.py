from pathlib import Path
import re

ROOT = Path(r"d:\blog_github\abarajithan11.github.io")
POSTS_DIR = ROOT / "_posts"
PAGES_DIR = ROOT / "_pages"
DATA_DIR = ROOT / "_data"


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def extract_tags(text: str) -> list[str]:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        return []

    tags: list[str] = []
    lines = match.group(1).splitlines()
    inside_tags = False
    for line in lines:
        if line.strip() == "tags:":
            inside_tags = True
            continue
        if inside_tags:
            if line.startswith("  - "):
                tags.append(line[4:].strip().strip("'").strip('"'))
            elif line and not line.startswith(" "):
                break
    return tags


def write_tag_pages(tags: list[str]) -> None:
    for tag in tags:
        slug = slugify(tag)
        content = (
            "---\n"
            "layout: single\n"
            f'title: "{tag}"\n'
            f"permalink: /tags/{slug}/\n"
            "author_profile: true\n"
            "---\n\n"
            f'{{% include post-grid.html tag="{tag}" %}}\n'
        )
        (PAGES_DIR / f"tag-{slug}.md").write_text(content, encoding="utf-8")


def write_tag_data(tags: list[str]) -> None:
    lines = []
    for tag in tags:
        slug = slugify(tag)
        lines.extend([
            f'- title: "{tag}"',
            f"  url: /tags/{slug}/",
        ])
    (DATA_DIR / "tag_pages.yml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    tags = sorted(
        {
            tag
            for post_path in POSTS_DIR.glob("*.md")
            for tag in extract_tags(post_path.read_text(encoding="utf-8"))
        }
    )
    write_tag_pages(tags)
    write_tag_data(tags)
    print(f"generated {len(tags)} tag pages")


if __name__ == "__main__":
    main()
