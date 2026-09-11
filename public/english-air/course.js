/* ============================================================
   English Air — ghép các trình độ và dữ liệu giải đấu.
   Nạp sau course-a1 / course-a2 / course-b1.
   ============================================================ */

/* ============================================================
   CÁC KHOÁ HỌC — mỗi khoá là một CẶP ngôn ngữ: học tiếng gì, giải thích bằng
   tiếng gì. Thêm thứ tiếng mới về sau chỉ là thêm một dòng vào bảng này cộng
   với bộ bài của nó; không phải đụng vào app.

   `hoc`  — mã gốc thứ tiếng đang học   (khớp thư mục kho giọng đọc)
   `giai` — mã gốc thứ tiếng giải thích (cũng là ngôn ngữ giao diện)
   `co`   — mã cờ để vẽ lá cờ
   ============================================================ */
const KHOA = [
  {
    id: "en-vi",
    hoc: "en", maHoc: "en-gb", tenHoc: "Tiếng Anh", coHoc: "gb",
    giai: "vi", maGiai: "vi-vn", tenGiai: "Tiếng Việt", coGiai: "vn",
    nhan: "Tiếng Anh cho người Việt",
    levels: [A1, A2, B1],
  },
  {
    id: "vi-en",
    hoc: "vi", maHoc: "vi-vn", tenHoc: "Vietnamese", coHoc: "vn",
    giai: "en", maGiai: "en-gb", tenGiai: "English", coGiai: "gb",
    nhan: "Vietnamese for English speakers",
    levels: [VI1],
  },
];

/* Khoá đang mở. KHÔNG gán lại biến này — app giữ tham chiếu tới nó ở nhiều nơi,
   nên đổi khoá là thay RUỘT chứ không thay vỏ. Xem datKhoa() bên app.js. */
const COURSE = {
  id: KHOA[0].id,
  name: KHOA[0].tenHoc,
  levels: KHOA[0].levels,
};

/* Giải đấu tuần — đối thủ mô phỏng, lưu trên máy người dùng */
const RIVALS = [
  { name: "Minh Anh",   xp: 620 }, { name: "Quốc Bảo",   xp: 545 },
  { name: "Thu Hà",     xp: 498 }, { name: "Gia Huy",    xp: 430 },
  { name: "Khánh Linh", xp: 388 }, { name: "Trọng Nhân", xp: 322 },
  { name: "Bảo Ngọc",   xp: 275 }, { name: "Đức Thắng",  xp: 210 },
  { name: "Hải Yến",    xp: 165 }, { name: "Phương Vy",  xp: 120 }
];

/* Bậc giải đấu, đi lên khi vào top 5 tuần */
/* Màu bậc đủ tối để icon trắng đạt tương phản 3:1 ở cả nền sáng lẫn nền tối. */
const LEAGUES = [
  { id: "bronze",   name: "Đồng",      color: "#92400E" },
  { id: "silver",   name: "Bạc",       color: "#52525B" },
  { id: "gold",     name: "Vàng",      color: "#A16207" },
  { id: "platinum", name: "Bạch Kim",  color: "#0F766E" },
  { id: "diamond",  name: "Kim Cương", color: "#4F46E5" }
];
