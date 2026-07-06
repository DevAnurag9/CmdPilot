from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ollama_model: str = "qwen3:4b"
    database_url: str = "backend/cmdpilot.db"
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="CMDPILOT_")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
