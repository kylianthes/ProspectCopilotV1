from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Prospect
from app.schemas import ProspectCreate, ProspectUpdate


def create_prospect(db: Session, prospect: ProspectCreate) -> Prospect:
    db_prospect = Prospect(**prospect.model_dump())
    db.add(db_prospect)
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def list_prospects(db: Session, skip: int = 0, limit: int = 100) -> list[Prospect]:
    statement = select(Prospect).offset(skip).limit(limit).order_by(Prospect.id.desc())
    return list(db.scalars(statement).all())


def get_prospect(db: Session, prospect_id: int) -> Prospect | None:
    return db.get(Prospect, prospect_id)


def update_prospect(
    db: Session,
    db_prospect: Prospect,
    prospect_update: ProspectUpdate,
) -> Prospect:
    update_data = prospect_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_prospect, field, value)

    db.add(db_prospect)
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def delete_prospect(db: Session, db_prospect: Prospect) -> None:
    db.delete(db_prospect)
    db.commit()
