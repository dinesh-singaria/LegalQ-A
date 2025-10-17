// Tiny JSON client for POST /chat/json

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
if (!API_BASE) {
  // Helps you catch misconfigured envs in dev
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_URL is not set. Set it in .env.local");
}

export type Mode = "ask" | "summarize";
export type ChatRes = { answer?: string; error?: string; context?: string };

export async function chatJson(payload: {
  question: string;
  context: string; // required by your FastAPI /chat/json
  mode?: Mode;
}): Promise<ChatRes> {
  const res = await fetch(`${API_BASE}/chat/json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // default to "ask" if not provided
    body: JSON.stringify({ mode: payload.mode ?? "ask", ...payload }),
  });

  // read as text first to preserve backend error messages
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try {
    return JSON.parse(text) as ChatRes;
  } catch {
    // backend returned non-JSON
    throw new Error(text || "Unexpected non-JSON response from backend");
  }
}
