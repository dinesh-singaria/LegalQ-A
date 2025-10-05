import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  try {
    // === Handle file upload ===
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const res = await fetch("http://127.0.0.1:8000/chat/file", {
        method: "POST",
        body: formData as any,
      });

      const resType = res.headers.get("content-type") || "";
      if (resType.includes("application/json")) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      } else {
        const text = await res.text();
        console.error("Non-JSON error from Python:", text);
        return NextResponse.json(
          { error: "Unexpected response from backend", raw: text },
          { status: res.status }
        );
      }
    }

    // === Handle plain JSON ===
    if (contentType.includes("application/json")) {
      const body = await req.json();

      const res = await fetch("http://127.0.0.1:8000/chat/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resType = res.headers.get("content-type") || "";
      if (resType.includes("application/json")) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      } else {
        const text = await res.text();
        console.error("Non-JSON error from Python:", text);
        return NextResponse.json(
          { error: "Unexpected response from backend", raw: text },
          { status: res.status }
        );
      }
    }

    // === Unsupported request ===
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 415 }
    );
  } catch (err: any) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
