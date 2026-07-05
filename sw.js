/* HealthLens - offline shell */
const CACHE = 'hl-v2-cache';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js',
  'i18n.js', 'atlas-data.js', 'medical-db.js', 'privacy.js',
  'favicon.svg', 'manifest.webmanifest'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(SHELL)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  // Never intercept the pose CDN
  if(url.hostname.includes('jsdelivr')) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).catch(()=> caches.match('index.html')))
  );
});
