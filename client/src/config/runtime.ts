/**
 * Runtime Configuration - Zero Hardcoding Policy
 * All API paths, headers, and enforcement flags from environment
 */

// API Configuration
export const API_CONFIG = {
  // Base paths - configurable via environment
  ADMIN_API_PREFIX: import.meta.env.VITE_ADMIN_API_PREFIX || '/api/admin/',
  AUTH_WHOAMI_ENDPOINT: import.meta.env.VITE_AUTH_WHOAMI_ENDPOINT || '/api/auth/whoami',
  
  // CRITICAL: Unified login route to prevent 404 redirects
  LOGIN_ROUTE: import.meta.env.VITE_LOGIN_ROUTE || '/admin/login',
  
  // Client identification headers - configurable for different environments
  CLIENT_HEADER_NAME: import.meta.env.VITE_API_CLIENT_HEADER || 'x-client-type',
  CLIENT_HEADER_VALUE: import.meta.env.VITE_API_CLIENT_VALUE || 'web-app',
  
  // Enforcement flags
  ENFORCE_SINGLE_API: import.meta.env.VITE_ENFORCE_SINGLE_API === '1',
  REACT_QUERY_DEFAULT_ENABLED: import.meta.env.VITE_REACT_QUERY_DEFAULT_ENABLED === '1',
  
  // Development flags
  DEV_MODE: import.meta.env.DEV,
  ENABLE_FETCH_TRAP: import.meta.env.VITE_ENABLE_FETCH_TRAP === '1',
} as const;

// Security: Remove dangerous dev headers that could leak to production
export const SECURITY_CONFIG = {
  // Never include user impersonation headers in production
  ALLOW_DEV_HEADERS: import.meta.env.DEV && import.meta.env.VITE_ALLOW_DEV_HEADERS === '1',
} as const;