import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient, useAuthedQuery } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { API_CONFIG } from "@/config/runtime";

type ProviderRow = {
  id: number;
  provider: string;
  modelId: string;
  active: boolean;
  hasKey: boolean;
};

export default function AIProvidersTable() {
  const [provider, setProvider] = useState("");
  const [modelId, setModelId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [makeActive, setMakeActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // DISABLED: Auth handled by adminLoader, not individual components
  const { data: whoami } = useQuery({
    queryKey: [API_CONFIG.AUTH_WHOAMI_ENDPOINT],
    queryFn: async () => {
      const response = await api(API_CONFIG.AUTH_WHOAMI_ENDPOINT);
      return await response.json();
    },
    enabled: false, // DISABLED: Auth handled by route loaders
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  });

  // CRITICAL: Use consistent queryKey for fetch and invalidation
  const PROVIDERS_QUERY_KEY = ['admin', 'providers'];
  
  const { data: rows = [], isLoading } = useAuthedQuery<ProviderRow[]>({
    queryKey: PROVIDERS_QUERY_KEY,
    url: API_ENDPOINTS.aiProviders(), // SPECIFICATION: Actual URL from API_ENDPOINTS (config-driven)
    enabled: false, // DISABLED: Data should come from route loaders, not unauthorized calls
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  });

  const createMutation = useMutation({
    mutationFn: async (data: { provider: string; modelId: string; apiKey: string; setActive: boolean }) => {
      const response = await api(API_ENDPOINTS.aiProviders(), { method: "POST", body: JSON.stringify(data) });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      setProvider("");
      setModelId("");
      setApiKey("");
      setMakeActive(false);
      setToast("Provider saved.");
    },
    onError: (err: any) => {
      setToast(err.message || "Save failed");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api(API_ENDPOINTS.aiProviderById(id), { method: "DELETE" });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      setDeletingId(null);
      setToast("Provider deleted.");
    },
    onError: (err: any) => {
      setDeletingId(null);
      setToast(err.message || "Delete failed");
    }
  });

  const testMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api(API_ENDPOINTS.aiProviderTest(id), { method: "POST" });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setToast(data.ok ? `✅ Test OK (${data.latencyMs ?? "?"} ms)` : `❌ ${data.message || "Test failed"}`);
    },
    onError: (err: any) => {
      setToast(err.message || "Test failed");
    }
  });

  const activateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api(API_ENDPOINTS.aiProviderById(id), { method: "PATCH", body: JSON.stringify({ setActive: true }) });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      setToast("Active provider updated.");
    },
    onError: (err: any) => {
      setToast(err.message || "Activate failed");
    }
  });

  function save() {
    if (!provider || !modelId || !apiKey) {
      setToast("All fields required.");
      return;
    }
    setToast(null);
    createMutation.mutate({
      provider: provider.trim().toLowerCase(),
      modelId: modelId.trim(),
      apiKey: apiKey,
      setActive: !!makeActive
    });
  }

  function testProvider(id: number) {
    setToast(null);
    testMutation.mutate(id);
  }

  function setActiveProvider(id: number) {
    setToast(null);
    activateMutation.mutate(id);
  }

  function deleteProvider(id: number) {
    if (!confirm('Delete this provider? This removes its key and deactivates it.')) {
      return;
    }
    setDeletingId(id);
    setToast(null);
    deleteMutation.mutate(id);
  }

  // Remove redundant auth check - AdminGate handles this

  const busy = createMutation.isPending || deleteMutation.isPending || testMutation.isPending || activateMutation.isPending;

  return (
    <div>
      {toast && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          {toast}
          <button
            className="ml-4 text-blue-600 underline"
            onClick={() => setToast(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-medium mb-4">Add AI Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Provider (openai, anthropic, etc.)"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            disabled={busy}
          />
          <input
            type="text"
            placeholder="Model ID (gpt-4, claude-3, etc.)"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            disabled={busy}
          />
          <input
            type="password"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            disabled={busy}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={makeActive}
              onChange={(e) => setMakeActive(e.target.checked)}
              className="mr-2"
              disabled={busy}
            />
            Make this the active provider
          </label>
          <button
            onClick={save}
            disabled={busy || !provider || !modelId || !apiKey}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Save Provider"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Current Providers</h3>
        {isLoading ? (
          <div>Loading providers...</div>
        ) : rows.length === 0 ? (
          <div>No providers configured.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Provider</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Model</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: ProviderRow) => (
                  <tr key={row.id}>
                    <td className="border border-gray-300 px-4 py-2">{row.provider}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.modelId}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${row.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {row.active ? "Active" : "Inactive"}
                      </span>
                      {row.hasKey && (
                        <span className="ml-2 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          Key Set
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => testProvider(row.id)}
                          disabled={busy || !row.hasKey}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                        >
                          {testMutation.isPending ? "Testing..." : "Test"}
                        </button>
                        {!row.active && (
                          <button
                            onClick={() => setActiveProvider(row.id)}
                            disabled={busy || !row.hasKey}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                          >
                            {activateMutation.isPending ? "Activating..." : "Activate"}
                          </button>
                        )}
                        <button
                          onClick={() => deleteProvider(row.id)}
                          disabled={busy || deletingId === row.id}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                        >
                          {deletingId === row.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}