# Coding Standards MCP Server (stdio)

A local MCP server that exposes your team's coding standards as tools, so AI coding assistants automatically follow your conventions when generating code. Uses stdio transport — your editor spawns the Node.js process directly.

## Supported Languages

- Python — naming, patterns, structure, quick-reference
- Node.js — naming, patterns, structure, quick-reference

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run build
```

## IDE Configuration

### VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "coding-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["./dist/index.js"]
    }
  }
}
```

Use the absolute path to `mcp-stdin-server/dist/index.js` when configuring from another folder (e.g. `mcp-exercises`). See `../mcp-exercises/SETUP.md` for details.

### Cursor (`.cursor/mcp.json`)

```json
{
  "servers": {
    "coding-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["./dist/index.js"]
    }
  }
}
```

## Testing

Try these prompts in your AI assistant after connecting the server:

Python:
- "Write me a Python service class for user authentication"
- "How should I handle errors in Python?"
- "What are the Python naming conventions?"

Node.js:
- "Create a Node.js Express middleware for request validation"
- "How do I structure a new Node.js feature?"
- "What HTTP client should I use in Node.js?"

## Customising Standards

Edit the markdown files in `../standards/{language}/` directly — no rebuild needed. The server reads files on every request, so changes take effect immediately.

## Adding a New Language

1. Create a new directory under `../standards/`, e.g. `../standards/go/`
2. Add markdown files following the same structure: `naming.md`, `patterns.md`, `structure.md`, `quick-reference.md`
3. The server discovers new language folders automatically via `list_categories` — no code changes needed
4. Update the `languageParam` enum in `src/index.ts` to include the new language, then rebuild

## Available Tools

| Tool | Description |
|------|-------------|
| `list_categories` | Lists all supported languages and their available standard categories. Call this first for discovery. |
| `get_guidelines` | Returns the full standards document for a specific language and category (e.g. python + naming). |
| `search_guidelines` | Full-text search across all standards for a language. Use when the topic spans multiple categories. |
| `get_quick_reference` | Returns the top-10 most important rules for a language as a cheat sheet. Called automatically before broad code generation. |
