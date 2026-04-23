"""Load and search coding standards from markdown files."""

import os
import re
from pathlib import Path


def _get_standards_dir() -> Path:
    """Return the path to the shared standards directory."""
    return Path(__file__).resolve().parent.parent / "standards"


def _validate_path_segment(value: str, label: str) -> None:
    """Validate that a path segment does not contain path traversal or separators."""
    if ".." in value or "/" in value or "\\" in value:
        raise ValueError(f'Invalid {label}: "{value}"')


def get_available_languages() -> list[str]:
    """Return sorted list of available language directories."""
    standards_dir = _get_standards_dir()
    return sorted(
        d.name for d in standards_dir.iterdir() if d.is_dir()
    )


def list_languages_and_categories() -> list[dict]:
    """Return list of {language, categories} for each language."""
    languages = get_available_languages()
    result = []
    for language in languages:
        lang_dir = _get_standards_dir() / language
        categories = sorted(
            f.stem for f in lang_dir.glob("*.md")
        )
        result.append({"language": language, "categories": categories})
    return result


def load_category(language: str, category: str) -> str:
    """Load the content of a standards category for a language."""
    _validate_path_segment(language, "language")
    _validate_path_segment(category, "category")

    languages = get_available_languages()
    if language not in languages:
        raise ValueError(
            f'Language "{language}" not found. Available languages: {", ".join(languages)}'
        )

    lang_dir = _get_standards_dir() / language
    categories = [f.stem for f in lang_dir.glob("*.md")]

    if category not in categories:
        raise ValueError(
            f'Category "{category}" not found for language "{language}". '
            f'Available categories: {", ".join(sorted(categories))}'
        )

    file_path = lang_dir / f"{category}.md"
    return file_path.read_text(encoding="utf-8")


def search_all(
    language: str, query: str, limit: int = 5
) -> list[dict]:
    """Search across all standards for a language. Returns list of {category, heading, content}."""
    _validate_path_segment(language, "language")

    languages = get_available_languages()
    if language not in languages:
        raise ValueError(
            f'Language "{language}" not found. Available languages: {", ".join(languages)}'
        )

    lang_dir = _get_standards_dir() / language
    lower_query = query.lower()
    heading_matches: list[dict] = []
    body_matches: list[dict] = []

    for md_file in lang_dir.glob("*.md"):
        category = md_file.stem
        content = md_file.read_text(encoding="utf-8")

        sections = re.split(r"^## ", content, flags=re.MULTILINE)

        # Step 1: Check the H1 preamble first
        preamble = sections[0].strip() if sections else ""
        if preamble.startswith("#"):
            h1_heading = preamble.split("\n")[0].lstrip("# ").strip()

            if lower_query in h1_heading.lower():
                # H1 matched — add entire file content as body, skip H2 search
                full_body = "\n\n## ".join(sections[1:]).strip()
                if full_body:
                    full_body = "## " + full_body
                heading_matches.append(
                    {"category": category, "heading": h1_heading, "content": full_body}
                )
                continue  # ← skip to the next file, don't search H2s

        # Step 2: H1 didn't match — search individual H2 sections
        for section in sections[1:]:
            if not section.strip():
                continue

            lines = section.split("\n")
            heading = lines[0].strip()
            body = "\n".join(lines[1:]).strip()

            heading_lower = heading.lower()
            body_lower = body.lower()

            if lower_query in heading_lower:
                heading_matches.append(
                    {"category": category, "heading": heading, "content": body}
                )
            elif lower_query in body_lower:
                body_matches.append(
                    {"category": category, "heading": heading, "content": body}
                )

    # Heading matches rank higher than body-only matches
    combined = heading_matches + body_matches
    return combined[:limit]
