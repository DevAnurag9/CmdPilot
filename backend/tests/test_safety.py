from app.services.safety import evaluate_command


def test_blocks_recursive_force_delete() -> None:
    result = evaluate_command("rm -rf /")
    assert result.blocked is True
    assert result.safe is False


def test_allows_listing_command() -> None:
    result = evaluate_command("dir")
    assert result.blocked is False
    assert result.warnings == []
