# 🧠 RUN ECHOMIND – Complete Execution Guide

> **Project Path:** `E:\AI CUSTOMER CARE BOT`  
> **Frontend:** React 18 + Vite 5 → `http://localhost:5173`  
> **Backend:** FastAPI + Python 3.10+ → `http://localhost:8000`

---

## QUICK START (TL;DR)

Open **two separate terminals**:

**Terminal 1 – Backend:**
```powershell
cd "E:\AI CUSTOMER CARE BOT\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

**Terminal 2 – Frontend:**
```powershell
cd "E:\AI CUSTOMER CARE BOT"
npm install
copy .env.example .env
npm run dev
```

Then open: **http://localhost:5173**

---

## PART 1 – ENVIRONMENT SETUP

### Node.js (Frontend)

1. Download and install Node.js 18+ from: https://nodejs.org
2. Verify installation:
   ```powershell
   node --version   # Should show v18.x.x or higher
   npm --version    # Should show 9.x.x or higher
   ```

### Python (Backend)

1. Download Python 3.10+ from: https://python.org
2. During install, check **"Add Python to PATH"**
3. Verify:
   ```powershell
   python --version   # Should show Python 3.10+
   pip --version
   ```

---

## PART 2 – FRONTEND STARTUP

### Step 1: Navigate to project root

**CMD:**
```cmd
cd "E:\AI CUSTOMER CARE BOT"
```

**PowerShell:**
```powershell
Set-Location "E:\AI CUSTOMER CARE BOT"
```

### Step 2: Install dependencies

```powershell
npm install
```

This installs all packages from `package.json` into `node_modules/`.

> ⏱ First-time install takes ~1-3 minutes.

### Step 3: Configure environment

```cmd
copy .env.example .env
```

The default `.env` is pre-configured to connect to `http://localhost:8000`.

### Step 4: Start dev server

```powershell
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open browser

Navigate to: **http://localhost:5173**

---

## PART 3 – BACKEND STARTUP

### Step 1: Navigate to backend folder

```powershell
cd "E:\AI CUSTOMER CARE BOT\backend"
```

### Step 2: Create virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

> If activation is blocked by PowerShell execution policy:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### Step 3: Install Python dependencies

```powershell
pip install -r requirements.txt
```

> ⚠️ PyTorch download is large (~800MB). Be patient on first install.

### Step 4: Configure backend environment

```cmd
copy .env.example .env
```

### Step 5: Start the backend server

```powershell
python app.py
```

**Expected output:**
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Step 6: Verify backend

Open: **http://localhost:8000/health**

Expected response: `{"status": "healthy", "version": "4.2.0"}`

---

## PART 4 – DEPENDENCY INSTALLATION (DETAIL)

### Frontend npm packages

```powershell
npm install
```

This installs:
- `react` + `react-dom` – Core UI framework
- `react-router-dom` – Client-side routing
- `framer-motion` – Animations
- `lucide-react` – Icon library
- `chart.js` + `react-chartjs-2` – Analytics charts
- `socket.io-client` – Real-time WebSocket connection
- `clsx` + `tailwind-merge` – CSS utilities

### Backend pip packages

```powershell
pip install -r requirements.txt
```

Key packages:
- `fastapi` + `uvicorn` – Web framework
- `scikit-learn`, `xgboost`, `torch` – ML models
- `sentence-transformers`, `transformers` – NLP embeddings
- `faiss-cpu` – Vector similarity search
- `librosa`, `soundfile` – Audio processing
- `sqlalchemy` – Database ORM

---

## PART 5 – COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `npm: command not found` | Node.js not installed | Install from nodejs.org |
| `Cannot find module 'vite'` | `npm install` not run | Run `npm install` in project root |
| `Error: ENOENT: no such file or directory, open 'package.json'` | Wrong directory | `cd "E:\AI CUSTOMER CARE BOT"` |
| `python: command not found` | Python not in PATH | Reinstall Python and check "Add to PATH" |
| `ModuleNotFoundError: No module named 'fastapi'` | venv not activated or deps not installed | Activate venv, then `pip install -r requirements.txt` |
| `Address already in use (port 5173)` | Another Vite process running | Kill it: `npx kill-port 5173` |
| `Address already in use (port 8000)` | Another FastAPI process running | `netstat -ano \| findstr :8000` then `taskkill /PID <id> /F` |
| Frontend shows "Could not connect to backend" | FastAPI not running | Start backend first (`python app.py`) |
| CORS errors in browser console | Backend CORS not configured | Verify `CORS_ORIGINS` in `backend/.env` includes `http://localhost:5173` |
| `torch` install error | CUDA mismatch or network timeout | Use CPU-only: `pip install torch --index-url https://download.pytorch.org/whl/cpu` |

---

## PART 6 – TROUBLESHOOTING

### Check if ports are in use (PowerShell)

```powershell
# Check port 5173 (Vite)
netstat -ano | findstr :5173

# Check port 8000 (FastAPI)
netstat -ano | findstr :8000
```

### Kill a process by PID

```powershell
taskkill /PID <PID_NUMBER> /F
```

### Reset database (if corrupted)

```powershell
cd "E:\AI CUSTOMER CARE BOT\backend"
del echomind.db
python app.py   # Database is auto-recreated on startup
```

### Clear npm cache (if install hangs)

```powershell
npm cache clean --force
npm install
```

### Re-activate Python venv

```powershell
cd "E:\AI CUSTOMER CARE BOT\backend"
.\venv\Scripts\Activate.ps1
```

---

## PART 7 – VERIFICATION CHECKLIST

After starting both servers, verify:

- [ ] `http://localhost:5173` – Loads ECHOMIND Landing page
- [ ] `http://localhost:5173/login` – Login page renders
- [ ] `http://localhost:5173/dashboard` – Dashboard renders
- [ ] `http://localhost:8000/health` – Returns `{"status":"healthy"}`
- [ ] `http://localhost:8000/docs` – FastAPI Swagger UI loads
- [ ] Live Chat (`/dashboard/chat`) connects to backend API
- [ ] Voice Analysis page (`/dashboard/voice`) renders without errors
- [ ] Analytics page (`/dashboard/analytics`) charts render correctly
- [ ] Memory Retrieval (`/dashboard/memory`) shows results
- [ ] AI Supervisor (`/dashboard/supervisor`) metrics load
- [ ] Hindsight Learning (`/dashboard/learning`) shows logs

---

## PROJECT STRUCTURE

```
E:\AI CUSTOMER CARE BOT\
├── package.json           ← Frontend dependencies (npm)
├── vite.config.js         ← Vite bundler configuration
├── index.html             ← HTML entry point
├── .env.example           ← Frontend env template
├── .gitignore             ← Git ignore rules
├── public/
│   └── echomind-icon.svg  ← App favicon
├── src/
│   ├── main.jsx           ← React entry point
│   ├── App.jsx            ← Router + route definitions
│   ├── index.css          ← Global styles
│   ├── pages/             ← Page components
│   ├── components/        ← Reusable UI components
│   ├── layouts/           ← Layout wrappers
│   ├── services/          ← API/socket services
│   ├── charts/            ← Chart components
│   └── animations/        ← Framer Motion variants
└── backend/
    ├── app.py             ← FastAPI entry point
    ├── requirements.txt   ← Python dependencies
    ├── database.py        ← SQLAlchemy models
    ├── models_store.py    ← ML model management
    ├── config.py          ← Configuration
    └── .env.example       ← Backend env template
```
