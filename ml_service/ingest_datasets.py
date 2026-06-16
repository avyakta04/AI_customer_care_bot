import os
import glob
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "datasets", "raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "datasets", "processed")

os.makedirs(PROCESSED_DIR, exist_ok=True)

def auto_detect_and_normalize(filepath):
    """
    Reads a Kaggle CSV and normalizes its column schema.
    Detects texts, emotions, intents, and urgency columns.
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None
        
    print(f"\nProcessing {os.path.basename(filepath)} | Original shape: {df.shape}")
    
    # Lowercase column names for easier matching
    df.columns = [c.lower().strip() for c in df.columns]
    
    # 1. Detect Text Column
    text_cols = [c for c in df.columns if c in ['text', 'tweet', 'content', 'query', 'message', 'sentence', 'utterance']]
    if not text_cols:
        # Fallback: Find longest string column
        str_cols = df.select_dtypes(include=['object']).columns
        if len(str_cols) > 0:
            text_cols = [max(str_cols, key=lambda x: df[x].astype(str).map(len).mean())]
    
    # 2. Detect Target Columns
    emotion_cols = [c for c in df.columns if 'emotion' in c or 'sentiment' in c]
    intent_cols = [c for c in df.columns if 'intent' in c or 'category' in c or 'label' in c and 'intent' in filepath.lower()]
    urgency_cols = [c for c in df.columns if 'urgency' in c or 'priority' in c or 'severity' in c]
    
    normalized = pd.DataFrame()
    if text_cols:
        normalized['query_text'] = df[text_cols[0]]
    else:
        print("Could not detect text column. Skipping.")
        return None
        
    if emotion_cols:
        normalized['emotion'] = df[emotion_cols[0]]
    if intent_cols:
        normalized['intent'] = df[intent_cols[0]]
    if urgency_cols:
        normalized['urgency'] = df[urgency_cols[0]]
        
    return normalized

def clean_and_deduplicate(df):
    """
    Removes duplicates, handles nulls, and standardizes text.
    """
    initial_len = len(df)
    
    # Drop rows with no text
    df = df.dropna(subset=['query_text'])
    
    # Standardize string format
    df['query_text'] = df['query_text'].astype(str).str.strip()
    
    # Drop empty strings
    df = df[df['query_text'] != ""]
    
    # Deduplicate
    df = df.drop_duplicates(subset=['query_text'])
    
    # Fill missing targets with 'unknown' or 'neutral'
    if 'emotion' in df.columns:
        df['emotion'] = df['emotion'].fillna('neutral').astype(str).str.lower()
    if 'intent' in df.columns:
        df['intent'] = df['intent'].fillna('general').astype(str).str.lower().str.replace(' ', '_')
    if 'urgency' in df.columns:
        df['urgency'] = df['urgency'].fillna('low').astype(str).str.lower()
        
    final_len = len(df)
    print(f"Cleaned Data: {initial_len} -> {final_len} rows (Removed {initial_len - final_len} duplicates/nulls)")
    return df

def generate_dataset_statistics(df, dataset_name):
    print(f"\n--- Statistics for {dataset_name} ---")
    print(f"Total Rows: {len(df)}")
    if 'emotion' in df.columns:
        print(f"Emotion Distribution:\n{df['emotion'].value_counts().head(5)}")
    if 'intent' in df.columns:
        print(f"Intent Distribution:\n{df['intent'].value_counts().head(5)}")
    if 'urgency' in df.columns:
        print(f"Urgency Distribution:\n{df['urgency'].value_counts().head(5)}")

def main():
    print("=== ECHOMIND REAL DATASET INGESTION PIPELINE ===")
    csv_files = glob.glob(os.path.join(RAW_DIR, "*.csv"))
    
    if not csv_files:
        print(f"[WARNING] No CSV files found in {RAW_DIR}")
        print("Please download Kaggle datasets (Emotion, Intent, Ticket Priority) and place them there.")
        return
        
    unified_dfs = []
    
    for filepath in csv_files:
        # Ignore our existing synthetic/metadata files
        if "customer_care_dataset" in filepath or "audio_metadata" in filepath:
            continue
            
        norm_df = auto_detect_and_normalize(filepath)
        if norm_df is not None and not norm_df.empty:
            clean_df = clean_and_deduplicate(norm_df)
            dataset_name = os.path.basename(filepath).split('.')[0]
            generate_dataset_statistics(clean_df, dataset_name)
            
            # Save processed individual dataset
            out_path = os.path.join(PROCESSED_DIR, f"processed_{dataset_name}.csv")
            clean_df.to_csv(out_path, index=False)
            unified_dfs.append(clean_df)
            
    if unified_dfs:
        # Generate unified master training format
        master_df = pd.concat(unified_dfs, ignore_index=True)
        master_df = master_df.drop_duplicates(subset=['query_text'])
        
        # Add required meta columns if they don't exist
        if 'stress_index' not in master_df.columns:
            master_df['stress_index'] = np.random.randint(10, 90, size=len(master_df))
        if 'escalation_count' not in master_df.columns:
            master_df['escalation_count'] = np.random.choice([0, 1, 2, 3], size=len(master_df), p=[0.7, 0.2, 0.08, 0.02])
            
        # Ensure all core columns exist for training
        for col, default in [('emotion', 'neutral'), ('intent', 'general'), ('urgency', 'low')]:
            if col not in master_df.columns:
                master_df[col] = default
                
        master_path = os.path.join(PROCESSED_DIR, "master_training_dataset.csv")
        master_df.to_csv(master_path, index=False)
        print(f"\n[SUCCESS] Unified master dataset generated at: {master_path}")
        print(f"Total Master Rows: {len(master_df)}")
        
if __name__ == "__main__":
    main()
