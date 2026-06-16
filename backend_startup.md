# ECHOMIND – Backend Startup Guide

## Backend Overview

The backend is a **FastAPI** server located in `E:\AI CUSTOMER CARE BOT\backend\`.

**Entry point:** `app.py`  
**Default port:** `8000`  
**API Docs:** `http://localhost:8000/docs`

---

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

Verify with:
```cmd
python --version
pip --version
```

---

## Step 1: Create a Virtual Environment

**Windows CMD:**
```cmd
cd "E:\AI CUSTOMER CARE BOT\backend"
python -m venv venv
venv\Scripts\activate
```

**PowerShell:**
```powershell
cd "E:\AI CUSTOMER CARE BOT\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
```

> If PowerShell blocks the script, run first:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## Step 2: Install Dependencies

```cmd
pip install -r requirements.txt
```

> ⚠️ `torch==2.3.0` is a large package (~800MB for CPU-only). This may take 5-10 minutes on first install.

---

## Step 3: Configure Environment

```cmd
copy .env.example .env
```

Edit `.env` if needed. Default values work out-of-the-box for local development.

---

## Step 4: Start the Backend

**Method 1 – Direct Python (recommended for development):**
```cmd
python app.py
```

**Method 2 – Uvicorn directly:**
```cmd
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

---

## Step 5: Verify Backend is Running

Open your browser or curl:
```
http://localhost:8000/
http://localhost:8000/health
http://localhost:8000/docs   ← Interactive Swagger UI
```

Expected response from `/health`:
```json
{"status": "healthy", "version": "4.2.0"}
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root health check |
| GET | `/health` | Health status |
| POST | `/api/predict` | NLP prediction (intent, emotion, urgency) |
| POST | `/api/voice/analyze` | Voice/audio emotion analysis |
| POST | `/api/memory/search` | Vector memory retrieval |
| POST | `/api/hindsight/feedback` | Submit response feedback |
| GET | `/api/hindsight/logs` | View hindsight learning logs |
| POST | `/api/hindsight/train` | Force model retraining |
| GET | `/api/metrics` | System performance metrics |

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r requirements.txt` |
| `Address already in use` on port 8000 | Run `netstat -ano \| findstr :8000` then kill the process |
| `torch` install fails | Try `pip install torch --index-url https://download.pytorch.org/whl/cpu` |
| CORS errors from frontend | Verify `CORS_ORIGINS` in `.env` includes `http://localhost:5173` |
| Database errors | Delete `echomind.db` and restart — it will be auto-recreated |
