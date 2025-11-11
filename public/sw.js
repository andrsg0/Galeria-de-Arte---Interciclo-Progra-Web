const CACHE_NAME = 'met-gallery-v1';
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/_next/static/*' // hint: Next genera rutas bajo _next/static; SW hará fallback dinámico
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // cachea archivos esenciales
      return cache.addAll(APP_SHELL.map((p) => p.replace('/*', '')));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Navegación -> network-first, fallback a offline.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        // cachear la navegación
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Para imágenes y scripts -> cache-first con actualización dinámica
  if (req.destination === 'image' || req.destination === 'style' || req.destination === 'script') {
    e.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => {
          if (req.destination === 'image') return caches.match('/icon-192.png');
        });
      })
    );
    return;
  }

  // Default: try network, fallback cache
  e.respondWith(
    fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
      return res;
    }).catch(() => caches.match(req))
  );
});