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


def _fallback_analysis(prospect: Prospect) -> ProspectAnalysis:
    bio_length = len(prospect.bio or "")
    score = 7 if bio_length > 180 else 5 if bio_length > 80 else 3
    category = "Hot" if score >= 8 else "Warm" if score >= 5 else "Cold"
    company = f" at {prospect.company}" if prospect.company else ""
    return ProspectAnalysis(
        summary=f"{prospect.name}{company} looks like a {category.lower()} prospect based on the available bio.",
        score=score,
        category=category,
    )


def _fallback_messages(prospect: Prospect) -> GeneratedMessages:
    first_name = prospect.name.split(" ")[0]
    company_part = f" chez {prospect.company}" if prospect.company else ""
    return GeneratedMessages(
        dm_message=(
            f"Salut {first_name}, j'ai vu ton profil{company_part}. "
            "Je pense qu'il y a peut-etre un angle interessant pour te faire gagner du temps sur ta prospection. "
            "Ouvert a en discuter rapidement ?"
        ),
        email_message=(
            f"Bonjour {first_name},\n\n"
            f"Je me permets de vous contacter apres avoir regarde votre profil{company_part}.\n\n"
            "Je pense qu'il peut y avoir un levier concret pour simplifier votre prospection et gagner du temps "
            "sur les messages personnalises.\n\n"
            "Seriez-vous ouvert a un court echange cette semaine ?\n\n"
            "Bonne journee,"
        ),
    )


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
    except (httpx.HTTPError, json.JSONDecodeError, ValueError):
        return _fallback_analysis(prospect)


async def generate_messages(prospect: Prospect, model: str | None = None) -> GeneratedMessages:
    prompt = f"""
Write two personalized outreach messages for this prospect.

Return only valid JSON with these exact fields:
dm_message: short direct message, natural, personalized
email_message: concise email, natural, personalized

Rules:
- Use the prospect name.
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
    except (httpx.HTTPError, json.JSONDecodeError, ValueError):
        return _fallback_messages(prospect)
