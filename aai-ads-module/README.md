# A-AI Ads — module clone-able

Bản đóng gói của tính năng A-AI Ads (tạo chiến dịch Facebook Ads bằng AI, đăng
bài tự động, Lợi nhuận & CRM, Tự động hóa, AI Decision Center) để copy nguyên
1 thư mục này sang bất kỳ web Node.js/Express nào khác và chạy được ngay —
không cần sửa gì bên trong, chỉ cần 2 dòng code + vài biến môi trường.

## Tích hợp (2 dòng code)

Trong `server.js` (hoặc file khởi động Express chính) của web mới:

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./aai-ads-module'));
```

Đặt ở đâu cũng được, miễn là SAU 2 dòng `express.json()`/`express.urlencoded()`
ở trên (module cần đọc `req.body`).

## Yêu cầu

- Đã cài `ejs` trong `node_modules` của web đó (`npm install ejs`) — module tự
  `require('ejs')` và tự render, không cần `app.set('view engine', ...)`.
- Node.js 18+ (cần `fetch` toàn cục — có sẵn từ Node 18).

## Biến môi trường cần đặt (Setup Node.js App → Environment variables)

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `AAI_FB_APP_ID` | Có | Facebook Developer App **của riêng khách hàng này** — tự tạo tại developers.facebook.com, KHÔNG dùng chung App với thầy hay khách khác (đúng mô hình tự phục vụ: khách tự quản lý Fanpage/quảng cáo của họ). |
| `AAI_FB_APP_SECRET` | Có | Đi kèm App ở trên. |
| `ANTHROPIC_API_KEY` | Có | Key Claude API — dùng để viết bài AI + phân tích Decision Center. |
| `PIXABAY_API_KEY` | Không | Để tự tìm ảnh minh họa cho bài đăng. Bỏ trống thì tính năng vẫn chạy, chỉ là không tự kèm ảnh. |
| `AAI_LICENSE_VERIFY_URL` | Không | Mặc định `https://3dvietpro.com/api/aai-license/verify` — chỉ đổi nếu thầy chuyển server trung tâm cấp key. |

Facebook App cần bật các quyền: `ads_management`, `ads_read`,
`business_management`, `pages_show_list`, `pages_read_engagement`,
`pages_manage_posts`, và có Redirect URI OAuth trỏ về
`https://<domain-khách>/aai-ads/callback`.

## Kích hoạt bằng license key

Trước khi cấu hình bất cứ gì, trang `/aai-ads` sẽ hiện màn hình yêu cầu nhập
key (dạng `AIWEB-XXXX-XXXX-XXXX`). Vào **Quản trị Vietpro → 🔑 Key A-AI Ads
(Web)** (`/admin/aai-license-keys`, trên 3dvietpro.com) để cấp key mới cho
khách — ghi chú tên khách/tên miền để dễ quản lý.

Key cần **online** để kích hoạt (gọi về server trung tâm xác nhận) — sau đó
tự tái xác minh mỗi 24h, có 3 ngày "grace period" nếu server trung tâm tạm
thời không tới được (không khoá oan khách khi thầy đang bảo trì server). Thầy
**thu hồi key bất cứ lúc nào** tại trang quản lý key — web của khách sẽ tự
khoá lại trong vòng tối đa 24h sau đó, không cần thầy đăng nhập vào web của
họ.

## Cấu trúc thư mục

```
aai-ads-module/
  index.js         — entry point, export ra Express router
  router.js         — toàn bộ route + controller (đã gộp từ adminController.js)
  service.js         — logic nghiệp vụ (Facebook Graph API, AI viết bài, CRM...)
  activation.js       — kiểm tra + gate license key
  views/aai-ads.ejs    — giao diện đầy đủ (trang HTML độc lập, tự có Tailwind CDN)
  data/                — nơi lưu cấu hình/dữ liệu CỦA RIÊNG web này (tự tạo khi chạy)
```

`data/` chỉ chứa dữ liệu của bản clone hiện tại (token Facebook, sản phẩm,
đơn hàng, key đã kích hoạt...) — hoàn toàn tách biệt với dữ liệu của
3dvietpro.com hay bất kỳ web nào khác đã clone module này.

## Checklist đưa lên 1 web mới (hosting cPanel giống 3dvietpro.com)

Kết hợp playbook đã có sẵn cho việc dựng site mới (xem memory
`project_satellite_sites_network`) + phần riêng cho module này:

1. Tạo domain + Node.js App trên cPanel (Node 20, production mode).
2. Copy code web (đã có sẵn — theo playbook multisite hiện tại) LÊN server.
3. **Copy nguyên thư mục `aai-ads-module/` này vào thư mục gốc của web đó.**
4. Thêm 2 dòng tích hợp vào `server.js` của web đó (xem mục "Tích hợp" trên).
5. `npm install ejs` nếu web đó chưa có sẵn.
6. Đặt các biến môi trường ở bảng trên (App Facebook khách tự tạo, Anthropic
   key, Pixabay key tùy chọn).
7. Kill process cũ (`ps aux | grep -i node`, `kill <pid>`) để nạp code mới.
8. Vào **3dvietpro.com/admin/aai-license-keys**, cấp 1 key mới, ghi chú tên
   domain khách.
9. Đưa khách vào `https://<domain-khách>/aai-ads`, nhập key để kích hoạt.
10. Khách tự kết nối Facebook App của họ (bấm "Kết nối Facebook" — dùng OAuth
    App riêng của họ, KHÔNG phải App của thầy) và tự cấu hình chủ đề/Fanpage.

Từ bước 9 trở đi là khách tự vận hành — thầy không cần đăng nhập/làm admin
cho web của họ, chỉ quản lý bằng key.
