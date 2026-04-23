# Coding Standards MCP Server

An MCP server that exposes your team's coding standards as tools, so AI coding assistants automatically follow your conventions when generating code.

This folder provides two implementations. Choose the one that fits your setup:

| Option | Transport | Use when |
|--------|-----------|----------|
| [mcp-stdin-server/](mcp-stdin-server/) | stdio (local) | You want the simplest setup: your editor spawns the server process. Node.js 18+ required. |
| [mcp-http-server/](mcp-http-server/) | HTTP/SSE (remote) | You want a shared server others can connect to, or prefer Python. Python 3.10+ required. |

Both servers expose the same four tools and read from the shared standards/ folder.

## Structure
flowchart TB
    subgraph mcp_server [mcp-server/]
        standards[standards/ nodejs + python]
        stdin[mcp-stdin-server/ Node.js stdio]
        http[mcp-http-server/ Python HTTP]
    end

    stdin -->|reads| standards
    http -->|reads| standards

    editor1[Editor Cursor/VS Code] -->|stdio| stdin
    editor2[Editor via URL] -->|HTTP/SSE| http
```

## Supported languages

- Python — naming, patterns, structure, quick-reference
- Node.js — naming, patterns, structure, quick-reference

## Quick start: See [mcp-stdin-server/README.md](mcp-stdin-server/README.md) — `cd mcp-stdin-server && npm install && npm run build`

Remote (HTTP): See [mcp-http-server/README.md](mcp-http-server/README.md) — `cd mcp-http-server && pip install -r requirements.txt && python server.py`

## Shared standards in `standards/{language}/` are used by both servers. Edit them directly — no rebuild needed. Changes take effect on the next request.
