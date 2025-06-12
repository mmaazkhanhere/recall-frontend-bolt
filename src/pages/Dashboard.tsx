import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Grid, List } from 'lucide-react';
import { useKnowledgeBases } from '../hooks/useKnowledgeBase';
import { SearchFilters } from '../types';
import KnowledgeBaseCard from '../components/dashboard/KnowledgeBaseCard';
import SearchBar from '../components/dashboard/SearchBar';
import SortingControls from '../components/dashboard/SortingControls';

type ViewMode = 'grid' | 'list';
type SortOption = 'title' | 'date' | 'duration' | 'videos';
type SortOrder = 'asc' | 'desc';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    dateRange: {},
    duration: {}
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const { data: knowledgeBases, isLoading, error } = useKnowledgeBases(filters);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const sortedKnowledgeBases = React.useMemo(() => {
    if (!knowledgeBases) return [];
    
    return [...knowledgeBases].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'duration':
          comparison = a.totalDuration - b.totalDuration;
          break;
        case 'videos':
          comparison = a.videoCount - b.videoCount;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [knowledgeBases, sortBy, sortOrder]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
        <p className="text-muted-foreground">Please try again later.</p>
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
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Bases</h1>
            <p className="text-muted-foreground">
              Manage and explore your video knowledge bases
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Controls */}
      <div className="mb-8 space-y-4">
        <SearchBar
          onSearch={handleSearch}
          onFilterToggle={() => setShowFilters(!showFilters)}
          placeholder="Search knowledge bases..."
        />
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <SortingControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex rounded-lg border">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center rounded-l-lg px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center rounded-r-lg px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 rounded-xl bg-muted mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Knowledge Bases Grid */}
      {!isLoading && sortedKnowledgeBases && (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
        }>
          {sortedKnowledgeBases.map((kb, index) => (
            <KnowledgeBaseCard
              key={kb.id}
              knowledgeBase={kb}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedKnowledgeBases?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No knowledge bases found</h3>
          <p className="text-muted-foreground mb-6">
            {filters.query ? 'Try adjusting your search terms' : 'Create your first knowledge base to get started'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Create Knowledge Base</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;