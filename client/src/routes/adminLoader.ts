import { redirect } from 'react-router-dom';
import { apiRaw } from '../lib/api';

export async function adminLoader() {
  // 1) Auth check using correct endpoint
  const meRes = await apiRaw('/api/auth/whoami');
  const me = await meRes.json();
  
  // Check if authenticated and admin
  if (!me.authenticated || !me.isAdmin) {
    throw redirect('/admin/login');
  }

  // 2) Bootstrap features *before* any admin child mounts
  const bootRes = await apiRaw('/api/admin/bootstrap');
  if (bootRes.status === 401 || bootRes.status === 403) throw redirect('/admin/login');
  const features = await bootRes.json();

  return { me, features };
}