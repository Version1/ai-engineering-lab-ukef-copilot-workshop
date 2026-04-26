# Exercise 5: full feature build

Time: ~20 minutes
Goal: The grand finale. Ask the AI to build a complete feature from scratch — no starter file,
no hints. Without MCP, it invents its own conventions. With MCP, it calls `get_quick_reference`
first, then consults specific standards categories, producing fully compliant code in one pass.

---

## How to run this exercise

1. Make sure the `nodejs-starter/` or `python-starter/` folder is open in your editor
2. Do NOT open any specific file — you want the AI to decide where to create files
3. Disable MCP
4. Paste the prompt below
5. Let the AI generate the full feature — note every decision it makes on its own
6. Enable MCP and paste the same prompt again
7. Compare the two outputs side by side

This is the best exercise to run last. You will now recognise every individual decision the AI makes —
from naming to structure to error handling — and see how the MCP server guides each one.

---

## Node.js

### Prompt

```
Build a complete user registration endpoint for our Express/TypeScript service.
The endpoint should be POST /users/register and accept a name, email, and password.
Include input validation, a service layer that checks if the email already exists in
MOCK_DB, proper error handling, and return the created user (without the password).
Follow our team's standards for everything.
```

### What the AI does WITHOUT MCP

The AI invents all conventions from training data. Common results:

File placement:
```
src/
├── controllers/UserController.ts    ← PascalCase file, controllers/ folder (wrong)
├── services/UserService.ts          ← PascalCase file, services/ folder (wrong)
├── models/User.ts                   ← separate models/ folder (wrong)
└── routes/userRoutes.ts             ← routes/ folder (wrong)
```

Code patterns:
```typescript
import axios from "axios";  // possibly added "just in case"
import bcrypt from "bcrypt"; // reasonable guess but may not be the team standard

// Throws instead of Result pattern:
async function registerUser(data: any): Promise<User> {
  const existing = MOCK_DB.find(u => u.email === data.email);
  if (existing) throw new Error("Email already exists"); // raw throw — forbidden

  const user = { id: uuid(), ...data };
  MOCK_DB.push(user);
  return user;
}
```

Things to look for:
- PascalCase file names and function names where kebab-case is required
- `any` types throughout — no proper interface definitions
- Throws for expected errors — no Result pattern
- Wrong folder structure — features not self-contained
- `console.log` for logging
- May install `uuid` or `bcrypt` without knowing if the team uses those

### What the AI does WITH MCP

Before writing a single line of code, the AI will call at minimum:

1. `get_quick_reference("nodejs")` — reads top-10 rules as a baseline
2. `get_guidelines("nodejs", "naming")` — reads naming rules before creating files/functions
3. `get_guidelines("nodejs", "patterns")` — reads error handling and HTTP patterns
4. `get_guidelines("nodejs", "structure")` — reads where to put the new files

Expected output structure:
```
src/features/users/
├── user-service.ts           ← kebab-case, extended with registerUser function
├── user-routes.ts            ← registerUser route added
├── types.ts                  ← CreateUserRequest interface
└── index.ts                  ← barrel file, exports public API
```

Expected code quality:
```typescript
// types.ts
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// user-service.ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export async function registerUser(
  request: CreateUserRequest,
): Promise<Result<User>> {
  const existing = MOCK_DB.find((u) => u.email === request.email);
  if (existing) {
    return { ok: false, error: new Error(`Email already registered: ${request.email}`) };
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: request.name,
    email: request.email,
  };
  MOCK_DB.push({ ...user, password: request.password });

  logger.info("User registered", { userId: user.id, email: user.email });
  return { ok: true, value: user };
}
```

### Key insight

Count the tool calls — the AI made four calls to the MCP server before writing code.
It was not guessing. It was reading a specification. The result is code that a senior engineer
would be proud to merge, on the first attempt, without a single standards violation.
That is the value of connecting your coding standards to your AI assistant.

---

## Python

### Prompt

```
Build a complete user registration endpoint for our FastAPI service.
The endpoint should be POST /users/register and accept a name, email, and password.
Include input validation using Pydantic, a service layer that checks if the email
already exists in MOCK_DB, proper error handling, and return the created user
(without the password). Follow our team's standards for everything.
```

### What the AI does WITHOUT MCP

File placement:
```
python-starter/
├── models.py                  ← top-level — wrong
├── UserService.py             ← PascalCase file — wrong
└── routes.py                  ← flat — wrong
```

Code patterns:
```python
from pydantic import BaseModel
import requests  # possibly imported
import uuid

# Missing type hints:
class UserService:
    def register_user(self, data):  # no types
        if any(u["email"] == data.email for u in MOCK_DB):
            raise HTTPException(status_code=400, detail="Email exists")  # wrong pattern

# Generic exception handling:
try:
    ...
except Exception as e:  # too broad
    raise HTTPException(500, str(e))
```

Things to look for:
- Using `raise HTTPException` inside the service layer — mixes HTTP concerns with business logic
- `requests` imported (sync, forbidden)
- Missing `@dataclass(frozen=True)` for domain objects
- Using `print()` instead of `structlog`
- No `exceptions.py` with custom exception classes

### What the AI does WITH MCP

The AI will call:

1. `get_quick_reference("python")` — reads top-10 rules
2. `get_guidelines("python", "naming")` — reads snake_case, verb prefix rules
3. `get_guidelines("python", "patterns")` — reads httpx, structlog, Pydantic, dataclass rules
4. `get_guidelines("python", "structure")` — reads where to create the new files

Expected output structure:
```
python-starter/app/users/
├── __init__.py           ← updated to export CreateUserRequest, UserService
├── user_service.py       ← extended with register_user function
├── user_routes.py        ← register endpoint added
├── models.py             ← Pydantic + dataclass models
└── exceptions.py         ← EmailAlreadyRegisteredError
```

Expected code quality:
```python
# exceptions.py
class EmailAlreadyRegisteredError(Exception):
    def __init__(self, email: str) -> None:
        self.email = email
        super().__init__(f"Email already registered: {email}")


# models.py
from pydantic import BaseModel, Field
from dataclasses import dataclass


class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r"^[\w.+-]+@[\w-]+\.[\w.]+$")
    password: str = Field(min_length=8)


@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str


# user_service.py (new function)
async def register_user(request: CreateUserRequest) -> User:
    if any(u["email"] == request.email for u in MOCK_DB):
        raise EmailAlreadyRegisteredError(request.email)

    user = User(
        id=str(uuid.uuid4()),
        name=request.name,
        email=request.email,
    )
    MOCK_DB.append({"id": user.id, "name": user.name, "email": user.email})
    logger.info("user_registered", user_id=user.id, email=user.email)
    return user


# user_routes.py (new endpoint)
from .exceptions import EmailAlreadyRegisteredError

@router.post("/register", status_code=201)
async def register_user_endpoint(request: CreateUserRequest) -> User:
    try:
        return await register_user(request)
    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
```

Notice:
- `EmailAlreadyRegisteredError` is a custom exception — HTTP concerns stay in the route, business logic in the service
- `structlog` with keyword args — no f-strings, no print
- Pydantic for the API model, dataclass for the domain object
- `__init__.py` updated with explicit `__all__` — no wildcard exports

### Key insight

The separation of `EmailAlreadyRegisteredError` from `HTTPException` is a subtle but important
point. The service layer does not know it is running inside a web framework — it just raises a
business exception. The route layer translates that into an HTTP 409 response.
The AI learned that pattern from your standards document, not from its general training.

---

## Wrapping Up

After this exercise, check the MCP server tool call log in your assistant.
You will see exactly which tools were called, in what order, and what was returned.

Key message: The AI did not become smarter. It became informed.

Your team's standards were always the right answer. The MCP server is just the
mechanism that delivers those standards to the AI at the moment it needs them.
