import csv
from io import StringIO

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi import File, UploadFile
from sqlalchemy.orm import Session

from app import crud
from app.ai.prospect_ai import analyze_prospect as run_ai_analysis
from app.ai.prospect_ai import generate_messages as run_message_generation
from app.database import get_db
from app.schemas import ProspectCreate, ProspectHistoryRead, ProspectRead, ProspectUpdate

router = APIRouter(prefix="/prospects", tags=["prospects"])


@router.post("", response_model=ProspectRead, status_code=status.HTTP_201_CREATED)
def create_prospect(
    prospect: ProspectCreate,
    db: Session = Depends(get_db),
) -> ProspectRead:
    return crud.create_prospect(db, prospect)


@router.get("", response_model=list[ProspectRead])
def list_prospects(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[ProspectRead]:
    return crud.list_prospects(db, skip=skip, limit=limit)


@router.post("/import-csv", response_model=list[ProspectRead], status_code=status.HTTP_201_CREATED)
async def import_prospects_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> list[ProspectRead]:
    if file.content_type not in {"text/csv", "application/vnd.ms-excel", "application/octet-stream"}:
        raise HTTPException(status_code=400, detail="File must be a CSV")

    raw_content = await file.read()
    try:
        text_content = raw_content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded") from exc

    reader = csv.DictReader(StringIO(text_content))
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV is empty")

    columns = {column.strip() for column in reader.fieldnames if column}
    required_columns = {"name", "bio"}
    missing_columns = required_columns - columns
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

    imported = []
    for row_number, row in enumerate(reader, start=2):
        normalized = {key.strip(): (value or "").strip() for key, value in row.items() if key}
        if not normalized.get("name") or not normalized.get("bio"):
            raise HTTPException(
                status_code=400,
                detail=f"Row {row_number} must include name and bio",
            )

        prospect = ProspectCreate(
            name=normalized["name"],
            bio=normalized["bio"],
            company=normalized.get("company") or None,
            source=normalized.get("source") or None,
        )
        imported_prospect = crud.create_prospect(db, prospect)
        crud.create_history(db, imported_prospect.id, "imported", "Prospect imported from CSV")
        imported.append(imported_prospect)

    return imported


@router.get("/{prospect_id}", response_model=ProspectRead)
def get_prospect(
    prospect_id: int,
    db: Session = Depends(get_db),
) -> ProspectRead:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return db_prospect


@router.get("/{prospect_id}/history", response_model=list[ProspectHistoryRead])
def get_prospect_history(
    prospect_id: int,
    db: Session = Depends(get_db),
) -> list[ProspectHistoryRead]:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return crud.list_history(db, prospect_id)


@router.post("/{prospect_id}/analyze", response_model=ProspectRead)
async def analyze_prospect(
    prospect_id: int,
    db: Session = Depends(get_db),
) -> ProspectRead:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")

    analysis = await run_ai_analysis(db_prospect)
    updated = crud.update_prospect(
        db,
        db_prospect,
        ProspectUpdate(
            summary=analysis.summary,
            score=analysis.score,
            category=analysis.category,
            status="analyzed",
        ),
    )
    crud.create_history(db, prospect_id, "analyzed", f"Score {analysis.score}/10, category {analysis.category}")
    return updated


@router.post("/{prospect_id}/generate-message", response_model=ProspectRead)
async def generate_prospect_message(
    prospect_id: int,
    db: Session = Depends(get_db),
) -> ProspectRead:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")

    messages = await run_message_generation(db_prospect)
    updated = crud.update_prospect(
        db,
        db_prospect,
        ProspectUpdate(
            dm_message=messages.dm_message,
            email_message=messages.email_message,
            status="draft",
        ),
    )
    crud.create_history(db, prospect_id, "message_generated", "DM and email messages generated")
    return updated


@router.patch("/{prospect_id}", response_model=ProspectRead)
def update_prospect(
    prospect_id: int,
    prospect_update: ProspectUpdate,
    db: Session = Depends(get_db),
) -> ProspectRead:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")
    updated = crud.update_prospect(db, db_prospect, prospect_update)
    crud.create_history(db, prospect_id, "updated", "Prospect updated")
    return updated


@router.delete("/{prospect_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prospect(
    prospect_id: int,
    db: Session = Depends(get_db),
) -> None:
    db_prospect = crud.get_prospect(db, prospect_id)
    if db_prospect is None:
        raise HTTPException(status_code=404, detail="Prospect not found")
    crud.delete_prospect(db, db_prospect)
