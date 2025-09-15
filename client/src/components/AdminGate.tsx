import { Navigate, useLocation } from "react-router-dom";
import { useWhoAmI } from "../hooks/useWhoAmI";

export default function AdminGate({ children }: { children: JSX.Element }) {
  const { data, isLoading } = useWhoAmI();
  const loc = useLocation();
  if (isLoading) return null;

  if (!data?.authenticated) {
    const raw = loc.pathname + loc.search; // not encoded
    const returnTo = encodeURIComponent(raw); // encode only the value
    return (
      <Navigate
        to={{ pathname: "/admin/login", search: `?returnTo=${returnTo}` }}
        replace
      />
    );
  }
  return children;
}