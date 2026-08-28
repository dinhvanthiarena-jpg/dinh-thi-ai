// Minimal app-shell cache so the PWA install prompt qualifies and the game
// still opens (from cache) with a flaky connection. Bump CACHE_NAME whenever
// the shipped files change so old caches don't linger.
const CACHE_NAME = 'tvc1-shell-v20';
const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/thay-avatar.png',
  './assets/fonts/nunito-400.woff2',
  './assets/fonts/nunito-600.woff2',
  './assets/fonts/nunito-700.woff2',
  './assets/fonts/nunito-800.woff2',
  './assets/fonts/nunito-900.woff2',
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

// Server-sent update announcements (see /admin/push-broadcast). Tapping the
// notification focuses/opens the game and force-reloads it — combined with
// the no-store Cache-Control on the game's static files, that guarantees
// the tap actually lands on the latest deployed version, not whatever was
// already loaded in a background tab.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { /* non-JSON payload, ignore */ }
  const title = data.title || 'Toán Vui Cấp 1';
  const options = {
    body: data.body || 'Có bản cập nhật mới!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    data: { url: data.url || './' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL((event.notification.data && event.notification.data.url) || './', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
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
