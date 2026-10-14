// Network-first: có mạng là luôn lấy bản mới nhất; mất mạng thì dùng bản đã lưu.
const CACHE = "sa-tracking-link-shell";
const SHELL = ["./", "index.html", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png", "qr-zalo.svg"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.url.includes("version.json") || /\.mp4(\?|$)/.test(req.url)) return; // video + version.json: lấy thẳng từ mạng // luôn lấy thẳng từ mạng
  e.respondWith(
    fetch(req, { cache: "no-cache" }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});
