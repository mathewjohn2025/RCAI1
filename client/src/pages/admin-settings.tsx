import { useQuery } from "@tanstack/react-query";
import { useWhoAmI } from "../hooks/useWhoAmI";

export default function AdminSettings() {
  // 1) Know who we are first
  const { data: me, isLoading: whoLoading } = useWhoAmI();
  const enabled = !!me?.user && !whoLoading; // <- gate!

  // 2) Only fetch admin data when enabled === true
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "aiSettings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ai/providers", { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled, // <- critical
  });

  if (whoLoading) return <div>Loading...</div>;
  if (!me?.user) return <div>Access denied</div>;
  if (isLoading) return <div>Loading AI settings...</div>;
  if (error) return <div>Error loading AI settings</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Settings</h1>
      <div>
        <h2 className="text-lg font-semibold mb-2">Providers ({data?.length || 0})</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}