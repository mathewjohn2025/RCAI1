// client/src/dev/once-cache-reset.ts
if (import.meta.env.DEV) {
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        (await navigator.serviceWorker.getRegistrations()).forEach(r => r.unregister());
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      const tag = String(import.meta.env.VITE_BUILD_TAG || '');
      const prev = localStorage.getItem('BUILD_TAG') || '';
      localStorage.setItem('BUILD_TAG', tag);
      if (tag && prev && tag !== prev) location.reload(); // ONE time only
    } catch {}
  })();
}