import { useState, useCallback, useEffect, useRef } from "react";
import { queryKnowledgeBase } from "./useKnowledgeBase";
import { submitQueryFeedback } from "./useQueryFeedback";
import { ChatMessage } from "../types";

const API_BASE_URL = "https://api.videoindex.app";

export const useChat = (
  videoId?: string,
  onVideoUpdate?: (videoPath: string, timestamp: number) => void
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!videoId) return;

      // Cancel any ongoing request
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const userMessage: ChatMessage = {
        type: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const loadingMessage: ChatMessage = {
        id: `loading-${Date.now()}`,
        type: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        originalQuery: content,
        knowledgeBaseId: videoId,
      };

      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await fetch(`${API_BASE_URL}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            knowledge_base_id: videoId,
            query: content,
            max_results: 5,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";
        let videoPath = "";
        let startTime = 0;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (abortController.signal.aborted) return;

          const chunk = decoder.decode(value);
          const jsonObjects = chunk
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (e) {
                console.error("Error parsing JSON chunk", e);
                return null;
              }
            })
            .filter(Boolean);

          for (const data of jsonObjects) {
            // Update video if needed (only once)
            if (
              onVideoUpdate &&
              !videoPath &&
              data.video_path &&
              data.start_time !== undefined
            ) {
              videoPath = data.video_path;
              startTime = data.start_time;
              onVideoUpdate(videoPath, startTime);
            }

            // Accumulate response tokens
            if (data.response) {
              accumulatedResponse += data.response;
            }

            // Update assistant message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === loadingMessage.id
                  ? {
                      ...msg,
                      content: accumulatedResponse,
                      videoPath: videoPath || msg.videoPath,
                      videoTimestamp: startTime || msg.videoTimestamp,
                    }
                  : msg
              )
            );
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
          return;
        }

        console.error("Error querying knowledge base:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? {
                  ...msg,
                  content:
                    "I'm sorry, I encountered an error. Please try again.",
                }
              : msg
          )
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      }
    },
    [videoId, onVideoUpdate]
  );

  const submitFeedback = useCallback(
    async (
      messageId: string,
      feedback: "positive" | "negative",
      comment?: string
    ) => {
      // Find the message to get the required data
      const message = messages.find((msg) => msg.id === messageId);
      if (
        !message ||
        message.type !== "assistant" ||
        !message.originalQuery ||
        !message.knowledgeBaseId
      ) {
        console.error("Cannot submit feedback: missing required message data", {
          messageFound: !!message,
          isAssistant: message?.type === "assistant",
          hasOriginalQuery: !!message?.originalQuery,
          hasKnowledgeBaseId: !!message?.knowledgeBaseId,
          message: message,
        });
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
        // Prepare the feedback data with proper validation
        const feedbackData = {
          knowledge_base_id: parseInt(message.knowledgeBaseId, 10), // Convert to integer
          query: message.originalQuery,
          response: message.content,
          thumbs_up: feedback === "positive", // Required boolean field
          // Only include comments if provided and not empty
          ...(comment && comment.trim() && { comments: comment.trim() }),
        };

        // Validate the knowledge_base_id is a valid integer
        if (isNaN(feedbackData.knowledge_base_id)) {
          throw new Error(
            `Invalid knowledge base ID: ${message.knowledgeBaseId}`
          );
        }

        console.log("Submitting feedback with data:", feedbackData);

        // Submit feedback to API
        const result = await submitQueryFeedback(feedbackData);

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
