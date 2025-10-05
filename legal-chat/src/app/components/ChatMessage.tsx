type ChatMessageProps = {
  text: string;
  type?: "user" | "bot" | "error" | "system";
};

export default function ChatMessage({ text, type = "bot" }: ChatMessageProps) {
  const isUser = type === "user";
  const isError = type === "error";
  const isSystem = type === "system";

  let bubbleClasses = "max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm";
  if (isUser) bubbleClasses += " bg-blue-600 text-white ml-auto";
  else if (isError) bubbleClasses += " bg-red-100 text-red-800";
  else if (isSystem) bubbleClasses += " bg-gray-200 text-gray-700 italic text-xs mx-auto";
  else bubbleClasses += " bg-gray-100 text-gray-900";

  return (
    <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={bubbleClasses}>{text}</div>
    </div>
  );
}