import os
import pandas as pd
import numpy as np
import faiss
import joblib
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "datasets", "processed", "master_training_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

def generate_historical_response(intent, emotion):
    responses = {
        "payment_issue": {
            "angry": "I sincerely apologize for the billing error. I have immediately issued a full reversal of the incorrect charge and credited your account. You will see the funds in 3-5 days.",
            "confused": "I understand billing can be confusing. The recent charge was for the annual renewal of your subscription. Let me break down the invoice for you.",
            "neutral": "Your payment has been processed successfully. I have attached the latest invoice to this ticket for your records."
        },
        "technical_support": {
            "angry": "I completely understand your frustration with this outage. Our engineering team has identified the degraded cluster and we are rebooting the nodes now. Your system should be back online in 5 minutes.",
            "confused": "It looks like there's a configuration mismatch in your API keys. I've updated your environment variables to ensure the webhook payloads route correctly.",
            "neutral": "The system diagnostic shows all services are running nominally. If you're still seeing latency, please try clearing your local cache."
        },
        "order_tracking": {
            "angry": "I apologize for the delay. The logistics carrier missed the outbound scan. I have upgraded your shipping to overnight delivery at no extra cost.",
            "neutral": "Your order is currently in transit and is scheduled for delivery tomorrow by 8 PM. Here is your tracking link."
        },
        "cancellation": {
            "angry": "I am sorry to hear you want to cancel, and I apologize for any friction you experienced. Your account has been immediately closed and no further charges will apply.",
            "neutral": "Your cancellation request has been processed. Your access will remain active until the end of the current billing cycle."
        },
        "feedback": {
            "happy": "Thank you so much for the glowing review! We are thrilled that the new UI update is making your workflow faster.",
            "neutral": "Thank you for your feature request. I have logged this with our product team for the Q3 roadmap planning."
        }
    }
    
    intent_map = responses.get(intent, responses["technical_support"])
    return intent_map.get(emotion, intent_map["neutral"])

def main():
    print("=== ECHOMIND MEMORY ENGINE UPGRADE ===")
    
    if not os.path.exists(DATA_PATH):
        print(f"Dataset not found at {DATA_PATH}")
        return
        
    df = pd.read_csv(DATA_PATH)
    
    # Subsample to 2000 records to create a dense, high-quality knowledge base
    # (FAISS can handle millions, but 2k is perfect for demonstration speed)
    if len(df) > 2000:
        df = df.sample(n=2000, random_state=42).reset_index(drop=True)
        
    print(f"Building Knowledge Base with {len(df)} historical interactions...")
    
    # Load SentenceTransformer
    print("Loading MiniLM Embedding Model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    queries = df["query_text"].astype(str).tolist()
    intents = df["intent"].astype(str).tolist()
    emotions = df["emotion"].astype(str).tolist()
    
    print("Generating vector embeddings (This may take a minute)...")
    embeddings = model.encode(queries, batch_size=64, show_progress_bar=True)
    
    # Normalize for Cosine Similarity (Inner Product)
    embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
    
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(np.array(embeddings, dtype=np.float32))
    
    # Build metadata array
    metadata = []
    for i in range(len(df)):
        q = queries[i]
        intnt = intents[i]
        emo = emotions[i]
        # Calculate a success score (higher for happy interactions or standard resolutions)
        score = 95.0 if emo == 'happy' else 85.0
        
        metadata.append({
            "query": q,
            "response": generate_historical_response(intnt, emo),
            "intent": intnt,
            "emotion": emo,
            "score": score
        })
        
    # Save artifacts
    os.makedirs(MODELS_DIR, exist_ok=True)
    faiss.write_index(index, os.path.join(MODELS_DIR, "faiss_index.index"))
    joblib.dump(metadata, os.path.join(MODELS_DIR, "faiss_metadata.pkl"))
    
    print(f"[SUCCESS] FAISS Index saved with {index.ntotal} vectors.")
    print("[SUCCESS] Metadata store generated and saved.")

if __name__ == "__main__":
    main()
