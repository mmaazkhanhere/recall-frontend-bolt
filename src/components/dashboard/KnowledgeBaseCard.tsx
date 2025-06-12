import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Play, Tag } from 'lucide-react';
import { KnowledgeBase } from '../../types';

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  index: number;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({ knowledgeBase, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={knowledgeBase.thumbnail}
          alt={knowledgeBase.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        
        {/* Play Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 backdrop-blur-sm">
            <Play className="ml-0.5 h-5 w-5" />
          </div>
        </motion.div>

        {/* Video Count Badge */}
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {knowledgeBase.videoCount} videos
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="mb-2 text-lg font-semibold text-card-foreground line-clamp-2">
            {knowledgeBase.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {knowledgeBase.description}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1">
          {knowledgeBase.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-secondary/20 px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </span>
          ))}
          {knowledgeBase.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              +{knowledgeBase.tags.length - 3}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {formatDuration(knowledgeBase.totalDuration)}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(knowledgeBase.updatedAt)}
          </div>
        </div>

        {/* Action */}
        <Link
          to={`/kb/${knowledgeBase.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Open Knowledge Base
        </Link>
      </div>
    </motion.div>
  );
};

export default KnowledgeBaseCard;