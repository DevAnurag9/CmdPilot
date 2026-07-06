import re
from dataclasses import dataclass


@dataclass
class SafetyResult:
    safe: bool
    blocked: bool
    warnings: list[str]


# Commands that should NEVER be executed
DANGEROUS_PATTERNS = {
    r"\brm\s+-rf\b": "Recursive force deletion is blocked.",
    r"\bdel\b": "Windows file deletion is blocked.",
    r"\berase\b": "Windows file deletion is blocked.",
    r"\brmdir\s+/s\b": "Recursive directory deletion is blocked.",
    r"\brd\s+/s\b": "Recursive directory deletion is blocked.",
    r"\bformat\b": "Disk formatting is blocked.",
    r"\bshutdown\b": "System shutdown is blocked.",
    r"\breboot\b": "System reboot is blocked.",
    r"\brestart-computer\b": "System restart is blocked.",
    r"\bmkfs\b": "Disk formatting commands are blocked.",
    r":\s*&\s*:\s*&": "Fork-bomb style commands are blocked.",
    r"\bchmod\s+777\b": "Dangerous permission change detected.",
    r"\bcurl.+\|\s*(bash|sh)\b": "Piping remote scripts into a shell is blocked.",
    r"\bwget.+\|\s*(bash|sh)\b": "Piping remote scripts into a shell is blocked.",
}


# Commands that should show a warning but are allowed
WARNING_PATTERNS = {
    r"\bsudo\b": "This command may request elevated privileges.",
    r"\bkill\b": "This command can terminate running processes.",
    r"\btaskkill\b": "This command can terminate running processes.",
    r"\bnet\s+user\b": "This command can modify user accounts.",
    r"\bsc\s+delete\b": "This command can remove Windows services.",
}


def evaluate_command(command: str) -> SafetyResult:
    """
    Evaluates whether a command is safe to execute.
    Returns:
        SafetyResult(
            safe=True/False,
            blocked=True/False,
            warnings=[...]
        )
    """

    normalized = command.strip().lower()

    blocked_warnings = [
        message
        for pattern, message in DANGEROUS_PATTERNS.items()
        if re.search(pattern, normalized)
    ]

    warnings = blocked_warnings + [
        message
        for pattern, message in WARNING_PATTERNS.items()
        if re.search(pattern, normalized)
    ]

    blocked = len(blocked_warnings) > 0

    return SafetyResult(
        safe=not blocked,
        blocked=blocked,
        warnings=warnings,
    )