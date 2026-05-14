import { useState } from "react";
import { ChevronDown, ChevronUp, User, Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MessageBubbleProps {
  message: ChatMessage;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-600 hover:text-zinc-100"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");
    const isBlock = codeText.includes("\n");

    if (match || isBlock) {
      return (
        <div className="my-3 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-1.5">
            <span className="text-xs font-medium text-zinc-400">
              {match ? match[1] : "code"}
            </span>
            <CopyButton text={codeText} />
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match ? match[1] : "text"}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: "transparent",
              padding: "1rem",
              fontSize: "0.8125rem",
              lineHeight: "1.6",
            }}
            codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } }}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.8125rem] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        {...props}
      >
        {children}
      </code>
    );
  },

  pre({ children }) {
    return <>{children}</>;
  },

  p({ children }) {
    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
  },

  ul({ children }) {
    return <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>;
  },

  ol({ children }) {
    return <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>;
  },

  li({ children }) {
    return <li className="text-sm leading-relaxed">{children}</li>;
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-2 border-l-4 border-muted-foreground/30 pl-3 text-muted-foreground italic">
        {children}
      </blockquote>
    );
  },

  h1({ children }) {
    return <h1 className="mb-2 mt-3 text-lg font-semibold">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-3 text-base font-semibold">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>;
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    );
  },

  table({ children }) {
    return (
      <div className="my-2 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },

  thead({ children }) {
    return <thead className="bg-muted font-medium">{children}</thead>;
  },

  tr({ children }) {
    return <tr className="border-b last:border-0">{children}</tr>;
  },

  th({ children }) {
    return <th className="px-3 py-2 text-left text-xs font-semibold">{children}</th>;
  },

  td({ children }) {
    return <td className="px-3 py-2 text-xs">{children}</td>;
  },

  hr() {
    return <hr className="my-3 border-border" />;
  },

  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },

  em({ children }) {
    return <em className="italic">{children}</em>;
  },
};

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
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.answer}
            </ReactMarkdown>
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
                {message.sources?.length} source{message.sources?.length !== 1 ? "s" : ""}
              </Button>

              {showSources && (
                <div className="mt-2 space-y-2">
                  {message.sources?.map((source, i) => (
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
