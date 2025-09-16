// src/lib/version.ts
export async function ensureFreshBuild() {
  // Skip on dev/preview domains
  if (import.meta.env.DEV || location.hostname.endsWith('.replit.dev')) return;

  try {
    const res = await fetch('/version.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) { console.warn('Version check HTTP', res.status); return; }

    const remote = await res.json(); // { buildTag: "..." }
    const local = import.meta.env.VITE_BUILD_TAG;
    if (remote?.buildTag && local && remote.buildTag !== local) {
      if (!sessionStorage.getItem('FORCED_RELOAD_DONE')) {
        sessionStorage.setItem('FORCED_RELOAD_DONE', '1');
        await unregisterSWAndCaches();
        window.location.reload();
      } else {
        console.warn('Reload already attempted; aborting loop.');
      }
    }
  } catch (e) {
    console.warn('Version check failed:', e); // <-- NO reload on error
  }
}

async function unregisterSWAndCaches() {
  const regs = await navigator.serviceWorker?.getRegistrations?.();
  await Promise.all((regs || []).map(r => r.unregister()));
  const keys = await caches?.keys?.();
  await Promise.all((keys || []).map(k => caches.delete(k)));
}