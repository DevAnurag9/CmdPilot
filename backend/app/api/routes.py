from fastapi import APIRouter

from app.database.repository import clear_history, list_history, save_history
from app.models.schemas import (
    CommandGenerationRequest,
    CommandGenerationResponse,
    CommandExplanationRequest,
    CommandExplanationResponse,
    HistoryItem,
)
from app.services.command_generator import generate_commands
from app.services.explainer import explain_command
from app.services.safety import evaluate_command


router = APIRouter()


@router.post("/generate-command", response_model=CommandGenerationResponse)
def generate_command(payload: CommandGenerationRequest) -> CommandGenerationResponse:
    suggestions = generate_commands(payload.prompt, payload.platform, payload.max_suggestions)

    safe_suggestions = []
    for suggestion in suggestions:
        safety = evaluate_command(suggestion.command)
        safe_suggestions.append(
            suggestion.model_copy(
                update={
                    "safe": safety.safe,
                    "warnings": safety.warnings,
                    "blocked": safety.blocked,
                }
            )
        )

    primary = safe_suggestions[0]
    save_history(
        prompt=payload.prompt,
        command=primary.command,
        platform=payload.platform,
        success=not primary.blocked,
    )

    return CommandGenerationResponse(
        prompt=payload.prompt,
        platform=payload.platform,
        suggestions=safe_suggestions,
    )


@router.post("/explain-command", response_model=CommandExplanationResponse)
def explain(payload: CommandExplanationRequest) -> CommandExplanationResponse:
    safety = evaluate_command(payload.command)
    return CommandExplanationResponse(
        command=payload.command,
        explanation=explain_command(payload.command),
        safe=safety.safe,
        blocked=safety.blocked,
        warnings=safety.warnings,
    )


@router.get("/history", response_model=list[HistoryItem])
def history() -> list[HistoryItem]:
    return list_history()


@router.delete("/history")
def delete_history() -> dict[str, str]:
    clear_history()
    return {"status": "cleared"}
