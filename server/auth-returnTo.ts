// server/auth-returnTo.ts
export function sanitizeReturnTo(raw?: string): string {
  try {
    if (!raw) return '/admin/settings';
    const u = new URL(raw, 'http://local'); // base to parse query/hashes safely
    const p = (u.pathname || '/') + (u.search || '') + (u.hash || '');
    return p.startsWith('/admin') ? p : '/admin/settings';
  } catch {
    return '/admin/settings';
  }
}