# PR Review Skill: setup and samples

This folder contains everything you need for the PR review skill part of **Exercise 1: Code Quality & PR Review with UKEF Standards**. No separate software is required; you need GitHub Copilot in your editor.

The exercise uses the **skill workflow**: copy `pr-review.prompt.md` into `.github/prompts/` in your repo and run the skill on staged changes (in Agent mode). Follow the playbook in the exercise folder for step-by-step instructions.

The three sample PR diffs and `review-prompt-template.md` are also included as optional extras for ad-hoc chat-based review practice.

---

## What is in this folder

- pr-review.prompt.md: Copilot skill prompt file. Copy it to `.github/prompts/` in your repo to run structured PR reviews in Agent mode. Use with the prompt picker or `/pr-review`.
- copilot-instructions.md: Example workspace instructions. Use as a reference for Exercise 3 (Custom Instructions Library) or copy to `.github/copilot-instructions.md` when using the skill so Copilot applies your team's rules.
- review-prompt-template.md: Starter prompt to copy into Copilot Chat when reviewing a PR (chat workflow). Customise with your team's standards.
- sample-pr-01-naming.diff: Unclear naming and magic numbers. Use to practise spotting naming and clarity issues.
- sample-pr-02-missing-tests.diff: New code with no tests. Use to practise checking test coverage.
- sample-pr-03-structure.diff: Long function and missing validation. Use to practise structure and safety issues.

---

## Setup (participants)

1. You do not need to install anything extra. Exercise 1 uses Copilot Agent mode.
2. Before the session, your facilitator will confirm where to find these files. If this repo is shared with you, they are in this folder: `pr-review-skill/`.
3. Copy `pr-review.prompt.md` into your repo at `.github/prompts/` and add `.github/copilot-instructions.md` (you can start from `copilot-instructions.md` in this folder).
4. Follow the playbook in the exercise folder for the full exercise.

---

## Skill workflow (Exercise 1)

1. Copy `pr-review.prompt.md` to your repo at `.github/prompts/pr-review.prompt.md`.
2. Create `.github/copilot-instructions.md` (use `copilot-instructions.md` in this folder as a starting point) and add at least one team-specific rule.
3. Stage changes with `git add`. Open Copilot Chat, switch to Agent mode, then choose the prompt (paperclip > Prompt... > pr-review) or type `/pr-review`.
4. Use the structured review output. Optionally extend the prompt by adding sections under `## What to check` in `pr-review.prompt.md`.

Full steps are in the Exercise 1 playbook: [exercise-01-code-quality-pr-review/playbook-copilot.md](../exercise-01-code-quality-pr-review/playbook-copilot.md).

---

## Chat workflow (optional, for ad-hoc review practice)

The three sample PR diffs and `review-prompt-template.md` can be used for ad-hoc chat-based review if you finish the main exercises early or want extra practice.

1. Open a sample diff file (e.g. `sample-pr-01-naming.diff`) in your editor.
2. Open Copilot Chat. @-mention the diff file or paste the diff into the chat.
3. Paste the review prompt from `review-prompt-template.md` (or your facilitator's version). Send the message.
4. Read Copilot's response: list of issues, score, and suggested fixes. Note what it caught and what it missed.

---
Version: 1.0
Last updated: April 2026
