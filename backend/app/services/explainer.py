EXPLANATIONS = {
    "dir": "Lists files and folders in the current directory on Windows.",
    "dir /a": "Lists all files and folders, including hidden items, on Windows.",
    "cd": "Prints the current directory in Command Prompt.",
    "ipconfig": "Shows network adapter and IP configuration on Windows.",
    "ls": "Lists files and folders in the current directory.",
    "ls -la": "Lists files with details, including hidden files.",
    "pwd": "Prints the current working directory.",
    "find": "Searches files or text depending on the platform and arguments.",
    "du -sh *": "Shows disk usage for items in the current directory.",
}


def explain_command(command: str) -> str:
    normalized = command.strip()
    if normalized in EXPLANATIONS:
        return EXPLANATIONS[normalized]

    if normalized.startswith("find "):
        return "Finds files or matches based on the supplied search expression."
    if normalized.startswith("grep "):
        return "Searches text for lines matching a pattern."
    if normalized.startswith("Get-ChildItem"):
        return "Lists files and folders using PowerShell."

    return "Runs the generated terminal command. Review it carefully before executing."
