# Standards content: markdown file specifications

## Purpose

This document specifies the exact content for each markdown file in the `standards/` folder. These files are the "database" that the MCP server reads and serves to AI coding assistants. There are two language subdirectories — `python/` and `nodejs/` — each with four standards files.

## Formatting Rules for All Standards Files

Follow these rules so the search logic in `standards.ts` works correctly:

1. Use `#` (H1) for the file title — one per file, first line
2. Use `##` (H2) for each rule group / section — the search function splits on these
3. Use `###` (H3) sparingly for sub-sections within a rule group
4. Use `` and `` markers for approved vs forbidden — the LLM picks up on these strongly
5. Include code examples in fenced code blocks — the LLM uses these as patterns when generating code
6. Keep each section self-contained — when the search returns a section, it should make sense on its own without needing context from other sections
7. Use the correct language in fenced code blocks — use ` ```python ` for Python files and ` ```typescript ` for Node.js files so the LLM produces the right syntax

---

# Python Standards

---

## standards/python/naming.md

```markdown
# Python Naming Conventions

## Functions and Methods

All functions and methods use snake_case and start with a verb.

 Approved patterns:
```python
def get_user_by_id(user_id: str) -> User: ...
def validate_email(email: str) -> bool: ...
def handle_submit(event: FormEvent) -> None: ...
def parse_response(data: dict[str, Any]) -> ParsedResult: ...
```

 Forbidden patterns:
```python
def user(user_id: str): ...            # no verb
def GetUser(user_id: str): ...         # no PascalCase (that's for classes)
def getUserById(user_id: str): ...     # no camelCase
def data(response: dict): ...          # vague, no verb
```

Common verb prefixes: `get`, `set`, `create`, `update`, `delete`, `fetch`, `validate`, `parse`, `handle`, `is`, `has`, `should`, `can`.

## Classes

Classes use PascalCase and are nouns or noun phrases.

 Approved patterns:
```python
class UserService: ...
class PaymentGateway: ...
class ApiResponse: ...
class UserProfile: ...
```

 Forbidden patterns:
```python
class user_service: ...         # must be PascalCase
class Manage_Users: ...         # no underscores in class names
class manage_users: ...         # classes are PascalCase nouns
```

## Files and Directories

Files use snake_case. One primary class or logical grouping per file. Name files after their primary export.

 Approved patterns:
```
user_service.py         → contains class UserService
payment_gateway.py      → contains class PaymentGateway
validate_email.py       → contains function validate_email
test_user_service.py    → tests for UserService
```

 Forbidden patterns:
```
UserService.py          # no PascalCase filenames
user-service.py         # no kebab-case in Python
helpers.py              # too vague — name after what it helps with
utils.py                # too vague — split into specific files
```

## Variables and Constants

Local variables use snake_case. Module-level constants use UPPER_SNAKE_CASE.

 Approved patterns:
```python
user_name = "alice"
is_active = True
MAX_RETRY_COUNT = 3
API_BASE_URL = "https://api.example.com"
DEFAULT_PAGE_SIZE = 20
```

 Forbidden patterns:
```python
userName = "alice"           # no camelCase
IsActive = True              # no PascalCase for variables
max_retry_count = 3          # module constant must be UPPER_SNAKE_CASE
```

## Type Hints and Protocols

Use PascalCase for type aliases and Protocols. Always include type hints on function signatures.

 Approved patterns:
```python
from typing import Protocol, TypeAlias

UserId: TypeAlias = str
ConnectionPool: TypeAlias = dict[str, Any]

class Authenticatable(Protocol):
    def authenticate(self, credentials: dict[str, str]) -> bool: ...
```

 Forbidden patterns:
```python
def get_user(id, name):          # missing type hints
user_id_type = str               # type aliases must be PascalCase
class authenticatable: ...       # Protocols are PascalCase
```

## Enums

Enums use PascalCase class names with UPPER_SNAKE_CASE members.

 Approved patterns:
```python
from enum import Enum, StrEnum

class UserRole(StrEnum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"
```

 Forbidden patterns:
```python
class user_role(Enum):       # class name must be PascalCase
    admin = "admin"          # members must be UPPER_SNAKE_CASE
```
```

---

## standards/python/patterns.md

```markdown
# Python Approved and Forbidden Patterns

## Error Handling

Use explicit exception handling with custom exception classes for business logic errors. Use specific exception types, never bare `except`. Return structured results for expected failures where appropriate.

 Approved: Custom exceptions + specific handling
```python
class UserNotFoundError(Exception):
    def __init__(self, user_id: str):
        self.user_id = user_id
        super().__init__(f"User not found: {user_id}")

class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"Validation error on {field}: {message}")

async def fetch_user(user_id: str) -> User:
    try:
        response = await client.get(f"/api/users/{user_id}")
        response.raise_for_status()
        return User(**response.json())
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise UserNotFoundError(user_id) from exc
        raise
    except httpx.RequestError as exc:
        logger.error("Request failed", user_id=user_id, error=str(exc))
        raise
```

 Forbidden: Bare except, silenced errors
```python
try:
    user = await fetch_user(user_id)
except:                              # never use bare except
    pass                             # never silently swallow errors

try:
    user = await fetch_user(user_id)
except Exception as e:               # too broad — catch specific types
    print(e)                         # don't use print for error handling
```

## HTTP Client

Use httpx for HTTP requests. Do not use `requests` (it is synchronous only) or `urllib`.

 Approved:
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        url,
        json=data,
        headers={"Content-Type": "application/json"},
    )
```

 Forbidden:
```python
import requests                  # do not use requests
import urllib.request            # do not use urllib
from aiohttp import ClientSession  # do not use aiohttp
```

## Async Patterns

Use `async/await` with `asyncio` for I/O-bound operations. Use synchronous code only when there is no I/O.

 Approved:
```python
import asyncio

async def load_data() -> Data:
    async with httpx.AsyncClient() as client:
        response = await client.get("/api/data")
        return parse_data(response.json())

async def process_batch(items: list[str]) -> list[Result]:
    tasks = [process_item(item) for item in items]
    return await asyncio.gather(*tasks)
```

 Forbidden:
```python
def load_data() -> Data:                   # synchronous I/O
    response = requests.get("/api/data")   # blocking call
    return parse_data(response.json())
```

## Type Safety

Always use type hints. Use `mypy` strict mode. Never use `Any` without justification — prefer `object` or specific types.

 Approved:
```python
from typing import Any

def parse_input(data: object) -> User:
    if not isinstance(data, dict):
        raise TypeError("Expected dict")
    return User(**data)

# Any is acceptable ONLY when interacting with untyped third-party code
def wrap_legacy_call(legacy_func: Any) -> str:
    """Wrapper for untyped legacy API — Any is documented and justified."""
    result = legacy_func()
    return str(result)
```

 Forbidden:
```python
def parse_input(data):           # missing type hints
    return data                  # no validation

def process(items: Any) -> Any:  # Any without justification
    return items
```

## Magic Numbers

Extract all magic numbers into named constants. No unexplained literals in logic.

 Approved:
```python
MAX_LOGIN_ATTEMPTS = 5
SESSION_TIMEOUT_SECONDS = 30 * 60
DEFAULT_PAGE_SIZE = 20

if attempts >= MAX_LOGIN_ATTEMPTS:
    lock_account(user_id)
```

 Forbidden:
```python
if attempts >= 5:                  # what is 5?
    lock_account(user_id)

await asyncio.sleep(1800)          # what is 1800?
```

## Dependency Injection

Use constructor injection or function parameters for dependencies. Do not import singletons directly.

 Approved:
```python
class UserService:
    def __init__(self, db: Database, logger: Logger) -> None:
        self._db = db
        self._logger = logger

    async def get_user(self, user_id: str) -> User:
        self._logger.info("Fetching user", user_id=user_id)
        return await self._db.find_by_id("users", user_id)
```

 Forbidden:
```python
from app.database import db        # hard-coded singleton import
from app.logger import logger

class UserService:
    async def get_user(self, user_id: str):
        logger.info(f"Fetching user {user_id}")
        return await db.find_by_id("users", user_id)
```

## Logging

Use structlog for structured logging. Never use `print` statements or f-string interpolation in log messages.

 Approved:
```python
import structlog

logger = structlog.get_logger()

logger.info("user_created", user_id=user.id, email=user.email)
logger.error("payment_failed", order_id=order_id, error=str(exc), attempt=attempt)
```

 Forbidden:
```python
print(f"User created: {user.id}")               # no print statements
logger.info(f"User {user.id} created")           # no f-string in log messages
logging.info("User created: " + user.id)         # no string concatenation
```

## Data Classes and Models

Use Pydantic `BaseModel` for external data (API inputs/outputs, config). Use `@dataclass` for internal domain objects.

 Approved:
```python
from pydantic import BaseModel, Field
from dataclasses import dataclass

# External data — Pydantic for validation
class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r"^[\w.+-]+@[\w-]+\.[\w.]+$")

# Internal domain — dataclass for simplicity
@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str
```

 Forbidden:
```python
# Don't use plain dicts for structured data
user = {"name": "alice", "email": "alice@example.com"}

# Don't use NamedTuple for mutable domain objects
from typing import NamedTuple
class User(NamedTuple):     # use dataclass instead
    id: str
    name: str
```
```

---

## standards/python/structure.md

```markdown
# Python Project Structure Rules

## Project Layout

All projects follow the src layout. The package lives inside a `src/` directory to prevent accidental imports from the working directory.

 Approved structure:
```
my-project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── features/
│       │   ├── authentication/
│       │   │   ├── __init__.py
│       │   │   ├── service.py
│       │   │   ├── models.py
│       │   │   ├── exceptions.py
│       │   │   └── test_service.py
│       │   └── user_management/
│       │       ├── __init__.py
│       │       ├── service.py
│       │       ├── models.py
│       │       └── test_service.py
│       ├── shared/
│       │   ├── __init__.py
│       │   ├── database.py
│       │   ├── logging.py
│       │   └── types.py
│       └── main.py
├── tests/                    # Integration and e2e tests only
│   ├── conftest.py
│   └── test_integration.py
├── pyproject.toml
└── README.md
```

 Forbidden:
```
my-project/
├── my_project/              # missing src/ wrapper
│   ├── everything_here.py
├── helpers.py               # top-level junk drawer
├── utils.py                 # top-level junk drawer
```

## Test Co-location

Unit tests live next to the code they test. Same directory, `test_` prefix on the filename. Integration/e2e tests live in a top-level `tests/` directory.

 Approved:
```
features/authentication/service.py
features/authentication/test_service.py
```

 Forbidden:
```
src/my_project/features/authentication/service.py
tests/features/authentication/test_service.py    # unit tests must be co-located
```

## Module Exports (__init__.py)

Each feature package has an `__init__.py` that exports only the public API. Keep internal modules private.

 Approved:
```python
# features/authentication/__init__.py
from .service import AuthService
from .models import LoginCredentials, AuthToken
from .exceptions import AuthenticationError

__all__ = ["AuthService", "LoginCredentials", "AuthToken", "AuthenticationError"]
```

 Forbidden:
```python
# Don't use wildcard imports
from .service import *
from .models import *
from .internal_helpers import *  # leaking internal implementation
```

## Import Ordering

Imports follow this exact order, with a blank line between each group. Use `isort` with the profile `black`.

```python
# 1. Standard library
import asyncio
import os
from pathlib import Path

# 2. Third-party packages
import httpx
import structlog
from pydantic import BaseModel

# 3. Local application imports
from my_project.shared.database import Database
from my_project.shared.types import UserId

# 4. Relative imports from the same feature
from .models import User
from .exceptions import UserNotFoundError
```

 Forbidden:
```python
from .models import User
import os                            # stdlib after relative
import httpx                         # third-party after stdlib violation
from my_project.shared import db
```

## Shared vs Feature Code

Code goes in `shared/` ONLY if it is used by 3 or more features. Until then, keep it in the feature where it was created. Premature abstraction is worse than duplication.

## Dependency Management

Use `pyproject.toml` as the single source of truth for dependencies. Pin major versions. Use dependency groups for dev/test/lint.

 Approved:
```toml
[project]
dependencies = [
    "httpx>=0.27,<1",
    "structlog>=24.0,<25",
    "pydantic>=2.0,<3",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "mypy>=1.10", "ruff>=0.5"]
```

 Forbidden:
```
# Don't use requirements.txt as the primary dependency file
# Don't leave dependencies unpinned: httpx, pydantic
```
```

---

## standards/python/quick-reference.md

```markdown
# Python Quick Reference — Top 10 Rules

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
```

---

# Node.js Standards

---

## standards/nodejs/naming.md

```markdown
# Node.js Naming Conventions

## Functions and Methods

All functions and methods use camelCase and start with a verb.

 Approved patterns:
```typescript
function getUserById(id: string): Promise<User> {}
function validateEmail(email: string): boolean {}
function handleSubmit(event: FormEvent): void {}
function parseResponse(data: unknown): ParsedResult {}
```

 Forbidden patterns:
```typescript
function user(id: string) {}          // no verb
function GetUser(id: string) {}       // PascalCase is for classes
function get_user(id: string) {}      // no snake_case
function data(response: unknown) {}   // vague, no verb
```

Common verb prefixes: `get`, `set`, `create`, `update`, `delete`, `fetch`, `validate`, `parse`, `handle`, `is`, `has`, `should`, `can`.

## Classes and Interfaces

Classes and interfaces use PascalCase and are nouns or noun phrases.

 Approved patterns:
```typescript
class UserService {}
class PaymentGateway {}
interface ApiResponse {}
interface UserProfile {}
type ValidationResult = { valid: boolean; errors: string[] };
```

 Forbidden patterns:
```typescript
class userService {}        // must be PascalCase
class ManageUsers {}        // classes are nouns, not verbs
interface IUserProfile {}   // no "I" prefix for interfaces
```

## Files and Directories

Files use kebab-case. One primary export per file. Name files after their primary export.

 Approved patterns:
```
user-service.ts         → exports class UserService
payment-gateway.ts      → exports class PaymentGateway
validate-email.ts       → exports function validateEmail
use-auth.ts             → exports hook useAuth
user-profile.types.ts   → exports User types/interfaces
```

 Forbidden patterns:
```
UserService.ts          // no PascalCase filenames
userService.ts          // no camelCase filenames
helpers.ts              // too vague — name after what it helps with
utils.ts                // too vague — split into specific files
```

## Variables and Constants

Local variables use camelCase. Module-level constants use UPPER_SNAKE_CASE.

 Approved patterns:
```typescript
const userName = "alice";
const isActive = true;
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_PAGE_SIZE = 20;
```

 Forbidden patterns:
```typescript
const user_name = "alice";       // no snake_case for variables
const ISACTIVE = true;           // UPPER_CASE is for constants only
const max_retry_count = 3;       // module constant must be UPPER_SNAKE_CASE
```

## React Components and Hooks

Components use PascalCase. Hooks start with use in camelCase. Component files use kebab-case.

 Approved patterns:
```typescript
// File: user-profile-card.tsx
export function UserProfileCard({ user }: UserProfileCardProps) {}

// File: use-auth.ts
export function useAuth(): AuthState {}

// File: use-fetch-users.ts
export function useFetchUsers(teamId: string): UseFetchUsersResult {}
```

 Forbidden patterns:
```typescript
export function userProfileCard() {}     // components must be PascalCase
export function Auth(): AuthState {}     // hooks must start with "use"
export function usedata() {}             // camelCase after "use"
```

## Enums and Constants Objects

Enums use PascalCase names with PascalCase members. Prefer `as const` objects over TypeScript enums.

 Approved patterns:
```typescript
const UserRole = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

 Forbidden patterns:
```typescript
enum UserRole {              // avoid TypeScript enums
  ADMIN = "admin",
  EDITOR = "editor",
}
```
```

---

## standards/nodejs/patterns.md

```markdown
# Node.js Approved and Forbidden Patterns

## Error Handling

Use the Result pattern for expected errors. Reserve `throw` for truly exceptional situations (programmer errors, invariant violations). Never let errors pass silently.

 Approved: Result type pattern
```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { ok: false, error: new Error(`HTTP ${response.status}`) };
    }
    const user = await response.json();
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// Caller handles both cases explicitly
const result = await fetchUser("123");
if (!result.ok) {
  logger.error("Failed to fetch user", { error: result.error });
  return;
}
const user = result.value;
```

 Forbidden: raw throws for control flow
```typescript
// Don't use throw for expected business logic errors
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("Not found"); // caller must remember to catch
  return response.json();
}
```

## HTTP Client

Use the native `fetch` API. Do not install axios or other HTTP libraries.

 Approved:
```typescript
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

 Forbidden:
```typescript
import axios from "axios";     // do not use axios
import got from "got";          // do not use got
import request from "request";  // do not use request
```

## Async Patterns

Always use `async/await`. Never use `.then()/.catch()` chains.

 Approved:
```typescript
async function loadData(): Promise<Data> {
  const response = await fetch("/api/data");
  const json = await response.json();
  return parseData(json);
}
```

 Forbidden:
```typescript
function loadData(): Promise<Data> {
  return fetch("/api/data")
    .then((r) => r.json())
    .then((json) => parseData(json))
    .catch((err) => console.error(err));  // swallowed error
}
```

## Type Safety

Never use `any`. Use `unknown` when the type is genuinely not known, and narrow with type guards.

 Approved:
```typescript
function parseInput(data: unknown): User {
  if (typeof data !== "object" || data === null) {
    throw new Error("Expected object");
  }
  // validate and narrow the type
  return data as User; // only after validation
}
```

 Forbidden:
```typescript
function parseInput(data: any): User {    // never use any
  return data;                             // no validation
}
```

## Magic Numbers

Extract all magic numbers into named constants. No unexplained literals in logic.

 Approved:
```typescript
const MAX_LOGIN_ATTEMPTS = 5;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 20;

if (attempts >= MAX_LOGIN_ATTEMPTS) {
  lockAccount(userId);
}
```

 Forbidden:
```typescript
if (attempts >= 5) {          // what is 5?
  lockAccount(userId);
}

setTimeout(callback, 1800000); // what is 1800000?
```

## Dependency Injection

Prefer dependency injection over hard-coded imports for services. This makes testing easier.

 Approved:
```typescript
class UserService {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger
  ) {}

  async getUser(id: string): Promise<Result<User>> {
    this.logger.info("Fetching user", { id });
    return this.db.findById("users", id);
  }
}
```

 Forbidden:
```typescript
import { db } from "../database";  // hard-coded singleton import
import { logger } from "../logger";

class UserService {
  async getUser(id: string) {
    logger.info("Fetching user", { id });
    return db.findById("users", id);
  }
}
```

## Logging

Use structured logging with context objects. Never use `console.log` in production code.

 Approved:
```typescript
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Payment failed", { orderId, error: err.message, attempt });
```

 Forbidden:
```typescript
console.log("User created: " + user.id);    // no console.log
console.log(user);                            // no dumping objects
logger.info(`User ${user.id} created`);      // use structured context, not interpolation
```
```

---

## standards/nodejs/structure.md

```markdown
# Node.js Project Structure Rules

## Feature Organisation

New features go in a dedicated directory under `src/features/`. Each feature is self-contained with its own components, hooks, types, and tests.

 Approved structure:
```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── login-form.test.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── use-auth.test.ts
│   │   ├── services/
│   │   │   └── auth-service.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── user-management/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types.ts
│       └── index.ts
├── shared/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Shared hooks
│   ├── types/             # Global types
│   └── utils/             # Pure utility functions
└── app/
    ├── layout.tsx
    └── routes/
```

 Forbidden:
```
src/
├── components/            # Don't dump all components together
│   ├── LoginForm.tsx
│   ├── UserList.tsx
│   ├── PaymentForm.tsx
├── hooks/                 # Don't dump all hooks together
├── utils/                 # Don't have a junk drawer
```

## Test Co-location

Tests live next to the code they test. Same directory, same name with `.test.ts` suffix.

 Approved:
```
user-service.ts
user-service.test.ts
```

 Forbidden:
```
src/services/user-service.ts
tests/services/user-service.test.ts    # separate test directory
```

## Barrel Files (index.ts)

Each feature has one `index.ts` that exports only the public API. Internal modules are not exported.

 Approved:
```typescript
// features/authentication/index.ts
export { LoginForm } from "./components/login-form";
export { useAuth } from "./hooks/use-auth";
export type { AuthState, LoginCredentials } from "./types";
// internal services are NOT exported
```

 Forbidden:
```typescript
// Don't re-export everything
export * from "./components/login-form";
export * from "./hooks/use-auth";
export * from "./services/auth-service"; // leaking internal implementation
```

## Import Ordering

Imports follow this exact order, with a blank line between each group:

```typescript
// 1. Node.js built-ins
import path from "path";
import { readFile } from "fs/promises";

// 2. External packages (npm dependencies)
import { z } from "zod";
import React from "react";

// 3. Internal shared modules (aliased with @/)
import { Button } from "@/shared/components/button";
import { useLogger } from "@/shared/hooks/use-logger";

// 4. Relative imports from the same feature
import { UserCard } from "./components/user-card";
import type { User } from "./types";
```

 Forbidden:
```typescript
import { UserCard } from "./components/user-card";
import React from "react";                        // external after relative
import path from "path";                           // built-in after external
import { Button } from "@/shared/components";
```

## Shared vs Feature Code

Code goes in `shared/` ONLY if it is used by 3 or more features. Until then, keep it in the feature where it was created. Premature abstraction is worse than duplication.

Rule of thumb: if you are about to move something to `shared/`, ask: "Would I use this unchanged in a completely different project?" If yes, it belongs in shared. If no, keep it in the feature.
```

---

## standards/nodejs/quick-reference.md

```markdown
# Node.js Quick Reference — Top 10 Rules

These are the 10 most important Node.js coding standards every engineer must follow. For detailed rules, consult the full category documents.

1. Functions are camelCase and start with a verb: `getUserById`, `validateEmail`, `handleSubmit`. No PascalCase functions (that's for classes). No snake_case.

2. Files are kebab-case: `user-service.ts`, `use-auth.ts`, `payment-gateway.ts`. Name the file after its primary export.

3. No `any` type — ever: Use `unknown` and type guards instead. If you find yourself reaching for `any`, define a proper type or interface.

4. Use Result types, not raw throws: Return `{ ok: true, value }` or `{ ok: false, error }` for expected errors. Reserve `throw` for programmer errors only.

5. Use `fetch`, not axios: The native fetch API is the team's standard HTTP client. Do not install axios, got, or other HTTP libraries.

6. async/await only: No `.then()` chains, no callbacks. All asynchronous code uses async/await.

7. No magic numbers: Extract all numeric literals into named `UPPER_SNAKE_CASE` constants with descriptive names.

8. Tests live next to code: `user-service.ts` and `user-service.test.ts` in the same directory. No separate `tests/` folder.

9. Features are self-contained directories: New features go in `src/features/{feature-name}/` with their own components, hooks, services, and types.

10. Imports follow strict ordering: Node built-ins → external packages → internal shared (`@/`) → relative imports. Blank line between each group.
```

---

# Content Design Notes

## Why Separate Files Per Language?

Each language has genuinely different conventions. Python uses `snake_case` for functions; Node.js uses `camelCase`. Python uses `httpx`; Node.js uses `fetch`. Python structures projects with `src/` layout and `__init__.py`; Node.js uses barrel `index.ts` files. Sharing a single file with "if Python do X, if Node do Y" would be confusing for both the LLM and human readers.

The separate-folder approach also makes it trivially easy to add new languages — just create a new subdirectory with the same four files.

## Why These Specific Rules?

The content is designed to be opinionated and verifiable. Each rule has a clear right/wrong answer so that during the workshop demo, attendees can immediately see whether the AI followed the standard or not.

For example: if the AI generates `requests.get(...)` instead of `httpx` in Python code, that's an obvious violation. If it names a Python file `userService.py` instead of `user_service.py`, that's a violation. If it uses `axios` in Node.js instead of `fetch`, that's a violation. These clear signals make the demo impactful.

The Python and Node.js rules also deliberately contrast with each other on several points (snake_case vs camelCase, httpx vs fetch, custom exceptions vs Result types) so the workshop can demonstrate that the LLM correctly switches conventions when the language changes.

## Why Code Examples in Every Section?

The LLM treats code examples in tool results as patterns to follow. Including both ` Approved` and ` Forbidden` examples gives the LLM concrete positive and negative examples, which significantly improves compliance compared to prose-only descriptions.

## Why the Quick Reference Exists Separately?

The quick reference is a curated subset, not a dump of all rules. It exists because the LLM may call `get_quick_reference` as a lightweight first pass before deciding whether to fetch a full category. Think of it as the LLM's "cheat sheet" — it covers 80% of cases in 20% of the text.

## Customisation for Your Team

These standards are intentionally generic examples. For the workshop, encourage attendees to:

1. Replace the content with their actual team standards
2. Add new categories (e.g., `testing.md`, `security.md`, `accessibility.md`)
3. Add new languages (e.g., `standards/go/`, `standards/java/`)
4. Observe that the MCP server picks up new files and folders automatically (no code changes needed for `list_categories` or `search_guidelines`)
