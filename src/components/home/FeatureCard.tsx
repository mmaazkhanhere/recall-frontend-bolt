import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-8 transition-all hover:bg-muted/30"
    >
      {/* Icon */}
      <div className="mb-6 flex h-12 w-12 items-center justify-center">
        <Icon className="h-6 w-6 text-foreground transition-transform group-hover:scale-110" />
      </div>

      {/* Content */}
      <h3 className="mb-3 text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">{description}</p>

      {/* Minimal hover indicator */}
      <div className="absolute bottom-0 left-8 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-12"></div>
    </motion.div>
  );
};

export default FeatureCard;