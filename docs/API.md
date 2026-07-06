# API Documentation

Base URL locally:

```text
http://localhost:8000
```

## Generate Command

`POST /generate-command`

```json
{
  "prompt": "show all files",
  "platform": "windows",
  "max_suggestions": 3
}
```

## Explain Command

`POST /explain-command`

```json
{
  "command": "dir"
}
```

## History

- `GET /history`
- `DELETE /history`
