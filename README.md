# CmdPilot

CmdPilot is a local AI terminal assistant for Windows.

It uses Ollama with the `qwen3:4b` model to convert natural language requests into Windows commands.

## Setup

Install Python dependencies:

```powershell
venv\Scripts\python.exe -m pip install -r requirements.txt
```

Install Ollama, then pull the local model:

```powershell
ollama pull qwen3:4b
```

Run the app:

```powershell
venv\Scripts\python.exe main.py
```
