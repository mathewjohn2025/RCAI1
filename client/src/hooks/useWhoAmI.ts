import { useQuery } from "@tanstack/react-query";

export function useWhoAmI() {
  return useQuery({
    queryKey: ['whoami'],
    queryFn: () => fetch('/api/auth/whoami', { credentials: 'include' }).then(r => r.json()),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  });
}