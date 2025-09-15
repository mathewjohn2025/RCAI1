import { Navigate, useLocation } from "react-router-dom";
import { useWhoAmI } from "../hooks/useWhoAmI";

export default function AdminGate({ children }: { children: JSX.Element }) {
  const { data, isLoading } = useWhoAmI();
  const loc = useLocation();
  if (isLoading) return null; // prevent early renders/requests
  if (!data?.user) {
    const rt = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/admin/login?returnTo=${rt}`} replace />;
  }
  return children;
}