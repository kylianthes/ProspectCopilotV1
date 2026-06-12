# Prospect Copilot

Prospect Copilot is an AI-assisted prospecting copilot MVP.

Current state:

- Backend foundation is implemented with FastAPI, SQLite, SQLAlchemy, and prospect CRUD.
- Frontend design from the Figma Make/GitHub project is installed in `frontend/`.
- The frontend is connected to the FastAPI backend for prospect CRUD, CSV import, AI analysis, and message generation.
- Ollama/Qwen integration is available through the backend. If Ollama is slow or unavailable, the backend uses a basic local fallback instead of crashing.
- Tauri desktop scaffolding exists in `frontend/src-tauri`, but Rust/Cargo must be installed before building a Windows desktop app.

## Structure

```text
backend/   FastAPI API, database, models, CRUD
frontend/  React/Vite UI from the existing Figma Make design
desktop/   Tauri placeholder for phase 8
work/      Local working files, including extracted Figma Make design
outputs/   User-facing deliverables
```

## Phase 1 Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Design

```powershell
cd frontend
npm run dev
```

Vite usually opens at:

```text
http://localhost:5173
```

## Desktop

Rust/Cargo is required for Tauri.

```powershell
cd frontend
npm run tauri:dev
npm run tauri:build
```

If `cargo` is not recognized, install Rust first. Without Rust, the web app still works, but the Windows desktop package cannot be built.

## VSCode

Open:

```text
Prospect-Copilot.code-workspace
```

This keeps backend and frontend visible in the same VSCode window.
