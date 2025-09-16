import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useWhoAmI() {
  return useQuery({
    queryKey: ['whoami'],
    queryFn: () => fetch('/api/admin/whoami', { credentials: 'include' }).then(res => res.json()),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: false,
  });
}