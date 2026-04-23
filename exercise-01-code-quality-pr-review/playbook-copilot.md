# Playbook: Code Quality & PR Review with UKEF Standards

Time: about 30 minutes

You will use Copilot to identify code quality violations, refactor to meet the bar, add tests, then set up a PR review skill, run it against buggy code, record findings, and extend the skill with your own rules.

**Note:** This is an intensive exercise. Focus on Part A (15 min) OR Part B (15 min) if time is short, or work through both if your team is fast.

---

## Part A: Code Quality Review and Refactoring (15 min)

## Step 1: Understand what the code does (3 mins)

Step 1a: Open the first sample file (or one of the flawed files) in your editor.

Step 1b: Select the whole file or the main function. Open Copilot Chat (`Ctrl+Shift+I` or `Cmd+Shift+I`).

Step 1c: Ask in plain English:

```
Explain what this code does. What is it for? What are the main steps?
```

Step 1d: If something is unclear, ask follow-ups:

```
What does [variable name] mean?
What could go wrong here?
What edge cases are not handled?
```

---

## Step 2: Ask Copilot to review against standards (5 mins)

Step 2a: Tell Copilot what to check for. If you have UKEF standards, refer to them. If not, use general good practice. For example:

```
Review this code. List:
1. Bugs or logic errors
2. Missing checks (e.g. null, empty input)
3. Unclear names or structure
4. Anything that would fail a code review at UKEF
```

Step 2b: Go through the list. For each point, ask:

```
Suggest a concrete fix for [issue].
```

Step 2c: Note what Copilot found and what you spotted yourself. You will use this when refactoring and in the debrief.

---

## Step 3: Refactor and add tests (5 mins)

Step 3a: For the most important issues, ask Copilot to propose better code. For example:

```
Rewrite this function so it handles null and empty input, and use clearer variable names.
```

Step 3b: Review every suggestion. Do not accept it until you understand it and it matches your standards.

Step 3c: Add or improve tests. Ask Copilot to generate tests for the refactored code (happy path, edge cases, errors). Run the tests and fix any failures.

Step 3d: If the suggestion is wrong or incomplete, say so and ask again:

```
That does not handle the case when X is empty. Try again.
```

---

## Step 4: Document your best prompts (2 mins)

Step 4a: Look back at the prompts you used that gave the most useful review or fixes.

Step 4b: Write them down in a short list or doc (e.g. in the repo or a shared doc). Include the exact wording that worked so you can reuse them for real PRs.

Step 4c: Be ready to share one or two in the debrief.

---

## Part B: PR Review Skill (15 min)

## Step 5: Set up the PR review skill (5 mins)

Step 5a: Copy `pr-review.prompt.md` from the `pr-review-skill/` folder in this workshop (or the shared location your facilitator has provided).

Step 5b: In a repository you work in (or a test repo), create this folder structure:

```
your-repo/
  .github/
    prompts/
      pr-review.prompt.md
    copilot-instructions.md
```

Step 5c: Open `.github/copilot-instructions.md`. Add at least one rule that applies to your team's codebase. For example:

```markdown
# Copilot workspace instructions

## Code review standards
- require error handling on all async functions
- flag any hardcoded environment-specific values
- require unit tests for all new public methods
```

Use your own team's actual standards, not these examples. You can start from the example `copilot-instructions.md` in the `pr-review-skill/` folder.

Step 5d: Run the skill:

1. Open your editor and open the repository.
2. Stage any change with `git add`.
3. Open Copilot Chat.
4. Switch the mode dropdown from "Ask" to "Agent".
5. Click the paperclip icon, select "Prompt...", and choose `pr-review.prompt.md`.
6. Press Enter.

You should see a structured review appear with findings organised into blocking, suggested, or optional.

---

## Step 6: Review buggy sample code (5 mins)

Step 6a: Create a new file in your repository called `userController.js` and paste this code into it:

```javascript
const db = require('./database');

// Get user by ID
async function getUser(req, res) {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  const result = await db.query(query);
  
  if (result) {
    res.json(result[0]);
  }
}

// Update user email
function updateEmail(req, res) {
  const userId = req.params.id;
  const newEmail = req.body.email;
  
  // TODO: add validation later
  db.query(`UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`);
  
  res.json({ success: true });
}

// Delete user
async function deleteUser(req, res) {
  const id = req.params.id;
  const adminKey = "supersecret123";
  
  if (req.headers['x-admin-key'] !== adminKey) {
    return res.status(403).json({ error: 'forbidden' });
  }
  
  await db.query(`DELETE FROM users WHERE id = ${id}`);
  res.json({ deleted: true });
}

module.exports = { getUser, updateEmail, deleteUser };
```

Step 6b: Stage the file with `git add userController.js`.

Step 6c: Run your PR review skill on it (same steps as Step 5d: open Copilot Chat, switch to Agent, select the prompt, press Enter).

Step 6d: Use this table to record what the skill found and whether you agree:

| Finding | Severity (skill) | Do you agree? | What the skill missed |
|---------|-----------------|---------------|----------------------|
| | | | |
| | | | |
| | | | |

There are at least five distinct issues in this file. How many did the skill catch?

Step 6e: Compare your findings with your team. Did the skill catch things you might have skimmed in a real review? Did it miss anything obvious?

---

## Step 7: Extend the skill (5 mins)

Step 7a: Based on what the skill missed or what you would add for your team, open `pr-review.prompt.md` and add a new section under `## What to check`.

For example, if the skill did not check for SQL injection clearly enough:

```markdown
### 7. Database query safety
- Flag any string concatenation used to build SQL queries
- Require parameterised queries or a query builder for all database calls
- Flag raw SQL in files that are not the designated repository layer
```

Step 7b: Re-run the skill on the same file. Does the new section improve the output?

Step 7c: Write down the rule you added and why. You will share this in the debrief.

---

## Discussion questions (debrief)

Your facilitator will ask the group:

1. What issues did Copilot catch in the code quality review? What did it miss?
2. What did the PR review skill catch that you might have skimmed in a real review?
3. How did the skill's findings compare with your manual review in Steps 1-3?
4. What one rule would you add for your own team's codebase?

## Prompts that work well

- "Explain what this code does step by step."
- "What could go wrong with this code? List edge cases and errors."
- "Review this against our code quality standards and list issues."
- "Suggest a fix for [specific issue]."
- "Generate unit tests for this function including edge cases and errors."
- "Review this PR diff against UKEF standards. List issues by category and give a pass/fail score with a short reason."
- "What would a senior reviewer say about this diff? List the top three issues."
- "Does this diff add or update tests? If not, what should be tested?"

## Prompts to avoid

- "Is this good?" (too vague)
- "Fix everything." (ask for one thing at a time)
- "Is this PR good?" (too vague; ask for categories and a score)
- "Review everything." (say "this PR diff" and "against UKEF standards")

## If you get stuck

- Copilot misses an issue: Add it yourself and note it for the debrief.
- Suggestions are off: Be specific: "We use Python 3 and pytest; suggest tests that follow that."
- No UKEF standards to hand: Use "government digital service" or "government coding standards" and ask Copilot to check against those.
- Agent mode option is not showing: go to Settings, search for "agent mode", enable it, and restart your editor.
- Prompt file is not appearing in the picker: type `/pr-review` directly in the chat input. If that does not work, check the file is saved inside `.github/prompts/` with the `.prompt.md` extension.
- Skill says it cannot find any changes: make sure you have staged changes with `git add`. The skill uses `#changes` which reads staged or committed diffs, not unstaged edits.
- Output is very short or generic: add `#codebase` to the chat input manually to give the skill more context about the repository.

---
Version: 1.0
Last updated: April 2026
