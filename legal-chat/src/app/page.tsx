"use client";

import { useRef, useState, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import { chatJson } from "@/lib/api"; // ✅ add
import { chatFile } from "@/lib/upload"; // ✅ add

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
    const userText = file
      ? `${mode === "summarize" ? "📄 Summarize" : "📄 Ask about"}: ${
          file.name
        }${question?.trim() ? ` — “${question.trim()}”` : ""}`
      : question?.trim() || "(no question)";

    setMessages((m) => [...m, { type: "user", text: userText }]);
    setLoading(true);

    try {
      let answerText = "";

      if (file) {
        const data = await chatFile(file, question, mode ?? "ask");
        if (data.error) throw new Error(data.error);
        answerText =
          typeof data.answer === "object"
            ? JSON.stringify(data.answer, null, 2)
            : data.answer || "";
      } else {
        const data = await chatJson({
          question,
          context: question || " ",
          mode: mode ?? "ask",
        });
        if (data.error) throw new Error(data.error);
        answerText =
          typeof data.answer === "object"
            ? JSON.stringify(data.answer, null, 2)
            : data.answer || "";
      }

      setMessages((m) => [
        ...m,
        { type: "bot", text: answerText || "No response." },
      ]);
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
      <header className="w-full max-w-3xl py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          ⚖️ Legal Q&A Assistant
        </h1>
        <p className="text-gray-600 text-sm">
          Upload case files or contracts (PDF/DOCX) and ask me questions.
        </p>
      </header>

      <div
        ref={listRef}
        className="flex-1 w-full max-w-3xl overflow-y-auto bg-white rounded-2xl shadow p-4 border flex flex-col gap-2"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} type={msg.type} text={msg.text} />
        ))}
        {loading && (
          <ChatMessage type="system" text="🤖 ForenzixBot is typing…" />
        )}
      </div>

      <div className="w-full max-w-3xl p-4">
        <ChatInput onSubmit={askBackend} disabled={loading} />
      </div>
    </main>
  );
}
