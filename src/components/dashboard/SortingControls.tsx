import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, Clock, Video } from 'lucide-react';

type SortOption = 'title' | 'date' | 'duration' | 'videos';
type SortOrder = 'asc' | 'desc';

interface SortingControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
}

const sortOptions = [
  { value: 'title' as const, label: 'Title', icon: ArrowUpDown },
  { value: 'date' as const, label: 'Date', icon: Calendar },
  { value: 'duration' as const, label: 'Duration', icon: Clock },
  { value: 'videos' as const, label: 'Videos', icon: Video },
];

const SortingControls: React.FC<SortingControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      // Toggle order if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default ascending order
      onSortChange(newSortBy, 'asc');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2"
    >
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      <div className="flex items-center space-x-1">
        {sortOptions.map(({ value, label, icon: Icon }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSortChange(value)}
            className={`relative inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            
            {sortBy === value && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: sortOrder === 'desc' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-1"
              >
                <ArrowUpDown className="h-3 w-3" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SortingControls;