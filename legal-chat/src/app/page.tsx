"use client";

import { useRef, useState, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

type Message = { text: string; type: "user" | "bot" | "error" | "system" };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "system",
      text: "👋 Upload a PDF/DOCX or ask me a legal question to get started.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const askBackend = async (
    question: string,
    file?: File,
    mode?: "ask" | "summarize"
  ) => {
    setMessages((m) => [
      ...m,
      { type: "user", text: mode === "ask" ? question : "📄 Summarize file" },
    ]);
    setLoading(true);

    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.append("question", question);
        form.append("file", file);
        form.append("mode", mode || "ask");

        res = await fetch("/api/chat", { method: "POST", body: form });
      } else {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, context: "", mode }),
        });
      }

      const data = await res.json();

      if (data.error) {
        setMessages((m) => [...m, { type: "error", text: `⚠️ ${data.error}` }]);
      } else {
        setMessages((m) => [...m, { type: "bot", text: data.answer }]);
      }
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { type: "error", text: `⚠️ ${err?.message || "Something went wrong"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-3xl py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          ⚖️ Legal Q&A Assistant
        </h1>
        <p className="text-gray-600 text-sm">
          Upload case files or contracts (PDF/DOCX) and ask me questions.
        </p>
      </header>

      {/* Chat window */}
      <div
        ref={listRef}
        className="flex-1 w-full max-w-3xl overflow-y-auto bg-white rounded-2xl shadow p-4 border"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} type={msg.type} text={msg.text} />
        ))}
        {loading && (
          <ChatMessage type="system" text="🤖 ForenzixBot is typing…" />
        )}
      </div>

      {/* Input bar */}
      <div className="w-full max-w-3xl p-4">
        <ChatInput onSubmit={askBackend} disabled={loading} />
      </div>
    </main>
  );
}
