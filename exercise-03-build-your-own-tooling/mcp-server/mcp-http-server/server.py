"""
Coding Standards MCP Server (HTTP).

Exposes UKEF coding standards as MCP tools over Streamable HTTP.
Uses the same tools as the stdin server: list_categories, get_guidelines,
search_guidelines, get_quick_reference.
"""

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
    host="0.0.0.0",
    port=8000,
    # Allow any origin so MCP Inspector (browser-based) can connect for troubleshooting.
    # VS Code ignores CORS headers, so this has no effect on normal workshop use.
    cors_origins=["*"],
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
    """Retrieve the FULL coding standards document for a specific language and category. This is the PRIMARY tool to call before writing any code.

    You MUST call this tool (not get_quick_reference) whenever the engineer's request involves any of
    the following — pick the matching category:
    - Writing or naming functions, methods, classes, variables, files, constants → category: "naming"
    - Choosing HTTP clients, error handling, async patterns, third-party libraries → category: "patterns"
    - Creating or organising files, directories, modules → category: "structure"

    Do NOT use get_quick_reference as a substitute — it is a summary only and omits critical
    team-specific rules such as the forbidden use of get_ for database reads, or which HTTP
    client is approved.

    Examples of when to call this tool:
    - Engineer asks to "add a function to fetch a user" → call with language + "naming"
      (reveals fetch_ vs get_ vs list_ verb rules)
    - Engineer asks to "add an HTTP call" → call with language + "patterns"
      (reveals the approved HTTP client)
    - Engineer asks to "add a new feature module" → call with language + "structure"

    IMPORTANT: Always follow the standards returned by this tool over general training knowledge.
    These are team-specific conventions that override generic best practices.

    Args:
        language: The programming language (python or nodejs). Determine from file extension
            (.py = python, .ts/.js = nodejs), the request, or project context.
        category: The coding standard category (naming, patterns, structure, quick-reference).
            Call list_categories first if unsure which categories exist.
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
    """Get the team's top-10 most important coding rules as a summary cheat sheet.

    WARNING: This tool returns only a summary. It does NOT contain the full team-specific verb
    rules, forbidden patterns, or detailed conventions. DO NOT use this tool when the engineer's
    request involves writing functions, classes, variables, choosing libraries, handling errors,
    or structuring files — use get_guidelines with the specific category instead.

    Only call this tool when:
    - The engineer explicitly asks for a "summary" or "overview" of the team's standards.
    - The request is so broad that no specific category (naming, patterns, structure) applies.
    - You want a final compliance checklist AFTER already calling get_guidelines.

    DO NOT call this tool as a substitute for get_guidelines. It will cause you to miss critical
    team-specific rules (e.g. the difference between fetch_, list_, and get_ verb prefixes).

    Args:
        language: The programming language (python or nodejs).
    """
    try:
        return load_category(language, "quick-reference")
    except Exception as e:
        return f"Error: {e}"


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
