// Basic Service Worker - does not force reload on activate
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Do NOT call clients.claim() to avoid force-reloading clients
  // Clean up old caches if needed
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Only delete very old cache versions if needed
          // Keep current cache to avoid breaking active clients
          return Promise.resolve();
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler - no aggressive caching
  event.respondWith(fetch(event.request));
});