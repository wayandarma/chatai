"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { AlertCircle, Trash2, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  apiKey: string;
}

export function ChatInterface({ apiKey }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  } = useChat({
    apiKey: currentApiKey,
    model: "gemini-2.0-flash",
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApiKeySubmit = () => {
    if (tempApiKey.trim()) {
      setCurrentApiKey(tempApiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentApiKey) {
      setShowApiKeyInput(true);
      return;
    }
    await sendMessage(message);
  };

  if (showApiKeyInput) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Configure Gemini API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                Gemini API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                onKeyDown={(e) => e.key === "Enter" && handleApiKeySubmit()}
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Get your API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
            </div>
            <Button
              onClick={handleApiKeySubmit}
              disabled={!tempApiKey.trim()}
              className="w-full"
            >
              Start Chatting
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
            Gemini 2.0 Flash
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            API Key
          </Button>

          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={retryLastMessage}
            className="ml-auto gap-1 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Welcome to AI Chat Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!currentApiKey}
        placeholder={
          currentApiKey
            ? "Type your message..."
            : "Please configure your API key first"
        }
      />
    </div>
  );
}
