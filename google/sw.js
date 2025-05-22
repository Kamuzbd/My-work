const CACHE_NAME = 'voice-search-pwa-v1';
const urlsToCache = [
  '.',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install SW and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key)))
    )
  );
});

// Fetch from cache first, then network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
