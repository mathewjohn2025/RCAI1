import { useLoaderData, NavLink, Outlet, useNavigate } from 'react-router-dom';

type LoaderData = { 
  me: { authenticated: boolean; isAdmin: boolean }; 
  features: { features: string[] } 
};

export default function AdminLayout() {
  const loaderData = useLoaderData() as LoaderData;
  const featuresArray = loaderData.features.features; // Server returns { features: [...] }
  const navigate = useNavigate();

  const items = [
    { key: 'ai_settings', label: 'AI Settings', to: '/admin/ai/providers' },
    { key: 'evidence_library', label: 'Evidence Library', to: '/admin/evidence' },
    { key: 'taxonomy', label: 'Taxonomy', to: '/admin/taxonomy' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to home page after successful logout
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex">
      <aside className="w-64 p-4 bg-gray-100 border-r">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 underline"
            data-testid="button-logout"
          >
            Logout
          </button>
        </div>
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