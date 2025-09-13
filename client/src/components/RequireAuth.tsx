import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, clearAuthState } from '@/lib/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

// Specification: Route guard that waits for getSession() before rendering
export default function RequireAuth({ children }: RequireAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    }
    
    checkAuth();
  }, []);

  // Wait for session check to complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnUrl}`} replace />;
  }

  // Render children only after authentication confirmed
  return <>{children}</>;
}