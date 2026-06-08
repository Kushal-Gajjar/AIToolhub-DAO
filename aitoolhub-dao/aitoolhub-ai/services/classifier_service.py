"""Zero-shot text classification service."""
from transformers import pipeline
from typing import List

_classifier = None

def get_classifier():
    global _classifier
    if _classifier is None:
        _classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    return _classifier

async def classify_text(text: str, labels: List[str]) -> dict:
    """Classify text into one of the provided labels using zero-shot classification."""
    classifier = get_classifier()
    result = classifier(text, candidate_labels=labels)
    return {
        "label": result["labels"][0],
        "scores": dict(zip(result["labels"], [round(s, 3) for s in result["scores"]])),
    }
