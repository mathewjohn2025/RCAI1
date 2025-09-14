import { redirect } from 'react-router-dom';
import { apiRaw } from '../lib/api';
import { getSessionRaw } from '../auth';

export async function adminLoader() {
  // 1) Auth check
  const meRes = await getSessionRaw();
  if (meRes.status === 401 || meRes.status === 403) throw redirect('/login');
  const me = await meRes.json();
  if (me.role !== 'admin') throw redirect('/login');

  // 2) Bootstrap features *before* any admin child mounts
  const bootRes = await apiRaw('/api/admin/bootstrap');
  if (bootRes.status === 401 || bootRes.status === 403) throw redirect('/login');
  const features = await bootRes.json();

  return { me, features };
}