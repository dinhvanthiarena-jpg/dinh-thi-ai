// Áp cấu hình bảng giá theo poster của thầy (2026-10-10): gói duy trì 1 tháng 55$, KHÔNG có gói 2/3/5 tháng; web mới 35$; tỷ giá 26.100.
// Bên A = Hợp tác xã Công nghệ AFF (số điện thoại bổ sung sau trong admin). Giữ nguyên MST/địa chỉ/email nếu đã điền.
require('dotenv').config();
const p = require('../services/fbaiKeyPricing');
const cur = p.getConfig();
const plans = [
  { id: 'khoi-dau', months: 3, usd: 199, kind: 'first', enabled: false },
  { id: '1-thang', months: 1, usd: 55, enabled: true },
  { id: '2-thang', months: 2, usd: 49, enabled: false },
  { id: '3-thang', months: 3, usd: 149, enabled: false },
  { id: '5-thang', months: 5, usd: 129, enabled: false },
];
const legal = { ten: 'HỢP TÁC XÃ CÔNG NGHỆ AFF (HTX Công nghệ AFF)', dienThoai: (cur.legal && cur.legal.dienThoai) || '' };
const out = p.saveConfig({ usdRate: 26100, webFeeUsd: 35, plans, legal });
console.log('gói đang bán:', p.getPlans().map((x) => x.id + '=' + x.vnd).join(', '));
console.log('Bên A:', JSON.stringify(out.legal));
process.exit(0);
