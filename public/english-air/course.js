/* ============================================================
   English Air — ghép các trình độ và dữ liệu giải đấu.
   Nạp sau course-a1 / course-a2 / course-b1.
   ============================================================ */

/* Ghép các trình độ lại thành một khoá học */
const COURSE = {
  name: "Tiếng Anh",
  levels: [A1, A2, B1]
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
