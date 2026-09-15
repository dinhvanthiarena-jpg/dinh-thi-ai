/* ============================================================
   ON-Language — Service Worker
   Toàn bộ app chạy offline sau lần mở đầu tiên.
   Đổi CACHE khi sửa file để buộc tải lại bản mới.
   ============================================================ */
const CACHE = "english-air-v211";

const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./letters.js",
  "./net-han.js",
  "./assets/sticker/s1.webp",
  "./assets/sticker/s2.webp",
  "./assets/sticker/s3.webp",
  "./assets/sticker/s4.webp",
  "./assets/sticker/s5.webp",
  "./assets/sticker/s6.webp",
  "./assets/sticker/s7.webp",
  "./assets/sticker/s8.webp",
  "./assets/sticker/s9.webp",
  "./assets/sticker/s10.webp",
  "./assets/sticker/s11.webp",
  "./assets/sticker/s12.webp",
  "./assets/sticker/s13.webp",
  "./assets/sticker/s14.webp",
  "./assets/sticker/s15.webp",
  "./assets/sticker/s16.webp",
  "./assets/sticker/s17.webp",
  "./assets/thuong.mp3",
  "./assets/vo-tay.mp3",
  "./assets/nhac-nen.mp3",
  "./course-vi1.js",
  "./course-zh1.js",
  "./ngon-ngu.js",
  "./assets/tieng/kho.json",
  "./assets/tieng-vi/kho.json",
  "./assets/tieng-zh/kho.json",
  "./assets/call-hero.webp",
  "./course-a1.js",
  "./course-a2.js",
  "./course-b1.js",
  "./course-b2.js",
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

/* ============================================================
   NHẮC HỌC — nhận thông báo đẩy từ máy chủ
   Máy chủ gửi tới lúc 8h, 12h, 16h, 20h cho ai hôm đó chưa học.
   ============================================================ */
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { /* gói hỏng thì dùng lời mặc định */ }
  const tieuDe = d.title || "Bạn ơi, vào học thôi nào!";
  // iOS BẮT BUỘC phải hiện thông báo cho mọi gói đẩy nhận được. Nhận mà không
  // hiện thì hệ điều hành thu hồi quyền đẩy của cả app.
  e.waitUntil(self.registration.showNotification(tieuDe, {
    body: d.body || "Mở ON-Language ra làm một bài nhé.",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: d.tag || "nhac-hoc",
    renotify: true,
    data: { url: d.url || "./" },
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const dich = new URL((e.notification.data && e.notification.data.url) || "./",
                       self.location).href;
  e.waitUntil((async () => {
    const ds = await clients.matchAll({ type: "window", includeUncontrolled: true });
    // App đang mở sẵn thì đưa cửa sổ đó lên, đừng mở thêm cửa sổ thứ hai
    for (const c of ds) {
      if (c.url.startsWith(dich.split("#")[0]) && "focus" in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(dich);
  })());
});
