import { apiRaw } from './lib/api';

export async function getSessionRaw() {
  const r = await apiRaw('/api/auth/whoami');
  return r; // caller decides redirect
}