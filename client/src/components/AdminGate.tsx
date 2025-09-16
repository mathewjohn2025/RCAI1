import { useLocation, Navigate } from 'react-router-dom';
import { useWhoAmI } from '../hooks/useWhoAmI';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { data: me, isLoading } = useWhoAmI(); // credentials:'include' already set

  if (isLoading) return null; // <- NO redirect while loading
  if (!me?.authenticated) {
    const rt = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/admin/login?returnTo=${rt}`} replace />;
  }
  return <>{children}</>;
}