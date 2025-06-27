import { useQuery } from "@tanstack/react-query";
import {
  KnowledgeBase,
  SearchFilters,
  KnowledgeBaseResponse,
  IQueryResponse,
} from "../types";

import axios from "axios";

const API_BASE_URL = "http://20.120.240.103:8000";

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

export const fetchKnowledgeBase = (id: string) => {
  return useQuery({
    queryKey: ["knowledgeBase", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/knowledge-bases/${id}`);
      if (!response.ok) throw new Error("Knowledge base not found");

      // Store the parsed JSON data
      const data: KnowledgeBaseResponse = await response.json();

      // Now you can log and use the actual data
      console.log("Knowledge base response:", data);
      return data;
    },
  });
};

export const queryKnowledgeBase = async (
  knowledge_base_id: string,
  query: string,
  max_results: number = 5
): Promise<IQueryResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, {
      knowledge_base_id,
      query,
      max_results,
    });

    if (response.status !== 200)
      throw new Error("Failed to fetch data from the knowledge base.");

    const data: IQueryResponse = await response.data;
    console.log("Query response:", data);
    return data;
  } catch (error) {
    console.error("Error while querying the knowledge base:", error);
    throw new Error("Failed to fetch data from the knowledge base.");
  }
};
