import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
  setIsVoiceInput: Dispatch<SetStateAction<boolean>>;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "Ask a question about the video...",
  setIsVoiceInput,
}) => {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const apiKey = "sk_667baab04117c3e8d96ca9e27be53aa0a1e680646b3cdf41";

  useEffect(() => {
    return () => {
      // Cleanup on unmount
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
  }, []);

  const getSupportedMimeType = () => {
    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];

    return (
      mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ||
      "audio/webm"
    );
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000,
      });
      
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
          
          // Convert to supported format if needed
          const processedBlob = await convertToSupportedFormat(audioBlob, mimeType);
          const text = await transcribeAudio(processedBlob);
          
          if (text.trim()) {
            setQuestion(text);
            // Auto-submit the transcribed text
            setTimeout(() => {
              onSubmit(text.trim());
              setQuestion("");
            }, 500);
          } else {
            setError("No speech detected. Please try again.");
          }
        } catch (error) {
          console.error("Transcription error:", error);
          setError("Failed to transcribe audio. Please try again.");
        } finally {
          setIsTranscribing(false);
          setIsVoiceInput(false);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording failed. Please try again.");
        setIsListening(false);
        setIsVoiceInput(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsListening(true);
      setIsVoiceInput(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Microphone access denied. Please allow microphone access and try again.");
      setIsListening(false);
      setIsVoiceInput(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  };

  const convertToSupportedFormat = async (audioBlob: Blob, mimeType: string): Promise<Blob> => {
    // If it's already in a supported format, return as is
    if (mimeType.includes('mp3') || mimeType.includes('wav') || mimeType.includes('flac') || mimeType.includes('ogg')) {
      return audioBlob;
    }

    // For webm, we'll send it directly as ElevenLabs supports it
    // If conversion is needed, you would implement audio conversion here
    return audioBlob;
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    if (!apiKey) {
      throw new Error("ElevenLabs API key is not configured");
    }

    const formData = new FormData();
    
    // Create a file with proper extension
    const fileName = `audio.${audioBlob.type.includes('webm') ? 'webm' : 'wav'}`;
    const audioFile = new File([audioBlob], fileName, { type: audioBlob.type });
    
    formData.append('file', audioFile);
    formData.append('model_id', 'whisper-1');

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        throw new Error(`Speech-to-text failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please check your connection and try again.');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled && !isTranscribing) {
      onSubmit(question.trim());
      setQuestion("");
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    setError(null);
  };

  return (
    <div className="space-y-2">
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
            onChange={handleInputChange}
            placeholder={isListening ? "Listening..." : isTranscribing ? "Transcribing..." : placeholder}
            disabled={disabled || isTranscribing || isListening}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleMicClick}
            disabled={disabled}
            className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              isListening
                ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                : isTranscribing
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : error
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            ) : error ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!question.trim() || disabled || isTranscribing || isListening}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </motion.form>

      {/* Status Messages */}
      <AnimatePresence>
        {(isListening || isTranscribing || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs px-2"
          >
            {isListening && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span>Recording... Release to stop and transcribe</span>
              </div>
            )}
            {isTranscribing && (
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Transcribing your speech...</span>
              </div>
            )}
            {error && (
              <div className="text-orange-600 dark:text-orange-400">
                <span>{error}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionInput;