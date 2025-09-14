import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from './pages/admin-login';
import AdminLayout from './components/AdminLayout';
import { adminLoader } from './routes/adminLoader';

// Add a simple Home component
function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">RCA Intelligence Pro</h1>
      <p className="mb-4">AI-Powered Root Cause Analysis Platform</p>
      <a href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Access Admin Panel
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/__canary', element: <div style={{padding:16,background:'#ffe08a'}}>CLIENT ROUTE CANARY</div> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/canary-client', element: <div style={{padding:16,background:'#ffe08a'}}>CLIENT ROUTE CANARY</div> },
  {
    path: '/admin',
    element: <AdminLayout />,
    loader: adminLoader,
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
      { 
        path: 'evidence', 
        lazy: async () => {
          const Component = await import('./pages/evidence-library-admin');
          return { Component: Component.default };
        }
      },
      { 
        path: 'taxonomy', 
        lazy: async () => {
          const Component = await import('./pages/admin/taxonomy-management');
          return { Component: Component.default };
        }
      },
    ],
  },
]);