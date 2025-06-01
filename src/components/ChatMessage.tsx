import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/lib/gemini";
import { User, Bot } from "lucide-react";

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
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <Card
          className={cn(
            "border-0 shadow-sm",
            isUser ? "bg-blue-500 text-white" : "bg-gray-50 dark:bg-gray-800"
          )}
        >
          <CardContent className="p-3">
            <div className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </div>
            <div
              className={cn(
                "text-xs mt-2 opacity-70",
                isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
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
