"""
Coding Standards MCP Server (HTTP).

Exposes UKEF coding standards as MCP tools over HTTP/SSE.
Uses the same tools as the stdin server: list_categories, get_guidelines,
search_guidelines, get_quick_reference.
"""

import uvicorn
from mcp.server.fastmcp import FastMCP

from standards_loader import (
    list_languages_and_categories,
    load_category,
    search_all,
)

mcp = FastMCP(
    "coding-standards-mcp-server",
    version="1.0.0",
    json_response=True,
)

LANGUAGE_DESCRIPTION = (
    'The programming language to retrieve standards for. Must be "python" or "nodejs". '
    "Determine this from the engineer's context: the file extension they are working in "
    "(.py = python, .ts/.js/.mjs = nodejs), the language they mention in their request, "
    "or the project type. If the language is ambiguous, call list_categories first to see "
    "what languages are available, or ask the engineer which language they are working in."
)


@mcp.tool()
def list_categories() -> str:
    """List all supported programming languages and their available coding standard categories.

    Call this tool FIRST when you need to discover what languages and coding guidelines are available
    before generating or reviewing code. Returns a structured list of languages (e.g. "python", "nodejs")
    and for each language, the available category names (e.g. "naming", "patterns", "structure")
    that can be passed to get_guidelines.

    Use this when:
    - You are about to generate code and want to know what standards are available
    - The engineer asks "what coding standards do you have?" or "what guidelines exist?"
    - You need to find the correct language or category name before calling get_guidelines
    - You are unsure which languages are supported

    Returns: A list of languages, each with their available category names."""
    try:
        data = list_languages_and_categories()
        lines = ["Available languages and categories:\n"]
        for item in data:
            lines.append(f"{item['language']}:")
            for cat in item["categories"]:
                lines.append(f"- {cat}")
            lines.append("")
        return "\n".join(lines)
    except Exception as e:
        return f"Error: {e}"


@mcp.tool()
def get_guidelines(language: str, category: str) -> str:
    """Retrieve the full coding standards document for a specific programming language and category.

    Call this tool before writing any code that involves the requested category.
    You MUST specify the correct language. Determine it from the file the engineer is editing,
    the language mentioned in the request, or the project context. If unsure, call list_categories first.

    Args:
        language: The programming language (python or nodejs).
        category: The coding standard category (e.g. naming, patterns, structure, quick-reference).
    """
    try:
        return load_category(language, category)
    except Exception as e:
        return f"Error: {e}"


@mcp.tool()
def search_guidelines(
    language: str,
    query: str,
    limit: int = 5,
) -> str:
    """Search across ALL coding standard documents for a specific programming language.

    Use this when the engineer's request does not map neatly to a single category,
    or when you need to find rules about a specific cross-cutting concern.

    Args:
        language: The programming language (python or nodejs).
        query: The keyword or phrase to search for (e.g. "error handling", "decorators").
        limit: Maximum number of matching sections to return (default 5, max 20).
    """
    try:
        limit = max(1, min(20, limit))
        results = search_all(language, query, limit)
        if not results:
            return (
                f'No guidelines found matching "{query}" for language "{language}". '
                "Try a broader search term or use list_categories to browse available topics."
            )
        formatted = []
        for r in results:
            formatted.append(f"### [{r['category']}] {r['heading']}\n\n{r['content']}\n\n---")
        return "\n\n".join(formatted)
    except Exception as e:
        return f"Error: {e}"


@mcp.tool()
def get_quick_reference(language: str) -> str:
    """Get the team's top-10 most important coding rules for a specific programming language.

    Call this tool BEFORE generating any code if you have not already called get_guidelines
    or search_guidelines for the specific task. This is the baseline safety net.

    Args:
        language: The programming language (python or nodejs).
    """
    try:
        return load_category(language, "quick-reference")
    except Exception as e:
        return f"Error: {e}"


class _CORSMiddleware:
    """Raw ASGI CORS middleware — safe for SSE (does not buffer the response)."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Handle preflight OPTIONS requests directly.
        if scope["method"] == "OPTIONS":
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [
                    [b"access-control-allow-origin", b"*"],
                    [b"access-control-allow-methods", b"GET, POST, OPTIONS"],
                    [b"access-control-allow-headers", b"*"],
                    [b"content-length", b"0"],
                ],
            })
            await send({"type": "http.response.body", "body": b""})
            return

        # Inject CORS header into the first response message only.
        async def send_with_cors(message):
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers.append([b"access-control-allow-origin", b"*"])
                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_cors)


if __name__ == "__main__":
    uvicorn.run(_CORSMiddleware(mcp.sse_app()), host="0.0.0.0", port=8000)
