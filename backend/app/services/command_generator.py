import json
from ollama import ResponseError, chat

from app.models.schemas import CommandSuggestion, Platform
from app.services.explainer import explain_command
from app.utils.config import settings


FALLBACKS: dict[Platform, dict[str, list[str]]] = {
    "windows": {
        "list": ["dir", "dir /a", "tree"],
        "current": ["cd"],
        "ip": ["ipconfig"],
        "large": [
            'forfiles /s /c "cmd /c if @fsize gtr 104857600 echo @path @fsize"'
        ],
    },
    "linux": {
        "list": ["ls", "ls -la", "find . -maxdepth 1 -type f"],
        "current": ["pwd"],
        "ip": ["ip addr", "hostname -I"],
        "large": [
            "find . -type f -size +100M",
            "du -ah . | sort -rh | head -20",
        ],
    },
    "macos": {
        "list": ["ls", "ls -la", "find . -maxdepth 1 -type f"],
        "current": ["pwd"],
        "ip": ["ifconfig", "ipconfig getifaddr en0"],
        "large": [
            "find . -type f -size +100M",
            "du -ah . | sort -rh | head -20",
        ],
    },
}


def _intent(prompt: str) -> str:
    lowered = prompt.lower()

    if any(word in lowered for word in ["ip", "network", "address"]):
        return "ip"

    if any(
        word in lowered
        for word in ["current directory", "where am i", "pwd"]
    ):
        return "current"

    if any(word in lowered for word in ["large", "big file", "disk"]):
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
    if "</think>" in content:
        content = content.split("</think>", 1)[1]

    content = content.strip().strip("`")
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
    system_prompt = f"""
You are CmdPilot, an AI terminal assistant.

Target platform: {platform}

Rules:
1. Return ONLY commands for the selected platform.
2. If platform is windows, return ONLY Windows CMD or PowerShell commands.
3. If platform is linux, return ONLY Linux commands.
4. If platform is macos, return ONLY macOS commands.
5. Never generate destructive commands.
6. Never generate:
   rm -rf
   del /f
   format
   shutdown
   reboot
7. Commands require user confirmation before execution.

Return JSON only:

{{
  "suggestions": [
    {{
      "command": "...",
      "explanation": "..."
    }}
  ]
}}
"""

    try:
        response = chat(
            model=settings.ollama_model,
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
            think=False,
            format="json",
            options={
                "temperature": 0.1,
                "num_predict": 220,
            },
        )

        payload = _clean_json(
            response["message"]["content"]
        )

        suggestions = payload.get(
            "suggestions",
            [],
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

        # AI returned commands for wrong OS
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

        return parsed or _fallback_commands(
            prompt,
            platform,
            limit,
        )

    except (
        ResponseError,
        ConnectionError,
        json.JSONDecodeError,
        KeyError,
        TypeError,
    ):
        return _fallback_commands(
            prompt,
            platform,
            limit,
        )