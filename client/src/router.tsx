import { createBrowserRouter, Outlet, useRouteError, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './auth/Login';
import AdminGate from './components/AdminGate';
import AdminLogin from './pages/admin-login';
import AdminSettings from './pages/admin-settings';
import EvidenceLibrary from './pages/evidence-library-admin';
import Taxonomy from './pages/admin/taxonomy-management';

function Root() {
  return <Outlet />;
}

function RootError() {
  const err: any = useRouteError();
  console.log('[ROOT_ERROR]', err);
  return (
    <div style={{ padding: 16, border: '2px solid red' }}>
      <h3>ROOT ERROR</h3>
      <div>path: {window.location.pathname}</div>
      <pre>{JSON.stringify({ status: err?.status, statusText: err?.statusText, data: err?.data }, null, 2)}</pre>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,                 // ← neutral wrapper
    errorElement: <RootError />,       // ← will show exact cause
    children: [
      { index: true, element: <Home /> },     // public
      { path: 'login', element: <Login /> },  // public
      { 
        path: 'incidents/new', 
        lazy: async () => {
          const Component = await import('./pages/incident-reporting');
          return { Component: Component.default };
        }
      },
      { path: 'admin/login', element: <AdminLogin /> },
      // Everything under /admin/* must be gated
      { path: 'admin', element: <AdminGate><AdminSettings /></AdminGate> },
      { path: 'admin/settings', element: <AdminGate><AdminSettings /></AdminGate> },
      { path: 'admin/ai/providers', element: <AdminGate><AdminSettings /></AdminGate> },
      { path: 'admin/evidence', element: <AdminGate><EvidenceLibrary /></AdminGate> },
      { path: 'admin/taxonomy', element: <AdminGate><Taxonomy /></AdminGate> },
      
      // NEW: normalize weird encoded paths like "/%3F__seed=…"
      { path: '%3F/*', element: <Navigate to="/" replace /> },
      // NEW: catch-all fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);