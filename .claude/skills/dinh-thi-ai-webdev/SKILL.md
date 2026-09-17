---
name: dinh-thi-ai-webdev
description: Quy trình làm việc kỹ thuật cho website 3dvietpro.com của thầy Đinh Thi Ai (Node.js/Express/EJS/Sequelize/MySQL, host trên inet.vn cPanel). Dùng skill này cho MỌI việc liên quan đến web này — sửa code, deploy, debug lỗi, thêm tính năng mới, kiểm tra AdSense/quảng cáo, chỉnh ảnh bìa blog, chèn link affiliate Shopee, hay bất cứ khi nào thầy nhắc tới 3dvietpro.com, cPanel, hoặc "web của thầy". Luôn đọc skill này trước khi bắt đầu, kể cả với yêu cầu tưởng chừng nhỏ — các gotcha bên dưới rất hay lặp lại.
---

# Làm việc trên 3dvietpro.com (dinh-thi-ai)

Repo local: `D:\CLAUDE CODE\dinh-thi-ai`. Chi tiết đầy đủ về credentials/env vars/domain nằm
trong memory `project_dinh-thi-ai_access.md` — đọc file đó để lấy mật khẩu DB, admin, API key...
Skill này tập trung vào QUY TRÌNH LÀM VIỆC và các GOTCHA kỹ thuật đã gặp thực tế, không lặp lại
credentials.

## 1. Quy trình deploy chuẩn (dùng cho MỌI thay đổi code)

```bash
# Local — sau khi sửa xong, luôn commit + push trước
git add <file...> && git commit -m "..." && git push origin main
```

Trên cPanel Terminal (mở qua Claude in Chrome — xem mục 3 bên dưới về cách vào):

```bash
cd ~/dinh-thi-ai && git pull origin main
```

Sau đó, TUỲ loại thay đổi mà làm thêm:

- **Sửa file `.ejs` có dùng class Tailwind MỚI chưa từng xuất hiện ở đâu trong site** (màu mới,
  kích thước arbitrary như `w-[220px]`, gradient mới...) → PHẢI build lại CSS, nếu không class đó
  sẽ không có trong `output.css` và phần tử sẽ trong suốt/vô hình (đã gặp thật: nút "Tham gia
  nhóm" bị `bg-blue-600` không hiện vì quên bước này):
  ```bash
  source ~/nodevenv/dinh-thi-ai/20/bin/activate && npm run build:css
  ```
- **Bất kỳ thay đổi code JS/EJS/controller nào** (kể cả khi đã build CSS) → PHẢI restart worker để
  Passenger nạp code mới, nút Restart trên UI cPanel không đáng tin:
  ```bash
  ps aux | grep 'dinh-thi-ai' | grep -v grep | awk '{print $2}' | xargs -r kill -9
  ```
- **Chỉ thêm/sửa file tĩnh thuần** (ảnh trong `public/images/`, `public/ads.txt`...) → không cần
  build CSS, không cần restart worker, `express.static` phục vụ trực tiếp từ đĩa.
- **Chạy 1 script backfill/migration một lần** (ví dụ `scripts/*.js`) → nhớ
  `source ~/nodevenv/dinh-thi-ai/20/bin/activate` trước, nếu không sẽ báo "node: command not
  found" (venv không tự động active ở tab Terminal mới).

Luôn verify lại trên trình duyệt thật sau khi deploy — đừng chỉ tin log terminal.

## 2. Gotcha cPanel Terminal hay gặp

- **Lệnh đầu tiên gõ ngay sau khi mở/điều hướng tới trang Terminal hay bị mất** (kết nối
  WebSocket của cPanel Terminal chưa kịp sẵn sàng dù trang đã load xong) — nếu chụp màn hình
  sau đó thấy prompt vẫn trống trơn (không có output gì), gõ lại NGUYÊN VĂN lệnh đó lần nữa,
  thường lần 2 sẽ ăn. Đừng tưởng lệnh đã chạy chỉ vì không báo lỗi gì.
- **Session cPanel hết hạn theo thời gian** — vào lại qua `portal.inet.vn` → đã đăng nhập sẵn
  Google → mục Hosting → bấm "Đăng nhập" ở dòng dịch vụ → mở tab cPanel mới đã đăng nhập.
- **Không gõ trực tiếp tiếng Việt có dấu vào Terminal** — bị lỗi encoding. Nếu cần nội dung
  tiếng Việt (ví dụ nội dung 1 script), viết ra file trước bằng Write tool rồi mới thao tác qua
  git, không paste trực tiếp vào dòng lệnh.
- **`computer{action:"screenshot"}` hay timeout ("renderer may be frozen")** trên các trang
  cPanel — chỉ cần gọi lại `screenshot` một lần nữa là thường được, không cần làm gì khác.
- Khi dùng `browser_batch` mà 1 bước lỗi (ví dụ "Cannot take screenshot with 0 width" vì tab
  không phải tab đang active) → gọi `tabs_context_mcp` để biết tab nào đang `selectedTabId`,
  hoặc điều hướng trực tiếp tab đó bằng `navigate` thay vì thao tác trên tab nền.

## 3. Kiến trúc & các hệ thống con — đọc file tham khảo tương ứng khi đụng tới

- **Ảnh bìa blog tự động (Wikimedia/Openverse/Pixabay)** → đọc
  [`references/cover-images.md`](references/cover-images.md)
- **Link affiliate Shopee gắn vào ảnh bìa/nội dung bài viết, trang /kiem-tien-affiliate, lightbox
  xem ảnh, gotcha CSP chặn `onclick=""` inline** → đọc
  [`references/affiliate-and-shopee-links.md`](references/affiliate-and-shopee-links.md)
- **Kiếm tiền quảng cáo (Google AdSense, ads.txt, Media.net và các mạng thay thế)** → đọc
  [`references/ad-monetization.md`](references/ad-monetization.md)

## 4. Nguyên tắc chung khi sửa code cho site này

- Site dùng Tailwind CDN? **Không** — Tailwind được build tĩnh (`tailwindcss -i input.css -o
  output.css --minify`), nên bắt buộc phải build lại mỗi khi thêm class mới (xem mục 1).
- View engine EJS + `express-ejs-layouts`, layout chính `views/layouts/main.ejs` — header/nav
  nằm ở `views/partials/header.ejs`, banner quảng cáo/khuyến mãi đặt trực tiếp trong layout để
  hiện trên mọi trang (xem `views/partials/business-offers.ejs` làm ví dụ).
- CSP (helmet, khai báo trong `server.js`) đã bật `'unsafe-inline'` cho `scriptSrc` nhưng **vẫn
  chặn thuộc tính `onclick=""` inline trong HTML** chạy đúng cách trên trình duyệt thật (lỗi ÂM
  THẦM — element/attribute vẫn có trong DOM, không báo gì ra console, nhưng
  `element.onclick` trả về `null`/không phải function). LUÔN dùng `addEventListener` trong 1
  khối `<script>` riêng thay vì `onclick=""` trên thẻ HTML.
- Ảnh trong carousel/gallery có thể bị trình duyệt hiểu nhầm thao tác bấm thành kéo-thả ảnh mặc
  định (native image drag), khiến sự kiện click không nổ ra dù đã gắn `addEventListener` đúng —
  thêm `draggable="false"` và `style="-webkit-user-drag: none; user-drag: none;"` vào thẻ `<img>`
  để phòng ngừa.
- Model `BlogPost` (`models/BlogPost.js`) có hook `beforeCreate` tự động gắn 1 link Shopee
  (`data/heroShopeeLinks.js`) vào MỌI bài viết mới tạo ra — hook này áp dụng bất kể bài được tạo
  qua đường nào (nhà máy tin tức tự động, trang quản trị, API auto-post). Đừng tưởng đây là bug
  nếu thấy marker `<!-- hero-shopee:... -->` xuất hiện trong `content` của bài — đó là chủ đích.
