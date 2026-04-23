# Playbook: Build Your Own Tooling

Time: about 30 minutes. Pick one track.

---

## Track A: Extend your custom instructions (30 min)

Step 1: Open the custom instructions file you created in Exercise 2 (e.g. `.github/copilot-instructions.md` or your editor's custom instructions).

Step 2: Add at least one of the following:

- More rules (e.g. error handling, logging, or security) so Copilot aligns better with UKEF standards.
- A short prompt library (3–5 copy-paste prompts for review, tests, refactor) and when to use each.
- A test: open another file (Exercise 1 code or your repo) and run 2–3 prompts; note if the output improved and refine the instructions if needed.

Step 3: Get the file or snippet into a form you could paste into your real repo (or share with your team). Be ready to show it in Show and Tell: what you added and how it changes Copilot's behaviour.

---

## Track B: Standards MCP server (30 min)

Step 1: If you have not already set up the MCP server, do that first. Open `mcp-server/README.md` in this exercise folder and follow the build steps for the stdio server (`cd mcp-server/mcp-stdin-server && npm install && npm run build`). Then open `mcp-exercises/SETUP.md` and connect your editor. Once the MCP server shows as connected, you are ready. If you completed the pre-day setup from `SETUP-GUIDE.md` section 4, skip this step.

Step 2: Open `mcp-exercises/` as your workspace. Pick one or two exercises from `mcp-exercises/exercises/` and run the prompts with MCP OFF then ON. Each exercise file is self-contained — it tells you exactly what to do, what prompt to paste, and what to look for. Good starting points:

- Exercise 1 (`exercises/01-naming.md`) — naming conventions: `getUserById` vs `getUserByID`, `listUsers` vs `getUsers`
- Exercise 2 (`exercises/02-patterns.md`) — code patterns: native `fetch` vs `axios` (Node.js), `httpx` vs `requests` (Python), async/await, error handling
- Exercise 4 (`exercises/04-refactor.md`) — refactor `bad-code.ts` or `bad_code.py`: the before/after shows naming, patterns, and structure fixes all at once

Note which MCP tool the model called (you will see `get_guidelines`, `search_guidelines`, or `get_quick_reference` in the tool call log) and which standards file it used.

Step 3: Extend the server or its standards. Choose one of:

- Edit a standards file — open `mcp-server/standards/nodejs/` or `mcp-server/standards/python/` and add or change a rule in one of the markdown files (`naming.md`, `patterns.md`, `structure.md`, or `quick-reference.md`). Re-run the relevant exercise prompt to see the updated guidance reflected in the output.
- Add a new tool — open `mcp-server/mcp-stdin-server/src/index.ts` and add a small tool (e.g. one that returns a checklist of the top five things to check before raising a pull request). Follow the pattern of the existing tools. Rebuild with `npm run build` and re-test.

If time is short, write a one-paragraph note on what you would add next and why. That is still a valid Show and Tell output.

Step 4: Prepare your Show and Tell (2 to 3 minutes). Show: the exercise you ran and the naming or pattern difference the MCP server produced (e.g. `getUserById` vs `getUserByID`, native `fetch` vs `axios`), name the MCP tool that was called, and describe the extension you made or would make next. No slides — screen share the code side by side.

---

## Track C: Test generation pipeline (30 min)

Step 1: Pick a function to test (from Exercise 1 sample code or your own code). Open it in your editor.

Step 2: Use Copilot to generate tests (happy path, edge cases, errors). Run the tests and fix any failures.

Step 3: Write down the steps so your team could repeat the pipeline. For example: "1. Open the file. 2. Select the function. 3. In Copilot Chat, paste this prompt: [your prompt]. 4. Copy the tests into [test file path]. 5. Run [test command]." Save this as a short doc or checklist.

Step 4: Be ready to demo in Show and Tell: show the function, the prompt you used, and the tests that pass; then show your pipeline doc.

---

## Track D: Open brief (30 min)

Step 1: Pitch your idea to a facilitator in one sentence. Example: "I want to build a small script that runs our review checklist so we can paste it into Copilot." Get a yes and a rough scope (e.g. "one script, one output").

Step 2: Build the smallest version that works. Use Copilot to help (e.g. generate the script, suggest structure). Do not aim for perfection; aim for "we can show this in 2–3 minutes."

Step 3: Prepare your demo: what it does, how you use it, what you would do next.

---

## Show and Tell (after the 30 min)

Each team: 2–3 minutes. No slides. Screen share and walk through what you built. Say what you would do next if you had more time.

---
Version: 1.0
Last updated: April 2026
