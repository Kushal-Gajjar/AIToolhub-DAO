"""OCR Service using Tesseract for image text extraction."""
import base64
import io
from PIL import Image
import pytesseract

async def extract_text(base64_image: str, language: str = "eng") -> str:
    """Extract text from a base64-encoded image using Tesseract OCR."""
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data))
    text = pytesseract.image_to_string(image, lang=language)
    return text.strip()
