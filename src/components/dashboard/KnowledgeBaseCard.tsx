import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { KnowledgeBase } from '../../types';

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  index: number;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({ knowledgeBase, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={knowledgeBase.thumbnail}
          alt={knowledgeBase.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 transition-transform duration-300 group-hover:translate-y-[-4px]">
            {knowledgeBase.title}
          </h3>
        </div>

        {/* Hover Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <Link
            to={`/kb/${knowledgeBase.id}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-white/90 backdrop-blur-sm px-6 py-3 text-sm font-medium text-black transition-all hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
          >
            <span>Open Knowledge Base</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default KnowledgeBaseCard;