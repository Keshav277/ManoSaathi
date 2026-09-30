"""
train_model.py
----------------
Trains a lightweight bilingual (English + Hindi) intent classifier for
ManoSaathi on dataset/intents_dataset.csv, and saves it to ml/model/intent_model.joblib.

Pipeline: TF-IDF (word 1-2 grams, Unicode aware) -> Logistic Regression.
This is intentionally simple and fast (trains in seconds on a laptop) so it's
easy to retrain as you grow the dataset. It is NOT a safety system on its own --
the backend always runs a keyword-based crisis check *before* trusting this
model's prediction (see backend/app.py). Treat this classifier as a router
that picks which supportive response template to show, not as a diagnostic
or risk-assessment tool.

Usage:
    cd manosaathi-project
    pip install -r ml/requirements.txt
    python ml/train_model.py
"""

import os
import sys
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "dataset", "intents_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "intent_model.joblib")


def main():
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset not found at {DATASET_PATH}")
        sys.exit(1)

    df = pd.read_csv(DATASET_PATH)
    df = df.dropna(subset=["text", "intent"])
    print(f"Loaded {len(df)} labelled examples across {df['intent'].nunique()} intents "
          f"and {df['lang'].nunique()} languages.")

    X = df["text"].astype(str)
    y = df["intent"].astype(str)

    # Small dataset -> keep a modest test split, stratified so every intent
    # is represented in both train and test.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            analyzer="word",
            token_pattern=r"(?u)\b\w+\b",  # Unicode-aware, works for Devanagari + Latin
        )),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])

    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    print("\nHold-out accuracy: {:.2%}".format(accuracy_score(y_test, preds)))
    print("\nClassification report:\n")
    print(classification_report(y_test, preds, zero_division=0))

    # Refit on the full dataset before saving, so the shipped model has seen
    # every labelled example (fine for a small seed dataset like this one).
    pipeline.fit(X, y)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"\nSaved trained pipeline to {MODEL_PATH}")
    print("Restart backend/app.py (or just start it) to pick up the new model.")


if __name__ == "__main__":
    main()
