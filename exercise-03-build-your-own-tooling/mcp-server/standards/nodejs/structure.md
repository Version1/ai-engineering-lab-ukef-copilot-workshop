# Node.js project structure rules

## Feature Organisation

New features go in a dedicated directory under `src/features/`. Each feature is self-contained with its own components, hooks, types, and tests.

✅ Approved structure:
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

❌ Forbidden:
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

✅ Approved:
```
user-service.ts
user-service.test.ts
```

❌ Forbidden:
```
src/services/user-service.ts
tests/services/user-service.test.ts    # separate test directory
```

## Barrel Files (index.ts)

Each feature has one `index.ts` that exports only the public API. Internal modules are not exported.

✅ Approved:
```typescript
// features/authentication/index.ts
export { LoginForm } from "./components/login-form";
export { useAuth } from "./hooks/use-auth";
export type { AuthState, LoginCredentials } from "./types";
// internal services are NOT exported
```

❌ Forbidden:
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

❌ Forbidden:
```typescript
import { UserCard } from "./components/user-card";
import React from "react";                        // external after relative
import path from "path";                           // built-in after external
import { Button } from "@/shared/components";
```

## Shared vs Feature Code

Code goes in `shared/` ONLY if it is used by 3 or more features. Until then, keep it in the feature where it was created. Premature abstraction is worse than duplication.

Rule of thumb: if you are about to move something to `shared/`, ask: "Would I use this unchanged in a completely different project?" If yes, it belongs in shared. If no, keep it in the feature.
