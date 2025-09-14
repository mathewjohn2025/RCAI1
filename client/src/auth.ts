import { apiRaw } from './lib/api';

export async function getSessionRaw() {
  const r = await apiRaw('/api/me');
  return r; // caller decides redirect
}