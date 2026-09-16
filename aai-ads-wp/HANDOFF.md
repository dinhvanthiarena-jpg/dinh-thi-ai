# Bàn giao: A-AI Ads WordPress plugin — đang kẹt ở bước kích hoạt trên suni.vn

Tài liệu này để dán sang 1 phiên Claude khác (hoặc đọc lại sau) và tiếp tục ngay, không cần hỏi lại thầy Đinh Thi Ai từ đầu.

## Bối cảnh / mục tiêu

Thầy Đinh Thi Ai quản lý web `D:\CLAUDE CODE\dinh-thi-ai` (3dvietpro.com) và muốn tính năng "A-AI Ads — AI tự động đăng bài" (viết bài AI + đăng Facebook Page + đăng lên chính website) chạy được trên **web khách hàng của thầy**, không chỉ web Node.js của chính thầy.

Quyết định kiến trúc (2026-09-16): **3dvietpro.com chỉ lo cấp/thu hồi license key** (hệ thống key `AIWEB-XXXX-XXXX-XXXX` đã có sẵn ở `/admin/aai-license-keys`, tự hết hạn sau 30 ngày, gia hạn bằng nút "Gia hạn +30 ngày"). **Tool thật phải chạy ngay trong web của khách** để khách tự vận hành, không qua 3dvietpro.com. Vì khách đầu tiên (suni.vn) chạy WordPress (không phải Node.js), phải viết 1 bản PHP riêng — đó là `aai-ads-wp/` này.

## Đã xong — code plugin hoàn chỉnh

Toàn bộ code ở `D:\CLAUDE CODE\dinh-thi-ai\aai-ads-wp\`, đã commit + push lên GitHub (`https://github.com/dinhvanthiarena-jpg/dinh-thi-ai.git`, nhánh `main`, commit `516979f`). Xem `README.md` trong thư mục này để biết chi tiết đầy đủ. Tóm tắt:

- `aai-ads.php` — entry point plugin.
- `includes/class-license.php` — kích hoạt/xác minh key qua `https://3dvietpro.com/api/aai-license/verify`, port từ `aai-ads-module/activation.js`.
- `includes/class-ai-writer.php` — gọi Claude viết bài, parse JSON an toàn theo kiểu đếm độ sâu ngoặc `{}` (KHÔNG dùng regex tham lam, KHÔNG BAO GIỜ đăng nội dung thô khi AI trả JSON lỗi — đây là bug đã xảy ra 2 lần trong dự án, xem `feedback_aai_ads_caption_style` và bản vá `fb-ads-manager/main.js` ngày 2026-09-16).
- `includes/class-facebook.php` — OAuth Facebook (App riêng của khách), đăng bài lên Page.
- `includes/class-poster.php` — 1 lượt chạy: viết bài + đăng Fanpage + đăng lên chính site (`wp_insert_post()`).
- `includes/class-cron.php` — lên lịch WP-Cron theo số bài/ngày.
- `includes/class-settings-page.php` — toàn bộ giao diện wp-admin (kích hoạt key, cấu hình Facebook/Anthropic/chủ đề, nút "Chạy thử ngay", nhật ký).

Code đã được đọc lại kỹ nhiều lần để bắt lỗi cú pháp PHP (không có PHP CLI cục bộ để chạy `php -l`), nhưng **CHƯA từng thực thi thật** (chưa kích hoạt được lần nào) — xem phần "Vướng mắc" dưới đây.

## Đã làm trên suni.vn

- suni.vn là web WordPress thật của khách (xem memory `project_sunistore_shop`), thầy quản lý dạng reseller.
- Đăng nhập `https://suni.vn/wp-admin` bằng user **SuniStore** / pass **SuniStore2026vip** (đã lưu trong memory, phiên trước đã đăng nhập qua Claude in Chrome, session còn giữ).
- Đã tạo 1 **Application Password** của WordPress (Users → Profile → Application Passwords) tên "AI Ads Tool": `wptl 5vUU 6blM dS8B SblR c0xo` — dùng cho 1 tính năng KHÁC đã xong (adapter WordPress bên `services/aaiAdsService.js` trên chính 3dvietpro.com, đăng bài lên suni.vn qua REST API `/wp-json/wp/v2/posts` — cái NÀY đã verify chạy thật thành công, KHÔNG liên quan đến plugin `aai-ads-wp`). Có thể tái dùng App Password này nếu cần test REST API riêng.
- Plugin `aai-ads-wp` đã **tải lên và cài đặt thành công** nhiều lần (thông báo "Plugin đã được cài đặt thành công") nhưng **kích hoạt luôn báo lỗi**.

## Vướng mắc — lỗi "Tập tin của plugin không tồn tại"

Mỗi lần bấm "Kích hoạt" sau khi cài, WordPress báo lỗi `Tập tin của plugin không tồn tại` với đường dẫn có dạng **lồng đôi cùng tên thư mục**:
- Lần 1 (zip tên `aai-ads.zip`, thư mục trong zip là `aai-ads-wp/`) → lỗi với path `aai-ads/aai-ads-wp/aai-ads.php` (thư mục ngoài "aai-ads" trùng tên file zip, thư mục trong "aai-ads-wp" đúng như trong zip — bị lồng thêm 1 lớp ngoài).
- Lần 2 (đổi tên, zip là `aai-ads.zip` chứa thư mục `aai-ads/` — CHÍNH XÁC 1 lớp) → báo **"Thư mục đích đã tồn tại: .../wp-content/plugins/aai-ads/"** (folder rác từ lần 1 chưa dọn được — xem mục Xoá thất bại bên dưới).
- Lần 3 (đổi tên hẳn sang `aai-ads-tool.zip` chứa thư mục `aai-ads-tool/`, xác nhận bằng `System.IO.Compression.ZipFile` là zip có cấu trúc ĐÚNG 1 lớp) → **VẪN bị lỗi y hệt**, lần này path là `aai-ads-tool/aai-ads-tool/aai-ads.php`.

**Kết luận**: đây không phải lỗi do cấu trúc zip của mình (đã xác nhận structurally đúng ở lần 3) — có vẻ là hành vi/lỗi từ chính cơ chế cài đặt plugin của bản WordPress đang chạy trên hosting suni.vn (footer trang ghi "Phiên bản 7.1" — một bản WordPress tương lai trong dòng thời gian mô phỏng này), TỰ Ý bọc thêm 1 lớp thư mục trùng tên bất kể tên gì được đặt.

**Đã thử xoá bản cài lỗi lần 1** (`aai-ads/aai-ads-wp/aai-ads.php`) qua wp-admin (cả link "Xóa" trực tiếp lẫn điều hướng thẳng URL `action=delete-selected` để né hộp thoại JS `confirm()` — hộp thoại `confirm()` bị kẹt/không phản hồi phím Enter qua CDP, phải né bằng cách gọi thẳng URL): trang báo **"Các plugin được chọn đã bị xóa"** (thành công) nhưng **plugin vẫn còn nguyên trong danh sách y hệt** ở lần tải lại trang sau đó (đã thử cả tab mới hoàn toàn) — nghĩa là việc xoá KHÔNG thực sự có hiệu lực, dù thông báo nói đã xoá.

**Chưa có quyền truy cập File Manager/FTP/SSH vào hosting suni.vn** — chỉ có quyền qua giao diện wp-admin (không có `plugin-editor.php` khả dụng — trang này tự động điều hướng ngược lại `plugins.php`, có thể do "Disallow File Edit" đã bật, phổ biến trên hosting quản lý sẵn).

## Việc cần làm tiếp (theo thứ tự ưu tiên)

1. **Xin thầy quyền File Manager hoặc FTP/SSH vào hosting của suni.vn** (qua tài khoản reseller ở `portal.inet.vn/list-service?rsale=linhttt`, xem memory `project_sunistore_shop`) — có quyền này thì vào thẳng `wp-content/plugins/`, xoá sạch mọi thư mục rác (`aai-ads/`, `aai-ads-tool/` và bất kỳ biến thể nào khác đã tạo ra trong quá trình thử), rồi tải plugin lên lại bằng 1 trong 2 cách: (a) copy thư mục `aai-ads-wp` thẳng vào `wp-content/plugins/aai-ads/` qua FTP (bỏ qua hẳn cơ chế upload-zip lỗi của wp-admin), hoặc (b) thử lại upload zip xem lỗi lồng thư mục có còn tái diễn không khi thư mục đích ban đầu sạch hoàn toàn.
2. **Nếu vẫn lồng thư mục dù đã dọn sạch**: thử tải lên 1 plugin WordPress THẬT của bên thứ 3 (VD Hello Dolly, plugin mẫu có sẵn của WordPress) để xem cùng hiện tượng có xảy ra không — nếu CÓ, đây là lỗi/đặc thù của chính hosting hoặc bản WP 7.1 này (không phải lỗi riêng của `aai-ads-wp`), cần báo hoặc tránh dùng upload-zip, chuyển hẳn sang FTP.
3. Sau khi kích hoạt được: vào menu **"🚀 A-AI Ads"** trong wp-admin, nhập license key (cấp key mới tại `https://3dvietpro.com/admin/aai-license-keys` nếu chưa có, hoặc dùng key nào thầy đã cấp riêng cho suni.vn), rồi cấu hình Facebook App (khách tự tạo App riêng), Anthropic API Key, chủ đề (LƯU Ý: phải là chủ đề hợp với suni.vn — nước kiềm/đồ gia dụng Nhật — KHÔNG phải chủ đề AI chung của 3dvietpro.com), rồi bấm "Chạy thử ngay" để verify thật.
4. Sau khi verify chạy thật ổn: báo lại cho thầy, và cân nhắc đóng gói `aai-ads-wp/` thành file `.zip` chuẩn kèm hướng dẫn để dùng cho các khách WordPress khác sau này (giống cách `aai-ads-module/` đã làm cho khách Node.js).

## Việc KHÔNG liên quan tới vướng mắc này (đã xong, đừng động vào)

Trong cùng phiên làm việc này, các việc sau đã hoàn tất, verify xong, deploy lên 3dvietpro.com rồi — không cần làm lại:
- Fix bug đăng trùng lặp/JSON thô trong `fb-ads-manager/main.js` (desktop tool) và `services/aaiAdsService.js` (web).
- Fix bug bài viết web hiển thị dính liền không xuống dòng (`utils/markdownToHtml.js`, dùng ở cả `routes/autopost.js` và `services/newsFactoryService.js`).
- Thêm adapter WordPress cho `postToWebsite()` trong `services/aaiAdsService.js` (dùng REST API + Application Password, KHÁC với plugin `aai-ads-wp` này) — đã verify hoạt động thật với suni.vn.
- Thêm hạn dùng 30 ngày + nút gia hạn cho hệ thống key `AIWEB-` (`services/aaiLicenseService.js`).

## Thông tin đăng nhập cần thiết (đã lưu trong memory, xem `project_sunistore_shop` để cập nhật mới nhất)

- WP admin suni.vn: `https://suni.vn/wp-admin` — user `SuniStore` / pass `SuniStore2026vip`
- Application Password đã tạo (cho tính năng REST API adapter, không phải cho plugin): tên "AI Ads Tool" — `wptl 5vUU 6blM dS8B SblR c0xo`
- Hosting reseller panel: `https://portal.inet.vn/list-service?rsale=linhttt` (cần hỏi thầy creds nếu khác với login cá nhân của thầy)
