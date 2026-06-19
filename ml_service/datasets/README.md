# ECHOMIND Dataset Documentation

This directory contains the training data for the ECHOMIND Machine Learning models. All datasets are stored locally to allow fully offline training and inference.

## 1. Raw Datasets (`datasets/raw/`)
- `customer_care_dataset.csv`: Cleaned customer support text queries labeled with Emotion, Intent, Urgency, Stress score, and Escalation parameters. Used for main NLP classification models.
- `audio/`: Programmatic synthesis WAV files mapping audio physics (pitch, Hz, dB intensity, noise, density) to customer voice states.
- `audio_metadata.csv`: Maps each audio WAV file to its corresponding target emotion and stress index.

## 2. Processed Datasets (`datasets/processed/`)
- Intermediary preprocessed and tokenized text outputs.

## 3. Training Datasets (`datasets/training/`)
- Split datasets (train/test sets) used for validation metrics extraction.
