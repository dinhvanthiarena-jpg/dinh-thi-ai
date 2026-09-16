# A-AI Ads — plugin WordPress

Bản WordPress của tính năng "AI tự động đăng bài" trong A-AI Ads: AI tự tìm
chủ đề đang hot, tự viết bài, tự đăng lên Fanpage Facebook và lên chính
website này — khách **tự vận hành ngay trong wp-admin của họ**, không cần
vào web nào khác. 3dvietpro.com chỉ lo cấp/thu hồi license key.

Không bao gồm phần tạo chiến dịch Facebook Ads / CRM / Catalog / AI Decision
Center của bản đầy đủ (aai-ads-module cho web Node.js) — plugin này chỉ có
tính năng "AI tự động đăng bài" (viết bài + đăng Fanpage + đăng lên chính
site này), đúng phần đã dùng thật.

## Cài đặt

1. Nén cả thư mục `aai-ads-wp/` thành 1 file `aai-ads.zip` (thư mục
   `aai-ads-wp` bên trong file zip phải đổi tên thành `aai-ads` hoặc giữ
   nguyên đều được, WordPress tự nhận theo tên plugin trong file chính).
2. Vào **wp-admin → Plugins → Add New → Upload Plugin**, chọn file zip, bấm
   **Install Now** rồi **Activate**.
3. Menu **"🚀 A-AI Ads"** xuất hiện ở sidebar wp-admin.

## Kích hoạt bằng license key

Vào menu "🚀 A-AI Ads", nhập key dạng `AIWEB-XXXX-XXXX-XXXX` do Đinh Thi Ai
cấp. Key cần **online** để kích hoạt (gọi về `3dvietpro.com` xác nhận), sau
đó tự tái xác minh mỗi 24h — có 3 ngày "grace period" nếu server trung tâm
tạm thời không tới được. **Key bán theo tháng, tự hết hạn sau đúng 30 ngày**
— hết hạn thì trang tự khoá lại, cần key mới hoặc thầy gia hạn.

## Cấu hình sau khi kích hoạt

1. **Facebook**: tự tạo 1 Facebook Developer App riêng (tại
   developers.facebook.com) — KHÔNG dùng chung App với ai khác. Bật quyền:
   `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`,
   `business_management`. Thêm Redirect URI đúng bằng địa chỉ hiện ra ngay
   trên trang plugin (dạng `.../wp-admin/admin.php?page=aai-ads&aai_oauth_callback=1`).
   Nhập App ID + App Secret vào plugin, lưu, rồi bấm "Kết nối Facebook".
2. **Anthropic API Key** (để AI viết bài) — lấy tại console.anthropic.com.
3. **Pixabay API Key** (tuỳ chọn, để tự tìm ảnh minh hoạ) — bỏ trống vẫn
   đăng được, chỉ không có ảnh.
4. Nhập **chủ đề/sản phẩm cần quảng bá**, chọn Fanpage muốn đăng, bật/tắt
   đăng lên chính website này, đặt **số bài/ngày**, rồi bật "AI tự động đăng
   bài".
5. Bấm "Chạy thử ngay" để kiểm tra trước khi để chạy tự động.

## Cấu trúc thư mục

```
aai-ads-wp/
  aai-ads.php                    — entry point, đăng ký menu + hook
  includes/
    class-license.php            — kích hoạt/xác minh license key
    class-ai-writer.php          — gọi Claude viết bài, parse JSON an toàn
    class-facebook.php           — OAuth Facebook, đăng bài lên Page
    class-poster.php             — 1 lượt chạy: viết bài + đăng mọi nơi đã chọn
    class-cron.php               — lên lịch WP-Cron theo số bài/ngày
    class-settings-page.php      — toàn bộ giao diện wp-admin
```

Mọi cấu hình (key, App ID/Secret, chủ đề...) lưu trong `wp_options` của
chính site đó — hoàn toàn tách biệt với dữ liệu của 3dvietpro.com hay bất kỳ
site nào khác đã cài plugin này.

## Khác biệt so với bản Node.js (aai-ads-module)

- Tần suất đăng đơn giản hơn: 1 lượt WP-Cron viết 1 bài rồi đăng **đồng thời**
  lên mọi Fanpage + Website đã chọn, lặp lại theo đúng số "bài/ngày" — không
  có tần suất/khoảng cách riêng cho từng nơi như bản Node.js.
- Đăng lên chính website dùng thẳng `wp_insert_post()` (không cần gọi API
  riêng vì đã chạy ngay trong WordPress).
