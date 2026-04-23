# Exercise 2: code patterns

Time: ~15 minutes
Goal: The most visually dramatic exercise. Without standards, the AI installs forbidden
libraries and uses deprecated async patterns. With the MCP server, it reads your team's
approved patterns and follows them exactly.

---

## How to run this exercise

1. Open the same file used in Exercise 1 (`user-service.ts` or `user_service.py`)
2. Disable MCP — see [SETUP.md](../SETUP.md) for your assistant
3. Paste the prompt below
4. Note the import statements and async pattern the AI chooses
5. Enable MCP and paste the same prompt again — see [SETUP.md](../SETUP.md) for how to toggle
6. Compare — the difference is immediate and dramatic

---

## Node.js

### Prompt

```
Add a function to user-service.ts that fetches a user's extended profile from this
external API: https://jsonplaceholder.typicode.com/users/{id}

The function should call the API, handle errors, and return the user profile data.
```

### What to watch for WITHOUT MCP

AI output varies — the examples below show common patterns, but your output may differ. Use the red flags list below as your definitive check, not the exact code shown.

```typescript
// Common variant A — axios with .then() chains:
import axios from "axios";

export async function fetchUserProfile(id: string): Promise<any> {
  return axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(`Failed to fetch profile: ${err.message}`);
    });
}

// Common variant B — axios with async/await but raw throw:
export async function fetchUserProfile(id: string): Promise<any> {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch profile");  // raw throw — forbidden
  }
}

// Common variant C (partial/hybrid) — axios with empty catch returning null:
export async function fetchUserProfile(id: string): Promise<any> {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    return response.data;
  } catch (err) {
    return null;  // silenced error — also forbidden
  }
}
```

Red flags — check for any of these regardless of which variant the AI produced:
- `import axios from "axios"` — forbidden; standards say use native `fetch`
- `Promise<any>` — forbidden; should define a proper return type
- `.then()` chains — forbidden; use `async/await`
- `throw new Error(...)` for an expected HTTP error — forbidden; use Result pattern
- Empty catch block returning `null` — error silenced with no logging or Result type
- No structured error context

### What to watch for WITH MCP

The AI will call `get_guidelines("nodejs", "patterns")` before writing code.
It reads: *"Use native fetch. No axios. Use Result pattern for expected errors."*

Expected output:

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

export async function fetchUserProfile(id: string): Promise<Result<UserProfile>> {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      return { ok: false, error: new Error(`HTTP ${response.status}`) };
    }
    const profile = await response.json() as UserProfile;
    return { ok: true, value: profile };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
```

What changed:
- No axios import — native `fetch` used
- `async/await` throughout — no `.then()` chains
- `Result<UserProfile>` return type — no `any`, no raw throws
- Caller must handle both the success and error case explicitly

### Talking points

> "Axios has been the community default for years, so it is deeply embedded in AI training data.
> The team has decided to use native fetch — a perfectly valid team decision. Without the MCP server,
> the AI cannot know that. It will add a dependency your team does not want, and you might not catch it
> until code review. The MCP server enforces that decision automatically on every code generation."

---

## Python

### Prompt

```
Add a function to user_service.py that fetches a user's extended profile from this
external API: https://jsonplaceholder.typicode.com/users/{id}

The function should call the API, handle errors, and return the user profile data.
```

### What to watch for WITHOUT MCP

```python
# The AI will almost certainly use requests (synchronous, forbidden):
import requests

def fetch_user_profile(user_id: str) -> dict:
    response = requests.get(f"https://jsonplaceholder.typicode.com/users/{user_id}")
    response.raise_for_status()
    return response.json()

# Or it might use aiohttp if it knows this is an async context:
from aiohttp import ClientSession

async def fetch_user_profile(user_id: str) -> dict:
    async with ClientSession() as session:
        async with session.get(f".../{user_id}") as response:
            return await response.json()
```

Red flags:
- `import requests` — forbidden; standards say use httpx
- `import aiohttp` — also forbidden; httpx is the team's standard
- `except Exception` or bare `except:` — too broad; catch specific types
- Generic `dict` return type — should be typed properly
- Using `print()` for error output

### What to watch for WITH MCP

The AI calls `get_guidelines("python", "patterns")`.
It reads: *"Use httpx for HTTP. Catch specific exception types. Never bare except."*

Expected output:

```python
import httpx
from dataclasses import dataclass


@dataclass(frozen=True)
class UserProfile:
    id: int
    name: str
    email: str
    phone: str
    website: str


async def fetch_user_profile(user_id: str) -> UserProfile:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://jsonplaceholder.typicode.com/users/{user_id}"
            )
            response.raise_for_status()
            data = response.json()
            return UserProfile(
                id=data["id"],
                name=data["name"],
                email=data["email"],
                phone=data["phone"],
                website=data["website"],
            )
        except httpx.HTTPStatusError as exc:
            raise UserNotFoundError(user_id) from exc
        except httpx.RequestError as exc:
            raise RuntimeError(f"Network error fetching profile {user_id}") from exc
```

What changed:
- `httpx.AsyncClient` — correct async HTTP client
- `async/await` — non-blocking I/O
- Specific exception types `HTTPStatusError`, `RequestError` — no bare except
- `@dataclass(frozen=True)` return type — typed, immutable domain object

### Talking points

> "This exercise shows two things at once: the AI chose the wrong library AND the wrong async pattern.
> Both are reasonable defaults based on training data. Both violate your team's standards.
> With the MCP server, the AI reads the actual standards document and follows it — no guessing."
