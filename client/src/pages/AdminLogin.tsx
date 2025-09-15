import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

function AdminLoginInner() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { emailRef.current?.focus(); }, []); // focus once only

  const nav = useNavigate();
  const loc = useLocation();
  const qc = useQueryClient();

  function getReturnTo() {
    const params = new URLSearchParams(loc.search);
    const raw = params.get("returnTo");
    if (raw) {
      const dec = decodeURIComponent(raw);
      if (dec.startsWith("/admin")) return dec; // only allow admin paths
    }
    return "/admin/settings";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setErr("");
    try {
      const email = emailRef.current?.value || "";
      const password = passRef.current?.value || "";
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Wait briefly until whoami sees the session once
      await qc.invalidateQueries({ queryKey: ["whoami"] });
      const t0 = Date.now();
      while (Date.now() - t0 < 1500) {
        const me: any = qc.getQueryData(["whoami"]);
        if (me?.user) break;
        await qc.refetchQueries({ queryKey: ["whoami"], exact: true });
        await new Promise(r => setTimeout(r, 100));
      }
      nav(getReturnTo(), { replace: true });
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
        
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              ref={emailRef}
              id="email"
              name="username"           // correct for autofill
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              defaultValue=""           // uncontrolled -> no value thrash
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="admin@example.com"
              disabled={submitting}
              data-testid="input-email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              ref={passRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue=""
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

export default React.memo(AdminLoginInner); // memoize to avoid replacement