/* ============================================================
   Mùn cưa & Củi — Service Worker
   Đây KHÔNG phải app tĩnh như game/english-air: mọi trang là HTML
   render động theo phiên đăng nhập (dữ liệu tài chính riêng của từng
   người dùng). Vì vậy chỉ cache đúng các file "vỏ" tĩnh không đổi theo
   người dùng (icon, manifest, CSS/JS dùng chung) — KHÔNG BAO GIỜ cache
   trang HTML hay bất kỳ request nào khác trong /mun-cui/, để tránh lặp
   lại lỗi từng gặp ở english-air: cache đè lên request "ai đang đăng
   nhập" khiến một người nhìn thấy dữ liệu/trạng thái của người khác.
   Đổi CACHE khi sửa danh sách SHELL để buộc tải lại bản mới.
   ============================================================ */
const CACHE = "mun-cui-shell-v1";

const SHELL = [
  "/mun-cui-app/manifest.webmanifest",
  "/mun-cui-app/offline.html",
  "/mun-cui-app/icons/icon-192.png",
  "/mun-cui-app/icons/icon-512.png",
  "/mun-cui-app/icons/icon-maskable-512.png",
  "/mun-cui-app/icons/apple-touch-icon.png",
  "/css/output.css",
  "/js/main.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Điều hướng trang (mở app / bấm link): luôn lấy bản mới từ máy chủ vì
  // đây là dữ liệu riêng theo phiên đăng nhập — không được trả bản cũ từ
  // cache. Mất mạng thì mới hiện trang "Không có kết nối" thay vì một
  // trang cũ có thể sai người/sai số liệu.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/mun-cui-app/offline.html")));
    return;
  }

  // Chỉ những file vỏ tĩnh nằm trong danh sách SHELL mới được cache — mọi
  // request khác (kể cả các request GET khác trong /mun-cui/) để mạng lo,
  // tuyệt đối không đụng vào.
  if (!SHELL.includes(url.pathname)) return;

  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
