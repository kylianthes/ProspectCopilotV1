import json
import re

import httpx

from app.ai.ollama import ollama_client
from app.models import Prospect
from app.schemas import GeneratedMessages, ProspectAnalysis


def _extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


TONE_INSTRUCTIONS = {
    "professionnel": "Use a clear, professional tone.",
    "amical": "Use a friendly and approachable tone.",
    "direct": "Use a concise, direct tone without sounding aggressive.",
    "chaleureux": "Use a warm and human tone.",
}


async def analyze_prospect(prospect: Prospect, model: str | None = None) -> ProspectAnalysis:
    prompt = f"""
Analyze this sales prospect for a manual prospecting workflow.

Return only valid JSON with these exact fields:
summary: short natural-language summary
score: integer from 0 to 10
category: one of Hot, Warm, Cold

Prospect:
Name: {prospect.name}
Company: {prospect.company or "Unknown"}
Bio: {prospect.bio}
Source: {prospect.source or "Unknown"}
"""
    try:
        response = await ollama_client.generate(prompt, model=model, num_predict=180, temperature=0.2)
        payload = _extract_json(response)
        return ProspectAnalysis(**payload)
    except httpx.HTTPError as exc:
        raise RuntimeError("Ollama is unavailable. Start Ollama and verify the selected model.") from exc
    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError("Ollama returned an invalid analysis response.") from exc


async def generate_messages(
    prospect: Prospect,
    model: str | None = None,
    tone: str | None = None,
) -> GeneratedMessages:
    tone_instruction = TONE_INSTRUCTIONS.get(tone or "professionnel", TONE_INSTRUCTIONS["professionnel"])
    prompt = f"""
Write two personalized outreach messages for this prospect.

Return only valid JSON with these exact fields:
dm_message: short direct message, natural, personalized
email_message: concise email, natural, personalized

Rules:
- Use the prospect name.
- {tone_instruction}
- Do not pretend the message was sent.
- Do not mention automation or scraping.
- The user will review and edit before sending manually.

Prospect:
Name: {prospect.name}
Company: {prospect.company or "Unknown"}
Bio: {prospect.bio}
AI summary: {prospect.summary or "Not analyzed yet"}
Score: {prospect.score if prospect.score is not None else "Unknown"}
Category: {prospect.category or "Unknown"}
"""
    try:
        response = await ollama_client.generate(prompt, model=model, num_predict=420, temperature=0.6)
        payload = _extract_json(response)
        return GeneratedMessages(**payload)
    except httpx.HTTPError as exc:
        raise RuntimeError("Ollama is unavailable. Start Ollama and verify the selected model.") from exc
    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError("Ollama returned an invalid message response.") from exc
