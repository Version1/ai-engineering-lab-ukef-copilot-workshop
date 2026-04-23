# Node.js quick reference: top 10 rules

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
