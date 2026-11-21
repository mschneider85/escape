// Bei Änderungen am Spiel VERSION erhöhen, damit iPads die neue Version laden.
const VERSION = 'v3';
const CACHE = 'escape-welten-' + VERSION;
const FILES = [
  './', 'index.html', 'style.css', 'manifest.webmanifest',
  'engine/art-common.js', 'engine/game.js',
  'worlds/nordpol.js', 'worlds/aegypten.js', 'worlds/weltraum.js',
  'fonts/patrick-hand.woff2', 'fonts/grandstander-800.woff',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Netzwerk zuerst (damit Updates ankommen), offline aus dem Cache.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok) {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)));
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      // Nur Seitenaufrufe bekommen die Startseite, Bilder usw. nicht.
      if (req.mode === 'navigate') return caches.match('index.html');
      return Response.error();
    }
  })());
});
