import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff } from 'lucide-react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ 
  onSubmit, 
  disabled = false,
  placeholder = "Ask a question about the video..." 
}) => {
  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQuestion(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      }
    } else {
      setIsListening(false);
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
          disabled={disabled}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
        
        {/* Voice Input Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleVoiceInput}
          disabled={disabled}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isListening
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Send Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={!question.trim() || disabled}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </motion.form>
  );
};

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default QuestionInput;