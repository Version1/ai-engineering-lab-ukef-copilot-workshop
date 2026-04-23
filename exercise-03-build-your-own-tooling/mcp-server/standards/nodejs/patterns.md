# Node.js approved and forbidden patterns

## Error Handling

Use the Result pattern for expected errors. Reserve `throw` for truly exceptional situations (programmer errors, invariant violations). Never let errors pass silently.

✅ Approved: Result type pattern
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

❌ Forbidden: raw throws for control flow
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

✅ Approved:
```typescript
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

❌ Forbidden:
```typescript
import axios from "axios";     // do not use axios
import got from "got";          // do not use got
import request from "request";  // do not use request
```

## Async Patterns

Always use `async/await`. Never use `.then()/.catch()` chains.

✅ Approved:
```typescript
async function loadData(): Promise<Data> {
  const response = await fetch("/api/data");
  const json = await response.json();
  return parseData(json);
}
```

❌ Forbidden:
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

✅ Approved:
```typescript
function parseInput(data: unknown): User {
  if (typeof data !== "object" || data === null) {
    throw new Error("Expected object");
  }
  // validate and narrow the type
  return data as User; // only after validation
}
```

❌ Forbidden:
```typescript
function parseInput(data: any): User {    // never use any
  return data;                             // no validation
}
```

## Magic Numbers

Extract all magic numbers into named constants. No unexplained literals in logic.

✅ Approved:
```typescript
const MAX_LOGIN_ATTEMPTS = 5;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 20;

if (attempts >= MAX_LOGIN_ATTEMPTS) {
  lockAccount(userId);
}
```

❌ Forbidden:
```typescript
if (attempts >= 5) {          // what is 5?
  lockAccount(userId);
}

setTimeout(callback, 1800000); // what is 1800000?
```

## Dependency Injection

Prefer dependency injection over hard-coded imports for services. This makes testing easier.

✅ Approved:
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

❌ Forbidden:
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

✅ Approved:
```typescript
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Payment failed", { orderId, error: err.message, attempt });
```

❌ Forbidden:
```typescript
console.log("User created: " + user.id);    // no console.log
console.log(user);                            // no dumping objects
logger.info(`User ${user.id} created`);      // use structured context, not interpolation
```
