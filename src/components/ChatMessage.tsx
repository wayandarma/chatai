"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/lib/gemini";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
            isUser
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <Card
          className={cn(
            "border-0 shadow-sm",
            isUser
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          )}
        >
          <CardContent className="p-4">
            <div className="text-sm prose prose-sm max-w-none">
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  className={cn(
                    "prose prose-sm max-w-none",
                    "prose-headings:text-gray-900 dark:prose-headings:text-gray-100",
                    "prose-p:text-gray-800 dark:prose-p:text-gray-200",
                    "prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
                    "prose-code:text-gray-900 dark:prose-code:text-gray-100",
                    "prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950",
                    "prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600",
                    "prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300",
                    "prose-li:text-gray-800 dark:prose-li:text-gray-200",
                    "prose-a:text-gray-900 dark:prose-a:text-gray-100 prose-a:underline"
                  )}
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded text-xs"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 mb-3">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 mb-3">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-800 dark:text-gray-200">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 mb-3">
                        {children}
                      </blockquote>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0 text-gray-800 dark:text-gray-200">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
            <div
              className={cn(
                "text-xs mt-3 opacity-70",
                isUser
                  ? "text-gray-300 dark:text-gray-600"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
