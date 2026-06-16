import os
import re
import joblib
import numpy as np
import pandas as pd
import scipy.sparse as sp
import torch
import torch.nn as nn
from response_engine import ResponseEngine
import faiss
import librosa
from sentence_transformers import SentenceTransformer
from train_models import SpeechEmotionNN, extract_audio_features

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")

class ModelsStore:
    def __init__(self):
        print("Loading ECHOMIND Machine Learning models into memory...")
        self.response_engine = ResponseEngine(MODELS_DIR)
        
        # 1. Text models
        self.emotion_model = joblib.load(os.path.join(MODELS_DIR, "emotion_model.pkl"))
        self.emotion_vectorizer = joblib.load(os.path.join(MODELS_DIR, "emotion_vectorizer.pkl"))
        self.emotion_le = joblib.load(os.path.join(MODELS_DIR, "emotion_label_encoder.pkl"))
        
        self.intent_model = joblib.load(os.path.join(MODELS_DIR, "intent_model.pkl"))
        self.intent_vectorizer = joblib.load(os.path.join(MODELS_DIR, "intent_vectorizer.pkl"))
        self.intent_le = joblib.load(os.path.join(MODELS_DIR, "intent_label_encoder.pkl"))
        self.intent_meta_columns = joblib.load(os.path.join(MODELS_DIR, "intent_meta_columns.pkl"))
        
        self.urgency_model = joblib.load(os.path.join(MODELS_DIR, "urgency_model.pkl"))
        self.urgency_vectorizer = joblib.load(os.path.join(MODELS_DIR, "urgency_vectorizer.pkl"))
        self.urgency_le = joblib.load(os.path.join(MODELS_DIR, "urgency_label_encoder.pkl"))
        self.urgency_columns = joblib.load(os.path.join(MODELS_DIR, "urgency_columns.pkl"))
        self.urgency_meta_columns = joblib.load(os.path.join(MODELS_DIR, "urgency_meta_columns.pkl"))
        
        self.safety_model = joblib.load(os.path.join(MODELS_DIR, "safety_model.pkl"))
        self.safety_vectorizer = joblib.load(os.path.join(MODELS_DIR, "safety_vectorizer.pkl"))
        
        # 2. Embedding & Vector search
        self.st_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.faiss_index = faiss.read_index(os.path.join(MODELS_DIR, "faiss_index.index"))
        self.faiss_metadata = joblib.load(os.path.join(MODELS_DIR, "faiss_metadata.pkl"))
        self.ranker_model = joblib.load(os.path.join(MODELS_DIR, "ranker_model.pkl"))
        
        # 3. Voice models
        self.voice_scaler = joblib.load(os.path.join(MODELS_DIR, "voice_scaler.pkl"))
        self.voice_le = joblib.load(os.path.join(MODELS_DIR, "voice_label_encoder.pkl"))
        self.voice_stress_reg = joblib.load(os.path.join(MODELS_DIR, "voice_stress_regressor.pkl"))
        
        # Instantiate PyTorch voice network and load state
        dummy_filepath = os.path.join(BASE_DIR, "datasets", "raw", "audio", "sample_000_happy.wav")
        if os.path.exists(dummy_filepath):
            dummy_features = extract_audio_features(dummy_filepath)
            input_dim = len(dummy_features)
        else:
            input_dim = 33  # standard dimension (13 mfccs + 7 spectral contrast + 12 chroma + 1 pitch + 1 rms)
            
        self.voice_model = SpeechEmotionNN(input_dim, len(self.voice_le.classes_))
        self.voice_model.load_state_dict(torch.load(os.path.join(MODELS_DIR, "voice_model.pth"), weights_only=True))
        self.voice_model.eval()
        
        print("All models successfully initialized offline.")

    def run_safety_audit(self, text):
        """
        Safety Engine checking for spam, toxicity, and sensitive leakage (OTP, Card info).
        """
        clean_text = text.lower()
        
        # Regex checks for data leaks and PII
        import re
        card_pattern = r'\b(?:\d[ -]*?){13,16}\b'
        otp_pattern = r'\b\d{4,6}\b'
        account_pattern = r'\b\d{8,12}\b'
        ssn_pattern = r'\b\d{3}-\d{2}-\d{4}\b'
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        phone_pattern = r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b'
        
        leaks = []
        if re.search(card_pattern, clean_text):
            leaks.append("CREDIT_CARD")
        if re.search(otp_pattern, clean_text) and any(kw in clean_text for kw in ["otp", "code", "verification"]):
            leaks.append("OTP")
        if re.search(account_pattern, clean_text) and any(kw in clean_text for kw in ["account", "bank", "routing"]):
            leaks.append("BANK_ACCOUNT")
        if re.search(ssn_pattern, clean_text):
            leaks.append("SSN")
        if re.search(email_pattern, clean_text):
            leaks.append("EMAIL")
        if re.search(phone_pattern, clean_text):
            leaks.append("PHONE_NUMBER")
            
        # Toxicity/Spam model prediction
        vec = self.safety_vectorizer.transform([clean_text])
        score = float(self.safety_model.predict_proba(vec)[0][1])
        
        is_safe = len(leaks) == 0 and score < 0.5
        return {
            "is_safe": is_safe,
            "toxicity_score": score,
            "detected_leaks": leaks
        }

    def predict_text_attributes(self, text, customer_history=0, escalation_count=0):
        """
        Predicts Emotion, Intent, Urgency, and generates Explainable AI keywords (XAI).
        """
        clean_text = text.lower()
        
        # 1. Emotion
        vec_e = self.emotion_vectorizer.transform([clean_text])
        emotion_probs = self.emotion_model.predict_proba(vec_e)[0]
        class_idx = np.argmax(emotion_probs)
        emotion = self.emotion_le.inverse_transform([class_idx])[0]
        emotion_conf = float(emotion_probs[class_idx])
        
        # 2. Intent
        vec_i_tfidf = self.intent_vectorizer.transform([clean_text])
        
        INTENT_KEYWORDS = {"cancel","refund","track","order","payment","billing",
                           "account","login","password","reset","upgrade","downgrade",
                           "subscribe","unsubscribe","complaint","feedback","support",
                           "help","return","replace","exchange","shipping","delivery"}
        
        meta_i = {
            "text_len": len(text),
            "word_count": len(text.split()),
            "question_mark": 1 if "?" in text else 0,
            "exclamation": 1 if "!" in text else 0,
            "has_number": 1 if any(c.isdigit() for c in text) else 0,
            "keyword_count": sum(1 for k in INTENT_KEYWORDS if k in clean_text)
        }
        meta_i_vals = [meta_i.get(c, 0) for c in self.intent_meta_columns]
        X_meta_i = sp.csr_matrix([meta_i_vals])
        vec_i = sp.hstack([vec_i_tfidf, X_meta_i], format="csr")
        
        intent_preds = self.intent_model.predict(vec_i)
        intent = self.intent_le.inverse_transform(intent_preds)[0]
        intent_probs = self.intent_model.predict_proba(vec_i)[0]
        intent_conf = float(np.max(intent_probs))
        
        # 3. Urgency
        vec_u_tfidf = self.urgency_vectorizer.transform([clean_text])
        
        URGENCY_HIGH_SIGNALS = ["urgent","asap","immediately","critical","emergency","now",
                                "broken","down","outage","failure","crash","cannot","blocked",
                                "loss","losing","money","revenue","escalate","severe",
                                "hours","unacceptable","frustrated","angry","lawsuit","hacked"]
        URGENCY_LOW_SIGNALS = ["question","curious","wondering","whenever","possible","feedback",
                               "suggestion","general","information","inquiry","follow up"]
                               
        meta_u = {
            "char_count": len(text),
            "word_count": len(text.split()),
            "sentence_count": len(re.findall(r"[.!?]", text)) + 1,
            "exclamation_count": text.count("!"),
            "question_count": text.count("?"),
            "caps_ratio": sum(1 for c in text if c.isupper()) / max(len(text),1),
            "high_signal_count": sum(1 for k in URGENCY_HIGH_SIGNALS if k in clean_text),
            "low_signal_count": sum(1 for k in URGENCY_LOW_SIGNALS if k in clean_text),
            "has_money_mention": 1 if re.search(r"\$|money|revenue|cost|loss|losing", clean_text) else 0,
            "has_time_pressure": 1 if re.search(r"hour|minute|asap|immediately|now|urgent", clean_text) else 0,
            "has_system_failure": 1 if re.search(r"down|outage|crash|fail|broken|error|not working", clean_text) else 0,
            "has_account_issue": 1 if re.search(r"account|login|access|locked|password|blocked", clean_text) else 0,
            "has_payment_issue": 1 if re.search(r"payment|charge|billing|refund|invoice|credit", clean_text) else 0,
            "repeated_punct": len(re.findall(r"[!?]{2,}", text))
        }
        meta_u_vals = [meta_u.get(c, 0) for c in self.urgency_meta_columns]
        X_meta_u = sp.csr_matrix([meta_u_vals], dtype=np.float32)
        X_urg = sp.hstack([vec_u_tfidf, X_meta_u], format="csr")
        
        urgency_pred_idx = self.urgency_model.predict(X_urg)[0]
        urgency = self.urgency_le.inverse_transform([urgency_pred_idx])[0]
        
        # 4. Explainable AI (XAI)
        # Extract features (words) with the highest TF-IDF weights in the input text
        feature_names = self.emotion_vectorizer.get_feature_names_out()
        tfidf_row = vec_e.toarray()[0]
        top_indices = np.argsort(tfidf_row)[::-1][:3]
        top_features = [feature_names[idx] for idx in top_indices if tfidf_row[idx] > 0]
        
        if not top_features:
            # Fallback to key nouns/adjectives
            words = [w for w in clean_text.split() if len(w) > 3]
            top_features = list(set(words))[:3]
            
        return {
            "emotion": emotion,
            "emotion_confidence": emotion_conf,
            "intent": intent,
            "intent_confidence": intent_conf,
            "urgency": urgency,
            "top_features": top_features
        }

    def retrieve_memory(self, text, k=3):
        """
        Retrieves vector memories from FAISS index.
        """
        emb = self.st_model.encode([text])
        emb_norm = emb / np.linalg.norm(emb, axis=1, keepdims=True)
        
        distances, indices = self.faiss_index.search(emb_norm, k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.faiss_metadata):
                metadata = self.faiss_metadata[idx]
                results.append({
                    "id": f"MEM{idx:02d}",
                    "snippet": metadata["query"],
                    "response": metadata["response"],
                    "similarity": float(dist) * 100, # convert to percentage
                    "intent": metadata["intent"],
                    "emotion": metadata["emotion"]
                })
        return results

    def recommend_response(self, query, predicted_intent, predicted_emotion, predicted_urgency="low"):
        """
        Retrieves top similar memories and runs the Response Ranker model to pick the best agent response.
        Falls back to ResponseEngine hybrid templates.
        """
        memories = self.retrieve_memory(query, k=5)
        
        best_mem = None
        if memories:
            ranking_features = []
            for mem in memories:
                # Feature: [similarity, intent_match, emotion_match, historical_success_score]
                sim = mem["similarity"] / 100.0
                intent_match = 1.0 if mem["intent"] == predicted_intent else 0.0
                emotion_match = 1.0 if mem["emotion"] == predicted_emotion else 0.0
                # Retrieve score from metadata mapping (or default to 90)
                score = 90.0
                for metadata in self.faiss_metadata:
                    if metadata["query"] == mem["snippet"]:
                        score = metadata["score"]
                        break
                ranking_features.append([sim, intent_match, emotion_match, score / 100.0])
                
            # Predict ranking scores (probability of being class 1)
            rank_probs = self.ranker_model.predict_proba(ranking_features)[:, 1]
            best_idx = np.argmax(rank_probs)
            best_mem = memories[best_idx]
            
        mem_list = [best_mem] if best_mem else []
        return self.response_engine.generate_response(predicted_intent, predicted_emotion, predicted_urgency, mem_list)

    def analyze_audio(self, file_path):
        """
        Performs Librosa features extraction and runs Voice Emotion classifier.
        """
        feats = extract_audio_features(file_path)
        feats_scaled = self.voice_scaler.transform([feats])
        
        # PyTorch prediction
        feats_tensor = torch.tensor(feats_scaled, dtype=torch.float32)
        with torch.no_grad():
            outputs = self.voice_model(feats_tensor)
            probs = torch.softmax(outputs, dim=1).numpy()[0]
            class_idx = np.argmax(probs)
            emotion = self.voice_le.classes_[class_idx]
            confidence = float(probs[class_idx])
            
        # Stress level prediction
        stress_score = float(self.voice_stress_reg.predict(feats_scaled)[0])
        
        # Compute charts data (frequencies, intensities)
        # Using extracted values to create real rolling sequences
        intensity_db = float(librosa.amplitude_to_db(np.array([np.max(np.abs(feats))]))[0])
        # scale intensity db cleanly to 40 - 90 scale
        intensity = max(35, min(95, 60 + intensity_db * 2))
        
        # Pitch Hz (mapped from features)
        pitch = float(feats[-2]) if feats[-2] > 0 else 180.0
        
        # Density (mapped from features)
        density = float(feats[-3]) if len(feats) > 3 else 0.95
        
        return {
            "emotion": emotion,
            "confidence": confidence,
            "stress_score": stress_score,
            "intensity": intensity,
            "pitch": pitch,
            "density": density
        }

if __name__ == "__main__":
    store = ModelsStore()
    # Test query
    res = store.predict_text_attributes("My payment got charged twice! Cancel this now!")
    print(res)
