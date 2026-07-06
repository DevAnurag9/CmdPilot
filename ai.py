import json

from ollama import chat


def _clean_command(text):
    text = text.strip()

    if "</think>" in text:
        text = text.split("</think>", 1)[1].strip()

    lines = [
        line.strip().strip("`")
        for line in text.splitlines()
        if line.strip() and not line.strip().startswith("<think>")
    ]

    return lines[0] if lines else ""


def get_command(user_query):
    prompt = f"""
You are a terminal assistant.

Convert the user request into ONE Windows Command Prompt command.
Prefer cmd.exe built-in commands and common Windows CLI tools.

Return JSON with exactly this shape:
{{"command": "the Windows command"}}

Do not explain it.
Do not use Markdown.
Do not wrap the command in backticks.

User:
{user_query}
"""

    response = chat(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        think=False,
        format="json",
        options={
            "temperature": 0,
            "num_predict": 32,
        },
    )

    content = response["message"]["content"].strip()

    try:
        command = json.loads(content)["command"]
    except (json.JSONDecodeError, KeyError, TypeError):
        command = content

    return _clean_command(command)
