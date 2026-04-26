# Exercise 3: project structure

Time: ~10 minutes
Goal: Show that without standards, the AI creates files wherever seems convenient.
With the MCP server, it reads your team's exact folder structure rules and places files correctly.

---

## How to run this exercise

1. Make sure your editor has `mcp-exercises/` open as (or within) your workspace so the AI can
   index the full file tree and understand the existing project structure.
   - Cursor: File → Open Folder → select `mcp-exercises/`
   - VS Code: ensure Copilot Chat is in Agent mode so `@workspace` context is available automatically
2. Disable MCP — see [SETUP.md](../SETUP.md) for your assistant
3. Paste the prompt below into your AI assistant chat
4. Note WHERE the AI creates the new files and what it names them
5. Enable MCP and paste the same prompt again — see [SETUP.md](../SETUP.md) for how to toggle
6. Compare the folder structures

---

## Node.js

### Prompt

```
Create a new "orders" feature in this Node.js/TypeScript project.
The feature needs a service that can create an order and get an order by ID,
and a routes file that exposes GET /orders/:id and POST /orders endpoints.
```

### What to watch for WITHOUT MCP

The AI tends to dump new files in whatever location seems most convenient:

```
nodejs-starter/src/
├── app.ts
├── features/
│   └── users/
│       ├── user-service.ts
│       └── user-routes.ts
│
│  ← The AI might create these anywhere:
├── orders.ts                      (flat — wrong)
├── ordersService.ts               (wrong naming convention too)
├── controllers/
│   └── orders-controller.ts       (wrong — no controllers/ folder in our structure)
├── services/
│   └── orders-service.ts          (wrong — services go inside features, not a top-level services/)
└── routes/
    └── orders-routes.ts           (wrong — routes go inside the feature)
```

Also watch for:
- PascalCase file names (`OrdersService.ts`)
- Creating a `tests/` folder instead of co-locating tests
- Not creating an `index.ts` barrel file

### What to watch for WITH MCP

The AI calls `get_guidelines("nodejs", "structure")`.
It reads: *"New features go in src/features/{feature-name}/. Each feature is self-contained."*

Expected output:

```
nodejs-starter/src/
├── app.ts
└── features/
    ├── users/
    │   ├── user-service.ts
    │   └── user-routes.ts
    └── orders/                         ← new feature in the right place
        ├── orders-service.ts           ← kebab-case file name
        ├── orders-routes.ts
        ├── types.ts                    ← feature-local types
        └── index.ts                    ← barrel file: exports public API only
```

File name: `orders-service.ts` (kebab-case — matches the naming standard)

The AI may also add `orders-service.test.ts` in the same folder — test co-location is in the structure standard.

### Key insight

Without standards, developers make different decisions on different days.
After six months you end up with some features in `services/`, some in `features/`,
some files PascalCase and some kebab-case. That inconsistency is expensive to fix.
The MCP server makes the right structure the path of least resistance.

---

## Python

### Prompt

```
Create a new "orders" feature in this FastAPI project.
The feature needs a service that can create an order and get an order by ID,
and a routes file that exposes GET /orders/{order_id} and POST /orders endpoints.
```

### What to watch for WITHOUT MCP

```
python-starter/
├── main.py
├── app/
│   └── users/
│       ├── user_service.py
│       └── user_routes.py
│
│   ← The AI might create these anywhere:
├── orders.py                          (flat — wrong)
├── orders_service.py                  (in app/ root — wrong)
├── models/
│   └── order.py                       (separate models/ folder — wrong)
└── controllers/
    └── orders_controller.py           (wrong concept for FastAPI)
```

Also watch for:
- Missing `__init__.py`
- No `exceptions.py` or `models.py` files (the standard says features have their own)
- Wildcard imports in `__init__.py`

### What to watch for WITH MCP

The AI calls `get_guidelines("python", "structure")`.
It reads: *"New features go in a dedicated directory under the app package. Each feature is self-contained with its own `__init__.py`, `service.py`, `models.py`, and `exceptions.py`."*

Expected output:

```
python-starter/app/
├── users/
│   ├── __init__.py
│   ├── user_service.py
│   └── user_routes.py
└── orders/                            ← new feature in the right place
    ├── __init__.py                    ← exports public API only (no wildcard imports)
    ├── service.py                     ← snake_case file names
    ├── models.py                      ← Pydantic models + dataclasses
    ├── exceptions.py                  ← custom exception classes
    └── routes.py
```

The `__init__.py` will use explicit exports, not `from .service import *`.

### Key insight

In Python, where you put files affects whether they can be imported correctly.
The `__init__.py` files and feature-scoped layout (which the standards enforce) keep each feature
self-contained and importable. Without the MCP server, the AI does not know your team's folder
conventions and will create an inconsistent structure.
