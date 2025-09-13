import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG } from "@/config/runtime";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// SPECIFICATION: useAuthedQuery helper - requires explicit enabled flag
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuthedQuery<T = unknown>(options: UseQueryOptions<T> & { 
  queryKey: string[];
  url: string; // REQUIRED: Actual API endpoint URL (no hardcoding in helper)
  enabled: boolean; // REQUIRED: Must explicitly enable
}) {
  return useQuery<T>({
    ...options,
    queryFn: async (): Promise<T> => {
      // SPECIFICATION: Use provided URL, queryKey is purely for cache identification
      const response = await api(options.url);
      return await response.json() as T;
    },
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // SPECIFICATION: Default enabled: false (no silent calls)
      enabled: API_CONFIG.REACT_QUERY_DEFAULT_ENABLED,
      // SPECIFICATION: Remove default queryFn to prevent bypasses
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: 0,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Cache busting for AI endpoint migration
export const persistOptions = {
  buster: '2025-09-08-ai-endpoint-migration-2'
};
