// version.ts
export async function ensureFreshBuild() {
  // In dev, skip entirely
  if (import.meta.env.DEV) return;

  try {
    const res = await fetch('/version.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) {
      console.warn('Version check HTTP', res.status);
      return; // <-- DO NOT reload on error
    }
    const remote = await res.json();    // { buildTag: "…" } or { build: "…" }
    const local = import.meta.env.VITE_BUILD_TAG;
    const remoteBuild = remote?.buildTag || remote?.build;
    if (remoteBuild && local && remoteBuild !== local) {
      await unregisterSW();
      window.location.reload();
    }
  } catch (e) {
    console.warn('Version check failed:', e); // <-- log only, no reload
  }
}

async function unregisterSW() {
  const regs = await navigator.serviceWorker?.getRegistrations?.();
  await Promise.all((regs||[]).map(r => r.unregister()));
  const keys = await caches?.keys?.();
  await Promise.all((keys||[]).map(k => caches.delete(k)));
}