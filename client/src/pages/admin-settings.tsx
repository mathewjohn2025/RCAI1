// Route module (React Router lazy route)
import { useLoaderData } from 'react-router-dom';
import { apiRaw } from '../lib/api';

export async function loader() {
  // parent adminLoader already proved you're admin
  const res = await apiRaw('/api/admin/ai/providers');
  if (!res.ok) throw new Response('Failed to load providers', { status: res.status });
  const providers = await res.json();
  return { providers };
}

export default function AdminSettingsPage() {
  const { providers } = useLoaderData() as { providers: any[] };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Settings</h1>
      <div>
        <h2 className="text-lg font-semibold mb-2">Providers ({providers.length})</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(providers, null, 2)}
        </pre>
      </div>
    </div>
  );
}