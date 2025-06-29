import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "Ask a question about the video...",
}) => {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const elevenLabsClientRef = useRef<ElevenLabsClient | null>(null);
  const [error, setError] = useState<boolean>(false);

  const apiKey = "";

  useEffect(() => {
    // Initialize ElevenLabs client
    elevenLabsClientRef.current = new ElevenLabsClient({ apiKey });

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [apiKey]);

  const getSupportedMimeType = () => {
    const mimeTypes = [
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
      "audio/aac",
      "audio/mpeg",
    ];

    return (
      mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ||
      "audio/webm"
    ); // Default to webm
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType,
          });
          const text = await transcribeAudio(audioBlob);
          setQuestion(text);
        } catch (error) {
          console.error("Transcription error:", error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsListening(false);
      setError(true);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    if (!elevenLabsClientRef.current) {
      throw new Error("ElevenLabs client not initialized");
    }

    const transcription =
      await elevenLabsClientRef.current.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1",
        tagAudioEvents: false, // Disable audio events tagging for simplicity
        languageCode: "eng", // Set to null for auto-detection if needed
        diarize: false, // Disable diarization for single speaker
      });

    return transcription.text;
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex space-x-2"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isTranscribing}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleVoiceInput}
          disabled={disabled || isTranscribing}
          className={`absolute right-2 top-0 -translate-y-1/2 flex items-center justify-center rounded-md p-1.5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50
          ${
            isListening && !error
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : error
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          style={{ width: 36, height: 36 }} // fixed size to prevent displacement
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4" />
          ) : error ? (
            <MicOff className="h-4 w-4" />
          ) : isListening ? (
            <Mic className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={!question.trim() || disabled || isTranscribing}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </motion.form>
  );
};

export default QuestionInput;
