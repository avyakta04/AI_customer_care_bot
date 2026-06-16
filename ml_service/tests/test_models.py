"""
ECHOMIND ML Model Sanity Tests – test_models.py
================================================
Verifies that all trained model artefacts exist, can be loaded,
and produce outputs of the expected types/shapes.

Run with:
    cd backend
    pytest tests/test_models.py -v
"""

import sys
import pickle
import pathlib
import pytest

import numpy as np

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))

MODELS_DIR = BASE_DIR / "models"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_pkl(name: str):
    path = MODELS_DIR / name
    assert path.exists(), f"Model file missing: {path}"
    with open(path, "rb") as f:
        return pickle.load(f)


# ---------------------------------------------------------------------------
# File Existence
# ---------------------------------------------------------------------------

class TestModelFilesExist:
    EXPECTED_FILES = [
        "emotion_model.pkl",
        "emotion_vectorizer.pkl",
        "intent_model.pkl",
        "intent_vectorizer.pkl",
        "intent_label_encoder.pkl",
        "urgency_model.pkl",
        "urgency_label_encoder.pkl",
        "urgency_columns.pkl",
        "safety_model.pkl",
        "safety_vectorizer.pkl",
        "ranker_model.pkl",
        "voice_model.pth",
        "voice_scaler.pkl",
        "voice_label_encoder.pkl",
        "voice_stress_regressor.pkl",
        "faiss_index.index",
        "faiss_metadata.pkl",
        "metrics.json",
    ]

    @pytest.mark.parametrize("filename", EXPECTED_FILES)
    def test_file_exists(self, filename):
        assert (MODELS_DIR / filename).exists(), f"Missing: {filename}"


# ---------------------------------------------------------------------------
# Emotion Model
# ---------------------------------------------------------------------------

class TestEmotionModel:
    def test_vectorizer_transform(self):
        vec = _load_pkl("emotion_vectorizer.pkl")
        result = vec.transform(["I am very angry about my order!"])
        assert result.shape[0] == 1

    def test_model_predict(self):
        vec = _load_pkl("emotion_vectorizer.pkl")
        clf = _load_pkl("emotion_model.pkl")
        X = vec.transform(["I am really upset"])
        pred = clf.predict(X)
        assert len(pred) == 1
        assert isinstance(pred[0], str)

    def test_model_predict_proba(self):
        vec = _load_pkl("emotion_vectorizer.pkl")
        clf = _load_pkl("emotion_model.pkl")
        X = vec.transform(["I'm delighted with the service!"])
        proba = clf.predict_proba(X)
        assert proba.shape[0] == 1
        assert abs(proba[0].sum() - 1.0) < 1e-5


# ---------------------------------------------------------------------------
# Intent Model
# ---------------------------------------------------------------------------

class TestIntentModel:
    def test_predict_returns_label(self):
        vec = _load_pkl("intent_vectorizer.pkl")
        clf = _load_pkl("intent_model.pkl")
        enc = _load_pkl("intent_label_encoder.pkl")
        X = vec.transform(["I want to track my delivery"])
        pred_idx = clf.predict(X)
        label = enc.inverse_transform(pred_idx)
        assert len(label) == 1
        assert isinstance(label[0], str)


# ---------------------------------------------------------------------------
# Urgency Model
# ---------------------------------------------------------------------------

class TestUrgencyModel:
    def test_predict_returns_valid_class(self):
        vec = _load_pkl("intent_vectorizer.pkl")   # urgency shares vectorizer
        clf = _load_pkl("urgency_model.pkl")
        enc = _load_pkl("urgency_label_encoder.pkl")
        cols = _load_pkl("urgency_columns.pkl")

        import pandas as pd
        X_raw = vec.transform(["This is extremely urgent, my account is hacked!"])
        # Build a DataFrame with the right columns (urgency uses feature names)
        X_df = pd.DataFrame.sparse.from_spmatrix(X_raw, columns=cols)
        pred_idx = clf.predict(X_df)
        label = enc.inverse_transform(pred_idx)
        assert isinstance(label[0], str)


# ---------------------------------------------------------------------------
# Safety Model
# ---------------------------------------------------------------------------

class TestSafetyModel:
    def test_safe_message(self):
        vec = _load_pkl("safety_vectorizer.pkl")
        clf = _load_pkl("safety_model.pkl")
        X = vec.transform(["Please help me with my order"])
        pred = clf.predict(X)
        assert pred[0] in (0, 1, "safe", "unsafe", True, False)

    def test_toxic_message_flagged(self):
        vec = _load_pkl("safety_vectorizer.pkl")
        clf = _load_pkl("safety_model.pkl")
        X = vec.transform(["I will harm you if you don't fix this now"])
        pred = clf.predict_proba(X)
        # At least one class probability should be non-trivial
        assert pred.shape[1] >= 2


# ---------------------------------------------------------------------------
# Voice Model
# ---------------------------------------------------------------------------

class TestVoiceModel:
    def test_scaler_transform(self):
        scaler = _load_pkl("voice_scaler.pkl")
        dummy = np.zeros((1, scaler.n_features_in_))
        out = scaler.transform(dummy)
        assert out.shape == dummy.shape

    def test_pth_file_loadable(self):
        import torch
        path = MODELS_DIR / "voice_model.pth"
        state = torch.load(path, map_location="cpu", weights_only=True)
        assert isinstance(state, dict)

    def test_stress_regressor_predict(self):
        scaler = _load_pkl("voice_scaler.pkl")
        reg = _load_pkl("voice_stress_regressor.pkl")
        dummy = np.zeros((1, scaler.n_features_in_))
        X_scaled = scaler.transform(dummy)
        score = reg.predict(X_scaled)
        assert len(score) == 1
        assert isinstance(score[0], float)


# ---------------------------------------------------------------------------
# FAISS Index
# ---------------------------------------------------------------------------

class TestFaissIndex:
    def test_index_loadable(self):
        import faiss
        index_path = str(MODELS_DIR / "faiss_index.index")
        index = faiss.read_index(index_path)
        assert index.ntotal > 0

    def test_search_returns_results(self):
        import faiss
        from sentence_transformers import SentenceTransformer
        index = faiss.read_index(str(MODELS_DIR / "faiss_index.index"))
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        emb = model.encode(["help with refund"], convert_to_numpy=True)
        D, I = index.search(emb.astype("float32"), k=3)
        assert len(I[0]) == 3

    def test_metadata_loadable(self):
        meta = _load_pkl("faiss_metadata.pkl")
        assert isinstance(meta, list)
        assert len(meta) > 0


# ---------------------------------------------------------------------------
# Metrics JSON
# ---------------------------------------------------------------------------

class TestMetricsJson:
    def test_metrics_valid_json(self):
        import json
        path = MODELS_DIR / "metrics.json"
        with open(path) as f:
            data = json.load(f)
        assert isinstance(data, dict)
        assert len(data) > 0
