/**
 * Step 4: One fetch wrapper (components) + one raw fetch (loaders)
 * Components should redirect on 401/403. Loaders should throw redirect() (React Router).
 */

// Components: redirect immediately on unauthorized
export async function api(url: string, init: RequestInit = {}) {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store', ...init });
  if (res.status === 401 || res.status === 403) {
    window.location.assign('/login');
    throw new Error('Unauthorized');
  }
  return res;
}

// Loaders: don't redirect here; let the loader throw redirect()
export async function apiRaw(url: string, init: RequestInit = {}) {
  return fetch(url, { credentials: 'include', cache: 'no-store', ...init });
}

export type AITestOk = {
  ok: true;
  status: number;
  providerId: string;
  modelId: string;
  message?: string;
  meta?: Record<string, unknown>;
};

export type AITestErr = {
  ok: false;
  status: number;
  providerId?: string;
  modelId?: string;
  error: { code: string; type?: string; detail?: string };
};

export type AITestResp = AITestOk | AITestErr;

export async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  // SPECIFICATION: Route through single API wrapper to ensure proper headers and 401 handling
  const response = await api(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await response.json()) as T;
  // If server somehow returned 2xx but ok=false, still treat as error at the caller
  return data;
}

/**
 * Map error codes to user-friendly messages (NO PROVIDER HARDCODING)
 */
export const ERROR_CODE_MESSAGES: Record<string, string> = {
  invalid_api_key: "The API key is invalid or revoked.",
  model_not_found: "Model not available. Change the model or request access.",
  insufficient_quota: "Quota or billing limit reached for this provider.",
  rate_limit_exceeded: "Rate limit exceeded. Try again shortly.",
  network_error: "Network connection error. Please try again.",
  timeout: "Request timed out. Please try again.",
  server_error: "Server error occurred. Please try again later.",
};

/**
 * Handle AI test errors with friendly messages
 */
export function getErrorMessage(data: AITestErr): string {
  return (
    data.error?.detail ||
    ERROR_CODE_MESSAGES[data.error?.code] ||
    "AI test failed. See server logs for details."
  );
}