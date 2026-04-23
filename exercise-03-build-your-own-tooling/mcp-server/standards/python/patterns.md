# Python approved and forbidden patterns

## Error Handling

Use explicit exception handling with custom exception classes for business logic errors. Use specific exception types, never bare `except`. Return structured results for expected failures where appropriate.

 Approved: Custom exceptions + specific handling
```python
class UserNotFoundError(Exception):
    def __init__(self, user_id: str):
        self.user_id = user_id
        super().__init__(f"User not found: {user_id}")

class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"Validation error on {field}: {message}")

async def fetch_user(user_id: str) -> User:
    try:
        response = await client.get(f"/api/users/{user_id}")
        response.raise_for_status()
        return User(**response.json())
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            raise UserNotFoundError(user_id) from exc
        raise
    except httpx.RequestError as exc:
        logger.error("Request failed", user_id=user_id, error=str(exc))
        raise
```

 Forbidden: Bare except, silenced errors
```python
try:
    user = await fetch_user(user_id)
except:                              # never use bare except
    pass                             # never silently swallow errors

try:
    user = await fetch_user(user_id)
except Exception as e:               # too broad — catch specific types
    print(e)                         # don't use print for error handling
```

## HTTP Client

Use httpx for HTTP requests. Do not use `requests` (it is synchronous only) or `urllib`.

 Approved:
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        url,
        json=data,
        headers={"Content-Type": "application/json"},
    )
```

 Forbidden:
```python
import requests                  # do not use requests
import urllib.request            # do not use urllib
from aiohttp import ClientSession  # do not use aiohttp
```

## Async Patterns

Use `async/await` with `asyncio` for I/O-bound operations. Use synchronous code only when there is no I/O.

 Approved:
```python
import asyncio

async def load_data() -> Data:
    async with httpx.AsyncClient() as client:
        response = await client.get("/api/data")
        return parse_data(response.json())

async def process_batch(items: list[str]) -> list[Result]:
    tasks = [process_item(item) for item in items]
    return await asyncio.gather(*tasks)
```

 Forbidden:
```python
def load_data() -> Data:                   # synchronous I/O
    response = requests.get("/api/data")   # blocking call
    return parse_data(response.json())
```

## Type Safety

Always use type hints. Use `mypy` strict mode. Never use `Any` without justification — prefer `object` or specific types.

 Approved:
```python
from typing import Any

def parse_input(data: object) -> User:
    if not isinstance(data, dict):
        raise TypeError("Expected dict")
    return User(**data)

# Any is acceptable ONLY when interacting with untyped third-party code
def wrap_legacy_call(legacy_func: Any) -> str:
    """Wrapper for untyped legacy API — Any is documented and justified."""
    result = legacy_func()
    return str(result)
```

 Forbidden:
```python
def parse_input(data):           # missing type hints
    return data                  # no validation

def process(items: Any) -> Any:  # Any without justification
    return items
```

## Magic Numbers

Extract all magic numbers into named constants. No unexplained literals in logic.

 Approved:
```python
MAX_LOGIN_ATTEMPTS = 5
SESSION_TIMEOUT_SECONDS = 30 * 60
DEFAULT_PAGE_SIZE = 20

if attempts >= MAX_LOGIN_ATTEMPTS:
    lock_account(user_id)
```

 Forbidden:
```python
if attempts >= 5:                  # what is 5?
    lock_account(user_id)

await asyncio.sleep(1800)          # what is 1800?
```

## Dependency Injection

Use constructor injection or function parameters for dependencies. Do not import singletons directly.

 Approved:
```python
class UserService:
    def __init__(self, db: Database, logger: Logger) -> None:
        self._db = db
        self._logger = logger

    async def get_user(self, user_id: str) -> User:
        self._logger.info("Fetching user", user_id=user_id)
        return await self._db.find_by_id("users", user_id)
```

 Forbidden:
```python
from app.database import db        # hard-coded singleton import
from app.logger import logger

class UserService:
    async def get_user(self, user_id: str):
        logger.info(f"Fetching user {user_id}")
        return await db.find_by_id("users", user_id)
```

## Logging

Use structlog for structured logging. Never use `print` statements or f-string interpolation in log messages.

 Approved:
```python
import structlog

logger = structlog.get_logger()

logger.info("user_created", user_id=user.id, email=user.email)
logger.error("payment_failed", order_id=order_id, error=str(exc), attempt=attempt)
```

 Forbidden:
```python
print(f"User created: {user.id}")               # no print statements
logger.info(f"User {user.id} created")           # no f-string in log messages
logging.info("User created: " + user.id)         # no string concatenation
```

## Data Classes and Models

Use Pydantic `BaseModel` for external data (API inputs/outputs, config). Use `@dataclass` for internal domain objects.

 Approved:
```python
from pydantic import BaseModel, Field
from dataclasses import dataclass

# External data — Pydantic for validation
class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r"^[\w.+-]+@[\w-]+\.[\w.]+$")

# Internal domain — dataclass for simplicity
@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str
```

 Forbidden:
```python
# Don't use plain dicts for structured data
user = {"name": "alice", "email": "alice@example.com"}

# Don't use NamedTuple for mutable domain objects
from typing import NamedTuple
class User(NamedTuple):     # use dataclass instead
    id: str
    name: str
```
