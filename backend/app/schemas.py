from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProspectBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    company: str | None = Field(default=None, max_length=255)
    bio: str = Field(min_length=1)
    source: str | None = Field(default=None, max_length=255)
    score: int | None = Field(default=None, ge=0, le=10)
    summary: str | None = None
    category: str | None = Field(default=None, max_length=50)
    dm_message: str | None = None
    email_message: str | None = None
    status: str = Field(default="new", max_length=50)


class ProspectCreate(ProspectBase):
    pass


class ProspectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    company: str | None = Field(default=None, max_length=255)
    bio: str | None = Field(default=None, min_length=1)
    source: str | None = Field(default=None, max_length=255)
    score: int | None = Field(default=None, ge=0, le=10)
    summary: str | None = None
    category: str | None = Field(default=None, max_length=50)
    dm_message: str | None = None
    email_message: str | None = None
    status: str | None = Field(default=None, max_length=50)


class ProspectRead(ProspectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProspectAnalysis(BaseModel):
    summary: str
    score: int = Field(ge=0, le=10)
    category: str = Field(pattern="^(Hot|Warm|Cold)$")


class GeneratedMessages(BaseModel):
    dm_message: str
    email_message: str


class AIRequest(BaseModel):
    model: str | None = Field(default=None, max_length=100)
    tone: str | None = Field(default=None, pattern="^(professionnel|amical|direct|chaleureux)$")


class ProspectHistoryRead(BaseModel):
    id: int
    prospect_id: int
    event_type: str
    detail: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
