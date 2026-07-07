from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.database.connection import init_db
from app.utils.config import settings


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="CmdPilot API",
    description="AI-powered terminal command assistant with safety checks.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "CmdPilot API is running",
        "docs": "/docs",
        "health": "/health",
    }
