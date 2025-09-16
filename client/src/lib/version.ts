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
    const remote = await res.json();    // { buildTag: "…" }
    const local = import.meta.env.VITE_BUILD_TAG;
    if (remote?.buildTag && local && remote.buildTag !== local) {
      const FLAG = 'FORCED_RELOAD_DONE';
      if (!sessionStorage.getItem(FLAG)) {
        sessionStorage.setItem(FLAG, '1');
        await unregisterSW();
        window.location.reload();
      } else {
        console.warn('Reload already attempted; aborting to avoid loop.');
      }
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