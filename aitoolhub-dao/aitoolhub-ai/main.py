from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.ocr_service import extract_text
from services.summarizer_service import summarize_text
from services.grammar_service import check_grammar
from services.resume_service import analyze_resume
from services.classifier_service import classify_text
from services.image_classifier_service import classify_image

app = FastAPI(title="AIToolHub AI Microservices", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://aitoolhub-api:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class OcrRequest(BaseModel):
    base64_image: str
    language: str = "eng"

class SummarizeRequest(BaseModel):
    text: str
    length: str = "standard"

class GrammarRequest(BaseModel):
    text: str

class ResumeRequest(BaseModel):
    resume: str
    job_description: str

class ClassifyRequest(BaseModel):
    text: str
    labels: list[str]

class ImageClassifyRequest(BaseModel):
    base64_image: str

@app.get("/health")
def health(): return {"status": "ok", "service": "aitoolhub-ai"}

@app.post("/ocr")
async def ocr(req: OcrRequest):
    result = await extract_text(req.base64_image, req.language)
    return {"extracted_text": result}

@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    result = await summarize_text(req.text, req.length)
    return {"summary": result}

@app.post("/grammar")
async def grammar(req: GrammarRequest):
    result = await check_grammar(req.text)
    return {"corrections": result}

@app.post("/resume")
async def resume(req: ResumeRequest):
    result = await analyze_resume(req.resume, req.job_description)
    return {"analysis": result}

@app.post("/classify")
async def classify(req: ClassifyRequest):
    result = await classify_text(req.text, req.labels)
    return {"classification": result}

@app.post("/classify-image")
async def classify_img_endpoint(req: ImageClassifyRequest):
    try:
        print(f"[DEBUG] Received classify-image request. Base64 length: {len(req.base64_image)}")
        if len(req.base64_image) > 100:
            print(f"[DEBUG] Base64 prefix: {req.base64_image[:50]}...")
            print(f"[DEBUG] Base64 suffix: {req.base64_image[-50:]}...")
        else:
            print(f"[DEBUG] Base64 content: {req.base64_image}")
        result = await classify_image(req.base64_image)
        return {"predictions": result}
    except Exception as e:
        import traceback
        print(f"[ERROR] Error in classify-image endpoint: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Image classification failed: {str(e)}")
