# Python quick reference: top 10 rules

These are the 10 most important Python coding standards every engineer must follow. For detailed rules, consult the full category documents.

1. Functions are snake_case and start with a verb: `get_user_by_id`, `validate_email`, `handle_submit`. No camelCase. No PascalCase (that's for classes).

2. Files are snake_case: `user_service.py`, `validate_email.py`, `payment_gateway.py`. Name the file after its primary class or function.

3. Always use type hints: Every function signature must have type hints on all parameters and the return type. Run `mypy --strict`.

4. Custom exceptions for business errors: Define specific exception classes (`UserNotFoundError`, `ValidationError`). Never use bare `except`. Never silently swallow errors.

5. Use httpx, not requests: `httpx` with `AsyncClient` is the team's standard HTTP client. Do not use `requests`, `urllib`, or `aiohttp`.

6. async/await for all I/O: All I/O-bound operations use `async/await`. Synchronous code is only for pure computation.

7. No magic numbers: Extract all numeric literals into named `UPPER_SNAKE_CASE` constants with descriptive names.

8. Unit tests live next to code: `service.py` and `test_service.py` in the same directory. Only integration tests go in the top-level `tests/` folder.

9. Use src layout: The package lives inside `src/my_project/`. Features are self-contained directories under `features/`.

10. Use structlog for logging: Structured key-value logging only. No `print()`. No f-strings in log messages.
