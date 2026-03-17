import json
import re
import shutil
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from bs4 import BeautifulSoup
from markdownify import markdownify as md


GHOST_EXPORT = Path(r"d:\blog\ghost_admin\abas-blog.ghost.2023-04-03-16-42-02.json")
GHOST_CONTENT = Path(r"d:\blog\ghost_admin\content")
SITE_ROOT = Path(r"d:\blog_github\abarajithan11.github.io")
POSTS_DIR = SITE_ROOT / "_posts"
PAGES_DIR = SITE_ROOT / "_pages"
CONTENT_DIR = SITE_ROOT / "content"

ZERO_WIDTH_RE = re.compile(r"[\u200b\u200c\u200d\u2060\ufeff]")
SELF_HOST_RE = re.compile(r"^https?://(?:www\.)?aba-blog\.xyz/(?P<rest>.*)$", re.IGNORECASE)
CONTENT_URL_RE = re.compile(r"https?://(?:www\.)?aba-blog\.xyz/content/", re.IGNORECASE)
HARDWARE_SLUG_HINTS = {
    "cocotb",
    "dnn-to-chip-1",
    "dnn-to-chip-2",
    "dnn-to-chip-3",
    "dnn-to-chip-4",
    "dobbybot-2016",
    "embedded-2021",
    "processor-2018",
    "self-driving-on-mars",
    "smart-lock",
    "systemverilog-2020",
    "vision-traffic-2019",
}
TRAVEL_SLUG_HINTS = {
    "agra-2020",
    "best-summer-2017",
    "bodh-gaya-india-2020",
    "brisbane-2018",
    "byron-bay-australia-2018",
    "camel-safari-thar",
    "delhi-2020",
    "ekka-2018",
    "fraser-island-2018",
    "gold-coast-2018",
    "holi-india-2020",
    "india",
    "jaipur-2020",
    "jaisalmer-2020",
    "jodhpur-udaipur-2020",
    "khuri-village-india-2020",
    "kolkata-2020",
    "lamington-2018",
    "lucknow-2020",
    "monkeys-glasses-india",
    "northeast-india-2019",
    "return-2020",
    "sex-temples-khajuraho-2020",
    "skydive-sunshine-coast",
    "springbrook-2018",
    "straddie-2018",
    "taj-mahal-architecture",
    "taste-of-india",
    "upper-gartmore",
    "varanasi-india-2020",
}
HARDWARE_KEYWORDS = (
    "accelerator",
    "arm+fpga",
    "asic",
    "battlebot",
    "bus",
    "chip",
    "cocotb",
    "embedded",
    "fpga",
    "hardware",
    "isa",
    "mpsoc",
    "processor",
    "rtl",
    "soc",
    "systemverilog",
    "verilog",
)


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = ZERO_WIDTH_RE.sub("", text)
    text = text.replace("\xa0", " ")
    return text


def squash_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", normalize_text(text)).strip()


def yaml_quote(text: str) -> str:
    return "'" + squash_spaces(text).replace("'", "''") + "'"


def normalize_href(url: str) -> str:
    if not url:
        return ""
    url = normalize_text(url).strip()
    if url.startswith("__GHOST_URL__/"):
        rest = url[len("__GHOST_URL__/") :]
        if not rest:
            return "/"
        if rest.startswith("content/"):
            return "/" + rest
        path = "/" + rest
        if path.endswith("/index.html"):
            return path[: -len("/index.html")] + "/"
        if not path.endswith("/") and "." not in Path(path).name:
            path = path + "/"
        return path
    url = url.replace("__GHOST_URL__/content/", "/content/")
    url = CONTENT_URL_RE.sub("/content/", url)

    match = SELF_HOST_RE.match(url)
    if not match:
        return url

    rest = match.group("rest")
    if not rest:
        return "/"

    parsed = urlparse("/" + rest)
    path = parsed.path or "/"
    if path.startswith("/content/"):
        return path

    if path.endswith("/index.html"):
        path = path[: -len("/index.html")] + "/"
    elif not path.endswith("/") and "." not in Path(path).name:
        path = path + "/"

    return path


def normalize_markup(html: str) -> str:
    html = normalize_text(html)
    html = html.replace("__GHOST_URL__/content/", "/content/")
    html = CONTENT_URL_RE.sub("/content/", html)
    return html


def make_link_paragraph(soup: BeautifulSoup, href: str, label: str):
    p = soup.new_tag("p")
    a = soup.new_tag("a", href=href or "")
    a.string = squash_spaces(label) or href or ""
    p.append(a)
    return p


def normalize_bookmark_cards(soup: BeautifulSoup):
    for figure in soup.select("figure.kg-bookmark-card"):
        anchor = figure.select_one("a.kg-bookmark-container")
        title = figure.select_one(".kg-bookmark-title")
        href = normalize_href(anchor.get("href") if anchor else "")
        label = title.get_text(" ", strip=True) if title else href
        figure.replace_with(make_link_paragraph(soup, href, label))


def normalize_button_cards(soup: BeautifulSoup):
    for card in soup.select(".kg-button-card"):
        anchor = card.find("a")
        href = normalize_href(anchor.get("href") if anchor else "")
        label = anchor.get_text(" ", strip=True) if anchor else href
        card.replace_with(make_link_paragraph(soup, href, label))


def embed_href(iframe_src: str) -> str:
    if not iframe_src:
        return ""
    iframe_src = normalize_href(iframe_src)
    parsed = urlparse(iframe_src)
    if "youtube.com" in parsed.netloc and parsed.path.startswith("/embed/"):
        video_id = parsed.path.split("/embed/", 1)[1]
        return f"https://www.youtube.com/watch?v={video_id}"
    return iframe_src


def normalize_embed_cards(soup: BeautifulSoup):
    for figure in soup.select("figure.kg-embed-card"):
        iframe = figure.find("iframe")
        caption = figure.find("figcaption")
        href = embed_href(iframe.get("src") if iframe else "")
        label = caption.get_text(" ", strip=True) if caption else "Embedded media"
        figure.replace_with(make_link_paragraph(soup, href, label))


def normalize_iframes(soup: BeautifulSoup):
    for iframe in soup.find_all("iframe"):
        href = embed_href(iframe.get("src"))
        label = "Embedded media"
        previous = iframe.find_previous(["h2", "h3", "p"])
        if previous:
            previous_text = squash_spaces(previous.get_text(" ", strip=True))
            if previous_text:
                label = previous_text
        iframe.replace_with(make_link_paragraph(soup, href, label))


def normalize_header_cards(soup: BeautifulSoup):
    for card in soup.select(".kg-header-card"):
        nodes = []
        header = card.select_one(".kg-header-card-header")
        subheader = card.select_one(".kg-header-card-subheader")
        if header and header.get_text(" ", strip=True):
            h2 = soup.new_tag("h2")
            h2.string = squash_spaces(header.get_text(" ", strip=True))
            nodes.append(h2)
        if subheader and subheader.get_text(" ", strip=True):
            h3 = soup.new_tag("h3")
            h3.string = squash_spaces(subheader.get_text(" ", strip=True))
            nodes.append(h3)
        if nodes:
            first = nodes[0]
            card.replace_with(first)
            current = first
            for node in nodes[1:]:
                current.insert_after(node)
                current = node
        else:
            card.decompose()


def normalize_all_links(soup: BeautifulSoup):
    for tag in soup.find_all(href=True):
        tag["href"] = normalize_href(tag["href"])
    for tag in soup.find_all(src=True):
        tag["src"] = normalize_href(tag["src"])
    for tag in soup.find_all(srcset=True):
        entries = []
        for part in tag["srcset"].split(","):
            chunk = squash_spaces(part)
            if not chunk:
                continue
            pieces = chunk.split(" ", 1)
            url = normalize_href(pieces[0])
            if len(pieces) == 2:
                entries.append(f"{url} {pieces[1]}")
            else:
                entries.append(url)
        tag["srcset"] = ", ".join(entries)


def convert_html_to_markdown(html: str) -> str:
    soup = BeautifulSoup(normalize_markup(html), "lxml")
    normalize_bookmark_cards(soup)
    normalize_button_cards(soup)
    normalize_embed_cards(soup)
    normalize_iframes(soup)
    normalize_header_cards(soup)
    normalize_all_links(soup)
    text = md(
        str(soup),
        heading_style="ATX",
        bullets="-",
        strip=["html", "body"],
    )
    text = normalize_text(text)
    text = re.sub(
        r"\(__GHOST_URL__/([^)]+)\)",
        lambda match: f"({normalize_href('__GHOST_URL__/' + match.group(1))})",
        text,
    )
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def has_feature_image(markdown_text: str, feature_image: str) -> bool:
    if not feature_image:
        return False
    image_name = Path(urlparse(feature_image).path).name
    return feature_image in markdown_text or image_name in markdown_text


def build_body(post: dict) -> str:
    html = post.get("html") or ""
    body = convert_html_to_markdown(html)
    feature_image = normalize_href(post.get("feature_image", ""))
    if feature_image and not has_feature_image(body, feature_image):
        body = f"![]({feature_image})\n\n{body}" if body else f"![]({feature_image})"
    return body.strip() + "\n"


def is_my_work(post: dict, tags: list[str]) -> bool:
    slug = post["slug"].lower()
    if slug in HARDWARE_SLUG_HINTS:
        return True
    haystack = " ".join(
        [
            slug,
            normalize_text(post.get("title", "")).lower(),
            normalize_text(post.get("plaintext", "")).lower(),
            " ".join(tag.lower() for tag in tags),
        ]
    )
    return any(keyword in haystack for keyword in HARDWARE_KEYWORDS)


def classify_post(post: dict, tags: list[str]) -> str:
    slug = post["slug"]
    tag_set = {tag.lower() for tag in tags}
    if (
        "travels" in tag_set
        or "australia" in tag_set
        or "india" in tag_set
        or slug in TRAVEL_SLUG_HINTS
    ):
        return "Travel"
    if "teaching" in tag_set:
        return "Teaching"
    if "technical projects" in tag_set and is_my_work(post, tags):
        return "My Work"
    return "Other"


def write_utf8(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def build_front_matter(title: str, permalink: str, date: str | None = None, category: str | None = None, tags: list[str] | None = None, modified: str | None = None) -> str:
    lines = ["---"]
    lines.append(f"title: {yaml_quote(title)}")
    if date:
        lines.append(f"date: {date}")
    if modified and modified != date:
        lines.append(f"last_modified_at: {modified}")
    if category:
        lines.append("categories:")
        lines.append(f"  - {yaml_quote(category)}")
    if tags:
        lines.append("tags:")
        for tag in tags:
            lines.append(f"  - {yaml_quote(tag)}")
    lines.append(f"permalink: {permalink}")
    lines.append("---")
    return "\n".join(lines)


def copy_content_tree():
    CONTENT_DIR.mkdir(exist_ok=True)
    for name in ("images", "media"):
        src = GHOST_CONTENT / name
        if not src.exists():
            continue
        dest = CONTENT_DIR / name
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(src, dest)


def load_data():
    payload = json.loads(GHOST_EXPORT.read_text(encoding="utf-8"))
    return payload["db"][0]["data"]


def build_tag_map(data: dict) -> dict[str, list[str]]:
    tag_names = {tag["id"]: tag["name"] for tag in data["tags"]}
    post_tags: dict[str, list[str]] = {}
    for relation in data["posts_tags"]:
        post_tags.setdefault(relation["post_id"], []).append(tag_names[relation["tag_id"]])
    for post_id in post_tags:
        post_tags[post_id] = sorted(post_tags[post_id])
    return post_tags


def migrate():
    data = load_data()
    post_tags = build_tag_map(data)

    copy_content_tree()

    for post in data["posts"]:
        if post["status"] != "published":
            continue

        title = squash_spaces(post["title"])
        permalink = f"/{post['slug']}/"
        body = build_body(post)

        if post["type"] == "post":
            tags = post_tags.get(post["id"], [])
            category = classify_post(post, tags)
            front_matter = build_front_matter(
                title=title,
                permalink=permalink,
                date=post["published_at"],
                category=category,
                tags=tags,
                modified=post["updated_at"],
            )
            target = POSTS_DIR / f"{post['published_at'][:10]}-{post['slug']}.md"
            write_utf8(target, f"{front_matter}\n\n{body}")
        elif post["type"] == "page":
            front_matter = build_front_matter(title=title, permalink=permalink)
            target = PAGES_DIR / f"{post['slug']}.md"
            write_utf8(target, f"{front_matter}\n\n{body}")


if __name__ == "__main__":
    migrate()

