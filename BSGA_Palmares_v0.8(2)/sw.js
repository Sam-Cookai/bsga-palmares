// BSGA Palmarès — Service Worker
// Permet le fonctionnement hors-ligne en mettant en cache tous les fichiers de l'app.
const CACHE_NAME = "bsga-palmares-v0.8";
const FILES_TO_CACHE = [
  "./index.html",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./lib/chart.umd.min.js",
  "./lib/xlsx.full.min.js",
  "./lib/jspdf.umd.min.js",
  "./lib/jspdf.plugin.autotable.min.js"
];

// Installation : mise en cache de tous les fichiers
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : supprimer les anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : servir depuis le cache, sinon aller chercher sur le réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
