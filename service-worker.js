const CACHE='healthlens-stage-1d-v20260704-1';
const ASSETS=['./index.html?v=1d','./styles.css?v=1d','./app.js?v=1d','./favicon.svg?v=1d','./site.webmanifest?v=1d'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET') return; event.respondWith(fetch(event.request).then(r=>{const clone=r.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html?v=1d'))));});
