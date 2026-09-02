# Đinh Thi Ai — Nền tảng đào tạo công nghệ AI

Website đào tạo trực tuyến (LMS) xây dựng bằng **Node.js + Express + EJS + MySQL (Sequelize)**, bao gồm:

- Trang chủ, giới thiệu, blog kiến thức AI, liên hệ tư vấn
- Danh mục khóa học, trang chi tiết khóa học, đánh giá học viên
- Đăng ký / đăng nhập (JWT + cookie)
- Đăng ký khóa học + thanh toán (kiến trúc sẵn sàng tích hợp VNPay/Stripe, mặc định dùng cổng demo)
- Khu vực học tập: xem bài giảng, theo dõi tiến độ, đánh giá khóa học
- Trang quản trị: quản lý khóa học/bài học, blog, đơn hàng, học viên, tin nhắn liên hệ

## 1. Cài đặt local

### Yêu cầu
- Node.js >= 18
- MySQL 5.7+ hoặc MariaDB 10.2+ (hầu hết hosting cPanel đều có sẵn miễn phí; hoặc cài local)

### Các bước

```bash
git clone <repo-url> dinh-thi-ai
cd dinh-thi-ai
npm install
cp .env.example .env
```

Mở `.env` và điền:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: thông tin kết nối MySQL (tạo database + user qua cPanel "MySQL Database Wizard" hoặc phpMyAdmin nếu chưa có)
- `JWT_SECRET`, `SESSION_SECRET`: chuỗi ngẫu nhiên dài (dùng `openssl rand -hex 32` để tạo)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: tài khoản quản trị sẽ được tạo khi seed

Bảng dữ liệu (users, courses, lessons...) sẽ tự động được tạo khi server khởi động lần đầu (Sequelize `sync()`), không cần chạy migration thủ công.

Build CSS (Tailwind) và tạo dữ liệu mẫu:

```bash
npm run build:css
npm run seed
```

Chạy server ở chế độ phát triển (tự reload khi sửa code):

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Đăng nhập trang quản trị tại `/auth/login` bằng tài khoản admin đã seed, sau đó vào `/admin`.

Khi chỉnh sửa giao diện, chạy song song để CSS tự build lại:

```bash
npm run watch:css
```

## 2. Cấu trúc thư mục

```
config/         Kết nối database
controllers/    Xử lý logic từng nhóm chức năng
middleware/     Auth, upload file, xử lý lỗi
models/         Sequelize models (User, Course, Lesson, Order, Enrollment, BlogPost, Review, ContactMessage)
routes/         Định tuyến Express
views/          Giao diện EJS (layouts, partials, pages)
public/         CSS/JS/ảnh tĩnh, file upload
services/       Tầng trừu tượng cho thanh toán
scripts/seed.js Script tạo dữ liệu mẫu
```

## 3. Tích hợp thanh toán thật (VNPay/Stripe)

Mặc định hệ thống dùng `PAYMENT_PROVIDER=mock` — mô phỏng luồng thanh toán để bạn kiểm thử toàn bộ tính năng mà
không cần tài khoản merchant. Khi đã có tài khoản VNPay/Stripe:

1. Điền `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` (hoặc Stripe secret key) vào `.env`
2. Cập nhật `PAYMENT_PROVIDER`
3. Bổ sung logic tạo URL thanh toán / xác thực callback trong `services/paymentService.js`
4. Thêm route xử lý callback (VNPay return URL / Stripe webhook) tương ứng trong `routes/checkout.js`

## 4. Đẩy code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit: Dinh Thi Ai LMS platform"
git branch -M main
git remote add origin https://github.com/<your-username>/dinh-thi-ai.git
git push -u origin main
```

**Lưu ý:** file `.env` đã được loại trừ trong `.gitignore` — không bao giờ commit thông tin nhạy cảm
(mật khẩu, chuỗi kết nối database, secret key).

## 5. Deploy lên hosting cPanel (đã kiểm chứng thực tế)

Nhiều gói shared hosting cPanel (kể cả gói rẻ như "Turbo Hosting") **chặn kết nối ra ngoài tới các cổng
không phải 80/443** (ví dụ MongoDB Atlas dùng cổng 27017) — đây là lý do dự án này dùng MySQL thay vì MongoDB,
vì MySQL chạy ngay trên cùng server (`localhost`), không cần mở cổng ra ngoài.

### Bước 1 — Tạo database MySQL

Trong cPanel: **MySQL® Database Wizard** → tạo database + user + gán full privileges. Ghi lại tên database/user
đầy đủ tiền tố (cPanel tự thêm tiền tố dạng `tenkhoan_tendatabase`).

### Bước 2 — Đưa code lên server qua Git

Trong cPanel: **Git™ Version Control** → Create → bật "Clone a Repository", dán URL repo GitHub (ví dụ
`https://github.com/<username>/dinh-thi-ai.git`), đặt Repository Path (ví dụ `dinh-thi-ai`) → Create.

### Bước 3 — Tạo Node.js App

Trong cPanel: **Setup Node.js App** → Create Application:
- Node.js version: chọn bản mới nhất có sẵn (>= 18)
- Application mode: **Production**
- Application root: thư mục vừa clone ở Bước 2 (ví dụ `dinh-thi-ai`)
- Application URL: chọn domain sẽ dùng cho web
- Application startup file: `server.js`
- Thêm toàn bộ biến môi trường trong `.env.example` vào phần **Environment variables** (bao gồm `DB_HOST=localhost`,
  `DB_NAME`, `DB_USER`, `DB_PASSWORD` lấy từ Bước 1)

Bấm **Create**, sau đó bấm **Run NPM Install**. Nếu giao diện báo lỗi "web application is inaccessible" ngay sau khi
tạo — thường không sao, đó chỉ là bước tự kiểm tra domain trong lúc DNS/SSL chưa sẵn sàng; kiểm tra qua **Terminal**
(cPanel có sẵn) bằng lệnh sau để xác nhận cài đặt thật sự thành công:

```bash
source ~/nodevenv/<app-root>/<node-version>/bin/activate
cd ~/<app-root>
npm install
tail -n 30 stderr.log
```

### Bước 4 — Build CSS và khởi động

Vẫn trong Terminal (đã activate virtualenv ở trên):
```bash
npm run build:css
npm run seed   # chỉ chạy lần đầu để tạo tài khoản admin + dữ liệu mẫu
```
Quay lại **Setup Node.js App**, bấm **Restart**.

### Cập nhật code sau này

```bash
# Trong cPanel Git Version Control, bấm "Pull" hoặc "Update from Remote"
# rồi trong Terminal:
source ~/nodevenv/<app-root>/<node-version>/bin/activate
cd ~/<app-root>
npm install
npm run build:css
# rồi bấm Restart trong Setup Node.js App
```

## 6. Module "Quản lý Mùn cưa & Củi" (`/mun-cui`)

Module quản lý hoạt động của xưởng mùn cưa/củi: xe hàng ngày đi mua mùn cưa tại các
xưởng xẻ, mang về xưởng tập kết để ủ, nhân công tính lương theo ngày, và mảng
kinh doanh củi (mua vào rồi bán lại cho công ty). Dùng chung hệ thống đăng nhập
của site (email/SĐT + mật khẩu) nhưng có phân quyền riêng.

**Cấu trúc chức năng:**
- **Chuyến mua mùn** — ghi nhận từng chuyến xe đi mua mùn (xưởng xẻ, xe, tài xế,
  khối lượng, đơn giá, chi phí xăng dầu...). Mỗi chuyến tự động tạo một **lô mùn**
  tương ứng bên Kho mùn.
- **Kho mùn (tập kết & ủ)** — theo dõi từng lô mùn theo trạng thái *Đang ủ* /
  *Đã ủ xong* / *Đã xuất hết*, xem tồn kho theo đơn vị (khối/bao/tấn).
- **Bán mùn** — ghi nhận đơn bán mùn đã ủ cho khách.
- **Mua củi** / **Bán củi cho công ty** — theo dõi việc mua củi rồi bán lại cho
  công ty, tính lãi riêng biệt với mảng mùn.
- **Công nhật** — bảng công nhân công tính theo ngày (không theo tháng), gắn với
  từng công việc (đi mua mùn, bốc xếp, đảo ủ, bốc củi...).
- **Chi phí khác** — xăng dầu, sửa xe, thuê bãi... không gắn với một chuyến/lô cụ thể.
- **Danh mục** — Xưởng xẻ, Xe, Nhân công dùng chung cho các form nhập liệu.
- **Báo cáo thu chi** — tổng hợp chi phí/doanh thu/lợi nhuận theo khoảng ngày tùy chọn.
- **Thành viên Ban quản trị** — cấp/gỡ quyền truy cập module cho từng tài khoản.

**Phân quyền (`sawdustRole` trên bảng `users`):**
| Vai trò | Quyền hạn |
| --- | --- |
| Quản trị viên site (`role='admin'`) | Toàn quyền module này, tương đương *Chủ xưởng*, không cần cấu hình thêm |
| `owner` — Chủ xưởng/Ban quản trị | Toàn quyền + cấp/gỡ quyền thành viên |
| `manager` — Quản lý | Nhập liệu + sửa/xóa mọi mục + xem báo cáo |
| `staff` — Nhân viên | Chỉ nhập liệu (chuyến mua mùn, công nhật, bán hàng...), không xóa được, không xem báo cáo tổng, không quản lý danh mục |

Tài khoản `ADMIN_EMAIL` (đã seed sẵn quyền `role='admin'`) có thể vào thẳng
`/mun-cui/thanh-vien` để cấp quyền cho các thành viên còn lại — chỉ cần nhập
email/SĐT của họ; nếu họ chưa có tài khoản, điền thêm họ tên + mật khẩu để tạo
mới ngay tại đó.

## 7. Checklist trước khi ra mắt

- [ ] Đổi `JWT_SECRET`, `SESSION_SECRET`, mật khẩu admin sang giá trị ngẫu nhiên mạnh
- [ ] Trỏ domain thật, bật HTTPS (Let's Encrypt/Certbot)
- [ ] Thay nội dung khóa học/blog mẫu bằng nội dung thật qua trang `/admin`
- [ ] Thay logo, ảnh minh họa trong `public/images`
- [ ] Cấu hình cổng thanh toán thật (VNPay/Momo/Stripe)
- [ ] Cấu hình SMTP nếu muốn gửi email xác nhận/tư vấn
- [ ] Bật backup định kỳ cho database MySQL (cPanel có sẵn Backup Wizard)
