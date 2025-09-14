import { useLoaderData, NavLink, Outlet } from 'react-router-dom';

type AdminBoot = { features: string[] };
type LoaderData = { me: { id: string; role: string }; features: AdminBoot };

export default function AdminLayout() {
  const { features } = useLoaderData() as LoaderData;

  const items = [
    { key: 'ai_settings', label: 'AI Settings', to: '/admin/ai/providers' },
    { key: 'evidence_library', label: 'Evidence Library', to: '/admin/evidence' },
    { key: 'taxonomy', label: 'Taxonomy', to: '/admin/taxonomy' },
  ];

  return (
    <div className="flex">
      <aside className="w-64 p-4">
        <nav className="space-y-2">
          {items
            .filter(i => features.features.includes(i.key))
            .map(i => (
              <NavLink key={i.key} to={i.to} className="block">
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