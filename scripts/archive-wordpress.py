#!/usr/bin/env python3
"""Create a reproducible local archive of the legacy WordPress site."""

from __future__ import annotations

import hashlib
import html
import json
import mimetypes
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


BASE_URL = "https://collaborativeprofessionals.com.au"
ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "legacy-archive"
SNAPSHOT_DIR = ARCHIVE_DIR / "html"
JSON_DIR = ARCHIVE_DIR / "wordpress-json"
MEDIA_DIR = ROOT / "public" / "media" / "legacy"
USER_AGENT = "SSCP site migration archive/1.0"
ARCHIVE_EXTENSIONS = {
    ".avif",
    ".bmp",
    ".gif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".png",
    ".pdf",
    ".svg",
    ".webp",
    ".doc",
    ".docx",
}


def fetch(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read(), response.headers.get("Content-Type", "")


def write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def safe_snapshot_name(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    slug = parsed.path.strip("/") or "home"
    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", slug).strip("-")
    if parsed.query:
        suffix = hashlib.sha256(parsed.query.encode()).hexdigest()[:10]
        slug = f"{slug}-{suffix}"
    return f"{slug}.html"


def sitemap_urls() -> tuple[list[str], list[str]]:
    index_url = f"{BASE_URL}/wp-sitemap.xml"
    index_data, _ = fetch(index_url)
    write_bytes(ARCHIVE_DIR / "wp-sitemap.xml", index_data)
    root = ET.fromstring(index_data)
    child_maps = [node.text for node in root.findall(".//{*}loc") if node.text]
    page_urls: list[str] = []
    for child_url in child_maps:
        child_data, _ = fetch(child_url)
        child_name = Path(urllib.parse.urlparse(child_url).path).name
        write_bytes(ARCHIVE_DIR / "sitemaps" / child_name, child_data)
        child_root = ET.fromstring(child_data)
        page_urls.extend(
            node.text for node in child_root.findall(".//{*}loc") if node.text
        )
    return child_maps, list(dict.fromkeys(page_urls))


def wordpress_collection(endpoint: str) -> list[dict]:
    url = f"{BASE_URL}/wp-json/wp/v2/{endpoint}?per_page=100&_embed=1"
    try:
        data, _ = fetch(url)
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return []
        raise
    parsed = json.loads(data)
    if not isinstance(parsed, list):
        return []
    write_bytes(
        JSON_DIR / f"{endpoint}.json",
        json.dumps(parsed, indent=2, ensure_ascii=False).encode(),
    )
    return parsed


def collect_urls(value: object) -> set[str]:
    urls: set[str] = set()
    if isinstance(value, str):
        for match in re.findall(r"https?://[^\s\"'<>\\\\]+", html.unescape(value)):
            urls.add(match.rstrip("),.;"))
    elif isinstance(value, list):
        for item in value:
            urls.update(collect_urls(item))
    elif isinstance(value, dict):
        for item in value.values():
            urls.update(collect_urls(item))
    return urls


def normalize_asset_url(raw_url: str, source_url: str) -> str | None:
    cleaned = html.unescape(raw_url).strip().strip("\"'")
    cleaned = cleaned.replace("\\/", "/")
    if cleaned.startswith("//"):
        cleaned = f"https:{cleaned}"
    absolute = urllib.parse.urljoin(source_url, cleaned)
    parsed = urllib.parse.urlparse(absolute)
    if parsed.hostname not in {
        "collaborativeprofessionals.com.au",
        "www.collaborativeprofessionals.com.au",
    }:
        return None
    if Path(parsed.path).suffix.lower() not in ARCHIVE_EXTENSIONS:
        return None
    return urllib.parse.urlunparse(parsed._replace(fragment=""))


def discover_page_assets(markup: str, source_url: str) -> set[str]:
    candidates = set(
        re.findall(
            r"""(?:src|href|content|data-src|data-lazy-src)\s*=\s*["']([^"']+)["']""",
            markup,
            flags=re.IGNORECASE,
        )
    )
    for srcset in re.findall(
        r"""(?:srcset|data-srcset)\s*=\s*["']([^"']+)["']""",
        markup,
        flags=re.IGNORECASE,
    ):
        candidates.update(item.strip().split()[0] for item in srcset.split(","))
    candidates.update(
        re.findall(r"""url\(\s*["']?([^"')]+)""", markup, flags=re.IGNORECASE)
    )
    candidates.update(
        re.findall(
            r"""https?://[^\s"'<>\\]+\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)(?:\?[^\s"'<>\\]*)?""",
            markup,
            flags=re.IGNORECASE,
        )
    )
    return {
        normalized
        for candidate in candidates
        if (normalized := normalize_asset_url(candidate, source_url))
    }


def local_asset_path(url: str, content_type: str = "") -> Path:
    parsed = urllib.parse.urlparse(url)
    remote_path = parsed.path.lstrip("/")
    if remote_path.startswith("wp-content/uploads/"):
        remote_path = remote_path.removeprefix("wp-content/uploads/")
    elif remote_path:
        remote_path = f"site-assets/{remote_path}"
    else:
        extension = mimetypes.guess_extension(content_type.split(";")[0]) or ".bin"
        remote_path = f"site-assets/asset-{hashlib.sha256(url.encode()).hexdigest()[:12]}{extension}"
    return MEDIA_DIR / remote_path


def main() -> None:
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    JSON_DIR.mkdir(parents=True, exist_ok=True)
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)

    child_maps, page_urls = sitemap_urls()
    rest_data: dict[str, list[dict]] = {}
    for endpoint in ("pages", "posts", "media", "categories", "tags", "users"):
        rest_data[endpoint] = wordpress_collection(endpoint)

    asset_urls = collect_urls(rest_data)
    snapshots: list[dict[str, str]] = []
    failures: list[dict[str, str]] = []
    for page_url in page_urls:
        try:
            page_data, content_type = fetch(page_url)
            snapshot_path = SNAPSHOT_DIR / safe_snapshot_name(page_url)
            write_bytes(snapshot_path, page_data)
            markup = page_data.decode("utf-8", errors="replace")
            asset_urls.update(discover_page_assets(markup, page_url))
            snapshots.append(
                {
                    "source_url": page_url,
                    "local_path": str(snapshot_path.relative_to(ROOT)),
                    "content_type": content_type,
                }
            )
        except Exception as error:  # keep archiving the rest of the site
            failures.append({"url": page_url, "error": str(error)})
        time.sleep(0.1)

    manifest_assets: list[dict[str, object]] = []
    normalized_assets = {
        normalized
        for url in asset_urls
        if (normalized := normalize_asset_url(url, BASE_URL))
    }
    for asset_url in sorted(normalized_assets):
        try:
            asset_data, content_type = fetch(asset_url)
            local_path = local_asset_path(asset_url, content_type)
            write_bytes(local_path, asset_data)
            manifest_assets.append(
                {
                    "source_url": asset_url,
                    "local_path": str(local_path.relative_to(ROOT)),
                    "content_type": content_type,
                    "bytes": len(asset_data),
                    "sha256": hashlib.sha256(asset_data).hexdigest(),
                }
            )
        except Exception as error:
            failures.append({"url": asset_url, "error": str(error)})
        time.sleep(0.05)

    manifest = {
        "source": BASE_URL,
        "sitemaps": child_maps,
        "pages": snapshots,
        "wordpress_collections": {
            endpoint: len(items) for endpoint, items in rest_data.items()
        },
        "assets": manifest_assets,
        "failures": failures,
    }
    write_bytes(
        ARCHIVE_DIR / "manifest.json",
        json.dumps(manifest, indent=2, ensure_ascii=False).encode(),
    )
    print(
        f"Archived {len(snapshots)} pages and {len(manifest_assets)} image assets "
        f"({len(failures)} failures)."
    )


if __name__ == "__main__":
    main()
