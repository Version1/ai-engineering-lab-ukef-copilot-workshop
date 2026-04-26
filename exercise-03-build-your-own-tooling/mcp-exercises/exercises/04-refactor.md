# Exercise 4: refactoring bad code

Time: ~15 minutes
Goal: Give the AI code that violates every standard and ask it to fix everything.
Without MCP, it makes generic improvements but misses team-specific rules.
With MCP, it searches the standards documents and fixes each violation systematically.

---

## How to run this exercise

1. Open `nodejs-starter/src/features/users/bad-code.ts` or `python-starter/app/users/bad_code.py`
2. Read through the file — the violations are annotated with  comments
3. Disable MCP — see [SETUP.md](../SETUP.md) for your assistant
4. Paste the prompt below
5. Note what the AI fixes and what it misses
6. Enable MCP and paste the same prompt again — see [SETUP.md](../SETUP.md) for how to toggle
7. Compare how complete each refactor is

---

## Node.js

### Prompt

```
Refactor bad-code.ts to follow our team's coding standards.
Fix all the issues you can find — naming, patterns, types, error handling, and anything else.
```

The prompt above is intentionally brief — the MCP server supplies the missing context. If you want to explore prompt structure further (for example, how to add role framing, constraints, or output format instructions), the [AI Engineering Lab prompt engineering playbook](https://github.com/govuk-digital-backbone/aiengineeringlab/tree/main/playbooks/prompt-engineering) covers the core techniques. The target output in the "What to watch for WITH MCP" section below shows what a well-guided refactor should produce.

### Violations in bad-code.ts (reference)

| Line | Violation | Standard says |
|---|---|---|
| `import axios from "axios"` | Forbidden HTTP library | Use native `fetch` |
| `GetUser`, `UsersList`, `LoginUser` | PascalCase functions | camelCase with verb prefix |
| `Promise<any>`, `(id: any)` | `any` type | Define proper interfaces |
| `.then()` chains | Forbidden async pattern | Use `async/await` |
| `throw new Error(...)` for control flow | Raw throw | Return `Result` type |
| `if (attempts >= 5)` | Magic number | `const MAX_LOGIN_ATTEMPTS = 5` |
| `return { expiresIn: 1800000 }` | Magic number | `const SESSION_TIMEOUT_MS = 30 * 60 * 1000` |
| `console.log(...)` | Console logging | Use structured logger |
| `import { db } from "..."` | Hard-coded import | Dependency injection |

### What to watch for WITHOUT MCP

The AI will fix the obvious issues it recognises from general best practices:
- May rename functions to camelCase
- May replace `.then()` with `async/await`
- May add TypeScript interfaces

But it will likely miss or get wrong:
- axios → fetch: It might keep axios (very deeply ingrained) or suggest another library
- Result pattern: It will use `try/catch` with `throw` — it does not know your team uses Result types
- Magic numbers: It may or may not extract them, and will not know the exact constant names your team uses
- Structured logging: It might add `winston` or `pino` — it does not know your team's logger preference
- Dependency injection: It will likely leave the hard-coded imports as-is

### What to watch for WITH MCP

The AI will call `search_guidelines("nodejs", "error handling")` and `get_guidelines("nodejs", "patterns")`.
It reads the actual standards documents and fixes every violation:

```typescript
import type { Database } from "../../shared/types.js";
import type { Logger } from "../../shared/types.js";

type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

interface User {
  id: string;
  name: string;
  email: string;
  loginAttempts: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export class UserService {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {}

  async getUserById(id: string): Promise<Result<User>> {
    const user = await this.db.findById("users", id);
    if (!user) {
      return { ok: false, error: new Error(`User not found: ${id}`) };
    }
    return { ok: true, value: user };
  }

  async listUsers(): Promise<Result<User[]>> {
    const users = await this.db.findAll("users");
    return { ok: true, value: users };
  }

  async loginUser(email: string, _password: string): Promise<Result<{ token: string; expiresIn: number }>> {
    const users = await this.db.findAll("users");
    const user = users.find((u) => u.email === email);

    if (!user) {
      return { ok: false, error: new Error(`No user with email: ${email}`) };
    }
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      return { ok: false, error: new Error(`Account locked: ${email}`) };
    }

    this.logger.info("User logged in", { userId: user.id });
    return { ok: true, value: { token: "mock-token-abc123", expiresIn: SESSION_TIMEOUT_MS } };
  }
}
```

### Key insight

Notice the AI found the magic numbers, the axios import, and the Result pattern — all from reading
the standards document. Without the server it could only apply general knowledge. The difference is
not that the AI is smarter; it is that it now has access to your team's decisions.

---

## Python

### Prompt

```
Refactor bad_code.py to follow our team's coding standards.
Fix all the issues you can find — naming, patterns, types, error handling, and anything else.
```

### Violations in bad_code.py (reference)

| Line | Violation | Standard says |
|---|---|---|
| `GetUser`, `UsersList`, `LoginUser` | camelCase (wrong for Python) | snake_case with verb prefix |
| `import requests` | Forbidden HTTP library | Use `httpx` with async |
| `def GetUser(id):` | Missing type hints | All functions must have type hints |
| `except:` | Bare except | Catch specific exception types |
| `pass` after except | Silenced error | Always log and re-raise |
| `if ... >= 5:` | Magic number | `MAX_LOGIN_ATTEMPTS = 5` |
| `return { "expires_in": 1800 }` | Magic number | `SESSION_TIMEOUT_SECONDS = 30 * 60` |
| `print(...)` | print statement | Use `structlog` |
| `f"User logged in: {user['id']}"` | f-string in log | Use keyword args: `logger.info("...", user_id=...)` |
| `from app.database import db` | Hard-coded import | Dependency injection |

### What to watch for WITHOUT MCP

The AI will fix some things:
- May rename functions to snake_case
- May add type hints

But will likely miss:
- requests → httpx: May keep `requests` or switch to `aiohttp`
- async: May not make functions async
- Bare except: May change to `except Exception` (better but still too broad)
- structlog: Does not know your team uses structlog — may add `logging` module instead
- Dependency injection: Will likely leave the singleton import
- Magic numbers: May extract them but with different constant names

### What to watch for WITH MCP

The AI calls `search_guidelines("python", "error handling")` and `get_guidelines("python", "patterns")`.

```python
import httpx
import structlog

from dataclasses import dataclass

logger = structlog.get_logger()

MAX_LOGIN_ATTEMPTS = 5
SESSION_TIMEOUT_SECONDS = 30 * 60


class UserNotFoundError(Exception):
    def __init__(self, user_id: str) -> None:
        self.user_id = user_id
        super().__init__(f"User not found: {user_id}")


class AccountLockedError(Exception):
    def __init__(self, email: str) -> None:
        super().__init__(f"Account locked: {email}")


@dataclass(frozen=True)
class LoginResult:
    token: str
    expires_in: int


class UserService:
    def __init__(self, db: Database) -> None:
        self._db = db

    async def get_user_by_id(self, user_id: str) -> dict[str, str] | None:
        user = await self._db.find_by_id("users", user_id)
        if not user:
            raise UserNotFoundError(user_id)
        return user

    async def login_user(self, email: str, password: str) -> LoginResult:
        users = await self._db.get_all_users()
        user = next((u for u in users if u["email"] == email), None)

        if not user:
            raise UserNotFoundError(email)
        if user["loginAttempts"] >= MAX_LOGIN_ATTEMPTS:
            raise AccountLockedError(email)

        logger.info("user_logged_in", user_id=user["id"])
        return LoginResult(token="mock-token-abc123", expires_in=SESSION_TIMEOUT_SECONDS)
```

### Key insight

Notice the structlog keyword-argument logging pattern — the AI would never know to use
that specific library without the standards document. The same applies to the custom exception
classes and dependency injection: these are team decisions that no model can infer from general
training data. The MCP server makes them explicit.
