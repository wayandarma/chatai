"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { ModelSelector } from "@/components/ui/model-selector";
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
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  } = useChat({
    apiKey: currentApiKey,
    model: selectedModel,
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4">
          <DarkModeToggle />
        </div>
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-gray-100">
              Configure Gemini API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="apiKey"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Gemini API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                onKeyDown={(e) => e.key === "Enter" && handleApiKeySubmit()}
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Get your API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-gray-100 hover:underline"
              >
                Google AI Studio
              </a>
            </div>
            <Button
              onClick={handleApiKeySubmit}
              disabled={!tempApiKey.trim()}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
            >
              Start Chatting
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            AI Chat Assistant
          </h1>
          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-200">
            {selectedModel
              .replace("gemini-", "Gemini ")
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
            className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            API Key
          </Button>

          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={retryLastMessage}
            className="ml-auto gap-1 text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
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

      {/* Model Selector */}
      <div className="px-4 pb-2">
        <div className="flex justify-center">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
    </div>
  );
}
