import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from './pages/admin-login';
import AdminLayout from './components/AdminLayout';
import { adminLoader } from './routes/adminLoader';

export const router = createBrowserRouter([
  { path: '/login', element: <AdminLogin /> },
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