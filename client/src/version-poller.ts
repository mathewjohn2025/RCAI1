// version-poller.ts — safe replacement for any version poller
const START_HASH = (import.meta as any).env?.VITE_BUILD_HASH || '';

async function poll(hash = START_HASH) {
  try {
    const r = await fetch('/__build.json', { cache: 'no-cache' });
    if (r.ok) {
      const j = await r.json();
      if (j?.hash && j.hash !== hash) {
        location.reload(); // reload ONCE on *change*, not on error
        return;
      }
    }
  } catch (_) {
    // swallow errors — never reload on failure
  } finally {
    setTimeout(() => poll(hash), 60000);
  }
}

// Only start polling in development
if (import.meta.env.DEV) {
  poll();
}