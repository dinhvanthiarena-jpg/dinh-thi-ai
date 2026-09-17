# Link affiliate Shopee & trang /kiem-tien-affiliate

## Gắn link Shopee vào MỌI bài viết (tự động, kể cả bài tương lai)

`models/BlogPost.js` có hook `beforeCreate`: nếu `content` chưa có marker `<!-- hero-shopee: -->`,
tự động chọn ngẫu nhiên 1 link trong `data/heroShopeeLinks.js` và append marker
`<!-- hero-shopee:URL -->` vào cuối content. Hook này chạy bất kể bài được tạo qua đường nào
(nhà máy tin tức tự động, trang quản trị, `/api/auto-post`) — đây là chỗ ĐÚNG để sửa nếu cần đổi
cách gán link cho bài mới, không cần sửa từng nơi tạo bài.

`controllers/blogController.js` (hàm `show`) đọc lại marker này bằng regex, build ra
`heroShopeeLink` = `/go/shopee?url=...&name=...` rồi truyền sang view. `views/blog/show.ejs`
dùng biến này để: (1) phủ 1 lớp `<a>` trong suốt lên TOÀN BỘ ảnh bìa (không chỉ 1 góc nhỏ — đã
từng bị thầy yêu cầu sửa lại vì lúc đầu chỉ làm badge góc), (2) hiện thêm 1 badge nhỏ luôn hiện ở
góc trên-phải ảnh (để user trên mobile không cần hover vẫn thấy). Cả 2 đều `target="_blank"` mở
tab mới đi thẳng ra Shopee, không phải chỉ cuộn xuống — đây là yêu cầu tường minh, đừng đổi lại
thành anchor `#` nếu không được hỏi.

**Bài cũ đã đăng trước khi có hook này**: chạy 1 lần `scripts/assign-hero-shopee-links.js` để
backfill marker cho toàn bộ bài cũ (idempotent, bỏ qua bài đã có marker).

**7 bài AI & Công nghệ ngày 16/9 là ngoại lệ lịch sử**: được gắn theo cơ chế CŨ HƠN, dùng marker
riêng `<!-- shopee-picks-ai-16-9 -->` (từ `scripts/insert-shopee-picks-ai-posts.js`), hiển thị
hẳn 1 khối "Gợi ý mua sắm hôm nay" với 4 sản phẩm cụ thể (ảnh+tên+giá lấy tay từ Shopee) chèn vào
`content`, KHÔNG dùng cơ chế `hero-shopee` ngẫu nhiên. `blogController.js` check marker cũ này
TRƯỚC, marker `hero-shopee` mới sau — đừng xoá nhánh check cũ nếu không được yêu cầu, sẽ làm 7
bài đó mất link đúng của chúng.

## Widget "Gợi ý mua sắm hôm nay" toàn site (khác với hero-shopee ở trên)

`views/partials/shopee-picks.ejs` — hiển thị Ở CUỐI mọi trang blog + trang `/uu-dai`, dùng danh
sách CỐ ĐỊNH trong `data/shopeePicks.js` (15 sản phẩm balo/sữa/nước giặt..., không liên quan chủ
đề bài viết, chỉ là widget quảng cáo chung). Đây là hệ thống HOÀN TOÀN RIÊNG so với `hero-shopee`
— đừng nhầm lẫn khi thầy nhắc "gợi ý mua sắm".

`controllers/affiliateController.js` — route `/go/shopee?url=...&name=...` là điểm trung chuyển
DUY NHẤT để redirect ra Shopee (ghi log `AffiliateClick` + chỉ cho phép host `shopee.vn`/
`s.shopee.vn` để tránh open-redirect). MỌI link Shopee hiển thị trên site (widget cũ, hero mới,
trang kiem-tien-affiliate) đều nên đi qua route này, không link thẳng ra Shopee.

## Trang /kiem-tien-affiliate — landing page giới thiệu cộng đồng hoàn tiền

Route: `routes/index.js` → `affiliateController.landing` → view
`views/kiem-tien-affiliate.ejs`. Nội dung: hero + thẻ giả lập giao diện xem trước nhóm Zalo thật
(icon, tên nhóm "CÙNG NHAU KIẾM TIỀN AFF12", nút "Tham gia nhóm" có hiệu ứng ánh sáng chạy chữ,
mã QR sinh động bằng API công khai `api.qrserver.com`) + carousel 6 ảnh slide marketing (file
gốc trong `public/images/affiliate/slide-*.png`) + lightbox xem ảnh cỡ lớn.

### Gotcha đã tốn nhiều vòng debug: CSP chặn `onclick=""` inline

Ban đầu lightbox dùng `onclick="ktaOpenLightbox(...)"` trực tiếp trên thẻ `<img>` — hoàn toàn
không hoạt động trên trình duyệt thật dù gọi hàm thủ công qua console vẫn chạy tốt. Nguyên nhân:
CSP của site (`helmet` trong `server.js`) tuy có `'unsafe-inline'` cho `scriptSrc`, nhưng thuộc
tính event-handler inline (`onclick=""`) vẫn không được compile thành handler thật trên 1 số
luồng — biểu hiện: `element.onclick` trả về `null` (typeof `"object"`), không báo lỗi gì ra
console. **Fix: luôn dùng `addEventListener` trong 1 khối `<script>` riêng**, không dùng
`onclick=""`/`onmousedown=""` trên thẻ HTML — pattern này áp dụng cho MỌI phần tử tương tác mới
thêm vào site, không chỉ lightbox này.

### Gotcha thứ 2: ảnh trong carousel bị hiểu nhầm thành kéo-thả

Sau khi sửa CSP, click vẫn đôi khi không nổ ra vì trình duyệt tự bắt gesture kéo-thả ảnh mặc
định (`<img>` mặc định `draggable`). Fix: thêm `draggable="false"` +
`style="-webkit-user-drag: none; user-drag: none;"` trên mọi `<img>` có gắn click handler trong
carousel/gallery.

### Lightbox có điều hướng prev/next

`ktaSlides` là mảng `{src, alt}` build từ toàn bộ `.kta-slide-thumb` lúc load trang,
`ktaCurrentIndex` theo dõi vị trí hiện tại, hỗ trợ nút mũi tên trái/phải, đếm trang "X / 6", và
phím tắt ArrowLeft/ArrowRight/Escape.

## Icon nhóm Zalo trên trang landing dùng tạm ảnh cover chung

`slide-0-cover.png` (ảnh mascot "MUA HÀNG ĐƯỢC HOÀN TIỀN") được tái sử dụng làm icon vuông cho
thẻ nhóm Zalo — không phải icon vuông thật của nhóm Zalo (không có file riêng), chỉ là lựa chọn
xấp xỉ hợp lý, không cần tìm/tạo icon vuông riêng trừ khi thầy yêu cầu.

## Banner "3 ô hợp tác kinh doanh" hiện trên MỌI trang

`views/partials/business-offers.ejs`, include ngay dưới header trong `views/layouts/main.ejs`
(trước `category-navbar`). 3 ô: (1) Hợp tác kinh doanh — kiếm tiền thụ động từ AI → link nhóm
Zalo, (2) Thương mại Tool sản xuất video → tạm link `/lien-he` (chưa có trang sản phẩm riêng),
(3) Hợp tác thương mại Tool đăng bài tự động → tạm link `/lien-he`. Nếu sau này có trang giới
thiệu riêng cho tool video hoặc tool đăng bài tự động, cập nhật lại 2 link này.

## Thẻ Zalo lồng vào cột "Kinh doanh & Chuyển đổi số" trên trang chủ

`views/home.ejs`, trong vòng lặp `restColumns.forEach` — khi `col.category.slug ===
'kinh-doanh'`, chèn 1 thẻ Zalo đặc biệt làm item ĐẦU TIÊN của lưới 4 cột, đồng thời chỉ lấy
`col.posts.slice(0, 3)` (bớt 1 bài thật để nhường chỗ) để tổng vẫn đúng 4 ô. Toàn bộ khối
`kinh-doanh` này được dịch nhẹ sang phải (`sm:ml-4 lg:ml-6`) theo yêu cầu riêng của thầy.
