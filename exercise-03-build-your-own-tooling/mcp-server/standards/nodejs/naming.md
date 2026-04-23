# Node.js naming conventions

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
