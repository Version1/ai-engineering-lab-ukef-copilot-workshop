# Example UKEF Engineering Standards Reference

*Where UKEF-specific standards are not yet documented, this guide draws on the GDS Service Standard, NCSC Secure Development guidelines, and the GOV.UK Technology Code of Practice.*

---

## 1. Security

- No secrets in code. API keys, passwords, connection strings, and tokens must come from environment variables or a secrets manager. Never commit credentials to source control.
- Parameterised queries only. All database queries must use parameterised statements or an ORM. String concatenation in SQL is never acceptable.
- Input validation on all boundaries. Validate and sanitise all user input at the API layer. Use allowlists where possible.
- Authentication tokens must expire. JWTs and session tokens must have a defined expiry. Never issue tokens without `expiresIn`.
- Least privilege. Services and users should have the minimum permissions required. Avoid wildcard CORS origins in production.
- Password hashing. Use bcrypt with a minimum cost factor of 10.

## 2. Code Quality

- Use `const` and `let`, never `var`. In JavaScript and TypeScript, `var` is not permitted.
- Strict equality only. Use `===` and `!==`, never `==` or `!=`.
- Type safety. TypeScript code must use proper types. Avoid `any` except where genuinely unavoidable.
- Meaningful names. Variables, functions, and files should have descriptive names.
- No magic numbers. Numeric literals should be extracted into named constants.
- DRY. Duplicated logic must be extracted into shared functions or modules.
- Single responsibility. Functions should do one thing. If a function is longer than 30 lines, consider splitting it.
- Use modern language features. Prefer `async/await` over callbacks.

## 3. Error Handling

- Never use bare `except` or `catch`. Catch specific error types. Never swallow errors silently.
- Structured error responses. API error responses must include a machine-readable error code, a human-readable message, and appropriate HTTP status codes.
- Logging, not console.log. Use a structured logging library. Never use `console.log` or `print` for production logging.

## 4. Testing

- All new code must have tests. Minimum: unit tests for business logic and integration tests for API endpoints.
- Test coverage. Aim for 80% line coverage on new code. Critical paths must have 100% coverage.
- Test naming. Test names should describe the behaviour: `should reject applications from sanctioned countries`.
- No tests that depend on external services. Mock all external dependencies.
- Edge cases. Tests must cover error paths, boundary conditions, empty inputs, and malformed data.

## 5. Python-Specific

- Type hints on all function signatures.
- Use context managers for file operations. Always use `with open(...)`.
- Logging. Use the `logging` module, not `print()`.
- Docstrings. All public functions and classes must have docstrings.

## 6. JavaScript and TypeScript-Specific

- Use ES modules (`import`/`export`) over CommonJS in new code.
- Avoid callback hell. Use `async/await`. Callbacks nested more than two levels deep must be refactored.
- Response consistency. All API responses should follow a consistent structure.

## 7. Pull request standards

- PRs should be small and focused. One logical change per PR.
- Descriptive PR titles and descriptions. Include: what changed, why, how to test, any risks.
- Self-review before requesting review. Run linters, formatters, and tests locally before pushing.
- Address all review comments.

## 8. Documentation

- README files. Every service must have a README with: what it does, how to run it, how to run tests, environment variables required.
- Inline comments for why, not what.
