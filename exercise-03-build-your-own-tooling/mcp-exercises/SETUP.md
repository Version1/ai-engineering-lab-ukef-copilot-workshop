# MCP server setup and toggle guide

This guide covers setup and toggling for all three supported AI assistants. You will use these toggle steps both during the exercises (to compare AI output with and without the MCP server) and during any facilitated demo.

- [Cursor](#cursor)
- [VS Code + GitHub Copilot](#vs-code--github-copilot)
- [Claude Code CLI](#claude-code-cli)

---

## Two server options (pick one) both MCP server implementations:

| Server | Transport | Setup | Use when |
|--------|-----------|-------|----------|
| `coding-standards-stdio` | stdio (Node.js) | Build once, no extra process | Simplest — your editor spawns the server |
| `coding-standards-http` | HTTP (Python) | Start Python server first | Shared server, or you prefer Python |

You only need one. Enable the one you want and disable the other. Both expose the same tools (`list_categories`, `get_guidelines`, `search_guidelines`, `get_quick_reference`).

---

## Step 1: build and start your chosen server

### Option A — stdio server (Node.js, recommended)

Build it once from the `mcp-exercises/` folder:

```bash
cd ../mcp-server/mcp-stdin-server
npm install
npm run build
```

Verify it worked — you should see a `dist/` folder inside `mcp-server/mcp-stdin-server/` containing `index.js`.

Your editor spawns this process automatically when MCP is enabled. No separate terminal needed.

---

### Option B — HTTP server (Python)

The HTTP server runs as a separate process on port 8000. Start it before your editor connects.

**Step 1 — Create and activate a Python virtual environment:**

Windows (PowerShell):
```powershell
cd ../mcp-server/mcp-http-server
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Mac / Linux:
```bash
cd ../mcp-server/mcp-http-server
python3 -m venv venv
source venv/bin/activate
```

When activated, your prompt will show `(venv)`.

**Step 2 — Install dependencies:**
```bash
pip install -r requirements.txt
```

**Step 3 — Start the server:**
```bash
python server.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Leave this terminal open while you work. Press `Ctrl+C` to stop it.

**The MCP endpoint is at:** `http://localhost:8000/mcp`

> Troubleshooting:
> - `python: command not found` — use `python3` instead
> - `ModuleNotFoundError` — run `pip install -r requirements.txt` with the venv activated
> - `Address already in use` — port 8000 is taken; stop the other process or change the port in `server.py`

---

## Step 2: find your absolute path (stdio only)

> Skip this step if you are using the HTTP server — you will use `http://localhost:8000/mcp` as the URL instead.

You need the full absolute path to `dist/index.js` on your machine.

Windows (PowerShell):
```powershell
(Resolve-Path ..\mcp-server\mcp-stdin-server\dist\index.js).Path
# Example output: C:\Users\yourname\projects\...\mcp-server\mcp-stdin-server\dist\index.js
```

Mac / Linux:
```bash
realpath ../mcp-server/mcp-stdin-server/dist/index.js
# Example output: /Users/yourname/projects/.../mcp-server/mcp-stdin-server/dist/index.js
```

Copy this path. You will paste it into the config file for your assistant below.

---

## Cursor

### Setup (one time)

Open `.cursor/mcp.json` in this folder.

**If using the stdio server** — replace the path with your absolute path from Step 2:

```json
{
  "mcpServers": {
    "coding-standards": {
      "command": "node",
      "args": ["C:\\Users\\yourname\\projects\\...\\mcp-server\\mcp-stdin-server\\dist\\index.js"]
    }
  }
}
```

> Windows note: Use double backslashes `\\` in JSON, or forward slashes `/` — both work.

**If using the HTTP server** — make sure the Python server is running first (Step 1B), then use:

```json
{
  "mcpServers": {
    "coding-standards": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

Restart Cursor once after saving. The server should appear in Settings → Cursor Settings → MCP.

### How to toggle MCP

Use this during exercises and demos — you will toggle MCP off and on to compare AI output.

| Action | Steps |
|---|---|
| Disable MCP | Settings → Cursor Settings → MCP → click the toggle next to `coding-standards` → OFF |
| Enable MCP | Same toggle → ON |

No restart required. Takes effect on the next prompt.

### Verify it is working

With MCP enabled, open any file and ask in chat:
> "What coding standards are available?"

You should see the AI call the `list_categories` tool and return a list of languages and categories.

---

## VS Code + GitHub Copilot

### Requirements

- VS Code 1.90 or higher
- GitHub Copilot extension installed and signed in
- Must use Agent mode in Copilot Chat (not the default Chat mode)

### Setup (one time)

VS Code reads MCP configuration from a `.vscode/mcp.json` file in your workspace folder. This folder is excluded from git in this repo, so **you must create it manually**.

**Step 1 — Create the folder and file:**

Windows (PowerShell), run from the `mcp-exercises/` folder:
```powershell
New-Item -ItemType Directory -Force -Path .vscode
New-Item -ItemType File -Path .vscode\mcp.json
```

Mac / Linux:
```bash
mkdir -p .vscode
touch .vscode/mcp.json
```

**Step 2 — Paste this content into `.vscode/mcp.json`:**

If using the **stdio server**, replace the path with your absolute path from Step 2:

```json
{
  "servers": {
    "coding-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/Users/yourname/projects/.../mcp-server/mcp-stdin-server/dist/index.js"]
    }
  }
}
```

> Windows note: Use double backslashes `\\` or forward slashes `/` in the path — both work in JSON.

If using the **HTTP server**, make sure the Python server is running first (Step 1B), then use:

```json
{
  "servers": {
    "coding-standards": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

VS Code detects this file automatically when you open the `mcp-exercises/` folder. No restart needed.

### How to toggle MCP

Use this during exercises and demos — you will toggle MCP off and on to compare AI output.

Option A — edit the config file (quickest):

Disable MCP — add `"disabled": true` to the server entry and save:

stdio example:
```json
{
  "servers": {
    "coding-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["..."],
      "disabled": true
    }
  }
}
```

HTTP example:
```json
{
  "servers": {
    "coding-standards": {
      "type": "http",
      "url": "http://localhost:8000/mcp",
      "disabled": true
    }
  }
}
```

Enable MCP — remove the `"disabled": true` line and save. VS Code picks up the change immediately.

Option B — use the UI:

Open the Command Palette (`Ctrl+Shift+P` on Windows, `Cmd+Shift+P` on Mac) and run `MCP: List Servers`. Select `coding-standards` and choose Start or Stop. This takes effect on the next prompt without editing any file.

### Switching to Agent mode

In the Copilot Chat panel, click the dropdown that says "Chat" and switch to Agent. MCP tools are only available in Agent mode.

### Verify it is working

With MCP enabled and Agent mode selected, ask:
> "What coding standards are available?"

Copilot will show a tool call icon and call `list_categories`.

---

## Claude Code CLI

### Requirements

- Claude Code CLI installed: `npm install -g @anthropic-ai/claude-code`
- Logged in: `claude login`

### Setup (one time)

Open `.mcp.json` in this folder.

**If using the stdio server** — replace the path with your absolute path from Step 2:

```json
{
  "mcpServers": {
    "coding-standards": {
      "command": "node",
      "args": ["/Users/yourname/projects/.../mcp-server/mcp-stdin-server/dist/index.js"]
    }
  }
}
```

**If using the HTTP server** — make sure the Python server is running first (Step 1B), then use:

```json
{
  "mcpServers": {
    "coding-standards": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

Claude Code automatically reads `.mcp.json` from the current directory when you run `claude`.

Alternatively, register the stdio server globally (stays active across all projects):
```bash
claude mcp add coding-standards -- node /absolute/path/to/mcp-server/mcp-stdin-server/dist/index.js
```

### How to toggle MCP

Use this during exercises and demos — you will toggle MCP off and on to compare AI output.

Option A — rename the config file (recommended, works during exercises and demos):

Disable — rename the file:
```bash
# Windows
Rename-Item .mcp.json .mcp.json.off

# Mac / Linux
mv .mcp.json .mcp.json.off
```

Enable — rename it back:
```bash
# Windows
Rename-Item .mcp.json.off .mcp.json

# Mac / Linux
mv .mcp.json.off .mcp.json
```

Option B — CLI commands (only if you registered the server globally):
```bash
claude mcp remove coding-standards   # disable
claude mcp add coding-standards -- node /path/to/mcp-stdin-server/dist/index.js  # re-enable
```

### Running Claude Code

```bash
cd mcp-exercises
claude
```

Claude Code starts in the current directory and picks up the `.mcp.json` config automatically.

### Verify it is working

```bash
claude
> What coding standards are available?
```

You should see Claude call `list_categories` and list the languages and categories.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| MCP server not found (stdio) | Check the absolute path in the config file — copy it exactly from Step 2 |
| Server shows "failed to connect" (stdio) | Run `node /your/absolute/path/to/dist/index.js` directly — if it errors, rebuild with `npm run build` |
| HTTP server not reachable | Make sure you started the Python server first (`python server.py`) and it is still running in a terminal |
| HTTP server — `Address already in use` | Port 8000 is taken; stop the other process or change the port in `server.py` |
| No tool calls visible | Make sure MCP is enabled AND you are using Agent/tool-calling mode |
| Windows path errors | Use forward slashes `/` instead of backslashes `\` in JSON config |
| Changes not taking effect (Cursor) | Toggle the server OFF then ON again in settings |

---

## Debugging with MCP Inspector

MCP Inspector is an interactive browser UI that lets you connect directly to either MCP server and call its tools manually — without involving your AI assistant. Use it to confirm the server is working, inspect tool inputs/outputs, and isolate whether a problem is with the server itself or with the editor integration.

### Install and run

No installation needed. Run it with `npx`:

```bash
npx @modelcontextprotocol/inspector
```

This starts a local web server and opens the Inspector UI in your browser at `http://localhost:5173`.

### Connect to the stdio server

1. In the Inspector UI, set **Transport** to `stdio`.
2. Set **Command** to `node`.
3. Set **Arguments** to the absolute path of `dist/index.js`, e.g.:
   - Windows: `C:\Users\yourname\projects\...\mcp-server\mcp-stdin-server\dist\index.js`
   - Mac/Linux: `/Users/yourname/projects/.../mcp-server/mcp-stdin-server/dist/index.js`
4. Click **Connect**.

> Make sure you have run `npm run build` inside `mcp-server/mcp-stdin-server/` first.

### Connect to the HTTP server

1. Start the Python server first (`python server.py` inside `mcp-server/mcp-http-server/`).
2. In the Inspector UI, set **Transport** to `SSE`.
3. Set **URL** to `http://localhost:8000/mcp`.
4. Click **Connect**.

### Calling tools manually

Once connected, the Inspector lists all available tools on the left (`list_categories`, `get_guidelines`, `search_guidelines`, `get_quick_reference`). Click any tool, fill in the input fields, and click **Run** to see the raw response. This is the fastest way to verify the server is returning the correct standards content.

### Common uses

| Scenario | What to do in Inspector |
|---|---|
| Confirm server starts correctly | Connect and check the tools list appears |
| Check a tool returns the right content | Run `get_guidelines` with `category: naming` and `language: nodejs` |
| Debug a keyword search | Run `search_guidelines` with your search term and inspect the output |
| Rule out editor config issues | If Inspector works but your editor doesn't, the problem is in the editor MCP config, not the server |
