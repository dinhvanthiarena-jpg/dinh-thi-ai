# Đinh Thi Ai — Nền tảng đào tạo công nghệ AI

Website đào tạo trực tuyến (LMS) xây dựng bằng **Node.js + Express + EJS + MongoDB**, bao gồm:

- Trang chủ, giới thiệu, blog kiến thức AI, liên hệ tư vấn
- Danh mục khóa học, trang chi tiết khóa học, đánh giá học viên
- Đăng ký / đăng nhập (JWT + cookie)
- Đăng ký khóa học + thanh toán (kiến trúc sẵn sàng tích hợp VNPay/Stripe, mặc định dùng cổng demo)
- Khu vực học tập: xem bài giảng, theo dõi tiến độ, đánh giá khóa học
- Trang quản trị: quản lý khóa học/bài học, blog, đơn hàng, học viên, tin nhắn liên hệ

## 1. Cài đặt local

### Yêu cầu
- Node.js >= 18
- MongoDB (dùng [MongoDB Atlas](https://www.mongodb.com/atlas) miễn phí, hoặc MongoDB cài local)

### Các bước

```bash
git clone <repo-url> dinh-thi-ai
cd dinh-thi-ai
npm install
cp .env.example .env
```

Mở `.env` và điền:
- `MONGO_URI`: chuỗi kết nối MongoDB Atlas
- `JWT_SECRET`, `SESSION_SECRET`: chuỗi ngẫu nhiên dài (dùng `openssl rand -hex 32` để tạo)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: tài khoản quản trị sẽ được tạo khi seed

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
models/         Schema MongoDB (User, Course, Lesson, Order, Enrollment, BlogPost, Review, ContactMessage)
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

## 5. Deploy lên Hostinger

Node.js cần một tiến trình server chạy liên tục — khác với hosting PHP tĩnh. Có 2 cách trên Hostinger:

### Cách A — Hostinger VPS (khuyến nghị cho LMS có database)

1. Thuê gói **VPS** (KVM 1/2), cài hệ điều hành Ubuntu.
2. SSH vào VPS, cài Node.js, Nginx, PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm install -g pm2
   ```
3. Clone repo và cài đặt:
   ```bash
   git clone https://github.com/<your-username>/dinh-thi-ai.git
   cd dinh-thi-ai
   npm install --production
   cp .env.example .env   # rồi điền giá trị production
   npm run build:css
   npm run seed            # chỉ chạy lần đầu
   ```
4. Chạy app bằng PM2 (tự khởi động lại khi crash hoặc reboot server):
   ```bash
   pm2 start server.js --name dinh-thi-ai
   pm2 save
   pm2 startup
   ```
5. Cấu hình Nginx làm reverse proxy (trỏ domain vào app chạy ở cổng 3000), rồi bật SSL miễn phí bằng Certbot:
   ```bash
   sudo certbot --nginx -d dinhthiai.com -d www.dinhthiai.com
   ```
6. Khi cập nhật code mới: `git pull && npm install --production && npm run build:css && pm2 restart dinh-thi-ai`

### Cách B — Hostinger hPanel "Node.js App" (gói Business/Cloud hỗ trợ)

1. Trong hPanel, chọn **Website > Node.js** > Create Application.
2. Chọn phiên bản Node.js >= 18, entry file là `server.js`.
3. Kết nối GitHub repo (hPanel hỗ trợ deploy từ Git) hoặc upload code qua File Manager/FTP.
4. Khai báo các biến môi trường (`.env`) trong phần **Environment Variables** của hPanel.
5. Chạy `npm install`, `npm run build:css` qua terminal tích hợp của hPanel, rồi Restart Application.

### Database khi deploy

Nên dùng **MongoDB Atlas** (cloud) thay vì tự cài MongoDB trên Hostinger — không cần quản trị, có gói miễn phí,
kết nối được từ cả VPS lẫn hPanel Node App. Nhớ whitelist địa chỉ IP của server Hostinger trong Atlas Network Access.

## 6. Checklist trước khi ra mắt

- [ ] Đổi `JWT_SECRET`, `SESSION_SECRET`, mật khẩu admin sang giá trị ngẫu nhiên mạnh
- [ ] Trỏ domain thật, bật HTTPS (Let's Encrypt/Certbot)
- [ ] Thay nội dung khóa học/blog mẫu bằng nội dung thật qua trang `/admin`
- [ ] Thay logo, ảnh minh họa trong `public/images`
- [ ] Cấu hình cổng thanh toán thật (VNPay/Momo/Stripe)
- [ ] Cấu hình SMTP nếu muốn gửi email xác nhận/tư vấn
- [ ] Bật backup định kỳ cho MongoDB Atlas
