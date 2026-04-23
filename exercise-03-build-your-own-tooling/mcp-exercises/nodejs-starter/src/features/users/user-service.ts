// Starter file for Workshop Exercises 1 and 2
//
// Exercise 1 (Naming):
//   Open this file and ask the AI to add functions for fetching users.
//   Watch how the AI names them — with and without the MCP server.
//
// Exercise 2 (Patterns):
//   Ask the AI to add an HTTP call to an external users API.
//   Watch which HTTP client it chooses and how it handles errors.

export interface User {
  id: string;
  name: string;
  email: string;
}

export const MOCK_DB: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "2", name: "Bob Smith", email: "bob@example.com" },
  { id: "3", name: "Carol White", email: "carol@example.com" },
];

// Exercise 1 — ask the AI to add these functions:
//   - Fetch a single user by ID
//   - Return all users

// Exercise 2 — ask the AI to add this function:
//   - Fetch a user's extended profile from https://jsonplaceholder.typicode.com/users/{id}
