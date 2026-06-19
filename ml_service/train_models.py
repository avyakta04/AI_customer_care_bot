import sys
import os

# Move local directory to the end of sys.path to prevent it shadowing standard packages like HuggingFace 'datasets'
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path = [p for p in sys.path if p != '' and os.path.abspath(p) != script_dir]
sys.path.append(script_dir)

import json
import joblib
import pandas as pd
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, accuracy_score, f1_score
from xgboost import XGBClassifier
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import faiss
from sentence_transformers import SentenceTransformer

# Setup directories
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "datasets", "raw")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# -------------------------------------------------------------
# Deep Learning PyTorch model for Speech Emotion Recognition
# -------------------------------------------------------------
class SpeechEmotionNN(nn.Module):
    def __init__(self, input_dim, num_classes):
        super(SpeechEmotionNN, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.3)
        self.fc2 = nn.Linear(128, 64)
        self.relu2 = nn.ReLU()
        self.dropout2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(64, num_classes)
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu1(out)
        out = self.dropout1(out)
        out = self.fc2(out)
        out = self.relu2(out)
        out = self.dropout2(out)
        out = self.fc3(out)
        return out

def extract_audio_features(file_path):
    """
    Extracts MFCC, Spectral Contrast, Chroma, Pitch, and Energy from WAV file.
    """
    y, sr = librosa.load(file_path, sr=None)
    
    # 1. MFCC
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfcc.T, axis=0)
    
    # 2. Spectral Contrast
    contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    contrast_mean = np.mean(contrast.T, axis=0)
    
    # 3. Chroma
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_mean = np.mean(chroma.T, axis=0)
    
    # 4. Pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_mean = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0.0
    
    # 5. Energy (RMS)
    rms = librosa.feature.rms(y=y)
    rms_mean = np.mean(rms.T, axis=0)
    
    # Concatenate features into single vector
    features = np.hstack([mfcc_mean, contrast_mean, chroma_mean, pitch_mean, rms_mean])
    return features

def train_voice_model():
    print("\n--- Training Voice Emotion & Stress Model ---")
    metadata_path = os.path.join(DATA_DIR, "audio_metadata.csv")
    df = pd.read_csv(metadata_path)
    
    features_list = []
    labels = []
    stress_scores = []
    
    for _, row in df.iterrows():
        filepath = os.path.join(DATA_DIR, "audio", row["filename"])
        feats = extract_audio_features(filepath)
        features_list.append(feats)
        labels.append(row["emotion"])
        stress_scores.append(row["stress_score"])
        
    X = np.array(features_list)
    y = np.array(labels)
    y_stress = np.array(stress_scores)
    
    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Scaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)
    
    # PyTorch Tensors
    train_x = torch.tensor(X_train, dtype=torch.float32)
    train_y = torch.tensor(y_train, dtype=torch.long)
    test_x = torch.tensor(X_test, dtype=torch.float32)
    test_y = torch.tensor(y_test, dtype=torch.long)
    
    # DataLoader
    train_dataset = TensorDataset(train_x, train_y)
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    
    model = SpeechEmotionNN(X.shape[1], len(le.classes_))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.005)
    
    # Train Loop
    model.train()
    for epoch in range(40):
        for batch_x, batch_y in train_loader:
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            
    # Eval
    model.eval()
    with torch.no_grad():
        preds = model(test_x)
        pred_labels = torch.argmax(preds, dim=1).numpy()
        acc = accuracy_score(y_test, pred_labels)
        print(f"Voice Emotion Classifier Accuracy: {acc * 100:.2f}%")
        
    # Fit regression model for voice stress level prediction
    from sklearn.svm import SVR
    stress_regressor = SVR(kernel='linear', C=1.0)
    stress_regressor.fit(X_scaled, y_stress)
    
    # Save voice pipeline
    torch.save(model.state_dict(), os.path.join(MODELS_DIR, "voice_model.pth"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "voice_scaler.pkl"))
    joblib.dump(le, os.path.join(MODELS_DIR, "voice_label_encoder.pkl"))
    joblib.dump(stress_regressor, os.path.join(MODELS_DIR, "voice_stress_regressor.pkl"))
    
    return {"voice_accuracy": float(acc)}

def train_text_models():
    print("\n--- Training Text Classification & Explainable AI Models ---")
    data_path = os.path.join(DATA_DIR, "customer_care_dataset.csv")
    df = pd.read_csv(data_path)
    
    # Preprocessing
    df["clean_text"] = df["query_text"].str.lower().str.replace(r'[^\w\s]', '', regex=True)
    
    # 1. EMOTION CLASSIFIER
    print("Training Emotion Classifier (angry, frustrated, confused, happy, neutral)...")
    emotion_vectorizer = TfidfVectorizer(max_features=1000, stop_words="english")
    X_emotion = emotion_vectorizer.fit_transform(df["clean_text"])
    y_emotion = df["emotion"]
    
    X_tr_e, X_te_e, y_tr_e, y_te_e = train_test_split(X_emotion, y_emotion, test_size=0.2, random_state=42)
    
    emotion_model = SVC(kernel="linear", probability=True, C=1.0)
    emotion_model.fit(X_tr_e, y_tr_e)
    e_preds = emotion_model.predict(X_te_e)
    e_acc = accuracy_score(y_te_e, e_preds)
    print(f"Emotion Classifier Accuracy: {e_acc * 100:.2f}%")
    print(classification_report(y_te_e, e_preds))
    
    # 2. INTENT CLASSIFIER
    print("Training Intent Classifier...")
    intent_vectorizer = TfidfVectorizer(max_features=1000, stop_words="english")
    X_intent = intent_vectorizer.fit_transform(df["clean_text"])
    y_intent = df["intent"]
    
    # Label encode intents for XGBoost
    intent_le = LabelEncoder()
    y_intent_encoded = intent_le.fit_transform(y_intent)
    
    X_tr_i, X_te_i, y_tr_i, y_te_i = train_test_split(X_intent, y_intent_encoded, test_size=0.2, random_state=42)
    
    intent_model = XGBClassifier(eval_metric="mlogloss", random_state=42)
    intent_model.fit(X_tr_i, y_tr_i)
    i_preds = intent_model.predict(X_te_i)
    i_acc = accuracy_score(y_te_i, i_preds)
    print(f"Intent Classifier Accuracy: {i_acc * 100:.2f}%")
    
    # Save basic NLP models
    joblib.dump(emotion_model, os.path.join(MODELS_DIR, "emotion_model.pkl"))
    joblib.dump(emotion_vectorizer, os.path.join(MODES_DIR, "emotion_vectorizer.pkl"))
    joblib.dump(intent_model, os.path.join(MODELS_DIR, "intent_model.pkl"))
    joblib.dump(intent_vectorizer, os.path.join(MODELS_DIR, "intent_vectorizer.pkl"))
    joblib.dump(intent_le, os.path.join(MODELS_DIR, "intent_label_encoder.pkl"))
    
    # 3. URGENCY PREDICTION MODEL
    print("Training Urgency Prediction Model...")
    # Map predictions to features for urgency modeling
    df["pred_emotion"] = emotion_model.predict(X_emotion)
    df["pred_intent"] = intent_le.inverse_transform(intent_model.predict(X_intent))
    
    urgency_features = pd.DataFrame({
        "query_len": df["query_text"].str.len(),
        "stress_index": df["stress_index"],
        "escalation_count": df["escalation_count"]
    })
    
    # One-hot encode predicted emotion and intent
    emotion_encoded = pd.get_dummies(df["pred_emotion"], prefix="emo")
    intent_encoded = pd.get_dummies(df["pred_intent"], prefix="int")
    
    X_urgency = pd.concat([urgency_features, emotion_encoded, intent_encoded], axis=1)
    
    # Store training columns list to restore one-hot encoding shape at inference time
    urgency_columns = X_urgency.columns.tolist()
    joblib.dump(urgency_columns, os.path.join(MODELS_DIR, "urgency_columns.pkl"))
    
    y_urgency = df["urgency"]
    urgency_le = LabelEncoder()
    y_urgency_encoded = urgency_le.fit_transform(y_urgency)
    
    X_tr_u, X_te_u, y_tr_u, y_te_u = train_test_split(X_urgency, y_urgency_encoded, test_size=0.2, random_state=42)
    
    urgency_model = XGBClassifier(eval_metric="mlogloss", random_state=42)
    urgency_model.fit(X_tr_u, y_tr_u)
    u_preds = urgency_model.predict(X_te_u)
    u_acc = accuracy_score(y_te_u, u_preds)
    print(f"Urgency Classifier Accuracy: {u_acc * 100:.2f}%")
    
    joblib.dump(urgency_model, os.path.join(MODELS_DIR, "urgency_model.pkl"))
    joblib.dump(urgency_le, os.path.join(MODELS_DIR, "urgency_label_encoder.pkl"))
    
    # 4. SAFETY & SUPERVISOR MODEL
    print("Training Safety/Supervisor Engine...")
    # Combine normal texts with synthetic toxic/spam texts for training
    safety_texts = df["clean_text"].tolist()
    safety_labels = [0] * len(df) # 0 = safe, 1 = unsafe (toxic/spam)
    
    toxic_spam_samples = [
        "die you idiot piece of trash bot", "i will kill your support agent",
        "fuck this stupid service your system is garbage",
        "spam spam spam click here for free cheap drugs double your cash fast",
        "earn money quick link here buy fake reviews instant cash click",
        "hack credentials override auth token bypass protocol secure database",
        "shut up stupid support helper"
    ]
    for sample in toxic_spam_samples:
        safety_texts.append(sample.lower())
        safety_labels.append(1)
        
    safety_vectorizer = TfidfVectorizer(max_features=500, stop_words="english")
    X_safety = safety_vectorizer.fit_transform(safety_texts)
    y_safety = np.array(safety_labels)
    
    safety_model = LogisticRegression()
    safety_model.fit(X_safety, y_safety)
    
    joblib.dump(safety_model, os.path.join(MODELS_DIR, "safety_model.pkl"))
    joblib.dump(safety_vectorizer, os.path.join(MODELS_DIR, "safety_vectorizer.pkl"))
    
    return {
        "emotion_accuracy": float(e_acc),
        "intent_accuracy": float(i_acc),
        "urgency_accuracy": float(u_acc),
        "safety_accuracy": float(accuracy_score(y_safety, safety_model.predict(X_safety)))
    }

def train_retrieval_and_ranker():
    print("\n--- Training FAISS Memory & Response Ranking Models ---")
    # Base KB of query-response pairings representing ECHOMIND's historical tickets database
    kb_data = [
        {
            "query": "This is unacceptable! The server has been down for 2 hours, and our team is losing thousands of dollars! I need immediate support!",
            "response": "I understand the extreme urgency of this database outage. I have immediately activated our VIP backup node and routed your request to the Tier 3 Supervisor. Synchronizing emergency redundancy cluster now.",
            "intent": "technical_support", "emotion": "frustrated", "score": 98.0
        },
        {
            "query": "I have been trying to get this database restored for over two hours now! It is extremely critical and we are losing sales.",
            "response": "I understand your critical situation with the database restore. I have initiated a high-priority connection rebuild to your redundancy cluster and queued an immediate trace session.",
            "intent": "technical_support", "emotion": "angry", "score": 95.0
        },
        {
            "query": "Your system charged my credit card twice and now I have a negative balance. Reverse this immediately!",
            "response": "I see the duplicate billing transaction on your account. I have submitted an emergency charge reversal to our processor. The funds should reflect in your statement shortly.",
            "intent": "payment_issue", "emotion": "angry", "score": 96.0
        },
        {
            "query": "Hello! I am trying to integrate the webhook, but the payload format in your docs doesn't match the event response. Can you help?",
            "response": "I see a format mismatch in our webhook documentation payload definition. Let me pull the current production JSON schema. I am updating your local environment configurations now. Try resending the payload.",
            "intent": "technical_support", "emotion": "confused", "score": 92.0
        },
        {
            "query": "How do I update my payment card? I don't see the billing tab anywhere in my profile settings page.",
            "response": "To update your credit card, navigate to Settings > Billing Profile. From there you can modify card details and billing address. Let me know if you hit any blocker.",
            "intent": "payment_issue", "emotion": "confused", "score": 88.0
        },
        {
            "query": "I cannot access my dashboard. The login page keeps looping back with credential mismatch error. Please help ASAP.",
            "response": "I've initiated a deep-scan of your credential cache. It appears there was a sync delay with the global auth server. I am re-validating your token now. Please try again in 30 seconds.",
            "intent": "account_recovery", "emotion": "frustrated", "score": 90.0
        },
        {
            "query": "Wow, the voice translation response speed is incredibly fast! I wanted to say thank you to the team for this outstanding upgrade!",
            "response": "We are absolutely thrilled to hear the voice translation module is meeting your standards! Your feedback has been synchronized with the core product weights to keep high-frequency performance optimized.",
            "intent": "feedback", "emotion": "happy", "score": 99.0
        },
        {
            "query": "I love the new dark mode design! The layout feels premium and highly responsive. Keep up the good work.",
            "response": "Thank you! We've forwarded your positive comments to our UI/UX team. We will continue optimizing structural contrast and glassmorphism elements based on user satisfaction.",
            "intent": "feedback", "emotion": "happy", "score": 95.0
        },
        {
            "query": "Please cancel my subscription immediately. The service does not work as advertised.",
            "response": "I've initiated the cancellation pipeline for your enterprise subscription. Your billing cycles will stop immediately. A confirmation invoice is dispatched to your registration email.",
            "intent": "cancellation", "emotion": "frustrated", "score": 85.0
        },
        {
            "query": "Could you check if the syncer database is currently up-to-date?",
            "response": "Checking synchronizer registers now... ChromaDB indexing and vector arrays are fully synchronized with V4 registers. Nominal status.",
            "intent": "technical_support", "emotion": "neutral", "score": 92.0
        }
    ]
    
    # Load embedding model
    print("Loading SentenceTransformer model (all-MiniLM-L6-v2)...")
    st_model = SentenceTransformer("all-MiniLM-L6-v2")
    
    queries = [item["query"] for item in kb_data]
    embeddings = st_model.encode(queries, show_progress_bar=False)
    
    # Create FAISS Index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)  # Inner Product (Cosine similarity since sentence embeddings are normalized)
    # Normalize embeddings for Cosine Similarity
    embeddings_norm = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
    index.add(embeddings_norm)
    
    # Save FAISS Index
    faiss.write_index(index, os.path.join(MODELS_DIR, "faiss_index.index"))
    
    # Save metadata index map
    joblib.dump(kb_data, os.path.join(MODELS_DIR, "faiss_metadata.pkl"))
    
    # -------------------------------------------------------------
    # Train Response Ranker Classifier
    # -------------------------------------------------------------
    # Feature inputs: [cosine_similarity, intent_match, emotion_match, historical_success_score]
    # Target: 1 (good response), 0 (bad response)
    ranker_X = []
    ranker_y = []
    
    # Build positive and negative ranking pairs for training
    for i, item in enumerate(kb_data):
        # Positive pair (matches query perfectly)
        ranker_X.append([1.0, 1.0, 1.0, item["score"] / 100.0])
        ranker_y.append(1)
        
        # Negative pairs (bad response match)
        for j, other_item in enumerate(kb_data):
            if i == j:
                continue
            # Calculate metrics
            emb_sim = float(np.dot(embeddings_norm[i], embeddings_norm[j]))
            intent_match = 1.0 if item["intent"] == other_item["intent"] else 0.0
            emotion_match = 1.0 if item["emotion"] == other_item["emotion"] else 0.0
            ranker_X.append([emb_sim, intent_match, emotion_match, other_item["score"] / 100.0])
            ranker_y.append(0)
            
    ranker_model = LogisticRegression()
    ranker_model.fit(ranker_X, ranker_y)
    
    joblib.dump(ranker_model, os.path.join(MODELS_DIR, "ranker_model.pkl"))
    print("FAISS index and Response Ranking models initialized.")
    return {"ranking_score": float(accuracy_score(ranker_y, ranker_model.predict(ranker_X)))}

def main():
    metrics = {}
    
    # 1. Train Voice pipeline
    voice_metrics = train_voice_model()
    metrics.update(voice_metrics)
    
    # 2. Train Text classifiers
    text_metrics = train_text_models()
    metrics.update(text_metrics)
    
    # 3. Train FAISS/Ranking models
    retrieval_metrics = train_retrieval_and_ranker()
    metrics.update(retrieval_metrics)
    
    # Save evaluation summary
    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=4)
        
    print("\nTraining complete! Metrics summary:")
    print(json.dumps(metrics, indent=4))

if __name__ == "__main__":
    main()
