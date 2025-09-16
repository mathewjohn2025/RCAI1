import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useWhoAmI() {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await api("/api/auth/whoami");
      return response.json();
    },
    staleTime: 60_000,            // longer cache
    refetchOnWindowFocus: false,  // no focus refetch
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: false,
  });
}