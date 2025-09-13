/**
 * UNIVERSAL API CLIENT - ZERO HARDCODING ENFORCEMENT
 * All network calls must go through this client
 */

// Preflight authentication check for admin endpoints - NO CACHING
async function checkAdminAuth(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/whoami', { credentials: 'include' });
    if (!res.ok) {
      return false;
    }
    
    const data = await res.json();
    return data?.authenticated && data?.isAdmin;
  } catch (error) {
    return false;
  }
}

export async function api(path: string, init?: RequestInit): Promise<Response> {
  // CRITICAL: Preflight guard for admin endpoints  
  if (path.includes('/admin/')) {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      // Block unauthorized admin API calls and redirect to login
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
      window.location.href = `/admin/login?returnTo=${returnTo}`;
      throw new Error('Unauthorized access to admin endpoint - redirecting to login');
    }
  }

  const res = await fetch(`/api${path}`, { cache: "no-store", credentials: "include", ...init });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

// Convenience methods
export async function apiGet(path: string): Promise<Response> {
  return api(path, { method: 'GET' });
}

export async function apiPost(path: string, data?: any): Promise<Response> {
  return api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined
  });
}

export async function apiPut(path: string, data?: any): Promise<Response> {
  return api(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined
  });
}

export async function apiDelete(path: string): Promise<Response> {
  return api(path, { method: 'DELETE' });
}