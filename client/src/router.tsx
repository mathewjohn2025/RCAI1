import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';        // your public homepage
import Login from './auth/Login';       // your login page
import AdminLayout from './admin/AdminLayout';
import { adminLoader } from './routes/adminLoader';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },                         // ← public, NO loader
  { path: '/login', element: <Login /> },                   // or /admin/login if you prefer
  {
    path: '/admin',
    element: <AdminLayout />,
    loader: adminLoader,                                    // ← loader ONLY here
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