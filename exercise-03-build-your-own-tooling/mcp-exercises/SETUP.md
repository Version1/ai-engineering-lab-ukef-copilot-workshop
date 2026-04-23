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

## Step 1: stdio server (Node.js)

If using `coding-standards-stdio`, build it once:

```bash
cd ../mcp-server/mcp-stdin-server
npm install
npm run build
```

Verify it worked — you should see a `dist/` folder inside `mcp-server/mcp-stdin-server/` containing `index.js`.

---

## Step 2: find your absolute path

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

Open `.cursor/mcp.json` in this folder and replace `YOUR_ABSOLUTE_PATH` with your path:

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

Open `.vscode/mcp.json` in this folder and replace `YOUR_ABSOLUTE_PATH`:

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

VS Code detects this file automatically when you open the `mcp-exercises/` folder. No restart needed.

### How to toggle MCP

Use this during exercises and demos — you will toggle MCP off and on to compare AI output.

Option A — edit the config file (quickest):

Disable MCP — add `"disabled": true` to the server entry and save:
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

Open `.mcp.json` in this folder and replace `YOUR_ABSOLUTE_PATH`:

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

Claude Code automatically reads `.mcp.json` from the current directory when you run `claude`.

Alternatively, register it globally (stays active across all projects):
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
| MCP server not found | Check the absolute path in the config file — copy it exactly from Step 2 |
| Server shows "failed to connect" | Run `node /your/absolute/path/to/dist/index.js` directly — if it errors, rebuild with `npm run build` |
| No tool calls visible | Make sure MCP is enabled AND you are using Agent/tool-calling mode |
| Windows path errors | Use forward slashes `/` instead of backslashes `\` in JSON config |
| Changes not taking effect (Cursor) | Toggle the server OFF then ON again in settings |
