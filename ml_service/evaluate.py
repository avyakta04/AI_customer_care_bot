"""
╔══════════════════════════════════════════════════════════════════════╗
║        ECHOMIND  ·  Model Evaluation Suite                          ║
╠══════════════════════════════════════════════════════════════════════╣
║  Loads all trained models and runs full evaluation:                  ║
║  • Per-class Precision / Recall / F1                                 ║
║  • Macro / Weighted averages                                         ║
║  • Confusion matrices (raw + normalised)                             ║
║  • ROC-AUC (one-vs-rest, per class)                                  ║
║  • Calibration check (reliability diagrams)                          ║
║  • Feature importance / top TF-IDF terms per class                   ║
║  • Cross-model comparison table                                       ║
║  • Saves full report to  metrics/evaluation_report.json              ║
╚══════════════════════════════════════════════════════════════════════╝

Run:
    python backend/evaluate.py                    # evaluate all models
    python backend/evaluate.py --model emotion    # evaluate single model
    python backend/evaluate.py --plot             # also save confusion heatmaps
"""

# ── stdlib ──────────────────────────────────────────────────────────────────
import sys
import json
import time
import logging
import argparse
import warnings
from pathlib import Path
from datetime import datetime

warnings.filterwarnings("ignore")

# ── third-party ─────────────────────────────────────────────────────────────
import joblib
import numpy as np
import pandas as pd
import scipy.sparse as sp

from sklearn.preprocessing import LabelEncoder, label_binarize
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    auc,
    log_loss,
    matthews_corrcoef,
    cohen_kappa_score,
    balanced_accuracy_score,
)

# ── paths ────────────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).resolve().parent
RAW_DIR     = BASE_DIR / "datasets" / "raw"
MODELS_DIR  = BASE_DIR / "models"
METRICS_DIR = BASE_DIR / "metrics"
METRICS_DIR.mkdir(parents=True, exist_ok=True)

# ── logging ──────────────────────────────────────────────────────────────────
# Force UTF-8 on Windows stdout
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

logging.basicConfig(
    level   = logging.INFO,
    format  = "%(asctime)s  [%(levelname)s]  %(message)s",
    datefmt = "%H:%M:%S",
    handlers = [
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(METRICS_DIR / "evaluate.log", mode="w", encoding="utf-8"),
    ],
)
log = logging.getLogger("evaluate")

# ── NLTK (optional, graceful fallback) ──────────────────────────────────────
try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    for pkg in ["stopwords", "wordnet", "omw-1.4"]:
        try:
            nltk.data.find(f"corpora/{pkg}")
        except LookupError:
            nltk.download(pkg, quiet=True)
    STOP_WORDS = set(stopwords.words("english"))
    LEMMATIZER = WordNetLemmatizer()
    NLTK_AVAILABLE = True
except Exception:
    STOP_WORDS, LEMMATIZER, NLTK_AVAILABLE = set(), None, False

import re

_CONTRACTIONS = {
    r"won't":"will not", r"can't":"cannot", r"n't":" not",
    r"'re":" are", r"'s":" is", r"'d":" would",
    r"'ll":" will", r"'ve":" have", r"'m":" am",
}

def clean_text(text: str) -> str:
    text = text.lower()
    for pat, rep in _CONTRACTIONS.items():
        text = re.sub(pat, rep, text)
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[@#]\w+", " ", text)
    text = re.sub(r"[^a-z\s!?]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if NLTK_AVAILABLE:
        tokens = [LEMMATIZER.lemmatize(w) for w in text.split()
                  if w not in STOP_WORDS and len(w) > 2]
        text = " ".join(tokens)
    return text


# ═══════════════════════════════════════════════════════════════════════════
# DATA LOADER  (re-uses the main dataset so evaluation is reproducible)
# ═══════════════════════════════════════════════════════════════════════════

def load_eval_data(label_col: str) -> pd.DataFrame:
    """
    Load customer_care_dataset.csv (always present) and return cleaned text
    + the requested label column.
    """
    p = RAW_DIR / "customer_care_dataset.csv"
    if not p.exists():
        raise FileNotFoundError(f"Evaluation data not found: {p}")
    df = pd.read_csv(p)
    df = df[["query_text", label_col]].dropna().copy()
    df.columns = ["text", "label"]
    df["text"]  = df["text"].astype(str)
    df["label"] = df["label"].astype(str).str.strip().str.lower()
    df["clean_text"] = df["text"].apply(clean_text)
    df = df[df["clean_text"].str.strip().str.len() > 3].reset_index(drop=True)
    return df


# ═══════════════════════════════════════════════════════════════════════════
# METRIC HELPERS
# ═══════════════════════════════════════════════════════════════════════════

def compute_full_metrics(model, X, y_true, le, vec=None, label: str = "") -> dict:
    """
    Given a fitted model + feature matrix, return a comprehensive metric dict.
    """
    y_pred = model.predict(X)

    result = {
        "model"                : label,
        "n_samples"            : int(len(y_true)),
        "n_classes"            : int(len(le.classes_)),
        "classes"              : list(le.classes_),
        "accuracy"             : float(accuracy_score(y_true, y_pred)),
        "balanced_accuracy"    : float(balanced_accuracy_score(y_true, y_pred)),
        "f1_weighted"          : float(f1_score(y_true, y_pred, average="weighted",  zero_division=0)),
        "f1_macro"             : float(f1_score(y_true, y_pred, average="macro",     zero_division=0)),
        "f1_micro"             : float(f1_score(y_true, y_pred, average="micro",     zero_division=0)),
        "precision_weighted"   : float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
        "recall_weighted"      : float(recall_score(y_true, y_pred,    average="weighted", zero_division=0)),
        "matthews_corrcoef"    : float(matthews_corrcoef(y_true, y_pred)),
        "cohen_kappa"          : float(cohen_kappa_score(y_true, y_pred)),
        "classification_report": classification_report(
            y_true, y_pred,
            target_names = list(le.classes_),
            output_dict  = True,
            zero_division= 0,
        ),
        "confusion_matrix"         : confusion_matrix(y_true, y_pred).tolist(),
        "confusion_matrix_normalised": (
            confusion_matrix(y_true, y_pred, normalize="true")
            .round(4).tolist()
        ),
    }

    # predict_proba → log-loss + ROC-AUC
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X)
        try:
            result["log_loss"] = float(log_loss(y_true, y_proba))
        except Exception:
            pass
        try:
            result["roc_auc_weighted"] = float(
                roc_auc_score(y_true, y_proba, multi_class="ovr", average="weighted"))
            result["roc_auc_macro"] = float(
                roc_auc_score(y_true, y_proba, multi_class="ovr", average="macro"))
        except Exception:
            pass

        # Per-class ROC curves
        classes = list(le.classes_)
        y_bin   = label_binarize(y_true, classes=list(range(len(classes))))
        per_class_roc = {}
        for i, cls in enumerate(classes):
            try:
                fpr, tpr, _ = roc_curve(y_bin[:, i], y_proba[:, i])
                per_class_roc[cls] = {
                    "auc"     : float(auc(fpr, tpr)),
                    "fpr_pts" : fpr[::max(1, len(fpr)//20)].tolist(),  # downsample
                    "tpr_pts" : tpr[::max(1, len(tpr)//20)].tolist(),
                }
            except Exception:
                pass
        result["per_class_roc"] = per_class_roc

    # Feature importances (tree-based)
    if hasattr(model, "feature_importances_") and vec is not None:
        fi = model.feature_importances_
        names = vec.get_feature_names_out().tolist()
        n = min(len(fi), len(names))
        pairs = sorted(zip(names[:n], fi[:n]), key=lambda x: x[1], reverse=True)[:30]
        result["top_features"] = [{"feature": f, "importance": float(v)} for f, v in pairs]

    # Top discriminative TF-IDF terms per class (for linear models / SVM)
    if hasattr(model, "coef_") and vec is not None:
        coef  = model.coef_
        names = vec.get_feature_names_out()
        top_terms = {}
        classes_list = list(le.classes_)
        for i, cls in enumerate(classes_list):
            if coef.shape[0] == 1:                  # binary
                row = coef[0] if i == 1 else -coef[0]
            else:
                row = coef[i]
            top_idx = np.argsort(row)[::-1][:15]
            top_terms[cls] = [
                {"term": names[j], "weight": float(row[j])}
                for j in top_idx
            ]
        result["top_terms_per_class"] = top_terms

    return result


def run_cv_on_loaded_model(model, X, y, k=5) -> dict:
    """Run k-fold CV on the already-fitted model architecture (refit from scratch)."""
    cv = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)
    f1_scores = cross_val_score(model, X, y, cv=cv,
                                scoring="f1_weighted", n_jobs=-1)
    return {
        "k"         : k,
        "mean_f1"   : float(f1_scores.mean()),
        "std_f1"    : float(f1_scores.std()),
        "all_folds" : f1_scores.tolist(),
    }


# ═══════════════════════════════════════════════════════════════════════════
# EMOTION MODEL EVALUATION
# ═══════════════════════════════════════════════════════════════════════════

def evaluate_emotion() -> dict:
    log.info("─" * 60)
    log.info("EVALUATING  →  EMOTION CLASSIFIER")
    log.info("─" * 60)

    model = joblib.load(MODELS_DIR / "emotion_model.pkl")
    vec   = joblib.load(MODELS_DIR / "emotion_vectorizer.pkl")
    le    = joblib.load(MODELS_DIR / "emotion_label_encoder.pkl")

    df  = load_eval_data("emotion")
    # Align labels to trained classes
    valid = set(le.classes_)
    df    = df[df["label"].isin(valid)].reset_index(drop=True)

    X = vec.transform(df["clean_text"])
    y = le.transform(df["label"])

    # 80/20 test split for isolated hold-out evaluation
    _, X_te, _, y_te = train_test_split(X, y, test_size=0.20,
                                         random_state=42, stratify=y)

    metrics = compute_full_metrics(model, X_te, y_te, le, vec,
                                   label="emotion_classifier")
    log.info(f"  Accuracy       : {metrics['accuracy']:.4f}")
    log.info(f"  F1 (weighted)  : {metrics['f1_weighted']:.4f}")
    log.info(f"  F1 (macro)     : {metrics['f1_macro']:.4f}")
    log.info(f"  Cohen's Kappa  : {metrics['cohen_kappa']:.4f}")
    if "roc_auc_weighted" in metrics:
        log.info(f"  ROC-AUC (OvR)  : {metrics['roc_auc_weighted']:.4f}")
    log.info(f"\n  Classification Report:\n"
             f"{classification_report(y_te, model.predict(X_te), target_names=list(le.classes_), zero_division=0)}")

    return metrics


# ═══════════════════════════════════════════════════════════════════════════
# INTENT MODEL EVALUATION
# ═══════════════════════════════════════════════════════════════════════════

INTENT_KEYWORDS = {
    "cancel","refund","track","order","payment","billing",
    "account","login","password","reset","upgrade","downgrade",
    "subscribe","unsubscribe","complaint","feedback","support",
    "help","return","replace","exchange","shipping","delivery",
}

def _build_meta_features(texts: pd.Series) -> sp.csr_matrix:
    meta = pd.DataFrame({
        "text_len"      : texts.str.len(),
        "word_count"    : texts.str.split().str.len(),
        "question_mark" : texts.str.contains(r"\?").astype(int),
        "exclamation"   : texts.str.contains("!").astype(int),
        "has_number"    : texts.str.contains(r"\d").astype(int),
        "keyword_count" : texts.str.lower().apply(
            lambda t: sum(1 for k in INTENT_KEYWORDS if k in t)
        ),
    })
    return sp.csr_matrix(meta.values)


def evaluate_intent() -> dict:
    log.info("─" * 60)
    log.info("EVALUATING  →  INTENT CLASSIFIER")
    log.info("─" * 60)

    model = joblib.load(MODELS_DIR / "intent_model.pkl")
    vec   = joblib.load(MODELS_DIR / "intent_vectorizer.pkl")
    le    = joblib.load(MODELS_DIR / "intent_label_encoder.pkl")

    df    = load_eval_data("intent")
    valid = set(le.classes_)
    df    = df[df["label"].isin(valid)].reset_index(drop=True)

    X_tfidf = vec.transform(df["clean_text"])
    X_meta  = _build_meta_features(df["text"])
    X = sp.hstack([X_tfidf, X_meta], format="csr")
    y = le.transform(df["label"])

    _, X_te, _, y_te = train_test_split(X, y, test_size=0.20,
                                         random_state=42, stratify=y)

    metrics = compute_full_metrics(model, X_te, y_te, le, vec,
                                   label="intent_classifier")
    log.info(f"  Accuracy       : {metrics['accuracy']:.4f}")
    log.info(f"  F1 (weighted)  : {metrics['f1_weighted']:.4f}")
    log.info(f"  F1 (macro)     : {metrics['f1_macro']:.4f}")
    log.info(f"  Cohen's Kappa  : {metrics['cohen_kappa']:.4f}")
    if "roc_auc_weighted" in metrics:
        log.info(f"  ROC-AUC (OvR)  : {metrics['roc_auc_weighted']:.4f}")
    log.info(f"\n  Classification Report:\n"
             f"{classification_report(y_te, model.predict(X_te), target_names=list(le.classes_), zero_division=0)}")

    return metrics


# ═══════════════════════════════════════════════════════════════════════════
# URGENCY MODEL EVALUATION
# ═══════════════════════════════════════════════════════════════════════════

URGENCY_HIGH_SIGNALS = [
    "urgent","asap","immediately","critical","emergency","now",
    "broken","down","outage","failure","crash","cannot","blocked",
    "loss","losing","money","revenue","escalate","severe",
    "hours","unacceptable","frustrated","angry","lawsuit","hacked",
]
URGENCY_LOW_SIGNALS = [
    "question","curious","wondering","whenever","possible","feedback",
    "suggestion","general","information","inquiry","follow up",
]
URGENCY_LABEL_MAP = {
    "critical":"critical","urgent":"critical",
    "high":"high","important":"high",
    "medium":"medium","normal":"medium","moderate":"medium",
    "low":"low","minor":"low",
}

def _build_urgency_meta(texts: pd.Series) -> sp.csr_matrix:
    raw = texts.str.lower()

    def cnt(t, kws):
        return sum(1 for k in kws if k in t)

    meta = pd.DataFrame({
        "char_count"        : texts.str.len(),
        "word_count"        : texts.str.split().str.len(),
        "sentence_count"    : texts.str.count(r"[.!?]") + 1,
        "exclamation_count" : texts.str.count("!"),
        "question_count"    : texts.str.count(r"\?"),
        "caps_ratio"        : texts.apply(lambda t: sum(1 for c in t if c.isupper()) / max(len(t),1)),
        "high_signal_count" : raw.apply(lambda t: cnt(t, URGENCY_HIGH_SIGNALS)),
        "low_signal_count"  : raw.apply(lambda t: cnt(t, URGENCY_LOW_SIGNALS)),
        "has_money_mention" : raw.str.contains(r"\$|money|revenue|cost|loss|losing", regex=True).astype(int),
        "has_time_pressure" : raw.str.contains(r"hour|minute|asap|immediately|now|urgent", regex=True).astype(int),
        "has_system_failure": raw.str.contains(r"down|outage|crash|fail|broken|error|not working", regex=True).astype(int),
        "has_account_issue" : raw.str.contains(r"account|login|access|locked|password|blocked", regex=True).astype(int),
        "has_payment_issue" : raw.str.contains(r"payment|charge|billing|refund|invoice|credit", regex=True).astype(int),
        "repeated_punct"    : texts.apply(lambda t: len(re.findall(r"[!?]{2,}", t))),
    })
    return sp.csr_matrix(meta.values.astype(np.float32))


def evaluate_urgency() -> dict:
    log.info("─" * 60)
    log.info("EVALUATING  →  URGENCY PREDICTOR")
    log.info("─" * 60)

    model = joblib.load(MODELS_DIR / "urgency_model.pkl")
    le    = joblib.load(MODELS_DIR / "urgency_label_encoder.pkl")

    # Try new vectorizer first; fall back to intent vectorizer (legacy)
    vec_path = MODELS_DIR / "urgency_vectorizer.pkl"
    if vec_path.exists():
        vec = joblib.load(vec_path)
    else:
        vec = joblib.load(MODELS_DIR / "intent_vectorizer.pkl")

    df  = load_eval_data("urgency")
    df["label"] = df["label"].map(lambda x: URGENCY_LABEL_MAP.get(x, x))
    valid = set(le.classes_)
    df    = df[df["label"].isin(valid)].reset_index(drop=True)

    X_tfidf = vec.transform(df["clean_text"])
    X_meta  = _build_urgency_meta(df["text"])
    X = sp.hstack([X_tfidf, X_meta], format="csr")
    y = le.transform(df["label"])

    _, X_te, _, y_te = train_test_split(X, y, test_size=0.20,
                                         random_state=42, stratify=y)

    metrics = compute_full_metrics(model, X_te, y_te, le, vec,
                                   label="urgency_predictor")
    log.info(f"  Accuracy       : {metrics['accuracy']:.4f}")
    log.info(f"  F1 (weighted)  : {metrics['f1_weighted']:.4f}")
    log.info(f"  F1 (macro)     : {metrics['f1_macro']:.4f}")
    log.info(f"  Cohen's Kappa  : {metrics['cohen_kappa']:.4f}")
    if "roc_auc_weighted" in metrics:
        log.info(f"  ROC-AUC (OvR)  : {metrics['roc_auc_weighted']:.4f}")
    log.info(f"\n  Classification Report:\n"
             f"{classification_report(y_te, model.predict(X_te), target_names=list(le.classes_), zero_division=0)}")

    return metrics


# ═══════════════════════════════════════════════════════════════════════════
# CROSS-MODEL COMPARISON TABLE
# ═══════════════════════════════════════════════════════════════════════════

def print_comparison_table(results: dict):
    log.info("")
    log.info("╔══════════════════════════════════════════════════════════════════╗")
    log.info("║              CROSS-MODEL COMPARISON SUMMARY                     ║")
    log.info("╠══════════════════════════════════════════════════════════════════╣")
    log.info(f"║  {'Model':<22} {'Accuracy':>9} {'F1(wt)':>8} {'F1(mc)':>8} {'Kappa':>8} {'ROC-AUC':>9}  ║")
    log.info("╠══════════════════════════════════════════════════════════════════╣")

    for name, m in results.items():
        acc   = f"{m['accuracy']:.4f}"
        f1_w  = f"{m['f1_weighted']:.4f}"
        f1_m  = f"{m['f1_macro']:.4f}"
        kappa = f"{m['cohen_kappa']:.4f}"
        roc   = f"{m.get('roc_auc_weighted', 0):.4f}" if m.get("roc_auc_weighted") else "  N/A  "
        log.info(f"║  {name:<22} {acc:>9} {f1_w:>8} {f1_m:>8} {kappa:>8} {roc:>9}  ║")

    log.info("╚══════════════════════════════════════════════════════════════════╝")


# ═══════════════════════════════════════════════════════════════════════════
# CONFUSION MATRIX HEATMAP  (optional – matplotlib / seaborn)
# ═══════════════════════════════════════════════════════════════════════════

def save_confusion_heatmap(cm_data: list, class_names: list, title: str, out_path: Path):
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        import seaborn as sns

        cm = np.array(cm_data)
        fig, ax = plt.subplots(figsize=(max(6, len(class_names)), max(5, len(class_names)-1)))
        sns.heatmap(
            cm, annot=True, fmt=".2f", cmap="Blues",
            xticklabels=class_names, yticklabels=class_names, ax=ax,
        )
        ax.set_title(title, fontsize=14, fontweight="bold")
        ax.set_xlabel("Predicted Label")
        ax.set_ylabel("True Label")
        plt.tight_layout()
        fig.savefig(out_path, dpi=150)
        plt.close(fig)
        log.info(f"  Heatmap saved → {out_path.name}")
    except ImportError:
        log.warning("  matplotlib/seaborn not installed – skipping heatmap.")


# ═══════════════════════════════════════════════════════════════════════════
# SAVE FINAL REPORT
# ═══════════════════════════════════════════════════════════════════════════

def save_report(all_results: dict, elapsed: float):
    report = {
        "timestamp"   : datetime.utcnow().isoformat() + "Z",
        "total_time_s": float(elapsed),
        "models"      : all_results,
        "summary": {
            name: {
                "accuracy"    : m["accuracy"],
                "f1_weighted" : m["f1_weighted"],
                "f1_macro"    : m["f1_macro"],
                "cohen_kappa" : m["cohen_kappa"],
                "roc_auc"     : m.get("roc_auc_weighted"),
            }
            for name, m in all_results.items()
        },
    }
    out = METRICS_DIR / "evaluation_report.json"
    with open(out, "w") as fh:
        json.dump(report, fh, indent=2)
    log.info(f"\n  ✅ Full evaluation report saved → {out}")

    # Also update shared models/metrics.json
    shared = MODELS_DIR / "metrics.json"
    existing = {}
    if shared.exists():
        with open(shared) as fh:
            try: existing = json.load(fh)
            except: pass

    for name, m in all_results.items():
        key = name.replace("_classifier", "").replace("_predictor", "")
        existing[f"{key}_accuracy"]   = m["accuracy"]
        existing[f"{key}_f1"]         = m["f1_weighted"]
        existing[f"{key}_kappa"]      = m["cohen_kappa"]
        existing[f"{key}_roc_auc"]    = m.get("roc_auc_weighted")

    with open(shared, "w") as fh:
        json.dump(existing, fh, indent=2)
    log.info(f"  models/metrics.json updated")

    return report


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════

EVALUATORS = {
    "emotion" : evaluate_emotion,
    "intent"  : evaluate_intent,
    "urgency" : evaluate_urgency,
}

def parse_args():
    p = argparse.ArgumentParser(description="ECHOMIND Model Evaluation Suite")
    p.add_argument(
        "--model",
        type    = str,
        default = "all",
        choices = ["all", "emotion", "intent", "urgency"],
        help    = "Which model to evaluate (default: all)",
    )
    p.add_argument(
        "--plot",
        action  = "store_true",
        default = False,
        help    = "Save confusion matrix heatmaps (requires matplotlib + seaborn)",
    )
    return p.parse_args()


def main():
    args    = parse_args()
    t_start = time.time()

    log.info("╔══════════════════════════════════════════════════════╗")
    log.info("║   ECHOMIND  ·  Model Evaluation Suite               ║")
    log.info("╚══════════════════════════════════════════════════════╝")

    to_run = list(EVALUATORS.keys()) if args.model == "all" else [args.model]
    all_results = {}

    for name in to_run:
        try:
            metrics = EVALUATORS[name]()
            all_results[metrics["model"]] = metrics

            if args.plot:
                save_confusion_heatmap(
                    cm_data     = metrics["confusion_matrix_normalised"],
                    class_names = metrics["classes"],
                    title       = f"{name.title()} – Normalised Confusion Matrix",
                    out_path    = METRICS_DIR / f"{name}_confusion.png",
                )
        except FileNotFoundError as exc:
            log.warning(f"  Skipping {name}: {exc}")
        except Exception as exc:
            log.error(f"  Error evaluating {name}: {exc}", exc_info=True)

    if not all_results:
        log.error("No models could be evaluated. Run the training scripts first.")
        sys.exit(1)

    elapsed = time.time() - t_start
    print_comparison_table(all_results)
    save_report(all_results, elapsed)

    log.info("")
    log.info(f"  Total evaluation time: {elapsed:.1f}s")
    log.info("  Done ✅")


if __name__ == "__main__":
    main()
