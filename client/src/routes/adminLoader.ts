import { redirect } from 'react-router-dom';
import { apiRaw } from '../lib/api';

export async function adminLoader() {
  console.log('[ADMIN_LOADER] Starting authentication check');
  
  // 1) Auth check using correct endpoint
  const meRes = await apiRaw('/api/auth/whoami');
  const me = await meRes.json();
  
  console.log('[ADMIN_LOADER] Auth response:', me);
  
  // Check if authenticated and admin
  if (!me.authenticated || !me.isAdmin) {
    console.log('[ADMIN_LOADER] Not authenticated/admin, redirecting to login');
    throw redirect('/admin/login');
  }

  // 2) Bootstrap features *before* any admin child mounts
  const bootRes = await apiRaw('/api/admin/bootstrap');
  if (bootRes.status === 401 || bootRes.status === 403) {
    console.log('[ADMIN_LOADER] Bootstrap failed, redirecting to login');
    throw redirect('/admin/login');
  }
  const features = await bootRes.json();

  console.log('[ADMIN_LOADER] Authentication successful, features:', features);
  return { me, features };
}