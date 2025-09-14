import { createBrowserRouter, Outlet, useRouteError, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './auth/Login';
import AdminLayout from './admin/AdminLayout';
import { adminLoader } from './routes/adminLoader';

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
        path: 'admin',
        element: <AdminLayout />,
        loader: adminLoader,                  // protected ONLY here
        children: [
          { 
            index: true, 
            lazy: async () => {
              const module = await import('./pages/admin-settings');
              return { Component: module.default, loader: module.loader };
            }
          },
          { 
            path: 'ai/providers', 
            lazy: async () => {
              const module = await import('./pages/admin-settings');
              return { Component: module.default, loader: module.loader };
            }
          },
          { path: 'evidence', element: <div style={{padding:12,background:'#ffef9f'}}>EVIDENCE CANARY</div> },
          { 
            path: 'taxonomy', 
            lazy: async () => {
              const Component = await import('./pages/admin/taxonomy-management');
              return { Component: Component.default };
            }
          },
        ],
      },
      
      // NEW: normalize weird encoded paths like "/%3F__seed=…"
      { path: '%3F/*', element: <Navigate to="/" replace /> },
      // NEW: catch-all fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);