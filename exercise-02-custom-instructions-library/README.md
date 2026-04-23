# Exercise 2: Custom Instructions Library

Level: Intermediate | Time: 50 mins | Focus: Writing a custom instructions file so Copilot follows UKEF standards by default, and testing it against Exercise 1 code

## Exercise summary

Your task is to write a custom instructions file (for example `.github/copilot-instructions.md` or the equivalent your editor or repo uses) that makes Copilot follow UKEF's (or government) standards by default. You then test it against the Exercise 1 code to see if Copilot's suggestions improve. Bonus: write a short prompt library for your team (the prompts that work best for code review, refactoring, tests, etc.) so others can reuse them.

This mirrors real work: codifying team standards so Copilot behaves consistently across the repo.

## Success criteria

- You have drafted or written a custom instructions file that describes how Copilot should behave (language, style, tests, what to avoid) in line with UKEF standards.
- You have tested it by opening Exercise 1 code and asking Copilot to review or suggest changes; you have noted whether the output improved compared with no instructions.
- Optionally, you have a short prompt library (e.g. a list of copy-paste prompts for review, refactor, tests) that your team could use.
- You can say what worked and what you would add next.

## Getting started

1. Create or open a file for custom instructions. Common locations: `.github/copilot-instructions.md` in the repo, or the editor's Copilot custom instructions setting. An example file is in [pr-review-skill/copilot-instructions.md](../pr-review-skill/copilot-instructions.md); use it as a starting point or reference. Your facilitator may also give you a template or a shared repo.
2. Write rules that reflect UKEF standards: e.g. use British English, write tests for new code, avoid unclear names, follow existing project structure. Use the prompts or guardrails your facilitator shared from the pre-session work with Kapil.
3. Save the file (or paste into the editor's custom instructions). If the tool applies instructions per-repo, open the Exercise 1 sample code in that repo or workspace.
4. Test: open one of the Exercise 1 files (e.g. `submission_processor.py` or `submissionProcessor.js`). Ask Copilot to review it or suggest a refactor. Compare the output with and without your instructions. Refine the instructions if needed.
5. Bonus: in a doc or the same file, add a "Prompt library" section with 3–5 prompts that work well (e.g. for PR review, test generation, refactoring) so your team can reuse them.

[View playbook →](playbook-copilot.md)

## Sample code for testing

Use the Exercise 1 sample code to test your custom instructions. Code lives in this workshop's `python-samples` or `node-samples` folder (e.g. `submission_processor.py`, `submissionProcessor.js`). Open it in a workspace where your custom instructions apply, then ask Copilot to review or suggest changes and see if the behaviour matches your rules.

---
Version: 1.0
Last updated: April 2026
