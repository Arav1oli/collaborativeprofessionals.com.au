#!/usr/bin/env python3
"""Turn the WordPress export into small, editable JSON content files."""

from __future__ import annotations

import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "legacy-archive" / "wordpress-json"
CONTENT_DIR = ROOT / "content"
OLD_UPLOADS = "https://collaborativeprofessionals.com.au/wp-content/uploads/"
OLD_UPLOADS_HTTP = "http://collaborativeprofessionals.com.au/wp-content/uploads/"
OLD_EC2_UPLOADS = (
    "http://ec2-54-164-74-3.compute-1.amazonaws.com/wp-content/uploads/"
)
LOCAL_UPLOADS = "/media/legacy/"


def text_only(markup: str) -> str:
    value = re.sub(r"<script\b[^>]*>.*?</script>", "", markup, flags=re.I | re.S)
    value = re.sub(r"<style\b[^>]*>.*?</style>", "", value, flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def localize(markup: str) -> str:
    return (
        markup.replace(OLD_UPLOADS, LOCAL_UPLOADS)
        .replace(OLD_UPLOADS_HTTP, LOCAL_UPLOADS)
        .replace(OLD_EC2_UPLOADS, LOCAL_UPLOADS)
    )


class TableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.rows: list[list[dict[str, object]]] = []
        self.row: list[dict[str, object]] | None = None
        self.cell: dict[str, object] | None = None

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = dict(attrs)
        if tag == "tr":
            self.row = []
        elif tag in {"td", "th"} and self.row is not None:
            self.cell = {"parts": [], "links": []}
        elif tag == "a" and self.cell is not None:
            href = attributes.get("href")
            if href:
                links = self.cell["links"]
                assert isinstance(links, list)
                links.append(href)
        elif tag in {"br", "p", "div"} and self.cell is not None:
            parts = self.cell["parts"]
            assert isinstance(parts, list)
            parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"td", "th"} and self.row is not None and self.cell is not None:
            parts = self.cell["parts"]
            assert isinstance(parts, list)
            raw_text = html.unescape("".join(str(item) for item in parts))
            lines = [
                re.sub(r"\s+", " ", line).strip(" .")
                for line in raw_text.splitlines()
                if re.sub(r"\s+", " ", line).strip(" .")
            ]
            self.cell["lines"] = lines
            self.row.append(self.cell)
            self.cell = None
        elif tag == "tr" and self.row:
            self.rows.append(self.row)
            self.row = None

    def handle_data(self, data: str) -> None:
        if self.cell is not None:
            parts = self.cell["parts"]
            assert isinstance(parts, list)
            parts.append(data)


def build_members(page_markup: str) -> list[dict[str, str]]:
    parser = TableParser()
    parser.feed(page_markup)
    members: list[dict[str, str]] = []
    for row in parser.rows:
        if len(row) < 4:
            continue
        cells = [cell.get("lines", []) for cell in row[:4]]
        if not cells[0] or str(cells[0][0]).lower() == "name":
            continue
        links = row[3].get("links", [])
        email = next(
            (
                str(link).removeprefix("mailto:")
                for link in links
                if "@" in str(link)
            ),
            next((str(line) for line in cells[3] if "@" in str(line)), ""),
        )
        website = next(
            (
                str(link)
                for link in links
                if str(link).startswith(("http://", "https://"))
            ),
            "",
        )
        contact_lines = [
            str(line)
            for line in cells[3]
            if "@" not in str(line)
            and not str(line).lower().startswith(("www.", "http"))
        ]
        title_lines = [str(line) for line in cells[1]]
        leadership = next(
            (
                line
                for line in title_lines
                if any(
                    label in line.lower()
                    for label in ("president", "treasurer", "committee")
                )
            ),
            "",
        )
        profession = " · ".join(line for line in title_lines if line != leadership)
        firm_lines = [str(line) for line in cells[2]]
        members.append(
            {
                "name": str(cells[0][0]),
                "leadership": leadership,
                "profession": profession or leadership,
                "firm": firm_lines[0] if firm_lines else "",
                "location": " · ".join(firm_lines[1:]),
                "email": email,
                "phone": " · ".join(contact_lines),
                "website": website,
            }
        )
    return members


def build_faqs(process_markup: str) -> list[dict[str, str]]:
    matches = re.findall(
        r'<div id="faq-\d+" class="arconix-faq-accordion-title">(.*?)</div>'
        r'<div id="faq-[^"]+" class="arconix-faq-accordion-content">(.*?)'
        r"(?=</div><div id=\"faq-\d+\"|</div></div>)",
        process_markup,
        flags=re.I | re.S,
    )
    return [
        {"question": text_only(question), "answer_html": localize(answer.strip())}
        for question, answer in matches
    ]


def local_media_url(url: str) -> str:
    if "/wp-content/uploads/" in url:
        return LOCAL_UPLOADS + url.split("/wp-content/uploads/", 1)[1]
    return url


def build_articles(posts: list[dict]) -> list[dict[str, object]]:
    articles: list[dict[str, object]] = []
    for post in posts:
        media = post.get("_embedded", {}).get("wp:featuredmedia", [])
        image = ""
        image_alt = ""
        if media:
            image = local_media_url(media[0].get("source_url", ""))
            image_alt = media[0].get("alt_text", "")
        articles.append(
            {
                "slug": post["slug"],
                "title": text_only(post["title"]["rendered"]),
                "date": post["date"][:10],
                "excerpt": text_only(post["excerpt"]["rendered"]),
                "content_html": localize(post["content"]["rendered"]),
                "image": image,
                "image_alt": image_alt,
                "legacy_url": post["link"],
            }
        )
    return articles


def write_json(filename: str, value: object) -> None:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    (CONTENT_DIR / filename).write_text(
        json.dumps(value, indent=2, ensure_ascii=False) + "\n"
    )


def main() -> None:
    pages = json.loads((SOURCE_DIR / "pages.json").read_text())
    posts = json.loads((SOURCE_DIR / "posts.json").read_text())
    pages_by_slug = {page["slug"]: page for page in pages}
    members_markup = pages_by_slug["members"]["content"]["rendered"]
    process_markup = pages_by_slug["process"]["content"]["rendered"]
    write_json("members.json", build_members(members_markup))
    write_json("faqs.json", build_faqs(process_markup))
    write_json("articles.json", build_articles(posts))
    print(
        "Built content: "
        f"{len(build_members(members_markup))} members, "
        f"{len(build_faqs(process_markup))} FAQs, "
        f"{len(posts)} articles."
    )


if __name__ == "__main__":
    main()
