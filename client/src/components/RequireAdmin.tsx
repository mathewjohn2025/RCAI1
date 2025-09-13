import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_ROUTES } from "@/config/apiEndpoints";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { data, isLoading } = useQuery({
    queryKey: ['whoami'],
    queryFn: () => fetch('/api/auth/whoami', { credentials: 'include' }).then(r => r.json()),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  });

  if (isLoading) return null; // or a spinner—NO admin layout yet
  if (!data?.user) {
    return <Navigate to={`${ADMIN_ROUTES.LOGIN}?returnTo=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  }
  
  // ✅ Only here will the lazy admin components import and render
  return <>{children}</>;
}