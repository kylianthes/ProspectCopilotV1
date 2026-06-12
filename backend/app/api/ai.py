from fastapi import APIRouter, Query

from app.ai.ollama import ollama_client

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/health")
async def ai_health(model: str | None = Query(default=None, max_length=100)) -> dict:
    return await ollama_client.health(model=model)
