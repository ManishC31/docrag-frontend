import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (question: string) => Promise<void>;
  isLoading: boolean;
  hasReadyDocuments: boolean;
}

export function ChatInterface({ messages, onSend, isLoading, hasReadyDocuments }: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    const q = question.trim();
    setQuestion("");
    await onSend(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="chat-scroll flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <p className="text-sm font-medium">
              {hasReadyDocuments
                ? "Ask a question about your documents"
                : "Upload documents to start chatting"}
            </p>
            <p className="mt-1 text-xs">Answers are grounded in your uploaded documents</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasReadyDocuments ? "Ask a question..." : "Upload documents first..."}
            disabled={isLoading || !hasReadyDocuments}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !question.trim() || !hasReadyDocuments}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
