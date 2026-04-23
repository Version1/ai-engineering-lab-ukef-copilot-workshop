# Python sample code for UKEF Copilot Enablement Day

Sample code for the hands-on exercises. Used in Exercise 1 (Code Quality & PR Review), Exercise 2 (testing custom instructions), and optionally Exercise 3. The scenarios are simple back-office style (cover amounts, submission processing, aggregation) so they fit a mixed team (juniors and seniors) without needing domain knowledge.

## Requirements

- Python 3.8 or higher
- pip

## Setup

From this directory (`python-samples` inside the UKEF Copilot Enablement Day workshop):

```bash
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -e .
pip install -r requirements.txt
```

## Run tests

```bash
pytest
pytest tests/exercise01/
pytest tests/exercise02/
```

## Project structure

| Path | Workshop exercise | Purpose |
|------|--------------------|---------|
| `src/samples/exercise01/cover_calculator.py` | Exercise 1 (Code Quality & PR Review) | Test generation: calculate cover amount from amount, risk band, cap |
| `src/samples/exercise01/submission_processor.py` | Exercise 1 (Code Quality & PR Review) | Code review: process submissions (deliberate issues to find) |
| `src/samples/exercise02/aggregator.py` | Exercise 2 (Custom Instructions Library) | Refactoring: process and aggregate data (works but needs tidying) |
| `tests/exercise01/` | Exercise 1 (Code Quality & PR Review) | Add tests here for cover_calculator |
| `tests/exercise02/` | Exercise 2 (Custom Instructions Library) | Existing tests; run after each refactor |

## Run sample code

```bash
python -m samples.exercise01.cover_calculator
python -m samples.exercise01.submission_processor
python -m samples.exercise02.aggregator
```

---
Version: 1.0
Last updated: April 2026
