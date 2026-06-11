# Backend

FastAPI backend for Prospect Copilot.

## Run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Test

```powershell
.\.venv\Scripts\python.exe -m pytest
```

## Endpoints

- `GET /health`
- `POST /prospects`
- `GET /prospects`
- `GET /prospects/{prospect_id}`
- `PATCH /prospects/{prospect_id}`
- `DELETE /prospects/{prospect_id}`
