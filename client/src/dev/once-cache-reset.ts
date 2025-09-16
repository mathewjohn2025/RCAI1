if (import.meta.env.DEV) {
  console.log('[BUILD_TAG] HOME_PUBLIC_TEST', import.meta.env.VITE_BUILD_TAG);
  // Run ONCE — no intervals, no repeated reloads
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        regs.forEach(r => r.unregister());
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      // Optional: only reload on version change, NOT forever
      const tag = String(import.meta.env.VITE_BUILD_TAG || '');
      const prev = localStorage.getItem('BUILD_TAG') || '';
      if (tag && prev && tag !== prev) {
        localStorage.setItem('BUILD_TAG', tag);
        location.reload(); // one time
      } else {
        localStorage.setItem('BUILD_TAG', tag);
      }
    } catch {}
  })();
}