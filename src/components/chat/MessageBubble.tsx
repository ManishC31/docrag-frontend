import { useState } from "react";
import { ChevronDown, ChevronUp, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);
  const hasSources = message.sources && message.sources.length > 0;

  return (
    <div className="space-y-3">
      {/* Question */}
      <div className="flex justify-end gap-2">
        <div className="max-w-[80%] space-y-1">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground">
            <p className="text-sm">{message.question}</p>
          </div>
          <p className="text-right text-xs text-muted-foreground">{formatDateTime(message.created_at)}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      </div>

      {/* Answer */}
      <div className="flex gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Bot className="h-4 w-4" />
        </div>
        <div className="max-w-[80%] space-y-2">
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.answer}</p>
          </div>

          {hasSources && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowSources(!showSources)}
              >
                {showSources ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                {message.sources!.length} source{message.sources!.length !== 1 ? "s" : ""}
              </Button>

              {showSources && (
                <div className="mt-2 space-y-2">
                  {message.sources!.map((source, i) => (
                    <div key={i} className="rounded-md border bg-background p-2.5 text-xs">
                      <p className="mb-1 font-medium text-muted-foreground">{source.document_name}</p>
                      <p className="text-muted-foreground line-clamp-3">{source.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
