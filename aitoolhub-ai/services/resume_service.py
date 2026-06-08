"""Resume analysis service — compares resume vs job description."""
from sentence_transformers import SentenceTransformer, util
import re

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

async def analyze_resume(resume: str, job_description: str) -> dict:
    """Score ATS compatibility and highlight keyword gaps."""
    model = get_model()
    emb_resume = model.encode(resume, convert_to_tensor=True)
    emb_jd = model.encode(job_description, convert_to_tensor=True)
    similarity = float(util.cos_sim(emb_resume, emb_jd)[0][0])
    score = round(similarity * 100, 1)

    jd_keywords = set(re.findall(r'\b[a-zA-Z]{4,}\b', job_description.lower()))
    resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', resume.lower()))
    missing = list(jd_keywords - resume_words)[:10]

    return {
        "ats_score": score,
        "match_percentage": score,
        "missing_keywords": missing,
        "recommendation": "Strong match" if score > 70 else "Consider adding more relevant keywords.",
    }
