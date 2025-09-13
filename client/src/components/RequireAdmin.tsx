import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS, ADMIN_ROUTES } from "@/config/apiEndpoints";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<null | boolean>(null);
  const loc = useLocation();

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const r = await fetch(API_ENDPOINTS.authWhoami(), { credentials: "include" });
        if (!r.ok) { if (!canceled) setOk(false); return; }
        const j = await r.json().catch(() => ({}));
        if (!canceled) setOk(!!j?.authenticated && !!j?.isAdmin);
      } catch {
        if (!canceled) setOk(false);
      }
    })();
    return () => { canceled = true; };
  }, []);

  // 🚫 While unknown, render nothing — this prevents the lazy admin bundle from importing
  if (ok === null) return null;

  if (!ok) {
    const returnTo = encodeURIComponent(loc.pathname + loc.search + loc.hash);
    return <Navigate to={`${ADMIN_ROUTES.LOGIN}?returnTo=${returnTo}`} replace />;
  }

  // ✅ Only here will the lazy admin components import and render
  return <>{children}</>;
}