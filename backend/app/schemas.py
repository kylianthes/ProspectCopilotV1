from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProspectBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    company: str | None = Field(default=None, max_length=255)
    bio: str = Field(min_length=1)
    source: str | None = Field(default=None, max_length=255)
    score: int | None = Field(default=None, ge=0, le=10)
    status: str = Field(default="new", max_length=50)


class ProspectCreate(ProspectBase):
    pass


class ProspectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    company: str | None = Field(default=None, max_length=255)
    bio: str | None = Field(default=None, min_length=1)
    source: str | None = Field(default=None, max_length=255)
    score: int | None = Field(default=None, ge=0, le=10)
    status: str | None = Field(default=None, max_length=50)


class ProspectRead(ProspectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
