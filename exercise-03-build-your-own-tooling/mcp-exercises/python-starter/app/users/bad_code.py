# ============================================================
# EXERCISE 4 — REFACTOR TARGET
#
# This file intentionally violates every Python coding standard.
# Ask the AI to refactor it — first WITHOUT the MCP server,
# then WITH it. Compare how thoroughly each version fixes the issues.
#
# Violations in this file:
#   - camelCase function names (should be snake_case with verb prefix)
#   - Uses `requests` (forbidden — use httpx with async)
#   - Synchronous I/O (forbidden — use async/await)
#   - Missing type hints on all functions
#   - Bare `except:` (forbidden — catch specific exception types)
#   - Silenced errors with `pass` (forbidden — never swallow errors)
#   - Magic numbers (5, 1800) — should be named UPPER_SNAKE_CASE constants
#   - print() statements (forbidden — use structlog)
#   - f-string in log call (forbidden — use keyword args)
#   - Hard-coded singleton imports instead of dependency injection
# ============================================================

import requests

from app.database import db  # type: ignore  (not a real module — for demo only)


# ❌ camelCase — should be snake_case
# ❌ No type hints
def GetUser(id):
    # ❌ requests (sync, forbidden) — should use httpx async
    # ❌ bare except — should catch specific exception types
    try:
        response = requests.get(f"/api/users/{id}")
        return response.json()
    except:   # ❌ bare except
        pass  # ❌ silenced error — should raise or log and re-raise


# ❌ camelCase, no verb prefix — should be list_users or get_all_users
# ❌ No type hints
def UsersList():
    # ❌ print — should use structlog
    print("fetching users from remote")
    # ❌ requests (sync, forbidden)
    return requests.get("https://jsonplaceholder.typicode.com/users").json()


# ❌ camelCase — should be login_user
# ❌ No type hints on parameters or return
def LoginUser(email, password):
    users = db.get_all_users()
    user = next((u for u in users if u["email"] == email), None)

    # ❌ raises generic Exception — should raise custom UserNotFoundError
    if not user:
        raise Exception("User not found")

    # ❌ magic number 5 — should be MAX_LOGIN_ATTEMPTS = 5
    if user["loginAttempts"] >= 5:
        raise Exception("Account locked")

    # ❌ print — should use structlog
    # ❌ f-string in log — should use keyword arguments: logger.info("user_logged_in", user_id=user["id"])
    print(f"User logged in: {user['id']}")

    # ❌ magic number 1800 — should be SESSION_TIMEOUT_SECONDS = 30 * 60
    return {"token": "mock-token-abc123", "expires_in": 1800}
