from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


Platform = Literal["windows", "linux", "macos"]


class CommandGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=2, examples=["show all files"])
    platform: Platform = "windows"
    max_suggestions: int = Field(default=3, ge=1, le=5)


class CommandSuggestion(BaseModel):
    command: str
    explanation: str
    safe: bool = True
    blocked: bool = False
    warnings: list[str] = []


class CommandGenerationResponse(BaseModel):
    prompt: str
    platform: Platform
    suggestions: list[CommandSuggestion]


class CommandExplanationRequest(BaseModel):
    command: str = Field(..., min_length=1)


class CommandExplanationResponse(BaseModel):
    command: str
    explanation: str
    safe: bool
    blocked: bool
    warnings: list[str]


class HistoryItem(BaseModel):
    id: int
    prompt: str
    command: str
    platform: str
    success: bool
    created_at: datetime
