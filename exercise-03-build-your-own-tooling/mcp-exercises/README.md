# MCP server workshop: demo project

This project is the hands-on companion for the workshop. It contains starter code and exercises that show the difference between AI-generated code with and without the Coding Standards MCP server connected.

---

## What you will see

Each exercise follows the same pattern. You paste a prompt into your AI assistant twice:

1. Round 1, MCP off: the AI uses only its general training knowledge.
2. Round 2, MCP on: the AI consults your team's actual standards before writing code.

The difference is immediate and visible. You can work through these exercises independently — no session attendance required. Each exercise file tells you exactly what to do and what to look for.

---

## Prerequisites, make sure you have:

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or higher | `node --version` |
| npm | 9 or higher | `npm --version` |
| Python | 3.11 or higher | `python --version` |
| Your AI assistant | Cursor, VS Code + Copilot, or Claude Code CLI | — |

You also need the MCP server built and ready. See [SETUP.md](SETUP.md) for full instructions.

---

## Project structure

```
mcp-exercises/
├── README.md          ← This file
├── SETUP.md           ← MCP server setup and toggle instructions (START HERE)
│
├── exercises/         ← One file per exercise, covering both languages
│   ├── 01-naming.md
│   ├── 02-patterns.md
│   ├── 03-structure.md
│   ├── 04-refactor.md
│   └── 05-full-feature.md
│
├── nodejs-starter/    ← Express/TypeScript starter code
│   └── src/features/users/
│       ├── user-service.ts   ← Edit during exercises 1 & 2
│       ├── user-routes.ts    ← Reference during exercise 3
│       └── bad-code.ts       ← Refactor target for exercise 4
│
└── python-starter/    ← FastAPI starter code
    └── app/users/
        ├── user_service.py   ← Edit during exercises 1 & 2
        ├── user_routes.py    ← Reference during exercise 3
        └── bad_code.py       ← Refactor target for exercise 4
```

---

## Exercise Order and Timing

| # | Title | Focus | Time |
|---|---|---|---|
| 1 | Naming | Function names, variable names, file names | 10 min |
| 2 | Patterns | HTTP client, async style, error handling | 15 min |
| 3 | Structure | Feature folder layout, where files go | 10 min |
| 4 | Refactor | Fix code that violates all standards | 15 min |
| 5 | Full Feature Build | End-to-end: everything at once | 20 min |

Total: ~70 minutes with discussion.

---

## How to Run an Exercise

1. Open the exercise file in `exercises/` (e.g. `exercises/01-naming.md`) — each file contains the prompt and what to look for
2. Open the corresponding starter file in `nodejs-starter/` or `python-starter/`
3. Disable MCP (see SETUP.md for your assistant)
4. Paste the prompt from the exercise file into your AI assistant
5. Note what the AI chose without guidance
6. Enable MCP and paste the same prompt again
7. Compare the two outputs

---

## Quick Setup Checklist

- [ ] MCP server built: `cd ../mcp-server/mcp-stdin-server && npm install && npm run build`
- [ ] Absolute path added to the config file for your assistant (see SETUP.md)
- [ ] MCP server shows as connected in your assistant
- [ ] Test: ask your AI "what coding standards are available?" — it should call `list_categories`
- [ ] Node.js deps installed: `cd nodejs-starter && npm install`
- [ ] Python deps installed: `cd python-starter && pip install -r requirements.txt`
