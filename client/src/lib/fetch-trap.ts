/**
 * Global Fetch Trap - Catches unauthorized admin API calls
 * Enabled only in development via environment flag
 */
import { API_CONFIG } from '@/config/runtime';

let trapInstalled = false;

export function installFetchTrap() {
  // Only install once and only if enabled
  if (trapInstalled || !API_CONFIG.ENABLE_FETCH_TRAP) {
    return;
  }

  const originalFetch = window.fetch;
  
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Check for admin API calls
    if (url.includes(API_CONFIG.ADMIN_API_PREFIX)) {
      const headers = init?.headers as Record<string, string> || {};
      
      // Check if our client header is present
      if (!headers[API_CONFIG.CLIENT_HEADER_NAME]) {
        const error = new Error(`[FETCH TRAP] Unauthorized admin API call detected: ${url}`);
        console.error(error.message, {
          url,
          stack: error.stack,
          headers,
          expectedHeader: API_CONFIG.CLIENT_HEADER_NAME,
        });
        
        // In strict mode, throw to break execution
        if (API_CONFIG.ENFORCE_SINGLE_API) {
          throw error;
        }
      }
    }
    
    return originalFetch.call(this, input, init);
  };
  
  trapInstalled = true;
  console.log('[FETCH TRAP] Installed - monitoring admin API calls');
}

export function uninstallFetchTrap() {
  // Note: Cannot easily restore original fetch, but trap can be disabled
  trapInstalled = false;
}