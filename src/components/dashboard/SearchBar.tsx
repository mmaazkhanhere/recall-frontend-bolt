import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterToggle, 
  placeholder = "Search knowledge bases..." 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-2"
    >
      {/* Search Input */}
      <div className={`relative flex-1 transition-all ${isFocused ? 'scale-[1.02]' : ''}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onFilterToggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Toggle filters"
      >
        <Filter className="h-4 w-4" />
      </motion.button>
    </motion.form>
  );
};

export default SearchBar;