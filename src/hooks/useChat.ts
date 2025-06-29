import { useState, useCallback } from "react";
import { queryKnowledgeBase } from "./useKnowledgeBase";
import { ChatMessage } from "../types";

export const useChat = (videoId?: string, onVideoUpdate?: (videoPath: string, timestamp: number) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingResponse("");

    try {
      // Start the API call
      const responsePromise = queryKnowledgeBase(videoId!, content);
      
      // Immediately show loading state with streaming effect
      const loadingMessage: ChatMessage = {
        id: `loading-${Date.now()}`,
        type: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, loadingMessage]);

      // Simulate streaming response for better UX
      const streamingTexts = [
        "Analyzing your question...",
        "Searching through video content...",
        "Finding relevant moments...",
        "Preparing response..."
      ];

      let streamIndex = 0;
      const streamInterval = setInterval(() => {
        if (streamIndex < streamingTexts.length) {
          setStreamingResponse(streamingTexts[streamIndex]);
          streamIndex++;
        }
      }, 300);

      // Wait for actual API response
      const response = await responsePromise;
      
      // Clear streaming simulation
      clearInterval(streamInterval);
      setStreamingResponse("");

      // Immediately update video if callback provided (proactive loading)
      if (onVideoUpdate && response.video_path && response.start_time !== undefined) {
        onVideoUpdate(response.video_path, response.start_time);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
        videoTimestamp: response.start_time,
        videoPath: response.video_path,
      };

      // Replace loading message with actual response
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === loadingMessage.id ? assistantMessage : msg
        )
      );

    } catch (error) {
      console.error("Error querying knowledge base:", error);
      
      // Clear any streaming state
      setStreamingResponse("");
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => 
        prev.map(msg => 
          msg.id?.startsWith('loading-') ? errorMessage : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [videoId, onVideoUpdate]);

  const submitFeedback = useCallback(
    (
      messageId: string,
      feedback: "positive" | "negative",
      comment?: string
    ) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? { ...message, feedback, feedbackComment: comment }
            : message
        )
      );

      // Here you would typically send the feedback to your backend
      console.log("Feedback submitted:", { messageId, feedback, comment });

      // You could also show a toast notification here
      if (feedback === "positive") {
        console.log("Thank you for your positive feedback!");
      } else {
        console.log(
          "Thank you for your feedback. We'll use it to improve our responses."
        );
      }
    },
    []
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingResponse("");
  }, []);

  return {
    messages,
    isLoading,
    streamingResponse,
    sendMessage,
    submitFeedback,
    clearChat,
  };
};