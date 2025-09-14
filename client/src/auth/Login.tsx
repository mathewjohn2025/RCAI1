import React, { useState, useEffect } from "react";
import { ADMIN_ROUTES, API_ENDPOINTS } from "@/config/apiEndpoints";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Check if already authenticated on load
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch(API_ENDPOINTS.authWhoami(), { 
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          // Already authenticated as admin, validate and redirect safely
          const urlParams = new URLSearchParams(window.location.search);
          let returnTo = urlParams.get('returnTo');
          
          // Security: Only allow same-origin relative paths
          if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
            window.location.href = returnTo;
          } else {
            // Invalid returnTo - redirect to base admin route (server will handle)
            window.location.href = ADMIN_ROUTES.BASE;
          }
        }
      }
    } catch (error) {
      // Not authenticated, continue to login form
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setToast("Please enter email and password");
      return;
    }

    setBusy(true);
    setToast(null);

    try {
      // Get returnTo from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');

      const res = await fetch(API_ENDPOINTS.authLogin(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password, returnTo })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setToast("Login successful! Redirecting...");
        setTimeout(() => {
          // Navigate to sanitized returnTo from server response
          window.location.href = data.returnTo;
        }, 1000);
      } else if (res.status === 401) {
        setToast("Invalid email or password");
      } else if (res.status === 429) {
        setToast("Too many login attempts. Please try again later.");
      } else {
        setToast(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setToast("Network error. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the RCA Intelligence Pro admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                data-testid="input-email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                data-testid="input-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={busy}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-login"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {toast && (
            <div className={`p-3 rounded-md text-sm ${
              toast.includes('successful') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`} data-testid="toast-message">
              {toast}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure admin authentication for RCA Intelligence Pro
          </p>
        </div>
      </div>
    </div>
  );
}