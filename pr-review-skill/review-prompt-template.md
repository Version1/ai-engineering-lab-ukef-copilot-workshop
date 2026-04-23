# PR review prompt template

Copy the text below into Copilot Chat when reviewing a PR diff. Customise the standards line if your team uses UKEF or government engineering standards.

---

Review this PR diff against our code quality and review standards.

List issues in these categories:

1. Correctness (bugs, logic errors, missing validation)
2. Testing (missing or weak tests for new or changed code)
3. Style and structure (naming, clarity, function length, duplication)
4. Other (security, performance, accessibility, or standards-specific points)

Then:

- Score: Pass or Fail (and why in one sentence)
- Top 2 changes the author should make before merge

Be specific: quote line numbers or snippets where possible.
