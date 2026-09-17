# Kiếm tiền quảng cáo — Google AdSense, ads.txt, Media.net

Web đã tích hợp sẵn Google AdSense (`ca-pub-4780520729439921`, script trong
`views/layouts/main.ejs`). Đây là cùng 1 tài khoản AdSense thầy dùng cho YouTube bấy lâu nay —
không cần và không nên tạo tài khoản AdSense mới (Google cấm dùng tài khoản mới để "lách" khi
tài khoản cũ bị khoá vĩnh viễn — domain và danh tính thầy có thể bị đưa vào danh sách hạn chế).

## Quy trình kiểm tra tình trạng AdSense (khi thầy hỏi "web kiếm được tiền quảng cáo chưa")

1. Kiểm tra `https://3dvietpro.com/ads.txt` tồn tại và đúng nội dung
   (`google.com, pub-4780520729439921, DIRECT, f08c47fec0942fa0`). Nếu 404 → tạo
   `public/ads.txt` với nội dung trên rồi deploy — việc này em tự làm được, không cần thầy.
2. Đăng nhập AdSense qua Claude in Chrome (trình duyệt đã có phiên đăng nhập sẵn của thầy) tại
   `https://adsense.google.com/adsense/new/u/0/pub-4780520729439921/home`. Nếu tài khoản Google
   đang active không có quyền truy cập, trang sẽ liệt kê các tài khoản Google khác từng đăng
   nhập trên máy — thử `dinhvanthi.arena@gmail.com` trước.
3. Đọc kỹ các banner cảnh báo đỏ/vàng ở đầu trang AdSense — đây là nguồn thông tin chính xác
   nhất, đừng đoán. Lỗi hay gặp:
   - **"Quảng cáo của bạn không hiển thị nữa vì bạn chưa hoàn tất quy trình xác minh địa chỉ"**
     → Thanh toán → Xác minh → xem ngày gửi mã PIN cũ. Nếu đã gửi lâu (nhiều tháng/năm) → mã
     chắc chắn hết hạn, thầy tự bấm "Gửi lại mã PIN", đợi thư giấy (1–3 tuần), tự nhập mã 6 số.
     Đây là bước xác minh danh tính cho tài khoản NHẬN TIỀN — không được làm thay dù thầy đưa
     mã, chỉ thầy tự nhập được.
   - **Mục "Trang web" báo lỗi (icon đỏ)** → bấm vào tên site → đọc "Chúng tôi đã tìm thấy một
     số lỗi vi phạm chính sách". Lỗi phổ biến nhất với site này là **"Nội dung có giá trị
     thấp"** — nguyên nhân khả năng cao nhất: "Nhà máy tin tức AI" đăng hàng loạt bài tự động
     mỗi ngày (`services/newsFactoryService.js`), kết hợp nhiều link affiliate Shopee chèn vào
     bài (xem `references/affiliate-and-shopee-links.md`). Nói thẳng nguyên nhân này với thầy,
     không giấu.
   - Mục "Quảng Cáo" trống trơn = chưa cấu hình vị trí quảng cáo nào (chưa bật Auto ads, chưa có
     `<ins class="adsbygoogle">` nào ngoài script loader — kiểm tra bằng
     `grep -r "adsbygoogle" views/`). Dù xác minh xong vẫn cần bật/thêm vị trí này mới có
     doanh thu thật.
4. Sidebar "AdSense cho YouTube" báo "Tài khoản đã bị huỷ kích hoạt vì không có hoạt động, không
   còn liên kết với kênh YouTube" — vấn đề RIÊNG của phần YouTube, KHÔNG ảnh hưởng gì đến phần
   web. Đừng gộp chung 2 việc này khi báo cáo cho thầy.

## Việc em tự làm được vs. bắt buộc phải là thầy

**Em tự làm (không cần hỏi lại)**: tạo/sửa `public/ads.txt`, chèn mã script của bất kỳ mạng
quảng cáo nào (AdSense, Media.net...) vào `views/layouts/main.ejs` khi thầy đã có mã sẵn, deploy.

**Bắt buộc thầy tự làm** (quy tắc an toàn cứng — không đăng nhập, không tạo tài khoản, không tự
nhập mã xác minh danh tính dù thầy đưa thông tin):
- Đăng ký tài khoản mạng quảng cáo mới (Media.net, Ezoic...) — chỉ cần email + tên site, rất
  nhanh, nhưng phải chính thầy bấm đăng ký.
- Nhập mã PIN xác minh địa chỉ AdSense.
- Bấm "Yêu cầu xem xét" sau khi khắc phục lỗi chính sách — hành động không dễ đảo ngược, mỗi lần
  yêu cầu thất bại có thể ảnh hưởng uy tín tài khoản.

## Các mạng quảng cáo thay thế/bổ sung

| Nền tảng | Đặc điểm | Yêu cầu traffic |
|---|---|---|
| Google AdSense | Phổ biến nhất, đang dùng | Không yêu cầu, nhưng duyệt nội dung gắt |
| Media.net | Quảng cáo theo ngữ cảnh, dễ duyệt hơn AdSense, chạy song song không xung đột | Không yêu cầu |
| Ezoic | AI tối ưu vị trí, doanh thu thường cao hơn AdSense | ~vài nghìn lượt xem/tháng |
| Mediavine / Raptive (AdThrive) | Trả cao nhất, duyệt rất khó | 50k–100k lượt/tháng (web chưa đạt) |
| Adsterra / PropellerAds | Dễ duyệt nhất | Không yêu cầu, nhưng quảng cáo dạng pop-up/pop-under, trải nghiệm kém hơn |

Mặc định gợi ý Media.net trước làm nguồn bổ sung an toàn. Không chủ động đề xuất
Adsterra/PropellerAds trừ khi thầy hỏi (ảnh hưởng trải nghiệm người dùng).
