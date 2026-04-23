# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A TypeScript MCP server that exposes team coding standards (stored as markdown files) as four tools to AI coding assistants. Engineers connect it to VSCode/Cursor/Claude Code so generated code follows their team's conventions for Python and Node.js.

This is a workshop teaching aid — it must remain readable top-to-bottom in ~20 minutes. Keep `src/` flat (no subdirectories), no extra dependencies, and no abstractions that obscure the MCP patterns being taught.

## Current State

The repository currently contains only three specification documents. No implementation files exist yet:

| File to create | Specification source |
|---|---|
| `src/index.ts` | `BUILD-PLAN.md` + `TOOL-DEFINITIONS.md` |
| `src/standards.ts` | `BUILD-PLAN.md` |
| `standards/python/*.md` (4 files) | `STANDARDS-CONTENT.md` |
| `standards/nodejs/*.md` (4 files) | `STANDARDS-CONTENT.md` |
| `package.json` | `BUILD-PLAN.md` |
| `tsconfig.json` | `BUILD-PLAN.md` |
| `README.md` | `BUILD-PLAN.md` |

## Commands

```bash
npm install        # Install dependencies
npm run build      # Compile TypeScript → dist/
npm start          # Run the compiled server
npm run dev        # Watch mode: recompile on save
```

There is no test runner or linter configured. The build output goes to `dist/`.

## Architecture

```
src/index.ts       — McpServer instance + 4 tool registrations + handlers
src/standards.ts   — File I/O, markdown section parsing, keyword search
standards/         — Markdown files (the data layer; auto-discovered by language subfolder)
  python/          — naming.md, patterns.md, structure.md, quick-reference.md
  nodejs/          — naming.md, patterns.md, structure.md, quick-reference.md
```

The server uses stdio transport (subprocess of the IDE, not HTTP). The four tools are:

| Tool | Parameters | Purpose |
|---|---|---|
| `list_categories` | none | Discovery: returns all languages + their categories |
| `get_guidelines` | `language`, `category` | Returns full markdown for a category |
| `search_guidelines` | `language`, `query`, `limit` | Full-text search across all standards for a language |
| `get_quick_reference` | `language` | Returns top-10 rules cheat sheet |

Adding a new language folder under `standards/` (e.g., `standards/go/`) is automatically discovered with zero code changes.

## Critical Implementation Rules

MCP API: Use `McpServer` + `server.registerTool()` from `@modelcontextprotocol/sdk/server/mcp.js`. Do NOT use the deprecated `new Server()` / `setRequestHandler()` pattern.

Logging: Use `console.error()` only — `stdout` is the MCP transport channel.

Error handling: All tool handlers must use try/catch and return `{ isError: true, content: [{ type: "text", text: "Error: ..." }] }`.

Tool annotations: Every tool must include `annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }`.

Path safety: `language` and `category` come from the LLM. Validate them before building file paths — reject any value containing `..`, `/`, or `\`.

Path resolution: Use `fileURLToPath(import.meta.url)` to resolve the `standards/` directory. The standards dir is one level above `src/`:
```typescript
const STANDARDS_DIR = path.resolve(__dirname, "..", "standards");
```

Search: `searchAll()` must split markdown by `##` headings and return matching sections (heading + body), not individual lines. Heading matches rank above body-only matches.

Language parameter: Three tools take a required `z.enum([...])` `language` parameter — never make it optional or give it a default. This forces the LLM to explicitly choose the language.

Tool descriptions: Written for the LLM, not humans. They must specify when to call the tool, what it returns, and why the LLM should prefer it over its training data. See `TOOL-DEFINITIONS.md` for exact descriptions.

## TypeScript Configuration

- `"type": "module"` in `package.json` (ESM)
- `"module": "Node16"` and `"moduleResolution": "Node16"` in tsconfig — requires `.js` extensions on all local imports
- `"target": "ES2022"` for top-level await
- Strict mode enabled

## IDE Integration (after build)

.vscode/mcp.json or .cursor/mcp.json:
```json
{
  "servers": {
    "coding-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["./coding-standards-mcp-server/dist/index.js"]
    }
  }
}
```
