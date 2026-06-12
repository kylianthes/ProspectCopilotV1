from pydantic import BaseModel


class Settings(BaseModel):
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen2.5:1.5b"
    ollama_timeout_seconds: float = 60.0


settings = Settings()
