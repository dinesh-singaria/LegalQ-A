from fastapi import FastAPI, UploadFile, Form
from pydantic import BaseModel
from transformers import pipeline
import docx
import fitz  # PyMuPDF

app = FastAPI()

qa = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

class ChatRequest(BaseModel):
    question: str
    context: str | None = None   # allow context to be optional

@app.post("/chat/json")
async def chat_json(req: ChatRequest):
    if not req.context or not req.context.strip():
        return {"error": "Context is required. Please upload a file or provide some text."}
    
    result = qa(question=req.question, context=req.context)
    return {"answer": result["answer"]}

@app.post("/chat/file")
async def chat_file(question: str = Form(...), file: UploadFile = None):
    text = ""

    if file:
        if file.filename.endswith(".docx"):
            document = docx.Document(file.file)
            text = "\n".join([p.text for p in document.paragraphs])
        elif file.filename.endswith(".pdf"):
            pdf = fitz.open(stream=file.file.read(), filetype="pdf")
            for page in pdf:
                text += page.get_text()
        else:
            return {"error": "Unsupported file type. Please upload PDF or DOCX."}

    if not text.strip():
        return {"error": "No text extracted from file."}

    result = qa(question=question, context=text)
    return {"answer": result["answer"]}