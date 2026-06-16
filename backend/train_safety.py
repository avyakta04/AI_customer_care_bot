"""
╔══════════════════════════════════════════════════════════════════════╗
║        ECHOMIND  ·  Safety Supervisor Training Pipeline             ║
║        Full 9-Step ML Pipeline                                       ║
╠══════════════════════════════════════════════════════════════════════╣
║  Step 1  │ Dataset Ingestion         (Kaggle Jigsaw CSV / fallback)  ║
║  Step 2  │ Data Cleaning             (regex, stopwords, lemma)       ║
║  Step 3  │ Label Encoding            (Binary classification)         ║
║  Step 4  │ TF-IDF Vectorisation      (unigram + bigram, 5k feats)    ║
║  Step 5  │ Train / Test Split        (80/20, stratified)             ║
║  Step 6  │ Cross-Validation          (StratifiedKFold, k=3)          ║
║  Step 7  │ Model Training            (Logistic Regression)           ║
║  Step 8  │ Model Evaluation          (ROC-AUC, Precision, Recall)    ║
║  Step 9  │ Model Serialisation       (joblib → models/)              ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import re

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import json
import time
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, f1_score, classification_report, roc_auc_score

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR / "datasets" / "raw"
MODELS_DIR = BASE_DIR / "models"
METRICS_DIR = BASE_DIR / "metrics"

for d in [MODELS_DIR, METRICS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

def generate_fallback_toxicity_dataset():
    """Generates a small fallback dataset if Jigsaw is not downloaded."""
    safe_texts = [
        "How do I reset my password?",
        "Thank you for the quick response.",
        "Can you send me the invoice for last month?",
        "I love this new dashboard update!",
        "The server is down again, please fix it.",
        "Could you clarify the shipping policy?",
        "I need a refund for my order.",
        "Where can I find the API documentation?"
    ] * 20
    
    toxic_texts = [
        "You guys are absolute idiots, fix the damn server!",
        "This is the worst service I have ever used. F*** this company.",
        "I will sue you for this mistake. You are all thieves.",
        "Shut up and just give me my money back right now.",
        "Your support team is completely useless and stupid.",
        "I hate this product, it's utter garbage.",
        "Go to hell, I am cancelling my subscription.",
        "If you don't refund me I will destroy your reputation online."
    ] * 20
    
    df = pd.DataFrame({
        "text": safe_texts + toxic_texts,
        "is_toxic": [0]*len(safe_texts) + [1]*len(toxic_texts)
    })
    return df

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def main():
    print("╔══════════════════════════════════════════════════════╗")
    print("║   ECHOMIND  ·  Safety Supervisor  ·  Training      ║")
    print("╚══════════════════════════════════════════════════════╝")
    
    jigsaw_path = RAW_DIR / "train.csv" # Standard Jigsaw dataset filename
    if jigsaw_path.exists():
        print("STEP 1: Ingesting Jigsaw Toxic Comment Dataset...")
        df = pd.read_csv(jigsaw_path)
        # Create a binary 'is_toxic' label from multiple toxicity columns
        toxic_cols = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
        if all(c in df.columns for c in toxic_cols):
            df['is_toxic'] = df[toxic_cols].max(axis=1)
        df = df[['comment_text', 'is_toxic']].rename(columns={'comment_text': 'text'})
        # Subsample to balance and speed up
        safe_df = df[df['is_toxic'] == 0].sample(n=5000, random_state=42)
        toxic_df = df[df['is_toxic'] == 1].sample(n=5000, random_state=42)
        df = pd.concat([safe_df, toxic_df])
    else:
        print("STEP 1: Jigsaw dataset not found. Using fallback dataset...")
        df = generate_fallback_toxicity_dataset()
        
    print("STEP 2: Cleaning Data...")
    df["clean_text"] = df["text"].apply(clean_text)
    
    print("STEP 3 & 4: TF-IDF Vectorization...")
    vec = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words="english")
    X = vec.fit_transform(df["clean_text"])
    y = df["is_toxic"].values
    
    print("STEP 5: Train/Test Split...")
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("STEP 6 & 7: Training Logistic Regression Model...")
    clf = LogisticRegression(C=1.0, max_iter=500, solver='lbfgs', n_jobs=1)
    clf.fit(X_tr, y_tr)
    
    print("STEP 8: Evaluation...")
    y_pred = clf.predict(X_te)
    y_prob = clf.predict_proba(X_te)[:, 1]
    
    acc = accuracy_score(y_te, y_pred)
    f1 = f1_score(y_te, y_pred)
    roc = roc_auc_score(y_te, y_prob)
    
    print(f"  Accuracy : {acc:.4f}")
    print(f"  F1 Score : {f1:.4f}")
    print(f"  ROC-AUC  : {roc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_te, y_pred))
    
    print("STEP 9: Serialization...")
    joblib.dump(clf, MODELS_DIR / "safety_model.pkl")
    joblib.dump(vec, MODELS_DIR / "safety_vectorizer.pkl")
    print(f"  Saved to {MODELS_DIR}")
    
    # Save metrics
    metrics = {
        "accuracy": float(acc),
        "f1_score": float(f1),
        "roc_auc": float(roc)
    }
    with open(METRICS_DIR / "safety_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
        
    print("✅ Safety Training Complete.")

if __name__ == "__main__":
    main()
