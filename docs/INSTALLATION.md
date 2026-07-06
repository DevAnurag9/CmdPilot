# Installation Guide

## Prerequisites

- Python 3.12+
- Node.js 22+
- Ollama
- Docker Desktop, optional

## Local AI Setup

```powershell
ollama pull qwen3:4b
```

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend

```powershell
cd frontend
npm install
npm run dev
```
