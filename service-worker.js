// HealthLens Stage 1F: development no-cache service worker. Immediately unregisters and clears old caches.
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil((async()=>{ const keys = await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); await self.registration.unregister(); await self.clients.claim(); })()); });
self.addEventListener('fetch', () => {});
