import { useLoaderData, NavLink, Outlet } from 'react-router-dom';

type LoaderData = { 
  me: { authenticated: boolean; isAdmin: boolean }; 
  features: { features: string[] } 
};

export default function AdminLayout() {
  const loaderData = useLoaderData() as LoaderData;
  const featuresArray = loaderData.features.features; // Server returns { features: [...] }

  const items = [
    { key: 'ai_settings', label: 'AI Settings', to: '/admin/ai/providers' },
    { key: 'evidence_library', label: 'Evidence Library', to: '/admin/evidence' },
    { key: 'taxonomy', label: 'Taxonomy', to: '/admin/taxonomy' },
  ];

  return (
    <div className="flex">
      <aside className="w-64 p-4 bg-gray-100 border-r">
        <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {items
            .filter(i => featuresArray.includes(i.key))
            .map(i => (
              <NavLink 
                key={i.key} 
                to={i.to} 
                className="block p-2 rounded hover:bg-gray-200 text-blue-600"
              >
                {i.label}
              </NavLink>
            ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}