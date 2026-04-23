# Python project structure rules

## Project Layout

All projects follow the src layout. The package lives inside a `src/` directory to prevent accidental imports from the working directory.

 Approved structure:
```
my-project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── features/
│       │   ├── authentication/
│       │   │   ├── __init__.py
│       │   │   ├── service.py
│       │   │   ├── models.py
│       │   │   ├── exceptions.py
│       │   │   └── test_service.py
│       │   └── user_management/
│       │       ├── __init__.py
│       │       ├── service.py
│       │       ├── models.py
│       │       └── test_service.py
│       ├── shared/
│       │   ├── __init__.py
│       │   ├── database.py
│       │   ├── logging.py
│       │   └── types.py
│       └── main.py
├── tests/                    # Integration and e2e tests only
│   ├── conftest.py
│   └── test_integration.py
├── pyproject.toml
└── README.md
```

 Forbidden:
```
my-project/
├── my_project/              # missing src/ wrapper
│   ├── everything_here.py
├── helpers.py               # top-level junk drawer
├── utils.py                 # top-level junk drawer
```

## Test Co-location

Unit tests live next to the code they test. Same directory, `test_` prefix on the filename. Integration/e2e tests live in a top-level `tests/` directory.

 Approved:
```
features/authentication/service.py
features/authentication/test_service.py
```

 Forbidden:
```
src/my_project/features/authentication/service.py
tests/features/authentication/test_service.py    # unit tests must be co-located
```

## Module Exports (__init__.py)

Each feature package has an `__init__.py` that exports only the public API. Keep internal modules private.

 Approved:
```python
# features/authentication/__init__.py
from .service import AuthService
from .models import LoginCredentials, AuthToken
from .exceptions import AuthenticationError

__all__ = ["AuthService", "LoginCredentials", "AuthToken", "AuthenticationError"]
```

 Forbidden:
```python
# Don't use wildcard imports
from .service import *
from .models import *
from .internal_helpers import *  # leaking internal implementation
```

## Import Ordering

Imports follow this exact order, with a blank line between each group. Use `isort` with the profile `black`.

```python
# 1. Standard library
import asyncio
import os
from pathlib import Path

# 2. Third-party packages
import httpx
import structlog
from pydantic import BaseModel

# 3. Local application imports
from my_project.shared.database import Database
from my_project.shared.types import UserId

# 4. Relative imports from the same feature
from .models import User
from .exceptions import UserNotFoundError
```

 Forbidden:
```python
from .models import User
import os                            # stdlib after relative
import httpx                         # third-party after stdlib violation
from my_project.shared import db
```

## Shared vs Feature Code

Code goes in `shared/` ONLY if it is used by 3 or more features. Until then, keep it in the feature where it was created. Premature abstraction is worse than duplication.

## Dependency Management

Use `pyproject.toml` as the single source of truth for dependencies. Pin major versions. Use dependency groups for dev/test/lint.

 Approved:
```toml
[project]
dependencies = [
    "httpx>=0.27,<1",
    "structlog>=24.0,<25",
    "pydantic>=2.0,<3",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "mypy>=1.10", "ruff>=0.5"]
```

 Forbidden:
```
# Don't use requirements.txt as the primary dependency file
# Don't leave dependencies unpinned: httpx, pydantic
```
