// Minimal app-shell cache so the PWA install prompt qualifies and the game
// still opens (from cache) with a flaky connection. Bump CACHE_NAME whenever
// the shipped files change so old caches don't linger.
const CACHE_NAME = 'tvc1-shell-v10';
const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/thay-avatar.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache the analytics ping — always hit the network.
  if (url.pathname.startsWith('/api/')) return;
  // Network-first for the app shell so a new deploy shows up on the very
  // next reload instead of being stuck on whatever was cached before —
  // falls back to cache only when offline.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
