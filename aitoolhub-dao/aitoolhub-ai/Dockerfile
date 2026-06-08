FROM python:3.11-slim

RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-all default-jre unzip && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy and unzip the pre-downloaded LanguageTool-5.7 cache
COPY LanguageTool-5.7.zip /tmp/LanguageTool-5.7.zip
RUN mkdir -p /root/.cache/language_tool_python && \
    unzip -q /tmp/LanguageTool-5.7.zip -d /root/.cache/language_tool_python && \
    rm /tmp/LanguageTool-5.7.zip

COPY . .
RUN rm -f LanguageTool-5.7.zip

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
