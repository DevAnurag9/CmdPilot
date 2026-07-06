# Contributing

Thanks for improving CmdPilot.

## Local Development

1. Fork and clone the repository.
2. Install backend dependencies from `backend/requirements.txt`.
3. Install frontend dependencies with `npm install` inside `frontend/`.
4. Run tests and linters before opening a pull request.

## Commands

```powershell
cd backend
pytest
ruff check app tests
```

```powershell
cd frontend
npm run lint
npm run build
```

## Pull Requests

- Keep PRs focused.
- Include screenshots for UI changes.
- Add tests for backend behavior changes.
- Never add behavior that executes commands without explicit confirmation.
