from collections.abc import Generator

from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import Base, get_db
from app.main import app
from app.schemas import GeneratedMessages, ProspectAnalysis


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def setup_function() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_prospect_crud_flow() -> None:
    create_response = client.post(
        "/prospects",
        json={
            "name": "Alice Martin",
            "company": "Northstar",
            "bio": "Founder building a B2B sales tool.",
            "source": "manual",
        },
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["name"] == "Alice Martin"
    assert created["score"] is None
    assert created["status"] == "new"

    prospect_id = created["id"]

    list_response = client.get("/prospects")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    update_response = client.patch(
        f"/prospects/{prospect_id}",
        json={"score": 8, "status": "analyzed"},
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["score"] == 8
    assert updated["status"] == "analyzed"

    delete_response = client.delete(f"/prospects/{prospect_id}")
    assert delete_response.status_code == 204

    missing_response = client.get(f"/prospects/{prospect_id}")
    assert missing_response.status_code == 404


def test_import_csv_creates_prospects() -> None:
    csv_content = (
        "name,bio,company,source\n"
        "Alice Martin,Founder building a B2B sales tool,Northstar,manual\n"
        "Ben Carter,Consultant helping local businesses,,csv\n"
    )

    response = client.post(
        "/prospects/import-csv",
        files={"file": ("prospects.csv", csv_content, "text/csv")},
    )

    assert response.status_code == 201
    imported = response.json()
    assert len(imported) == 2
    assert imported[0]["name"] == "Alice Martin"
    assert imported[0]["company"] == "Northstar"
    assert imported[1]["name"] == "Ben Carter"
    assert imported[1]["company"] is None


def test_import_csv_requires_name_and_bio_columns() -> None:
    response = client.post(
        "/prospects/import-csv",
        files={"file": ("prospects.csv", "name,company\nAlice,Northstar\n", "text/csv")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Missing required columns: bio"


def test_ai_analysis_and_message_generation_flow(monkeypatch) -> None:
    async def fake_analysis(prospect, model=None):
        return ProspectAnalysis(
            summary=f"{prospect.name} is a strong fit for the MVP workflow.",
            score=8,
            category="Hot",
        )

    seen_generation_args = {}

    async def fake_messages(prospect, model=None, tone=None):
        seen_generation_args["model"] = model
        seen_generation_args["tone"] = tone
        first_name = prospect.name.split(" ")[0]
        return GeneratedMessages(
            dm_message=f"Salut {first_name}, message DM personnalise.",
            email_message=f"Bonjour {first_name}, message email personnalise.",
        )

    monkeypatch.setattr("app.api.prospects.run_ai_analysis", fake_analysis)
    monkeypatch.setattr("app.api.prospects.run_message_generation", fake_messages)

    create_response = client.post(
        "/prospects",
        json={
            "name": "Claire Dubois",
            "company": "ScaleLab",
            "bio": "Founder working on sales operations and outbound workflows for B2B teams.",
            "source": "manual",
        },
    )
    assert create_response.status_code == 201
    prospect_id = create_response.json()["id"]

    analyze_response = client.post(f"/prospects/{prospect_id}/analyze")
    assert analyze_response.status_code == 200
    analyzed = analyze_response.json()
    assert analyzed["status"] == "analyzed"
    assert analyzed["summary"]
    assert analyzed["score"] in range(0, 11)
    assert analyzed["category"] in {"Hot", "Warm", "Cold"}

    message_response = client.post(
        f"/prospects/{prospect_id}/generate-message",
        json={"model": "qwen2.5:1.5b", "tone": "direct"},
    )
    assert message_response.status_code == 200
    assert seen_generation_args == {"model": "qwen2.5:1.5b", "tone": "direct"}
    with_messages = message_response.json()
    assert with_messages["status"] == "draft"
    assert "Claire" in with_messages["dm_message"]
    assert "Claire" in with_messages["email_message"]

    history_response = client.get(f"/prospects/{prospect_id}/history")
    assert history_response.status_code == 200
    events = [entry["event_type"] for entry in history_response.json()]
    assert "created" in events
    assert "analyzed" in events
    assert "message_generated" in events
