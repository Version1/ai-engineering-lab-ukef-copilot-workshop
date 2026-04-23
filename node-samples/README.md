# Node.js sample code for UKEF Copilot Enablement Day

Sample code for the hands-on exercises. Used in Exercise 1 (Code Quality and Standards), Exercise 2 (testing custom instructions), and optionally Exercise 3. The scenarios are simple back-office style (cover amounts, submission processing, aggregation) so they fit a mixed team (juniors and seniors) without needing domain knowledge.

## Requirements

- Node.js 18 or higher
- npm (included with Node)

## Setup

From this directory (`node-samples` inside the UKEF Copilot Enablement Day workshop):

```bash
npm install
```

## Run tests

```bash
npm test
```

## Project structure

| Path | Workshop exercise | Purpose |
|------|--------------------|---------|
| `src/exercise01/coverCalculator.js` | Exercise 1 (Code Quality & PR Review) | Test generation: calculate cover amount from amount, risk band, cap |
| `src/exercise01/submissionProcessor.js` | Exercise 1 (Code Quality & PR Review) | Code review: process submissions (deliberate issues to find) |
| `src/exercise02/aggregator.js` | Exercise 2 (Custom Instructions Library) | Refactoring: process and aggregate data (works but needs tidying) |
| `test/exercise01/` | Exercise 1 (Code Quality & PR Review) | Add tests here for coverCalculator |
| `test/exercise02/` | Exercise 2 (Custom Instructions Library) | Existing tests; run after each refactor |

## Run sample code

```bash
npm run run:exercise01
npm run run:exercise01:submission
npm run run:exercise02
```

Or:

```bash
node src/exercise01/coverCalculator.js
node src/exercise01/submissionProcessor.js
node src/exercise02/aggregator.js
```

Each file runs its example when you execute it directly.

---
Version: 1.0
Last updated: April 2026
