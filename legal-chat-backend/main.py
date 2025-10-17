from fastapi import FastAPI, UploadFile, Form
from pydantic import BaseModel
from agents.ask_agent import run_ask_agent
from agents.summarize_agent import run_summarize_agent
from utils.file_reader import extract_text_from_file
from io import BytesIO

app = FastAPI()

class ChatRequest(BaseModel):
    question: str
    context: str | None = None
    mode: str = "ask"  # "ask" or "summarize"

@app.post("/chat/json")
async def chat_json(req: ChatRequest):
    if not req.context or not req.context.strip():
        return {"error": "Context is required."}

    if req.mode == "summarize":
        summary = run_summarize_agent(req.question, req.context)
        return {"answer": summary}
    else:
        answer = run_ask_agent(req.question, req.context)
        return {"answer": answer}

@app.post("/chat/file")
async def chat_file(
    question: str = Form(""),
    mode: str = Form("ask"),
    file: UploadFile = None,
):
    if not file:
        return {"error": "No file uploaded"}

    # Read file content into memory buffer
    file_bytes = await file.read()
    file_buffer = BytesIO(file_bytes)

    # Extract text from buffer instead of raw stream
    text = extract_text_from_file(file_buffer, file.filename)
    if not text.strip():
        return {"error": "No text found in file"}

    if mode == "summarize":
        summary = run_summarize_agent(question, text)
        return {"answer": summary, "context": text}
    else:
        answer = run_ask_agent(question, text)
        return {"answer": answer, "context": text}