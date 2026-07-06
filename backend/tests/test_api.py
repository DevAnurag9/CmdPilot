from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_explain_command() -> None:
    response = client.post("/explain-command", json={"command": "dir"})
    assert response.status_code == 200
    assert "Lists files" in response.json()["explanation"]
