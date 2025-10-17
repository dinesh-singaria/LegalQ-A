// Multipart client for POST /chat/file

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
if (!API_BASE) {
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_URL is not set. Set it in .env.local");
}

export type Mode = "ask" | "summarize";
export type FileRes = { answer?: string; error?: string; context?: string };

export async function chatFile(
  file: File,
  question = "",
  mode: Mode = "ask"
): Promise<FileRes> {
  const fd = new FormData();
  fd.append("file", file); // FastAPI reads this as UploadFile
  fd.append("question", question);
  fd.append("mode", mode); // "ask" | "summarize"

  const res = await fetch(`${API_BASE}/chat/file`, {
    method: "POST",
    body: fd, // don't set Content-Type; browser sets boundary
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try {
    return JSON.parse(text) as FileRes;
  } catch {
    throw new Error(text || "Unexpected non-JSON response from backend");
  }
}
