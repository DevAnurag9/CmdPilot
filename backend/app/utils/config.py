from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Groq
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"

    # Database
    database_url: str = "./cmdpilot.db"

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cmd-pilot.vercel.app",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="CMDPILOT_",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
