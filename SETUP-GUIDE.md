# Setup guide: UKEF Copilot Enablement Day

What to do before the day. Allow 15 to 20 minutes. Complete at least one week before the event.

If you get stuck, contact your facilitator or support channel.

---

## 1. Check GitHub Copilot works in your editor

Your facilitator will ask everyone to confirm Copilot is working before the day.

1. Open your editor (for example VS Code, Visual Studio, or JetBrains with the Copilot extension).
2. Check the Copilot icon or status shows Copilot is on.
3. Open Copilot Chat (shortcut depends on your editor; often `Ctrl+Shift+I` or `Cmd+Shift+I`).
4. Type a short question, for example: "What are custom instructions for GitHub Copilot?"
5. If you get a reply, you are ready.

If Copilot does not respond, check you are signed in and your licence is active. Sign out and back in, then restart your editor. If it still fails, contact your IT team or the support channel before the event.

---

## 2. Set up Python or Node.js and the sample code

You only need one language: Python or Node.js.

### Option A: Python

1. You need Python 3.8 or higher. Check with: `python3 --version` or `python --version`.
2. Go to the `python-samples` folder for this workshop (or the path your facilitator gives you).
3. Follow the setup steps in `python-samples/README.md`: create a virtual environment, install dependencies, run tests.
4. When the tests pass, you are ready.

### Option B: Node.js

1. You need Node.js 18 or higher. Check with: `node --version`.
2. Go to the `node-samples` folder for this workshop (or the path your facilitator gives you).
3. Run: `npm install`, then `npm test` (or the commands in `node-samples/README.md`).
4. When the tests pass, you are ready.

Your facilitator may share a link or copy of the sample code; use the path they give you if it is different from this workshop folder.

---

## 3. Set up for the PR Review Skill (part of Exercise 1)

Exercise 1 includes setting up a PR review skill (prompt file in Agent mode) to review sample code. No extra software is required.

1. Your facilitator will tell you where to find the skill files. If this workshop repo is shared with you, they are in the `pr-review-skill/` folder.
2. Open `pr-review-skill/README.md` for short instructions. The folder contains the skill prompt file, example custom instructions, three `.diff` files (naming, missing tests, structure), and a starter review prompt template you can paste into Copilot Chat.
3. You do not need to do anything else before the day. In Exercise 1 you will set up the skill, run it on sample code, record findings, and extend the prompt.

---

## 4. Set up the local MCP server (for after lunch and Exercise 3)

After lunch there is a live demo: connecting Copilot to UKEF standards via a local MCP server. In Exercise 3 you can choose Track B and extend or use that server. The server and demo workspace are already in this repository — you do not need anything from your facilitator to get started.

The MCP server is a Node.js process. You need Node.js 18 or higher (check with `node --version`).

1. Navigate to the MCP stdio server folder:

   ```
   cd exercise-03-build-your-own-tooling/mcp-server/mcp-stdin-server
   ```

2. Install dependencies and build the server:

   ```
   npm install
   npm run build
   ```

   This produces a `dist/index.js` file inside `mcp-stdin-server/`. Keep note of the absolute path to this file — you will need it when configuring your editor.

3. Connect your editor. Open `exercise-03-build-your-own-tooling/mcp-exercises/SETUP.md` and follow the instructions for your editor (Cursor, VS Code with GitHub Copilot, or Claude Code CLI). The setup file explains how to add the server entry and how to toggle it on and off.

4. Test the connection: open `mcp-exercises/nodejs-starter/src/features/users/user-service.ts` and ask your AI assistant "what coding standards are available?" — it should call the `list_categories` tool and return the Node.js and Python categories.

If you get stuck, contact your facilitator or support channel. The troubleshooting table in `mcp-exercises/SETUP.md` covers the most common issues (wrong path, server not built, editor needing a restart).

---

## 5. Bring a real piece of work for Exercise 3

Exercise 3 is "Build Your Own Tooling". Depending on your track, you may use your own code. Before the day, choose one of these if useful:

- a pull request you have open that you want to move forward
- a function you wrote recently that needs tests
- a piece of code with no documentation that could use some
- a piece of code you want to tidy or refactor

You do not need to prepare anything else. Not all tracks require your own code (e.g. Track A extends Exercise 2 instructions; Track B uses the MCP starter).

---

## 6. Check your device and network

Your laptop must:

- run your editor with GitHub Copilot installed and turned on
- connect to the venue Wi-Fi (if you have had problems before, test in advance)

If your device cannot install extensions, ask whether you can use GitHub Copilot in a browser (for example github.dev). Your facilitator can say if that is enough for the exercises.

---

## Pre-event checklist

- [ ] GitHub Copilot is installed, turned on, and responding in your editor
- [ ] Python or Node.js sample code is set up and tests pass
- [ ] PR review skill: you know where the skill files are (e.g. `pr-review-skill/` or link from your facilitator)
- [ ] MCP server (optional): `exercise-03-build-your-own-tooling/mcp-server/mcp-stdin-server/` is built (`npm install && npm run build`) and your editor is configured using `mcp-exercises/SETUP.md` if you want to join the demo and Exercise 3 Track B
- [ ] You have chosen a real piece of work if you plan to use it in Exercise 3
- [ ] Your device can run your editor and connect to the venue wifi

---
Version: 1.0
Last updated: April 2026
