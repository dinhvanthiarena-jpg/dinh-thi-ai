// Cấp 1 mã FBAI- "quyền cao nhất" cho chính thầy dùng test — không qua DB,
// file JSON thuần (giống hệt cách routes/admin.js#fbaiLicenseKeys... thao
// tác), chạy 1 lần rồi in ra mã để dán vào tool.
const fbai = require('../services/fbaiLicenseService');

const entry = fbai.issueKey('Thầy Đinh Thi Ai - key test full quyền (tự cấp)');
fbai.setExtraWebs(entry.key, 999);

console.log('KEY:', entry.key);
console.log('Hết hạn key (30 ngày):', new Date(entry.expiresAt).toLocaleString('vi-VN'));
console.log('Giới hạn Website/Group:', fbai.effectiveWebsiteLimit({ ...entry, extraWebs: 999, extraWebsExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 }));
