import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useWhoAmI() {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await api("/api/auth/whoami");
      return response.json();
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,   // <-- prevent flicker on focus
    refetchOnReconnect: false,
  });
}