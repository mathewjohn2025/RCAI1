// client/pages/admin-login.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const didAutoRedirect = useRef(false);

  // ONE-TIME check: already logged in? (don't mount/unmount inputs repeatedly)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetch('/api/admin/whoami', { credentials: 'include' });
      if (!cancelled && r.ok) {
        const d = await r.json();
        if (d?.user && !didAutoRedirect.current) {
          didAutoRedirect.current = true;
          navigate(sp.get('returnTo') || '/admin/settings', { replace: true });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [navigate, sp]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('login_failed');
      const { redirectTo } = await res.json();

      // Hard navigation to avoid any SPA race conditions with fresh cookies
      window.location.replace(redirectTo || '/admin/settings');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} autoComplete="on" spellCheck={false} data-testid="form-admin-login">
      <label>Email Address</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        data-testid="input-email"
      />
      <label>Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        data-testid="input-password"
      />
      <button type="submit" disabled={submitting} data-testid="button-login">
        Sign in
      </button>
    </form>
  );
}