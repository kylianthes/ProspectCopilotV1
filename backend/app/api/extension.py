from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import ProspectCreate, ProspectRead

router = APIRouter(prefix="/extension", tags=["extension"])


class ExtensionProspectCreate(BaseModel):
    username: str = Field(min_length=1, max_length=255)
    display_name: str | None = Field(default=None, max_length=255)
    bio: str = Field(min_length=1, max_length=4000)
    source: str = Field(pattern="^(instagram|tiktok)$")
    profile_url: str = Field(min_length=1, max_length=2048)


@router.post("/prospects", response_model=ProspectRead, status_code=status.HTTP_201_CREATED)
def create_extension_prospect(
    payload: ExtensionProspectCreate,
    db: Session = Depends(get_db),
) -> ProspectRead:
    username = payload.username.removeprefix("@").strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    source_key = f"{payload.source}:@{username}"
    existing = crud.get_prospect_by_source(db, source_key)
    if existing is not None:
        return existing

    platform = "Instagram" if payload.source == "instagram" else "TikTok"
    name = (payload.display_name or username).strip()
    bio = "\n".join(
        [
            f"Profil {platform}",
            f"Username: @{username}",
            f"Bio: {payload.bio.strip()}",
            f"URL: {payload.profile_url.strip()}",
        ]
    )

    prospect = crud.create_prospect(
        db,
        ProspectCreate(
            name=name,
            company=None,
            bio=bio,
            source=source_key,
        ),
    )
    crud.create_history(db, prospect.id, "extension_imported", f"Imported from {platform}")
    return prospect
