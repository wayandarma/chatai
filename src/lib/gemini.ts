import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error("Gemini API key is required");
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || "gemini-2.0-flash";
  }

  async generateResponse(
    message: string,
    conversationHistory?: ChatMessage[]
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      // Build conversation context if history is provided
      let prompt = message;
      if (conversationHistory && conversationHistory.length > 0) {
        const context = conversationHistory
          .slice(-10) // Keep last 10 messages for context
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n");
        prompt = `Previous conversation:\n${context}\n\nUser: ${message}`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return text;
    } catch (error) {
      console.error("Error generating response:", error);

      if (error instanceof Error) {
        if (error.message.includes("API_KEY_INVALID")) {
          throw new Error("Invalid API key. Please check your Gemini API key.");
        }
        if (error.message.includes("QUOTA_EXCEEDED")) {
          throw new Error("API quota exceeded. Please try again later.");
        }
        if (error.message.includes("RATE_LIMIT_EXCEEDED")) {
          throw new Error(
            "Rate limit exceeded. Please wait a moment before trying again."
          );
        }
      }

      throw new Error("Failed to generate response. Please try again.");
    }
  }

  async streamResponse(
    message: string,
    conversationHistory?: ChatMessage[]
  ): Promise<ReadableStream<string>> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });

      let prompt = message;
      if (conversationHistory && conversationHistory.length > 0) {
        const context = conversationHistory
          .slice(-10)
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n");
        prompt = `Previous conversation:\n${context}\n\nUser: ${message}`;
      }

      const result = await model.generateContentStream(prompt);

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                controller.enqueue(chunkText);
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } catch (error) {
      console.error("Error streaming response:", error);
      throw new Error("Failed to stream response. Please try again.");
    }
  }
}

// Utility function to create a new chat message
export function createChatMessage(
  role: "user" | "assistant",
  content: string
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}
