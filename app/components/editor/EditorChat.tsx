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
  return (
    <div className="border-t p-4">
      <h2 className="font-bold text-lg mb-2">Architecture Assistant</h2>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your architecture..."
          className="border p-2 flex-1"
        />

        <button
          onClick={onAsk}
          disabled={chatLoading}
          className="border px-4 py-2"
        >
          {chatLoading ? "Thinking..." : "Ask"}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "border p-3 rounded bg-gray-100"
                : "border p-3 rounded"
            }
          >
            <div className="font-bold mb-1">
              {message.role === "user" ? "You" : "AI"}
            </div>

            <div>{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
