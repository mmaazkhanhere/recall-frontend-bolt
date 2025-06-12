import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KnowledgeBase, SearchFilters } from '../types';

// Mock data for development
const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    description: 'Comprehensive course covering the basics of machine learning algorithms and applications.',
    videoCount: 24,
    totalDuration: 1440, // 24 hours
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
    tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'React Advanced Patterns',
    description: 'Deep dive into advanced React patterns, hooks, and performance optimization techniques.',
    videoCount: 18,
    totalDuration: 1080, // 18 hours
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    title: 'Cloud Architecture Best Practices',
    description: 'Learn how to design scalable and secure cloud architectures using modern practices.',
    videoCount: 30,
    totalDuration: 2100, // 35 hours
    thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=500',
    tags: ['Cloud Computing', 'AWS', 'Architecture', 'DevOps'],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  }
];

export const useKnowledgeBases = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['knowledgeBases', filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filtered = [...mockKnowledgeBases];
      
      if (filters?.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(kb => 
          kb.title.toLowerCase().includes(query) ||
          kb.description.toLowerCase().includes(query) ||
          kb.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      if (filters?.tags.length) {
        filtered = filtered.filter(kb =>
          filters.tags.some(tag => kb.tags.includes(tag))
        );
      }
      
      return filtered;
    },
  });
};

export const useKnowledgeBase = (id: string) => {
  return useQuery({
    queryKey: ['knowledgeBase', id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockKnowledgeBases.find(kb => kb.id === id);
    },
  });
};

export const useCreateKnowledgeBase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KnowledgeBase, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newKB: KnowledgeBase = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newKB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    },
  });
};