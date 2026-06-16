# ECHOMIND – AI Customer Care Bot

This project uses a modern **Microservice Architecture**, splitting the application into three independent services:
1. **Frontend:** React + Vite
2. **Node.js API Gateway:** Express + Prisma + PostgreSQL
3. **ML Service:** Python + FastAPI + PyTorch

---

## 🏗️ Architecture Setup & Running Locally

You will need to open **three separate terminals** to run the full stack locally.

### 1. Database & Node.js API (Gateway)
This service handles all database operations and proxies AI requests to the Python service.

```bash
cd node_backend

# Install dependencies
npm install

# Set up your environment variables
# Open node_backend/.env and add your PostgreSQL credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Push the database schema to PostgreSQL
npx prisma db push

# Start the Node.js server (Runs on port 3000)
npm run dev
```

### 2. Python ML Service (The Brain)
This service strictly handles PyTorch intent prediction, audio analysis, and vector search.

```bash
cd ml_service

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (Runs on port 8000)
python app.py
```

### 3. Frontend (React + Vite)
This is the user interface.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server (Usually runs on port 5173)
npm run dev
```

---

## 🌐 API Routes (via Node.js Gateway on Port 3000)

| Method | Endpoint | Handled By | Description |
|--------|----------|------------|-------------|
| GET | `/health` | Node.js + Python | Checks if both Node.js and Python ML services are running. |
| POST | `/api/predict` | Python (Proxy) + Postgres | Gets NLP prediction from Python and saves log to PostgreSQL. |
| POST | `/api/voice/analyze` | Python (Proxy) | Analyzes voice/audio emotion. |
| POST | `/api/memory/search` | Python (Proxy) | Vector memory retrieval. |
| POST | `/api/hindsight/train`| Python (Proxy) | Triggers ML model retraining. |
| POST | `/api/hindsight/feedback`| Node.js + Postgres | Saves user feedback directly to PostgreSQL. |
| GET | `/api/hindsight/logs` | Node.js + Postgres | Retrieves recent chat logs from PostgreSQL. |
| GET | `/api/metrics` | Node.js + Python | Combines DB interaction counts with Python ML metrics. |
