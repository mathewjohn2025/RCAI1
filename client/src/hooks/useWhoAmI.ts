import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useWhoAmI() {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: () => api("/api/auth/whoami"),
    staleTime: 60_000,
    refetchOnWindowFocus: false,   // <-- prevent flicker on focus
    refetchOnReconnect: false,
  });
}