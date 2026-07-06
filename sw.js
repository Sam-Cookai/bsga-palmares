// BSGA Palmarès — Service Worker
// Permet le fonctionnement hors-ligne en mettant en cache tous les fichiers de l'app.
const CACHE_NAME = "bsga-palmares-v0.26";
const FILES_TO_CACHE = [
  "./index.html",
  "./app.js",
  "./data.js",
  "./cotation_defaults.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./lib/chart.umd.min.js",
  "./lib/xlsx.full.min.js",
  "./lib/jspdf.umd.min.js",
  "./lib/jspdf.plugin.autotable.min.js"
];

// Fichiers "figés" (librairies tierces) : jamais modifiés, donc cache-first est sûr et rapide.
const VENDOR_PATTERNS = ["/lib/"];

// Installation : mise en cache de tous les fichiers
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : supprimer les anciens caches (toute version précédente du cache est purgée)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch :
// - Librairies vendor (lib/*) : cache d'abord (ne changent jamais, chargement rapide).
// - Tout le reste (HTML/JS/JSON de l'app) : réseau d'abord, pour que les mises à jour
//   soient toujours visibles immédiatement quand une connexion est disponible ;
//   le cache ne sert de secours qu'hors-ligne.
self.addEventListener("fetch", event => {
  const isVendor = VENDOR_PATTERNS.some(p => event.request.url.includes(p));

  if (isVendor) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
