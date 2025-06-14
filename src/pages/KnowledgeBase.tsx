import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { useChat } from '../hooks/useChat';
import VideoPlayer from '../components/kb/VideoPlayer';
import ChatInterface from '../components/kb/ChatInterface';
import QuestionInput from '../components/kb/QuestionInput';

const KnowledgeBase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: knowledgeBase, isLoading, error } = useKnowledgeBase(id!);
  const { messages, isLoading: isChatLoading, sendMessage, submitFeedback } = useChat(id);
  const [currentVideo] = useState({
    id: '1',
    title: 'Introduction to Machine Learning',
    url: '#',
    duration: 600
  });

  const handleTimestampClick = (timestamp: number) => {
    // This would normally seek the video to the specific timestamp
    console.log('Seeking to timestamp:', timestamp);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative', comment?: string) => {
    submitFeedback(messageId, feedback, comment);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !knowledgeBase) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Knowledge Base Not Found</h2>
        <p className="text-muted-foreground mb-6">The knowledge base you're looking for doesn't exist.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {knowledgeBase.title}
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <VideoPlayer
            src={currentVideo.url}
            title={currentVideo.title}
            onTimeUpdate={handleTimestampClick}
          />
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Ask Questions</h3>
            <ChatInterface
              messages={messages}
              isLoading={isChatLoading}
              onTimestampClick={handleTimestampClick}
              onFeedback={handleFeedback}
            />
          </div>
          
          <QuestionInput
            onSubmit={sendMessage}
            disabled={isChatLoading}
            placeholder="Ask about this video..."
          />
        </motion.div>
      </div>
    </div>
  );
};

export default KnowledgeBase;