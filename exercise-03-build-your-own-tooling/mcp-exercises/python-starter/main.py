from fastapi import FastAPI

from app.users.user_routes import router as user_router

app = FastAPI(title="Workshop Demo API")

app.include_router(user_router)
