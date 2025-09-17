// client/src/admin/AdminLogin.tsx
export default function AdminLogin() {
  return (
    <form
      method="POST"
      action="/api/auth/login-redirect"   // ← server handles and 303s you
      autoComplete="on"
      noValidate
      className="login-form"
    >
      <label htmlFor="admin-email">Email</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
      />
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <button type="submit">Sign in</button>
    </form>
  );
}