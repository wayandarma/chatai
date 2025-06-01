import { useState, useCallback, useRef } from "react";
import { GeminiService, ChatMessage, createChatMessage } from "@/lib/gemini";

export interface UseChatOptions {
  apiKey: string;
  model?: string;
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useChat(options: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const geminiServiceRef = useRef<GeminiService | null>(null);
  const lastUserMessageRef = useRef<string>("");

  // Initialize Gemini service
  const getGeminiService = useCallback(() => {
    if (!geminiServiceRef.current) {
      try {
        geminiServiceRef.current = new GeminiService({
          apiKey: options.apiKey,
          model: options.model,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to initialize Gemini service";
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));
        return null;
      }
    }
    return geminiServiceRef.current;
  }, [options.apiKey, options.model, options.onError]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const geminiService = getGeminiService();
      if (!geminiService) return;

      setIsLoading(true);
      setError(null);
      lastUserMessageRef.current = message;

      // Add user message
      const userMessage = createChatMessage("user", message);
      setMessages((prev) => [...prev, userMessage]);

      try {
        // Get conversation history for context
        const conversationHistory = messages;

        // Generate AI response
        const response = await geminiService.generateResponse(
          message,
          conversationHistory
        );

        // Add AI response
        const aiMessage = createChatMessage("assistant", response);
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));

        // Remove the user message if AI response failed
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, getGeminiService, options.onError]
  );

  const retryLastMessage = useCallback(async () => {
    if (!lastUserMessageRef.current || isLoading) return;

    // Remove the last message if it was an error
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === "user") {
        return prev.slice(0, -1);
      }
      return prev;
    });

    await sendMessage(lastUserMessageRef.current);
  }, [sendMessage, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = "";
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}
