from typing import Any

import httpx

from app.config import settings


class OllamaClient:
    def __init__(
        self,
        base_url: str = settings.ollama_base_url,
        model: str = settings.ollama_model,
        timeout_seconds: float = settings.ollama_timeout_seconds,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout_seconds = timeout_seconds

    async def list_models(self) -> list[str]:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            payload = response.json()
        return [model["name"] for model in payload.get("models", [])]

    async def health(self) -> dict[str, Any]:
        try:
            models = await self.list_models()
        except httpx.HTTPError as exc:
            return {
                "online": False,
                "model": self.model,
                "model_available": False,
                "models": [],
                "error": str(exc),
            }

        return {
            "online": True,
            "model": self.model,
            "model_available": self.model in models,
            "models": models,
            "error": None,
        }

    async def generate(
        self,
        prompt: str,
        *,
        num_predict: int = 320,
        temperature: float = 0.4,
        json_mode: bool = True,
    ) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "keep_alive": "10m",
            "options": {
                "num_predict": num_predict,
                "temperature": temperature,
            },
        }
        if json_mode:
            payload["format"] = "json"
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post(f"{self.base_url}/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
        return str(data.get("response", "")).strip()


ollama_client = OllamaClient()
