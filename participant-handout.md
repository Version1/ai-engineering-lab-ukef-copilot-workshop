# UKEF Copilot Enablement Day: participant reference

Keep this open during the day.

---

## Exercise 1: Code Quality & PR Review (30 min)

### Part A: Code Quality 

- Given: flawed code files (JS, TS, Python) or the workshop sample code.
- Use Copilot to identify violations against UKEF standards (or government standards if that is the stand-in).
- Refactor to meet the bar. Add tests. Document your best prompts.

### Part B: PR Review Skill

- Set up the PR review skill (prompt file in `.github/prompts/`, custom instructions in `.github/`).
- Run the skill on the sample buggy code (`userController.js` from the playbook). Record what it catches and misses.
- Extend the skill prompt with at least one new rule.

**Debrief**: 2 to 3 teams share. What worked? What did Copilot get wrong? What did the skill catch? What did it miss?

---

## Exercise 2: Custom Instructions Library (50 min)

- Write a `.github/copilot-instructions.md` (or equivalent) that makes Copilot follow UKEF standards by default.
- Test it against Exercise 1 code.
- Bonus: write a prompt library for your team.

---

## Exercise 3: Build Your Own Tooling (60 min)

Pick one track:

- Track A: Extend your custom instructions from Exercise 2.
- Track B: Standards MCP server. See `mcp-server/mcp-stdin-server/` (Node.js stdio) or `mcp-server/mcp-http-server/` (Python HTTP).
- Track C: Test generation pipeline.
- Track D: Open brief. Pitch to a facilitator first, then build.

Show and Tell at the end of the day.

---

## Useful prompts

- "Review this code against our standards and list issues."
- "Review this PR diff against UKEF standards. Score it and list what should be fixed."
- "Refactor this to use clearer names and smaller functions; keep behaviour the same."
- "Generate unit tests for this function including edge cases and errors."
- "Explain what this code does and what could go wrong."

---
Version: 1.0
Last updated: April 2026
