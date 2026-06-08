"""Image classification service using google/vit-base-patch16-224 (Vision Transformer)."""
import base64
import io
from PIL import Image
from transformers import pipeline

_image_classifier = None

def get_image_classifier():
    global _image_classifier
    if _image_classifier is None:
        # Load high-accuracy ViT model
        _image_classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
    return _image_classifier

async def classify_image(base64_image: str) -> list:
    """Classify image using ViT and return predictions with confidence scores."""
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data))
    
    # Ensure image is in RGB format for classification
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    classifier = get_image_classifier()
    results = classifier(image)
    
    return [
        {"label": r["label"], "score": round(float(r["score"]), 4)}
        for r in results
    ]
