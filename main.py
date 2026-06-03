import subprocess

commands = {
    "list all files": "dir",
    "show current directory": "cd"
}

query = input("Ask: ").lower()

if query in commands:

    command = commands[query]

    print(f"\nSuggested Command: {command}")

    choice = input("Execute? (y/n): ")

    if choice.lower() == "y":
        subprocess.run(command, shell=True)

else:
    print("Command not found")