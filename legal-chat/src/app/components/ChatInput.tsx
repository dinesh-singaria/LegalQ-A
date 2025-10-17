"use client";


import { useState, FormEvent, useRef } from "react";

type Mode = "ask" | "summarize";

type ChatInputProps = {
  onSubmit: (
    question: string,
    file?: File,
    mode?: Mode
  ) => Promise<void> | void;
  disabled?: boolean;
};

export default function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState<Mode>("ask");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = question.trim();

    if (mode === "ask" && !q) return;

    const file = fileRef.current?.files?.[0];
    await onSubmit(q, file, mode);

    setQuestion("");
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Ask vs Summarize Tabs */}
      <div className="flex justify-center gap-2 mb-1">
        {(["ask", "summarize"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              mode === m
                ? "bg-blue-600 text-white shadow"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m === "ask" ? "Ask" : "Summarize"}
          </button>
        ))}
      </div>

      {/* Chat Input Row */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
      >
        <input
          className="flex-1 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
          placeholder={
            mode === "ask"
              ? "Ask your legal question…"
              : "Optionally write a summarization prompt (e.g., 'Give me the key facts')"
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={disabled}
        />

        {/* File Upload Button */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 shadow hover:bg-gray-100 transition whitespace-nowrap"
        >
          📁 Choose File
          <input
            id="file-upload"
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFileName(file.name);
            }}
            className="hidden"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 text-sm"
        >
          Send
        </button>
      </form>

      {/* File Name Display */}
      {fileName && (
        <div className="text-xs text-gray-600 mt-1 pl-1">📄 {fileName}</div>
      )}
    </div>
  );
}
