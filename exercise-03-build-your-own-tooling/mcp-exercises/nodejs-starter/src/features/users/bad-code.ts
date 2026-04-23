// ============================================================
// EXERCISE 4 — REFACTOR TARGET
//
// This file intentionally violates every Node.js coding standard.
// Ask the AI to refactor it — first WITHOUT the MCP server,
// then WITH it. Compare how thoroughly each version fixes the issues.
//
// Violations in this file:
//   - PascalCase function names (should be camelCase with verb prefix)
//   - Uses axios (forbidden — use native fetch)
//   - Uses .then() chains (forbidden — use async/await)
//   - Uses `any` type everywhere (forbidden — use proper types)
//   - Raw throw for control flow (forbidden — use Result pattern)
//   - Magic numbers (5, 1800000) — should be named constants
//   - console.log in production code (forbidden — use structured logger)
//   - Hard-coded singleton imports instead of dependency injection
// ============================================================

import axios from "axios";

const db = {
  users: [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", loginAttempts: 0 },
    { id: "2", name: "Bob Smith", email: "bob@example.com", loginAttempts: 6 },
  ],
  findById: (id: string) => db.users.find((u) => u.id === id),
};

// ❌ PascalCase function — should be camelCase with a verb prefix
export async function GetUser(id: any): Promise<any> {
  // ❌ .then() chain — should be async/await
  // ❌ `any` type — should define a User interface
  return Promise.resolve(db.users).then((users: any) => {
    return users.find((u: any) => u.id === id);
  });
}

// ❌ No verb in name — should be getAllUsers or listUsers
// ❌ axios — should use native fetch
export async function UsersList(): Promise<any> {
  // ❌ console.log — should use structured logger
  console.log("fetching users from remote");
  // ❌ axios — forbidden
  // ❌ .then() chain
  return axios.get("https://jsonplaceholder.typicode.com/users").then((res: any) => res.data);
}

// ❌ PascalCase — should be loginUser
// ❌ `any` return type — should define a result shape
export async function LoginUser(email: string, password: string): Promise<any> {
  const user = db.users.find((u) => u.email === email);

  // ❌ raw throw for expected business logic — should return Result type
  if (!user) {
    throw new Error("User not found");
  }

  // ❌ magic number 5 — should be const MAX_LOGIN_ATTEMPTS = 5
  if (user.loginAttempts >= 5) {
    throw new Error("Account locked");
  }

  // ❌ console.log — should use structured logger
  // ❌ string concatenation in log — should use structured context object
  console.log("User logged in: " + user.id);

  // ❌ magic number 1800000 — should be const SESSION_TIMEOUT_MS = 30 * 60 * 1000
  return { token: "mock-token-abc123", expiresIn: 1800000 };
}
