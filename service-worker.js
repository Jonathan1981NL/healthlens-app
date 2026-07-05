// HealthLens development cache-kill service worker
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clientsList = await clients.matchAll({type:'window'});
    for (const client of clientsList) client.navigate(client.url);
  })());
});
self.addEventListener('fetch', event => event.respondWith(fetch(event.request, {cache:'no-store'})));
