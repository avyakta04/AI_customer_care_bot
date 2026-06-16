"""
ECHOMIND Backend Configuration
================================
All runtime constants are sourced from environment variables.
Copy `.env.example` to `.env` and override as needed.
"""

import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Base Paths
# ---------------------------------------------------------------------------
BASE_DIR: Path = Path(__file__).resolve().parent          # backend/
ROOT_DIR: Path = BASE_DIR.parent                          # project root

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
# For SQLite (default dev mode):  sqlite:///./echomind.db
# For PostgreSQL:  postgresql+psycopg2://user:pass@host:5432/echomind
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{ROOT_DIR / 'echomind.db'}"
)

# ---------------------------------------------------------------------------
# Model Storage
# ---------------------------------------------------------------------------
MODELS_DIR: Path = Path(os.getenv("MODELS_DIR", str(BASE_DIR / "models")))

# Individual model paths (override to swap models without code changes)
EMOTION_MODEL_PATH: Path       = MODELS_DIR / "emotion_model.pkl"
EMOTION_VECTORIZER_PATH: Path  = MODELS_DIR / "emotion_vectorizer.pkl"

INTENT_MODEL_PATH: Path        = MODELS_DIR / "intent_model.pkl"
INTENT_VECTORIZER_PATH: Path   = MODELS_DIR / "intent_vectorizer.pkl"
INTENT_ENCODER_PATH: Path      = MODELS_DIR / "intent_label_encoder.pkl"

URGENCY_MODEL_PATH: Path       = MODELS_DIR / "urgency_model.pkl"
URGENCY_ENCODER_PATH: Path     = MODELS_DIR / "urgency_label_encoder.pkl"
URGENCY_COLUMNS_PATH: Path     = MODELS_DIR / "urgency_columns.pkl"

SAFETY_MODEL_PATH: Path        = MODELS_DIR / "safety_model.pkl"
SAFETY_VECTORIZER_PATH: Path   = MODELS_DIR / "safety_vectorizer.pkl"

RANKER_MODEL_PATH: Path        = MODELS_DIR / "ranker_model.pkl"

VOICE_MODEL_PATH: Path         = MODELS_DIR / "voice_model.pth"
VOICE_SCALER_PATH: Path        = MODELS_DIR / "voice_scaler.pkl"
VOICE_ENCODER_PATH: Path       = MODELS_DIR / "voice_label_encoder.pkl"
VOICE_STRESS_PATH: Path        = MODELS_DIR / "voice_stress_regressor.pkl"

FAISS_INDEX_PATH: Path         = MODELS_DIR / "faiss_index.index"
FAISS_META_PATH: Path          = MODELS_DIR / "faiss_metadata.pkl"

METRICS_PATH: Path             = MODELS_DIR / "metrics.json"

# ---------------------------------------------------------------------------
# Dataset Storage
# ---------------------------------------------------------------------------
DATASETS_DIR: Path = Path(os.getenv("DATASETS_DIR", str(BASE_DIR / "datasets")))

# ---------------------------------------------------------------------------
# Sentence Transformer (used for FAISS embeddings)
# ---------------------------------------------------------------------------
SENTENCE_TRANSFORMER_MODEL: str = os.getenv(
    "SENTENCE_TRANSFORMER_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

# ---------------------------------------------------------------------------
# FastAPI Server
# ---------------------------------------------------------------------------
API_HOST: str  = os.getenv("API_HOST", "0.0.0.0")
API_PORT: int  = int(os.getenv("API_PORT", "8000"))
API_RELOAD: bool = os.getenv("API_RELOAD", "false").lower() == "true"

# CORS – comma-separated list of allowed origins
_raw_origins: str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)
CORS_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# ---------------------------------------------------------------------------
# Hindsight / Active Learning
# ---------------------------------------------------------------------------
# Number of negative-feedback samples required to trigger auto-retraining
HINDSIGHT_RETRAIN_THRESHOLD: int = int(os.getenv("HINDSIGHT_RETRAIN_THRESHOLD", "5"))

# ---------------------------------------------------------------------------
# Safety / Moderation
# ---------------------------------------------------------------------------
# Probability threshold above which a message is flagged as unsafe
SAFETY_THRESHOLD: float = float(os.getenv("SAFETY_THRESHOLD", "0.7"))

# ---------------------------------------------------------------------------
# Voice Analysis
# ---------------------------------------------------------------------------
AUDIO_SAMPLE_RATE: int = int(os.getenv("AUDIO_SAMPLE_RATE", "22050"))
AUDIO_MAX_DURATION_SEC: int = int(os.getenv("AUDIO_MAX_DURATION_SEC", "30"))

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------
APP_NAME: str    = "ECHOMIND AI Customer Care"
APP_VERSION: str = "1.0.0"
APP_DEBUG: bool  = os.getenv("APP_DEBUG", "false").lower() == "true"
