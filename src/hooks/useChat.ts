import { useState, useCallback } from "react";
import { queryKnowledgeBase } from "./useKnowledgeBase";
import { submitQueryFeedback } from "./useQueryFeedback";
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
        // Store original query and knowledge base ID for feedback
        originalQuery: content,
        knowledgeBaseId: videoId,
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
    async (
      messageId: string,
      feedback: "positive" | "negative",
      comment?: string
    ) => {
      // Find the message to get the required data
      const message = messages.find(msg => msg.id === messageId);
      if (!message || message.type !== "assistant" || !message.originalQuery || !message.knowledgeBaseId) {
        console.error("Cannot submit feedback: missing required message data");
        return;
      }

      // Optimistically update UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, feedback, feedbackComment: comment }
            : msg
        )
      );

      try {
        // Submit feedback to API
        const result = await submitQueryFeedback({
          knowledge_base_id: message.knowledgeBaseId,
          query: message.originalQuery,
          response: message.content,
          thumbs_up: feedback === "positive",
          comments: comment,
        });

        if (result.success) {
          console.log("Query feedback submitted successfully");
          // Show success message (you could add a toast notification here)
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Failed to submit query feedback:", error);
        
        // Revert UI changes on error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, feedback: undefined, feedbackComment: undefined }
              : msg
          )
        );
        
        // You could show an error toast here
        alert("Failed to submit feedback. Please try again.");
      }
    },
    [messages]
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