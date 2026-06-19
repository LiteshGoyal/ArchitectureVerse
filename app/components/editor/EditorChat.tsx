import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";

interface Props {
  question: string;
  setQuestion: (value: string) => void;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  onAsk: () => void;
}

export default function EditorChat({
  question,
  setQuestion,
  chatMessages,
  chatLoading,
  onAsk,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to top (newest message) whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const reversed = [...chatMessages].reverse();

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Scrollable messages (fills remaining space, newest at top) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col-reverse min-h-0">
        <div ref={messagesEndRef} />
        {reversed.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-indigo-600">AI</span>
              </div>
            )}

            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                message.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {message.content}
            </div>

            {message.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-white">You</span>
              </div>
            )}
          </div>
        ))}

        {chatMessages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
              <span className="text-lg">✦</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Ask me anything about your architecture</p>
            <p className="text-[11px] text-gray-400 mt-1">Scalability, patterns, improvements…</p>
          </div>
        )}
      </div>

      {/* ── Pinned input at bottom ── */}
      <div className="shrink-0 px-3 py-3 border-t border-gray-100 bg-white">
        {chatLoading && (
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="text-[11px] text-gray-400 ml-1">AI is thinking…</span>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!chatLoading) onAsk();
              }
            }}
            placeholder="Ask about your architecture…"
            rows={1}
            className="flex-1 resize-none px-3 py-2 text-xs rounded-xl border border-gray-200
                       bg-gray-50 placeholder-gray-400 text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                       transition-all leading-relaxed"
            style={{ maxHeight: 96, overflowY: "auto" }}
          />
          <button
            onClick={onAsk}
            disabled={chatLoading || !question.trim()}
            className="shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center
                       justify-center hover:bg-indigo-700 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
      </div>

    </div>
  );
}