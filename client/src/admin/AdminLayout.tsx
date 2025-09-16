import { Outlet, NavLink } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="border-b p-4 flex items-center gap-4">
        <h1 className="font-semibold">Admin</h1>
        <nav className="flex gap-3">
          <NavLink to="/admin/settings">Settings</NavLink>
          {/* add other admin links here */}
        </nav>
        <div className="ml-auto">
          {/* Put LogoutButton in header if you like */}
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}