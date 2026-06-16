"""
ECHOMIND API Test Suite – test_api.py
======================================
Full integration tests for every FastAPI endpoint.

Run with:
    cd backend
    pytest tests/ -v
"""

import io
import sys
import struct
import wave
import pytest
from httpx import AsyncClient, ASGITransport

# ---- import the FastAPI app ----
sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parents[1]))
from app import app  # noqa: E402


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_wav_bytes(duration_s: float = 1.0, sample_rate: int = 22050) -> bytes:
    """Generate a minimal valid WAV file in memory (silent mono)."""
    n_samples = int(duration_s * sample_rate)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)          # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(struct.pack(f"<{n_samples}h", *([0] * n_samples)))
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ---------------------------------------------------------------------------
# Health / Root
# ---------------------------------------------------------------------------

class TestHealth:
    @pytest.mark.anyio
    async def test_root_returns_200(self, client):
        resp = await client.get("/")
        assert resp.status_code == 200
        body = resp.json()
        assert "ECHOMIND" in body.get("message", "")

    @pytest.mark.anyio
    async def test_health_endpoint(self, client):
        resp = await client.get("/health")
        assert resp.status_code == 200
        assert resp.json().get("status") == "healthy"


# ---------------------------------------------------------------------------
# /api/predict – Text Prediction
# ---------------------------------------------------------------------------

class TestPredict:
    ENDPOINT = "/api/predict"

    @pytest.mark.anyio
    async def test_predict_basic(self, client):
        payload = {
            "message": "My order has not arrived and I am very frustrated!",
            "session_id": "test-session-001",
            "customer_id": "cust-001",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200, resp.text
        data = resp.json()
        assert "response" in data
        assert "emotion" in data
        assert "intent" in data
        assert "urgency" in data
        assert "is_safe" in data
        assert isinstance(data["response"], str)
        assert len(data["response"]) > 0

    @pytest.mark.anyio
    async def test_predict_safe_flag(self, client):
        """A normal polite message should be flagged as safe."""
        payload = {
            "message": "Can you help me track my package please?",
            "session_id": "test-session-002",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        assert resp.json()["is_safe"] is True

    @pytest.mark.anyio
    async def test_predict_xai_present(self, client):
        """XAI explanation keys must be present in response."""
        payload = {
            "message": "I need a refund immediately!",
            "session_id": "test-session-003",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "xai_explanation" in data

    @pytest.mark.anyio
    async def test_predict_empty_message_rejected(self, client):
        payload = {"message": "", "session_id": "test-session-004"}
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code in (400, 422)

    @pytest.mark.anyio
    async def test_predict_missing_message_rejected(self, client):
        resp = await client.post(self.ENDPOINT, json={"session_id": "x"})
        assert resp.status_code == 422

    @pytest.mark.anyio
    async def test_predict_memory_results_present(self, client):
        """FAISS memory retrieval block should be present."""
        payload = {
            "message": "I want to cancel my subscription",
            "session_id": "test-session-005",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        assert "memory_results" in resp.json()

    @pytest.mark.anyio
    async def test_predict_emotion_is_string(self, client):
        payload = {"message": "I am so happy with the service!", "session_id": "s6"}
        resp = await client.post(self.ENDPOINT, json=payload)
        assert isinstance(resp.json()["emotion"], str)

    @pytest.mark.anyio
    async def test_predict_urgency_valid_values(self, client):
        payload = {"message": "This is urgent! My account is locked!", "session_id": "s7"}
        resp = await client.post(self.ENDPOINT, json=payload)
        urgency = resp.json()["urgency"]
        assert urgency in ("low", "medium", "high", "critical", "urgent", "normal")


# ---------------------------------------------------------------------------
# /api/voice/analyze – Voice Emotion Analysis
# ---------------------------------------------------------------------------

class TestVoiceAnalysis:
    ENDPOINT = "/api/voice/analyze"

    @pytest.mark.anyio
    async def test_voice_analyze_wav(self, client):
        wav_bytes = _make_wav_bytes(duration_s=1.0)
        files = {"audio": ("test.wav", wav_bytes, "audio/wav")}
        resp = await client.post(self.ENDPOINT, files=files)
        assert resp.status_code == 200, resp.text
        data = resp.json()
        assert "emotion" in data
        assert "stress_score" in data
        assert "confidence" in data
        assert isinstance(data["stress_score"], (int, float))

    @pytest.mark.anyio
    async def test_voice_analyze_no_file(self, client):
        resp = await client.post(self.ENDPOINT)
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# /api/memory/search – FAISS Memory Retrieval
# ---------------------------------------------------------------------------

class TestMemorySearch:
    ENDPOINT = "/api/memory/search"

    @pytest.mark.anyio
    async def test_memory_search_returns_results(self, client):
        payload = {"query": "refund policy", "top_k": 3}
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "results" in data
        assert isinstance(data["results"], list)

    @pytest.mark.anyio
    async def test_memory_search_top_k_respected(self, client):
        payload = {"query": "billing issue", "top_k": 2}
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        results = resp.json()["results"]
        assert len(results) <= 2


# ---------------------------------------------------------------------------
# /api/hindsight/feedback – Feedback submission
# ---------------------------------------------------------------------------

class TestHindsightFeedback:
    ENDPOINT = "/api/hindsight/feedback"

    @pytest.mark.anyio
    async def test_submit_positive_feedback(self, client):
        payload = {
            "session_id": "test-session-001",
            "message_id": "msg-001",
            "rating": 1,
            "comment": "Very helpful!",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200
        assert resp.json().get("status") in ("received", "ok", "success")

    @pytest.mark.anyio
    async def test_submit_negative_feedback(self, client):
        payload = {
            "session_id": "test-session-002",
            "message_id": "msg-002",
            "rating": -1,
            "comment": "Not helpful at all",
        }
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 200

    @pytest.mark.anyio
    async def test_feedback_missing_session_id(self, client):
        payload = {"message_id": "msg-003", "rating": 1}
        resp = await client.post(self.ENDPOINT, json=payload)
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# /api/metrics – System Analytics
# ---------------------------------------------------------------------------

class TestMetrics:
    ENDPOINT = "/api/metrics"

    @pytest.mark.anyio
    async def test_metrics_returns_data(self, client):
        resp = await client.get(self.ENDPOINT)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, dict)

    @pytest.mark.anyio
    async def test_metrics_has_model_info(self, client):
        resp = await client.get(self.ENDPOINT)
        data = resp.json()
        # At least one of these keys should be present
        has_info = any(k in data for k in (
            "emotion_accuracy", "intent_accuracy",
            "models", "accuracy", "total_sessions", "metrics"
        ))
        assert has_info


# ---------------------------------------------------------------------------
# /api/hindsight/train – Trigger retraining (smoke test)
# ---------------------------------------------------------------------------

class TestHindsightTrain:
    ENDPOINT = "/api/hindsight/train"

    @pytest.mark.anyio
    async def test_train_endpoint_reachable(self, client):
        resp = await client.post(self.ENDPOINT, json={})
        # Accepts 200 (triggered) or 202 (accepted/queued)
        assert resp.status_code in (200, 202, 400)
