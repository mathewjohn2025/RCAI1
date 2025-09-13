/**
 * SPECIFICATION: Router loader - no mount until auth confirmed
 * Prevents any admin components from mounting before authentication verified
 */
import React, { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth';
import { API_CONFIG } from '@/config/runtime';

interface AdminRouteLoaderProps {
  children: React.ReactNode;
}

export default function AdminRouteLoader({ children }: AdminRouteLoaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('[AdminRouteLoader] Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  // SPECIFICATION: No mount until auth confirmed
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login without mounting children
    const currentPath = window.location.pathname + window.location.search;
    const returnUrl = encodeURIComponent(currentPath);
    window.location.href = `/admin/login?returnTo=${returnUrl}`;
    return null;
  }

  // SPECIFICATION: Only mount children after auth confirmed
  return <>{children}</>;
}