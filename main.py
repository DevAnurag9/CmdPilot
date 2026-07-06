import subprocess

from ai import get_command


query = input("Ask: ")

command = get_command(query)

print(f"\nSuggested Command:\n{command}")

choice = input("\nExecute? (y/n): ")

if choice.lower() == "y":
    subprocess.run(command, shell=True)
