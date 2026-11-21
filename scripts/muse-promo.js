// Quản lý mã ưu đãi Sa Muse Ai bằng dòng lệnh (trên máy chủ, không cần mở trang admin).
//   node scripts/muse-promo.js ds
//   node scripts/muse-promo.js them <gia> <soLuot|0> [ma] [ghiChu...]
//   node scripts/muse-promo.js khoa <ma>      |  node scripts/muse-promo.js mo <ma>
// Chỉ đọc/ghi file data/muse-promo-codes.json (không đụng CSDL). Dùng chung dịch vụ với trang admin.
const promo = require('../services/musePromoService');

const [, , lenh, a, b, c, ...rest] = process.argv;
const vnd = (n) => `${Number(n).toLocaleString('vi-VN')}d`;

if (lenh === 'them') {
  const r = promo.them({ gia: a, toiDa: b, ma: c, ghiChu: rest.join(' ') });
  console.log(r.ok ? `DA TAO ${r.ma} gia ${vnd(r.gia)} luot ${r.toiDa || 'khong gioi han'}` : `LOI: ${r.loi}`);
} else if (lenh === 'khoa' || lenh === 'mo') {
  console.log(promo.datKhoa(a, lenh === 'khoa') ? `OK ${lenh} ${promo.chuanHoa(a)}` : 'khong thay ma');
} else {
  promo.danhSach().forEach((x) => console.log(`${x.ma}\t${vnd(x.gia)}\t${x.dung.length}/${x.toiDa || 'inf'}\t${x.khoa ? 'KHOA' : 'dang dung'}\t${x.ghiChu || ''}`));
  console.log(`(${promo.danhSach().length} ma)`);
}
