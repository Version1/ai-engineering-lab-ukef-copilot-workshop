# Exercise 1: Code Quality & PR Review with UKEF Standards

Level: Intermediate | Time: 30 mins | Focus: Using Copilot to identify violations against UKEF standards, refactor code, add tests, set up a PR review skill, and extend it with your team's rules

**Note:** This exercise has two parts (A: Code Quality, B: PR Review Skill). You can do both if time allows, or focus on one part depending on your team's pace.
## Exercise summary

You are given flawed code files (or the sample set from this workshop: JS/TS, Python). First, you use Copilot to identify violations against UKEF's (or government) standards, refactor the code to meet the bar, add tests, and document the prompts that worked best. Then, you set up a Copilot PR review skill, run it against buggy sample code, record what it catches and misses, and extend the skill's prompt with at least one new rule. In the debrief, the room discusses what Copilot caught, what it missed, and what rules each team added.

This mirrors real work: improving code quality before it goes to a human reviewer, and using Copilot as a first-pass reviewer so human reviewers can focus on higher-level feedback.

## Success criteria

- You have used Copilot to explain what the code does and what could go wrong.
- You have identified violations (bugs, missing checks, unclear names, or things that would fail a UKEF review) and listed them.
- You have refactored at least one file to meet the bar and added or improved tests where needed.
- You have written down your best prompts (the ones that gave the most useful review or fixes) so you can reuse them.
- You have set up the PR review skill in a repository (prompt file in `.github/prompts/`, custom instructions in `.github/copilot-instructions.md`).
- You have run the skill against the sample buggy code and recorded its findings.
- You have extended the skill prompt with at least one new rule based on what it missed.
- You can say what Copilot caught and what it missed in the debrief.

## Getting started

1. Open the sample code files for this exercise (Python or Node.js) in your editor. Your facilitator may provide specific flawed files or point you to this workshop's samples.
2. Use Copilot Chat to explain the code, spot issues, and list violations against UKEF standards (or government standards if that is the stand-in).
3. For each file (or a subset if time is short), use Copilot to suggest and apply improvements: refactor, add tests, fix edge cases.
4. Document the prompts that worked best.
5. Set up the PR review skill: copy `pr-review.prompt.md` from `pr-review-skill/` into `.github/prompts/` and create `.github/copilot-instructions.md` with your team's rules.
6. Run the skill against sample code, record findings, and extend the prompt with new rules.

[View playbook →](playbook-copilot.md)

## Sample code

Use one language only. Code lives in this workshop's `python-samples` or `node-samples` folder.

- Python: `../python-samples/src/samples/exercise01/submission_processor.py` and `../python-samples/src/samples/exercise01/cover_calculator.py`. See `../python-samples/README.md` for setup and how to run.
- Node.js: `../node-samples/src/exercise01/submissionProcessor.js` and `../node-samples/src/exercise01/coverCalculator.js`. See `../node-samples/README.md` for setup and how to run.

If your facilitator gave you different code (for example from a UKEF repo), use that instead.

## Skill files

The `pr-review-skill/` folder in this workshop contains everything you need for the PR review part. See [pr-review-skill/README.md](../pr-review-skill/README.md) for what is in the folder.

- `pr-review.prompt.md`: Copilot skill prompt file. Copy to `.github/prompts/` in your repo.
- `copilot-instructions.md`: example workspace instructions. Copy to `.github/copilot-instructions.md` and add your team's rules.
- `review-prompt-template.md`: starter prompt you can also use in Copilot Chat for ad-hoc reviews.
- Three sample PR diffs (`sample-pr-01-naming.diff`, `sample-pr-02-missing-tests.diff`, `sample-pr-03-structure.diff`): optional extra material if you finish early or want to practise chat-based review.

---
Version: 1.0
Last updated: April 2026
