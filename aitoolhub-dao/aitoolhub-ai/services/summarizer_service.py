"""Summarizer Service using transformers/BART model."""
from transformers import pipeline

_summarizer = None

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        _summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    return _summarizer

LENGTH_CONFIG = {
    "brief":    {"max_length": 60,  "min_length": 20},
    "standard": {"max_length": 130, "min_length": 50},
    "detailed": {"max_length": 250, "min_length": 100},
}

async def summarize_text(text: str, length: str = "standard") -> str:
    """Summarize the given text to the specified length."""
    config = LENGTH_CONFIG.get(length, LENGTH_CONFIG["standard"])
    summarizer = get_summarizer()
    result = summarizer(text[:1024], **config, do_sample=False)
    return result[0]["summary_text"]
