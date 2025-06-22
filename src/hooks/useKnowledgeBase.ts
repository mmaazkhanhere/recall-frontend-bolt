import { useQuery } from "@tanstack/react-query";
import { KnowledgeBase, SearchFilters, KnowledgeBaseResponse } from "../types";

const API_BASE_URL = "http://20.120.240.103:8000/knowledge-bases";

export const useKnowledgeBases = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ["knowledgeBases", filters],
    queryFn: async () => {
      const url = new URL(API_BASE_URL);

      // Add query parameters
      if (filters) {
        if (filters.query) url.searchParams.append("query", filters.query);
        if (filters.tags.length) {
          filters.tags.forEach((tag) => url.searchParams.append("tags", tag));
        }
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Network response was not ok");

      return response.json() as Promise<KnowledgeBase[]>;
    },
  });
};

export const useKnowledgeBase = (id: string) => {
  return useQuery({
    queryKey: ["knowledgeBase", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error("Knowledge base not found");

      // Store the parsed JSON data
      const data: KnowledgeBaseResponse = await response.json();

      // Now you can log and use the actual data
      console.log("Knowledge base response:", data);
      return data;
    },
  });
};
