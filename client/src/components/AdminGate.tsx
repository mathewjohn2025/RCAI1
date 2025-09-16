import { useLocation, useNavigate } from 'react-router-dom';
import { useWhoAmI } from '../hooks/useWhoAmI';
import { useEffect, useRef } from 'react';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: me, isLoading } = useWhoAmI();
  const didRedirect = useRef(false);

  // SINGLE redirector - waits for whoami, redirects once
  useEffect(() => {
    if (!isLoading && !me?.authenticated && !didRedirect.current) {
      didRedirect.current = true;
      const rt = encodeURIComponent(location.pathname + location.search + location.hash);
      navigate(`/admin/login?returnTo=${rt}`, { replace: true });
    }
  }, [isLoading, me?.authenticated, location, navigate]);

  if (isLoading) return null; // <- NO redirect while loading
  if (!me?.authenticated) return null; // <- Wait for redirect
  return <>{children}</>;
}