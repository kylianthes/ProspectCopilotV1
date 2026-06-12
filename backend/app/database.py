from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy import inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


DATABASE_PATH = Path(__file__).resolve().parent.parent / "prospect_copilot.sqlite3"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _add_missing_prospect_columns()


def _add_missing_prospect_columns() -> None:
    inspector = inspect(engine)
    if "prospects" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("prospects")}
    required_columns = {
        "summary": "TEXT",
        "category": "VARCHAR(50)",
        "dm_message": "TEXT",
        "email_message": "TEXT",
    }

    with engine.begin() as connection:
        for column_name, column_type in required_columns.items():
            if column_name not in existing_columns:
                connection.execute(text(f"ALTER TABLE prospects ADD COLUMN {column_name} {column_type}"))
