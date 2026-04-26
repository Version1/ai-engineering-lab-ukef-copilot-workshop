# Exercise 1: naming conventions

Time: ~10 minutes
Goal: Show that without standards, the AI guesses naming conventions from its general training.
With the MCP server, it reads your team's actual rules first.

---

## How to run this exercise

1. Open `nodejs-starter/src/features/users/user-service.ts` (for the Node.js demo)
   or `python-starter/app/users/user_service.py` (for the Python demo)
2. Disable MCP — see SETUP.md for your assistant
3. Paste the prompt below into your AI assistant
4. Note what the AI writes — especially function names, types, and file name suggestions
5. Enable MCP and paste the same prompt again
6. Compare the two outputs

---

## Node.js

### Prompt

```
I'm working on the users feature of our Express/TypeScript service.
Add a function to user-service.ts that fetches a user by their ID from the MOCK_DB array.
Also add a function that returns all users.
```

### What to watch for WITHOUT MCP

The AI has no knowledge of your team's conventions. Typical output:

```typescript
// Common AI choices without standards guidance:

// Option A — inconsistent verb usage, wrong ID casing
export function getUserByID(id: string): User | undefined {
  return MOCK_DB.find((u) => u.id === id);
}

export function getUsers(): User[] {
  return MOCK_DB;
}

// Option B — no verb prefix
export function userById(id: string): User | undefined { ... }

// Option C — PascalCase (mixing class and function conventions)
export function GetUserById(id: string): User | undefined { ... }
```

Red flags:
- `getUserByID` — the standard says `getUserById` (camelCase `Id`, not `ID`)
- No return type annotation (if strict mode is off)
- `getUsers()` — should start with a verb that better describes the action (`listUsers` or `getAllUsers`)

### What to watch for WITH MCP

The AI will call `get_guidelines("nodejs", "naming")` before writing code.
The tool returns the naming standard: *"All functions use camelCase and start with a verb."*

Expected output:

```typescript
export function getUserById(id: string): User | undefined {
  return MOCK_DB.find((user) => user.id === id);
}

export function listUsers(): User[] {
  return MOCK_DB;
}
```

What changed:
- `getUserById` — correct camelCase, correct `Id` casing
- `listUsers` — verb prefix, clearer intent than `getUsers`
- Return types explicitly annotated

### Key insight

The AI knows that functions should have verb prefixes — that is general JavaScript knowledge.
But it does not know *your team's* specific preferences: `Id` vs `ID`, `listUsers` vs `getUsers`,
whether return types are required. The MCP server makes those team-specific decisions explicit.

---

## Python

### Prompt

```
I'm working on the users feature of our FastAPI service.
Add a function to user_service.py that fetches a user by their ID from the MOCK_DB list.
Also add a function that returns all users.
```

### What to watch for WITHOUT MCP

> **Note:** Modern models often produce correct snake_case for Python. Exact output varies by model. Focus on the team-specific red flags below regardless of which variant the AI produces.

```python
# Possible AI choices without standards guidance:

# Option A — missing type hints entirely
def get_user(id):
    return next((u for u in MOCK_DB if u["id"] == id), None)

# Option B — correct snake_case but vague name, no return type
def user_by_id(user_id: str):  # no verb prefix, no return type
    ...

# Option C — bare dict return type, no verb prefix
def get_user_by_id(id: str) -> dict:
    return next((u for u in MOCK_DB if u["id"] == id), None)
```

Red flags:
- Missing type hints on parameters and return value
- No verb prefix (`user_by_id` instead of `get_user_by_id`)
- Using bare `dict` return type instead of `dict[str, str]` (not specific enough)
- `get_users()` instead of `list_users()` — verb choice is a team decision the AI cannot know

### What to watch for WITH MCP

The AI will call `get_guidelines("python", "naming")`.
The tool returns: *"All functions use snake_case and start with a verb."*

Expected output:

```python
def get_user_by_id(user_id: str) -> dict[str, str] | None:
    return next((user for user in MOCK_DB if user["id"] == user_id), None)

def list_users() -> list[dict[str, str]]:
    return MOCK_DB
```

What changed:
- `get_user_by_id` — snake_case, verb prefix, descriptive parameter name `user_id`
- `list_users` — verb prefix, clearer than `get_users`
- Full type hints on both parameters and return types

### Key insight

Even when the AI gets basic snake_case right, it does not know your team's specific preferences:
the required verb prefix, mandatory type hints on return values, and `dict[str, str]` over a bare `dict`.
The MCP server makes those team-specific decisions explicit regardless of which model you are using.
