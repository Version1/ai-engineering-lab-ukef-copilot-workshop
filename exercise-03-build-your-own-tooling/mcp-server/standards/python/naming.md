# Python naming conventions

## Functions and Methods

All functions and methods use snake_case and start with a verb.

 Approved patterns:
```python
def get_user_by_id(user_id: str) -> User: ...
def validate_email(email: str) -> bool: ...
def handle_submit(event: FormEvent) -> None: ...
def parse_response(data: dict[str, Any]) -> ParsedResult: ...
```

 Forbidden patterns:
```python
def user(user_id: str): ...            # no verb
def GetUser(user_id: str): ...         # no PascalCase (that's for classes)
def getUserById(user_id: str): ...     # no camelCase
def data(response: dict): ...          # vague, no verb
```

Common verb prefixes: `get`, `set`, `create`, `update`, `delete`, `fetch`, `validate`, `parse`, `handle`, `is`, `has`, `should`, `can`.

## Classes

Classes use PascalCase and are nouns or noun phrases.

 Approved patterns:
```python
class UserService: ...
class PaymentGateway: ...
class ApiResponse: ...
class UserProfile: ...
```

 Forbidden patterns:
```python
class user_service: ...         # must be PascalCase
class Manage_Users: ...         # no underscores in class names
class manage_users: ...         # classes are PascalCase nouns
```

## Files and Directories

Files use snake_case. One primary class or logical grouping per file. Name files after their primary export.

 Approved patterns:
```
user_service.py         → contains class UserService
payment_gateway.py      → contains class PaymentGateway
validate_email.py       → contains function validate_email
test_user_service.py    → tests for UserService
```

 Forbidden patterns:
```
UserService.py          # no PascalCase filenames
user-service.py         # no kebab-case in Python
helpers.py              # too vague — name after what it helps with
utils.py                # too vague — split into specific files
```

## Variables and Constants

Local variables use snake_case. Module-level constants use UPPER_SNAKE_CASE.

 Approved patterns:
```python
user_name = "alice"
is_active = True
MAX_RETRY_COUNT = 3
API_BASE_URL = "https://api.example.com"
DEFAULT_PAGE_SIZE = 20
```

 Forbidden patterns:
```python
userName = "alice"           # no camelCase
IsActive = True              # no PascalCase for variables
max_retry_count = 3          # module constant must be UPPER_SNAKE_CASE
```

## Type Hints and Protocols

Use PascalCase for type aliases and Protocols. Always include type hints on function signatures.

 Approved patterns:
```python
from typing import Protocol, TypeAlias

UserId: TypeAlias = str
ConnectionPool: TypeAlias = dict[str, Any]

class Authenticatable(Protocol):
    def authenticate(self, credentials: dict[str, str]) -> bool: ...
```

 Forbidden patterns:
```python
def get_user(id, name):          # missing type hints
user_id_type = str               # type aliases must be PascalCase
class authenticatable: ...       # Protocols are PascalCase
```

## Enums

Enums use PascalCase class names with UPPER_SNAKE_CASE members.

 Approved patterns:
```python
from enum import Enum, StrEnum

class UserRole(StrEnum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"
```

 Forbidden patterns:
```python
class user_role(Enum):       # class name must be PascalCase
    admin = "admin"          # members must be UPPER_SNAKE_CASE
```
