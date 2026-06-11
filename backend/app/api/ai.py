from fastapi import APIRouter

from app.ai.ollama import ollama_client

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/health")
async def ai_health() -> dict:
    return await ollama_client.health()
