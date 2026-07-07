from app.services.safety import evaluate_command
from app.services.command_generator import generate_commands


def test_blocks_recursive_force_delete() -> None:
    result = evaluate_command("rm -rf /")
    assert result.blocked is True
    assert result.safe is False


def test_allows_listing_command() -> None:
    result = evaluate_command("dir")
    assert result.blocked is False
    assert result.warnings == []


def test_blocks_destructive_prompt_before_fallbacks() -> None:
    suggestions = generate_commands("delete all files", "windows")

    assert len(suggestions) == 1
    assert suggestions[0].command == "No safe command generated"
    assert suggestions[0].blocked is True
    assert suggestions[0].safe is False
