from ollama import chat


def get_command(user_query):
    prompt = f"""
You are a terminal assistant.

Convert the user request into ONE Windows command.

Return only the command.

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
    )

    return response["message"]["content"].strip()
