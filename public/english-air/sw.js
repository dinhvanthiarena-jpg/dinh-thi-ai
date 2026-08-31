/* ============================================================
   ON-Language — Service Worker
   Toàn bộ app chạy offline sau lần mở đầu tiên.
   Đổi CACHE khi sửa file để buộc tải lại bản mới.
   ============================================================ */
const CACHE = "english-air-v131";

const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./letters.js",
  "./course-a1.js",
  "./course-a2.js",
  "./course-b1.js",
  "./course.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./assets/avatar.webp",
  "./assets/mon-room.jpg",
  "./assets/mon-closed.png",
  "./assets/mon-mouth.png",
  "./assets/call-card.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll thất bại toàn bộ nếu một file lỗi, nên nạp từng file riêng
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;

  // CHỈ ĐỤNG VÀO FILE CỦA CHÍNH APP. Trước đây bắt mọi lời gọi cùng tên miền rồi
  // trả bản đã lưu — nên các lời gọi API bị đóng băng: app hỏi "ai đang đăng nhập"
  // thì nhận lại bản cũ từ lúc chưa đăng nhập, và màn chờ tiền hỏi mãi vẫn nhận
  // "chưa trả" cũ nên quay không dứt. Cái gì không nằm trong thư mục app thì để
  // mạng lo, tuyệt đối không lưu lại.
  const trongApp = url.pathname.startsWith(new URL("./", self.location).pathname);
  if (sameOrigin && !trongApp) return;

  // Điều hướng: ưu tiên mạng để lấy bản mới, mất mạng thì trả bản đã lưu
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Tài nguyên tĩnh và font: trả cache ngay, đồng thời làm mới ngầm
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req)
        .then(res => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
