import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function AdminLogin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const returnTo = new URLSearchParams(loc.search).get("returnTo") || "/admin/settings";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");

    try {
      await api("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Force whoami to update & wait briefly until it reports a user
      await qc.invalidateQueries({ queryKey: ["whoami"] });
      const start = Date.now();
      while (Date.now() - start < 1500) {
        const me: any = qc.getQueryData(["whoami"]);
        if (me?.user) break;
        await qc.refetchQueries({ queryKey: ["whoami"], exact: true });
        await new Promise(r => setTimeout(r, 100));
      }

      // Now that session is confirmed, navigate once
      nav(returnTo, { replace: true });
    } catch (e: any) {
      setErr(e?.body?.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access AI Settings and administration panel
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* uncontrolled inputs avoid flicker */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="username"
              type="email"
              autoComplete="username"
              defaultValue=""
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="admin@example.com"
              disabled={submitting}
              data-testid="input-email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your password"
              disabled={submitting}
              data-testid="input-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-login"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          
          {err && (
            <div className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200" role="alert" data-testid="toast-message">
              {err}
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