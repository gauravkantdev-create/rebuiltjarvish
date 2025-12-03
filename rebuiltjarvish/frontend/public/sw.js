// Temporary safety service worker: clears caches and unregisters itself
// This helps when an old SW is serving stale dev assets (HMR/socket failures).
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Delete all caches
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (e) {
      console.error('SW cleanup error', e);
    }
    // Unregister this service worker so it won't interfere again
    try {
      const registration = await self.registration.unregister();
      console.log('SW unregistered', registration);
    } catch (e) {
      console.error('SW unregister failed', e);
    }
    // Claim clients to ensure they reload from network
    try { await self.clients.claim(); } catch(e){}
  })());
});

// Fallback fetch: prefer network, but allow cache as fallback (should be empty after activate)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
