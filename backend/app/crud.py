from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Prospect, ProspectHistory
from app.schemas import ProspectCreate, ProspectUpdate


def create_prospect(db: Session, prospect: ProspectCreate) -> Prospect:
    db_prospect = Prospect(**prospect.model_dump())
    db.add(db_prospect)
    db.commit()
    db.refresh(db_prospect)
    create_history(db, db_prospect.id, "created", "Prospect created")
    return db_prospect


def list_prospects(db: Session, skip: int = 0, limit: int = 100) -> list[Prospect]:
    statement = select(Prospect).offset(skip).limit(limit).order_by(Prospect.id.desc())
    return list(db.scalars(statement).all())


def get_prospect(db: Session, prospect_id: int) -> Prospect | None:
    return db.get(Prospect, prospect_id)


def get_prospect_by_source(db: Session, source: str) -> Prospect | None:
    statement = select(Prospect).where(Prospect.source == source)
    return db.scalars(statement).first()


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
    create_history(db, db_prospect.id, "deleted", "Prospect deleted")
    db.delete(db_prospect)
    db.commit()


def create_history(
    db: Session,
    prospect_id: int,
    event_type: str,
    detail: str | None = None,
) -> ProspectHistory:
    history = ProspectHistory(
        prospect_id=prospect_id,
        event_type=event_type,
        detail=detail,
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


def list_history(db: Session, prospect_id: int) -> list[ProspectHistory]:
    statement = (
        select(ProspectHistory)
        .where(ProspectHistory.prospect_id == prospect_id)
        .order_by(ProspectHistory.id.desc())
    )
    return list(db.scalars(statement).all())
