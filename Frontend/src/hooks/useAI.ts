import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/lib/api/ai.service";
import { ChatMessage } from "@/types";
import { toast } from "sonner";

// 1. Hook for AI recipe suggestions based on ingredients list
export function useAISuggest() {
  return useMutation({
    mutationFn: (ingredients: string[]) =>
      aiService.suggestRecipes(ingredients),
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to get AI suggestions.";
      toast.error(message);
    },
  });
}

// 2. Hook for AI recipe generation from descriptions
export function useAIGenerate() {
  return useMutation({
    mutationFn: (description: string) => aiService.generateRecipe(description),
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to generate recipe.";
      toast.error(message);
    },
  });
}

// 3. Hook for AI Chat Assistant (with persistence)
export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bitebot_chat_history");
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      } finally {
        setIsInitializing(false);
      }
    }
  }, []);

  // Save chat history to localStorage on change
  useEffect(() => {
    if (!isInitializing && typeof window !== "undefined") {
      localStorage.setItem("bitebot_chat_history", JSON.stringify(messages));
    }
  }, [messages, isInitializing]);

  const chatMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      // 1. Add user message to state optimistically
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageContent,
      };

      setMessages((prev) => [...prev, userMessage]);

      // 2. Prepare payload history (removing UUID for API compatibility)
      const historyPayload = messages.map(({ role, content }) => ({
        role,
        content,
      }));

      // 3. Request bot reply
      const response = await aiService.chatWithAI(
        messageContent,
        historyPayload,
      );
      return response.reply;
    },
    onSuccess: (botReply) => {
      // 4. Add assistant message to state
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botReply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send message.";
      toast.error(message);
    },
  });

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("bitebot_chat_history");
    }
    toast.success("Conversation history cleared.");
  };

  return {
    messages,
    sendMessage: chatMutation.mutate,
    isSending: chatMutation.isPending,
    clearChat,
    isInitializing,
  };
}
