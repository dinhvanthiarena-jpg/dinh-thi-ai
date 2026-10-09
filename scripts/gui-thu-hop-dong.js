// Gửi thử email hợp đồng MẪU tới 1 địa chỉ (kiểm tra SMTP). Chạy: node scripts/gui-thu-hop-dong.js ten@email.com
require('dotenv').config();
const cs = require('../services/contractService');
const to = process.argv[2];
if (!to) { console.log('Thiếu email nhận'); process.exit(1); }
cs.guiThuMau(to).then(() => { console.log('ĐÃ GỬI tới', to); process.exit(0); }).catch((e) => { console.log('LỖI gửi:', e.message); process.exit(1); });
