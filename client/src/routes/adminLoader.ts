import { redirect } from 'react-router-dom';
import { apiRaw } from '../lib/api';

export async function adminLoader({ request }: { request: Request }) {
  console.log('[ADMIN_LOADER] start');                // CANARY
  const meRes = await apiRaw('/api/me');
  console.log('[ADMIN_LOADER] /api/me', meRes.status);

  if (meRes.status === 401 || meRes.status === 403) {
    const returnTo = encodeURIComponent(new URL(request.url).pathname);
    throw redirect(`/admin/login?returnTo=${returnTo}`);
  }
  const me = await meRes.json();
  if (me.role !== 'admin') {
    const returnTo = encodeURIComponent(new URL(request.url).pathname);
    throw redirect(`/admin/login?returnTo=${returnTo}`);
  }

  const bootRes = await apiRaw('/api/admin/bootstrap');
  console.log('[ADMIN_LOADER] /bootstrap', bootRes.status);

  if (bootRes.status === 401 || bootRes.status === 403) {
    const returnTo = encodeURIComponent(new URL(request.url).pathname);
    throw redirect(`/admin/login?returnTo=${returnTo}`);
  }
  const features = await bootRes.json();

  console.log('[ADMIN_LOADER] done');                 // CANARY
  return { me, features };
}