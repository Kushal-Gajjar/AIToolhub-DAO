"""Celery async task queue for long-running AI jobs."""
from celery import Celery
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery("aitoolhub_tasks", broker=REDIS_URL, backend=REDIS_URL)
celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"

@celery_app.task(name="tasks.run_ocr")
def run_ocr_task(base64_image: str, language: str = "eng"):
    import asyncio
    from services.ocr_service import extract_text
    return asyncio.run(extract_text(base64_image, language))

@celery_app.task(name="tasks.run_summarize")
def run_summarize_task(text: str, length: str = "standard"):
    import asyncio
    from services.summarizer_service import summarize_text
    return asyncio.run(summarize_text(text, length))
