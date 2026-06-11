import httpx
import pytest

from app.ai.ollama import OllamaClient


class MockTransport(httpx.AsyncBaseTransport):
    def __init__(self, response: httpx.Response | None = None, error: Exception | None = None) -> None:
        self.response = response
        self.error = error

    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        if self.error:
            raise self.error
        assert self.response is not None
        return self.response


class PatchedAsyncClient:
    def __init__(self, real_async_client, transport: MockTransport) -> None:
        self.client = real_async_client(transport=transport)

    async def __aenter__(self) -> httpx.AsyncClient:
        return self.client

    async def __aexit__(self, *args) -> None:
        await self.client.aclose()


@pytest.mark.anyio
async def test_ollama_health_reports_model_availability(monkeypatch: pytest.MonkeyPatch) -> None:
    response = httpx.Response(
        status_code=200,
        json={"models": [{"name": "qwen2.5:7b"}, {"name": "llama3.2:3b"}]},
    )
    transport = MockTransport(response=response)
    real_async_client = httpx.AsyncClient

    def async_client_factory(*args, **kwargs) -> PatchedAsyncClient:
        return PatchedAsyncClient(real_async_client, transport)

    monkeypatch.setattr(httpx, "AsyncClient", async_client_factory)

    client = OllamaClient(model="qwen2.5:7b")
    health = await client.health()

    assert health["online"] is True
    assert health["model_available"] is True
    assert health["models"] == ["qwen2.5:7b", "llama3.2:3b"]


@pytest.mark.anyio
async def test_ollama_health_handles_connection_error(monkeypatch: pytest.MonkeyPatch) -> None:
    transport = MockTransport(error=httpx.ConnectError("not running"))
    real_async_client = httpx.AsyncClient

    def async_client_factory(*args, **kwargs) -> PatchedAsyncClient:
        return PatchedAsyncClient(real_async_client, transport)

    monkeypatch.setattr(httpx, "AsyncClient", async_client_factory)

    client = OllamaClient(model="qwen2.5:7b")
    health = await client.health()

    assert health["online"] is False
    assert health["model_available"] is False
    assert health["models"] == []
