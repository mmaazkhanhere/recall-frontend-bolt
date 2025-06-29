import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { ChatMessage } from "../../types";
import FeedbackModal from "./FeedbackModal";
import { getPublicVideoUrl } from "../../uitls/getPublicImageUrl";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onTimestampClick?: (timestamp: number, videoPath?: string) => void;
  onFeedback?: (
    messageId: string,
    feedback: "positive" | "negative",
    comment?: string
  ) => void;
  isVoiceInput: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onTimestampClick,
  onFeedback,
  isVoiceInput,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    messageId: string;
  }>({ isOpen: false, messageId: "" });

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const currentObjectUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSpokenMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isVoiceInput) return;

    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      lastMessage.type !== "assistant" ||
      lastMessage.content === lastSpokenMessageRef.current
    )
      return;

    speakText(lastMessage.content);
    lastSpokenMessageRef.current = lastMessage.content;

    return () => {
      // Cleanup on unmount or dependency change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [messages, isVoiceInput]);

  const speakText = async (text: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const apiKey = "";

    if (!apiKey) {
      console.error("ElevenLabs API key is not set");
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?optimize_streaming_latency=0`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0,
              similarity_boost: 0,
            },
          }),
          signal: abortController.signal,
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();

      // Clean up previous URL
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(audioBlob);
      currentObjectUrlRef.current = objectUrl;

      audioRef.current.src = objectUrl;
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("TTS Error:", error);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: number): string => {
    const totalSeconds = Math.floor(timestamp);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePositiveFeedback = (messageId: string) => {
    onFeedback?.(messageId, "positive");
  };

  const handleNegativeFeedback = (messageId: string) => {
    setFeedbackModal({ isOpen: true, messageId });
  };

  const handleFeedbackSubmit = (comment: string) => {
    onFeedback?.(feedbackModal.messageId, "negative", comment);
    setFeedbackModal({ isOpen: false, messageId: "" });
  };

  const handleFeedbackCancel = () => {
    setFeedbackModal({ isOpen: false, messageId: "" });
  };

  const handleTimestampClick = (message: ChatMessage) => {
    if (message.videoTimestamp !== undefined && onTimestampClick) {
      const videoPath = message.videoPath ? getPublicVideoUrl(message.videoPath) : undefined;
      onTimestampClick(message.videoTimestamp, videoPath);
    }
  };

  return (
    <>
      <div className="flex h-96 flex-col overflow-hidden rounded-lg border bg-card">
        {/* Header */}
        <div className="border-b bg-muted/50 px-4 py-2">
          <h3 className="text-sm font-medium text-card-foreground">
            AI Assistant
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2 ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col space-y-2">
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {/* Timestamp Link */}
                      {message.videoTimestamp !== undefined &&
                        onTimestampClick && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTimestampClick(message)}
                            className="mt-2 inline-flex items-center space-x-1 rounded bg-primary/20 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/30"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>
                              Jump to {formatTime(message.videoTimestamp!)}
                            </span>
                          </motion.button>
                        )}

                      <div className="mt-1 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Feedback Buttons for Assistant Messages */}
                    {message.type === "assistant" && onFeedback && (
                      <div className="flex items-center space-x-2 px-1">
                        <span className="text-xs text-muted-foreground">
                          Was this helpful?
                        </span>
                        <div className="flex space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePositiveFeedback(message.id || `${index}`)}
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                              message.feedback === "positive"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "text-muted-foreground hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNegativeFeedback(message.id || `${index}`)}
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                              message.feedback === "negative"
                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                : "text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onSubmit={handleFeedbackSubmit}
        onCancel={handleFeedbackCancel}
      />
    </>
  );
};

export default ChatInterface;