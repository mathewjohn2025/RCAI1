import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// EXACT SPECIFICATION: AdminGate blocks render until authentication confirmed
const AdminGate = () => {
  const loc = useLocation();
  const { data, isLoading } = useQuery({
    queryKey: ['whoami'],
    queryFn: () => fetch('/api/auth/whoami', { credentials:'include' }).then(r => r.json()),
    staleTime: 0,
    gcTime: 0, // cacheTime renamed to gcTime in v5
    refetchOnMount: 'always'
  });

  if (isLoading) return null; // or spinner; DO NOT render admin shell yet
  if (!data?.user) {
    return <Navigate to={`/admin/login?returnTo=${encodeURIComponent(loc.pathname+loc.search)}`} replace />;
  }
  return <Outlet/>;
};

export default AdminGate;