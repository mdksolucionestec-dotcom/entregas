/* MD Actas · Service Worker
   Guarda la app en el telefono para que abra sin internet.
   AL CAMBIAR CUALQUIER ARCHIVO, sube el numero de CACHE. */

const CACHE = 'mdk-actas-v1';

const ARCHIVOS = [
  './','./index.html','./acta.html','./evidencias.html',
  './app.js','./estilos.css','./manifest.json',
  './icon-192.png','./icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', ev => {
  ev.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ARCHIVOS.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', ev => {
  ev.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.map(k => k === CACHE ? null : caches.delete(k)));
    await self.clients.claim();
  })());
});

function esPropio(req) {
  if (new URL(req.url).origin !== self.location.origin) return false;
  return /\.(html|js|css|json)$/i.test(new URL(req.url).pathname) || req.mode === 'navigate';
}

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  if (req.url.indexOf('script.google.com') !== -1) return;

  if (esPropio(req)) {
    ev.respondWith((async () => {
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res && res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
        return res;
      } catch (e) {
        return (await caches.match(req)) || (await caches.match('./index.html')) ||
               new Response('Sin conexion', { status: 503 });
      }
    })());
    return;
  }

  ev.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const c = await caches.open(CACHE); c.put(req, res.clone());
      }
      return res;
    } catch (e) { return new Response('', { status: 504 }); }
  })());
});
