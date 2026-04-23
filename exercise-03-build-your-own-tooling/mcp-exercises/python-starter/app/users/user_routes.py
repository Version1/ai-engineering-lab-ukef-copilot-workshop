# Starter routes file — used as context during Exercise 3 (Structure)
#
# Exercise 3:
#   Ask the AI to create a new "orders" feature.
#   Watch where it puts the files — with and without the MCP server.

from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{user_id}")
async def get_user(user_id: str) -> dict[str, str]:
    return {"id": user_id, "name": "Alice Johnson", "email": "alice@example.com"}


@router.get("/")
async def list_users() -> list[dict[str, str]]:
    return [
        {"id": "1", "name": "Alice Johnson"},
        {"id": "2", "name": "Bob Smith"},
    ]
