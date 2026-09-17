# Ảnh bìa blog tự động — Wikimedia + Openverse + Pixabay

`services/newsFactoryService.js` là "Nhà máy tin tức AI" — tự động tổng hợp tin theo chuyên mục
thành bài viết gốc và đăng lên blog. Hàm `fetchStockImage()` tìm ảnh thật, miễn phí bản quyền,
đúng nội dung bài, theo thứ tự thử: Wikimedia Commons → Openverse → Pixabay, gộp candidate từ cả
3 nguồn rồi thử tải + kiểm tra độ liên quan bằng Claude Vision trước khi chốt dùng.

## Vì sao cần tới 3 nguồn

Wikimedia Commons gần như không có ảnh tự do về người nổi tiếng/scandal showbiz cụ thể → chuyên
mục "Giải trí" (Entertainment) từng gần như 100% phải dùng icon SVG dự phòng. Thêm Openverse rồi
Pixabay để giải quyết đúng vấn đề này.

## Gotcha: Openverse bị Cloudflare chặn, không liên quan gì đến logic code

`api.openverse.org` đứng sau Cloudflare bot-management. Request với User-Agent tự đặt tên
(`DinhThiAi-NewsFactory/1.0`) bị coi là bot, Cloudflare trả về trang thử thách HTML ("Just a
moment...") thay vì JSON — **lỗi ÂM THẦM**: `fetch()` vẫn trả về HTTP 200 OK, code không throw
gì cả, chỉ là `data.results` sẽ undefined nên candidate luôn = 0. Đã thử:
- Đổi User-Agent giả trình duyệt thật → vẫn bị chặn khi gọi bằng `fetch()` của Node (dựa trên
  undici).
- Gọi `curl` với CÙNG header y hệt → đôi khi lấy được JSON thật, đôi khi vẫn bị chặn — **không
  ổn định**, khả năng cao Cloudflare fingerprint theo TLS/HTTP client chứ không chỉ User-Agent.

Kết luận: Openverse chỉ nên coi là nguồn "ăn may" (best-effort qua `execCurl` helper trong
`searchOpenverse()`), KHÔNG dựa vào nó làm nguồn chính. **Pixabay mới là nguồn đáng tin cậy** —
API chính thức, không bị Cloudflare, cần `PIXABAY_API_KEY` trong biến môi trường (đặt qua cPanel
→ Setup Node.js App, không phải file `.env`, xem `project_dinh-thi-ai_access.md`).

Cách chẩn đoán nhanh nếu nghi ngờ 1 nguồn nào đó không trả kết quả: bật
`NEWSFACTORY_DEBUG=1 node scripts/<ten-script>.js` — code trong `fetchStockImage()` đã có sẵn
log số candidate từng nguồn (`wikimedia=X openverse=Y pixabay=Z`) và kết quả tải/Vision-check
từng candidate, không cần thêm log mới mỗi lần debug.

## Các bộ lọc đã có sẵn (đừng viết lại)

- `LOGO_TITLE_PATTERN` — loại ảnh có chữ logo/wordmark/emblem/flag trong tên file.
- `PERSON_PORTRAIT_PATTERN` + `isPersonPortrait()` — loại ảnh chân dung định danh 1 người cụ thể
  (chính khách...), kiểm tra cả `extmetadata.Categories` của Wikimedia chứ không chỉ tên file
  (Commons hay gắn "Portraits of <Tên>" vào Categories dù filename không gợi ý gì).
- `isImageRelevant()` — dùng Claude Vision so ảnh với tiêu đề bài, PHẢI giữ prompt ở mức RỘNG
  (chấp nhận ảnh cùng lĩnh vực/ngữ cảnh lớn, không cần khớp đúng sự kiện) — từng chỉnh quá chặt
  khiến 87% ảnh tốt bị từ chối oan, phải rollback. Khi phân vân, prompt yêu cầu luôn trả lời "CO".

## Chuyên mục "Sản phẩm tin đồn/chưa ra mắt" là giới hạn thật, không phải bug

Ví dụ iPhone chưa công bố chính thức: không có ảnh thật nào tồn tại hợp pháp cho sản phẩm chưa
ra mắt — dù tăng số candidate thử (đã tăng từ 5 lên 12) vẫn có thể fallback về SVG. Đây là giới
hạn khách quan, không cần cố sửa thêm.
