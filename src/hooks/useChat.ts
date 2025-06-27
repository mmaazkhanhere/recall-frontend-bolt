import { useState, useCallback } from "react";
import { queryKnowledgeBase } from "./useKnowledgeBase";
import { ChatMessage } from "../types";

const mockResponses = [
  "Based on the video content, that concept is covered at timestamp 2:45. The key points are...",
  "This topic is discussed in detail around the 5:30 mark. Let me explain the main ideas...",
  "Great question! The video addresses this starting at 1:20. Here's what you need to know...",
  "I can help clarify that. Check out the section at 3:15 where this is explained with examples...",
];

export const useChat = (videoId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const response = await queryKnowledgeBase(videoId!, content);
    const answer = response.response;
    // Simulate AI response

    const assistantMessage: ChatMessage = {
      type: "assistant",
      content: answer,
      timestamp: new Date().toISOString(),
      videoTimestamp: response.start_time,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

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
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    submitFeedback,
    clearChat,
  };
};
