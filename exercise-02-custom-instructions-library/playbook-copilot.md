# Playbook: Custom Instructions Library

Time: about 50 minutes

## Step 1: Create or open the custom instructions file (5 mins)

Step 1a: Choose where to put custom instructions. Options:

- Repo-level: `.github/copilot-instructions.md` in the repo (if your editor or Copilot reads it).
- Editor-level: Copilot settings in your editor (e.g. "Custom instructions" or "Instructions for AI").
- Shared doc: a file your facilitator provided that you can paste from.

Step 1b: If you are creating from scratch, start with a short heading and 3–5 rules. For example:

```markdown
# Copilot instructions for this repo

- Use British English (e.g. "behaviour", "organise").
- Prefer clear, short functions; one job per function.
- New code must have tests; suggest tests when adding features.
- Follow existing naming and structure in this codebase.
- Do not suggest code that would fail our PR review (no unexplained magic, no missing null checks).
```

Step 1c: If your facilitator gave you UKEF-specific prompts or guardrails, add or adapt those (e.g. "Follow UKEF code quality standards: ...").

---

## Step 2: Expand the rules (15 mins)

Step 2a: Add rules that cover:

- Language and style (e.g. British English, naming conventions).
- Testing (when to suggest tests, what framework).
- What to avoid (e.g. no hardcoded secrets, no unclear abbreviations).
- Pointers to existing standards (e.g. "Match the style of the existing modules in this repo").

Step 2b: Keep each rule short and actionable. Copilot works better with clear, concrete instructions than long paragraphs.

Step 2c: If you have a checklist from the pre-session work with Kapil (or government standards), turn the key points into bullet rules.

---

## Step 3: Test against Exercise 1 code (20 mins)

Step 3a: Open the Exercise 1 sample code in your editor (e.g. `python-samples/src/samples/exercise01/submission_processor.py` or the Node equivalent). Ensure the workspace or repo has your custom instructions applied.

Step 3b: Ask Copilot to review the file. For example: "Review this code against our standards and list issues." Note whether the output now aligns with your rules (e.g. mentions tests, British English, structure).

Step 3c: Ask Copilot to suggest a refactor or a fix for one issue. See if the suggestion follows your instructions (e.g. clearer names, no behaviour change).

Step 3d: If the output does not match your rules, refine the instructions (e.g. add "When reviewing, always list missing tests" or "When suggesting code, use British English spellings"). Test again.

Step 3e: Optionally, switch to a file without instructions (or clear them) and run the same prompts. Compare: did the custom instructions improve relevance and consistency?

---

## Step 4: Prompt library (bonus, 10 mins)

Step 4a: In the same file or a separate doc, add a "Prompt library" section. List 3–5 prompts that work well for your team, for example:

- "Review this code against UKEF standards. List issues by category and suggest fixes."
- "Generate unit tests for this function. Include happy path, edge cases, and error cases. Use pytest."
- "Refactor this function for clarity. Keep behaviour the same. Use British English."

Step 4b: Write them so anyone can copy-paste into Copilot Chat. Add one line each on when to use them (e.g. "Use for PR review" or "Use when adding a new function").

---

## Prompts that work well when testing

- "Review this code against our standards and list issues."
- "Suggest a refactor for this function. Keep behaviour the same and follow our style."
- "What tests are missing for this code? Suggest test cases."

## If you get stuck

- Editor does not support repo-level instructions: Use the editor's "Custom instructions" or "Instructions for AI" in settings and paste your rules there. Test in the same workspace as the Exercise 1 code.
- Copilot ignores the instructions: Make the rules shorter and more direct. Start with one rule (e.g. "Use British English") and test; add more gradually.
- No UKEF standards to hand: Use "government digital service" or "government coding standards" in the instructions and ask Copilot to align with those.

---
Version: 1.0
Last updated: April 2026
