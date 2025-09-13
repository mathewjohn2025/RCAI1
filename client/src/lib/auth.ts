// Specification: getSession function and auth utilities
export async function getSession() {
  try {
    const response = await fetch('/api/auth/whoami', { 
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.authenticated && data.user ? data : null;
  } catch (error) {
    console.error('Session check failed:', error);
    return null;
  }
}

export function clearAuthState() {
  // Clear any local auth state - currently using server-side sessions only
  console.log('Auth state cleared');
}