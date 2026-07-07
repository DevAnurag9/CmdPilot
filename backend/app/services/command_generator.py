import json
import re

from groq import Groq

from app.models.schemas import CommandSuggestion, Platform
from app.services.explainer import explain_command
from app.utils.config import settings


client = Groq(api_key=settings.groq_api_key)


FALLBACKS: dict[Platform, dict[str, list[str]]] = {
    "windows": {
        "list": ["dir", "dir /a", "tree"],
        "search": [
            "where filename",
            "dir /s filename",
            "Get-ChildItem -Recurse",
        ],
        "current": ["cd"],
        "ip": ["ipconfig"],
        "large": [
            'forfiles /s /c "cmd /c if @fsize gtr 104857600 echo @path @fsize"'
        ],
    },
    "linux": {
        "list": ["ls", "ls -la", "find . -maxdepth 1 -type f"],
        "search": [
            "find . -name filename",
            "locate filename",
            "find / -name filename 2>/dev/null",
        ],
        "current": ["pwd"],
        "ip": ["ip addr", "hostname -I"],
        "large": [
            "find . -type f -size +100M",
            "du -ah . | sort -rh | head -20",
        ],
    },
    "macos": {
        "list": ["ls", "ls -la", "find . -maxdepth 1 -type f"],
        "search": [
            "find . -name filename",
            "mdfind filename",
            "find / -name filename 2>/dev/null",
        ],
        "current": ["pwd"],
        "ip": ["ifconfig", "ipconfig getifaddr en0"],
        "large": [
            "find . -type f -size +100M",
            "du -ah . | sort -rh | head -20",
        ],
    },
}


DESTRUCTIVE_INTENT_PATTERNS = (
    r"\b(delete|remove|erase|wipe|destroy)\b.*\b(all|everything|files?|folders?|directories|drive|disk|system)\b",
    r"\b(clear|clean)\b.*\b(drive|disk|system)\b",
    r"\bformat\b.*\b(drive|disk|system|[a-z]:)\b",
    r"\brm\s+-rf\b",
    r"\bdel\s+(/f|/s|/q|\*)",
)


def _has_destructive_intent(prompt: str) -> bool:
    lowered = prompt.lower()
    return any(
        re.search(pattern, lowered)
        for pattern in DESTRUCTIVE_INTENT_PATTERNS
    )


def _blocked_destructive_request() -> list[CommandSuggestion]:
    return [
        CommandSuggestion(
            command="No safe command generated",
            explanation=(
                "CmdPilot blocked this request because it asks for broad "
                "file deletion or another destructive operation."
            ),
            safe=False,
            blocked=True,
            warnings=[
                "Destructive requests that delete broad sets of files are blocked."
            ],
        )
    ]


def _intent(prompt: str) -> str:
    lowered = prompt.lower()

    if any(
        x in lowered
        for x in ["search", "find", "locate", "where is"]
    ):
        return "search"

    if any(
        x in lowered
        for x in ["ip", "network", "address"]
    ):
        return "ip"

    if any(
        x in lowered
        for x in ["current directory", "where am i", "pwd"]
    ):
        return "current"

    if any(
        x in lowered
        for x in ["large", "big file", "disk"]
    ):
        return "large"

    return "list"


def _fallback_commands(
    prompt: str,
    platform: Platform,
    limit: int,
) -> list[CommandSuggestion]:
    commands = FALLBACKS[platform][_intent(prompt)][:limit]

    return [
        CommandSuggestion(
            command=command,
            explanation=explain_command(command),
        )
        for command in commands
    ]


def _clean_json(content: str) -> dict:
    content = content.strip()

    if content.startswith("```"):
        content = content.split("\n", 1)[1]
        content = content.rsplit("```", 1)[0]

    return json.loads(content)


def _wrong_platform(
    command: str,
    platform: Platform,
) -> bool:
    cmd = command.strip().lower()

    if platform == "windows":
        linux_prefixes = (
            "ls",
            "pwd",
            "find ",
            "ip addr",
            "hostname",
            "du ",
            "grep",
            "cat ",
        )
        return cmd.startswith(linux_prefixes)

    if platform in ("linux", "macos"):
        windows_prefixes = (
            "dir",
            "tree",
            "ipconfig",
            "forfiles",
            "cls",
            "type ",
        )
        return cmd.startswith(windows_prefixes)

    return False


def generate_commands(
    prompt: str,
    platform: Platform,
    limit: int = 3,
) -> list[CommandSuggestion]:
    if _has_destructive_intent(prompt):
        return _blocked_destructive_request()

    system_prompt = f"""
You are CmdPilot, an AI terminal assistant.

Target platform: {platform}

Rules:
1. Return ONLY commands for the selected platform.
2. Never generate destructive commands.
3. Return ONLY valid JSON.

Example:

{{
  "suggestions": [
    {{
      "command": "dir",
      "explanation": "Lists files."
    }}
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
        )

        content = response.choices[0].message.content
        payload = _clean_json(content)

        suggestions = payload.get(
            "suggestions",
            []
        )[:limit]

        parsed = [
            CommandSuggestion(
                command=item["command"].strip(),
                explanation=item.get("explanation")
                or explain_command(item["command"]),
            )
            for item in suggestions
            if item.get("command")
        ]

        if any(
            _wrong_platform(
                suggestion.command,
                platform,
            )
            for suggestion in parsed
        ):
            return _fallback_commands(
                prompt,
                platform,
                limit,
            )

        if parsed:
            return parsed

        return _fallback_commands(
            prompt,
            platform,
            limit,
        )

    except Exception as e:
        print("Groq Error:", e)

        return _fallback_commands(
            prompt,
            platform,
            limit,
        )