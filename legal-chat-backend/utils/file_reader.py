import fitz  # PyMuPDF
import docx

def extract_text_from_file(file, filename: str) -> str:
    if filename.endswith(".docx"):
        document = docx.Document(file)
        return "\n".join([p.text for p in document.paragraphs])
    elif filename.endswith(".pdf"):
        pdf = fitz.open(stream=file.read(), filetype="pdf")
        return "\n".join([page.get_text() for page in pdf])
    else:
        return ""