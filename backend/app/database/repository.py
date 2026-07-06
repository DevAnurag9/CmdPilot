from app.database.connection import get_connection
from app.models.schemas import HistoryItem


def save_history(prompt: str, command: str, platform: str, success: bool) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO command_history (prompt, command, platform, success)
            VALUES (?, ?, ?, ?)
            """,
            (prompt, command, platform, int(success)),
        )


def list_history() -> list[HistoryItem]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, prompt, command, platform, success, created_at
            FROM command_history
            ORDER BY id DESC
            LIMIT 100
            """
        ).fetchall()

    return [
        HistoryItem(
            id=row["id"],
            prompt=row["prompt"],
            command=row["command"],
            platform=row["platform"],
            success=bool(row["success"]),
            created_at=row["created_at"],
        )
        for row in rows
    ]


def clear_history() -> None:
    with get_connection() as connection:
        connection.execute("DELETE FROM command_history")
