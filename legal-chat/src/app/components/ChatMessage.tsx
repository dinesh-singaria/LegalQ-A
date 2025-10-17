import React from "react";
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  text: string;
  type?: "user" | "bot" | "error" | "system";
};

export default function ChatMessage({ text, type = "bot" }: ChatMessageProps) {
  const isUser = type === "user";
  const isError = type === "error";
  const isSystem = type === "system";

  let bubbleClasses =
    "max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm prose prose-sm prose-gray";
  if (isUser) bubbleClasses += " bg-blue-600 text-white ml-auto";
  else if (isError) bubbleClasses += " bg-red-100 text-red-800";
  else if (isSystem)
    bubbleClasses += " bg-gray-200 text-gray-700 italic text-xs mx-auto";
  else bubbleClasses += " bg-gray-100 text-gray-900";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={bubbleClasses}>
        {/* ✅ Markdown rendering */}
        <ReactMarkdown
          components={{
            ul: ({ children }) => (
              <ul className="list-disc pl-5">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            p: ({ children }) => <p className="">{children}</p>,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
