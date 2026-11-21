// Mã ưu đãi cho trang /dang-ky-tool-muse: thầy thỏa thuận giá với khách qua tin nhắn rồi gửi 1 mã;
// khách đăng ký trên web, nhập mã (hoặc mở link riêng ?ma=MÃ) → giá đơn = giá của mã, QR / Telegram / mail theo giá đó.
// Lưu trong 1 file JSON (không đổi cấu trúc CSDL). Mỗi mã: giá, số lượt tối đa, khoá/mở, danh sách đơn đã dùng.
// Mọi hàm ở đây chạy ĐỒNG BỘ (đọc-sửa-ghi trong 1 nhịp) nên 2 khách nhập cùng lúc không vượt quá số lượt.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = process.env.MUSE_PROMO_FILE || path.join(__dirname, '..', 'data', 'muse-promo-codes.json');
const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ 0/O, 1/I cho khỏi nhầm khi gõ
const GIA_TOI_THIEU = 10000;

function doc() {
  try {
    const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    return j && Array.isArray(j.codes) ? j : { codes: [] };
  } catch (e) {
    return { codes: [] };
  }
}

function ghi(d) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(d, null, 2));
  fs.renameSync(tmp, FILE);
}

/** Khách có thể gõ thường/có khoảng trắng: chuẩn hoá về IN HOA, chỉ giữ A-Z 0-9 và dấu gạch. */
const chuanHoa = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 40);

function taoMaNgauNhien(gia) {
  let s = '';
  for (let i = 0; i < 6; i += 1) s += CHU[crypto.randomInt(CHU.length)];
  return `UD${Math.round(gia / 1000)}-${s}`;
}

const LOI_CHUNG = 'Mã ưu đãi không đúng hoặc đã hết lượt. Bạn kiểm tra lại mã, hoặc bỏ trống ô này để mua giá niêm yết.';

/** Chỉ xem mã có dùng được không (KHÔNG giữ chỗ). Trả {ok, ma, gia} hoặc {ok:false, loi}. */
function kiemTra(maNhap) {
  const ma = chuanHoa(maNhap);
  if (!ma) return { ok: false, loi: LOI_CHUNG };
  const c = doc().codes.find((x) => x.ma === ma);
  if (!c || c.khoa) return { ok: false, loi: LOI_CHUNG };
  if (c.toiDa > 0 && (c.dung || []).length >= c.toiDa) return { ok: false, loi: LOI_CHUNG };
  return { ok: true, ma: c.ma, gia: c.gia };
}

/** Giữ 1 lượt cho đơn `donMa` (gọi ngay sau khi tạo đơn). Trả {ok, ma, gia} hoặc {ok:false, loi}. */
function datCho(maNhap, donMa) {
  const ma = chuanHoa(maNhap);
  const d = doc();
  const c = d.codes.find((x) => x.ma === ma);
  if (!c || c.khoa) return { ok: false, loi: LOI_CHUNG };
  c.dung = c.dung || [];
  if (c.dung.some((u) => u.don === donMa)) return { ok: true, ma: c.ma, gia: c.gia };
  if (c.toiDa > 0 && c.dung.length >= c.toiDa) return { ok: false, loi: LOI_CHUNG };
  c.dung.push({ don: donMa, luc: new Date().toISOString() });
  ghi(d);
  return { ok: true, ma: c.ma, gia: c.gia };
}

/** Trả lượt lại khi đơn bị xoá/huỷ. */
function hoanTheoDon(donMa) {
  const d = doc();
  let co = false;
  d.codes.forEach((c) => {
    const truoc = (c.dung || []).length;
    c.dung = (c.dung || []).filter((u) => u.don !== donMa);
    if (c.dung.length !== truoc) co = true;
  });
  if (co) ghi(d);
  return co;
}

/** Đơn này đã dùng mã nào? → {ma, gia} hoặc null. */
function timTheoDon(donMa) {
  const c = doc().codes.find((x) => (x.dung || []).some((u) => u.don === donMa));
  return c ? { ma: c.ma, gia: c.gia } : null;
}

function danhSach() {
  return doc().codes.map((c) => ({ ...c, dung: c.dung || [] }));
}

/** Bản đồ mã đơn → mã ưu đãi (để trang admin ghi bên cạnh từng đơn). */
function banDoDon() {
  const m = {};
  doc().codes.forEach((c) => (c.dung || []).forEach((u) => { m[u.don] = c.ma; }));
  return m;
}

/** Tạo mã. `ma` bỏ trống thì tự sinh mã khó đoán. Trả {ok, ma, gia, toiDa} hoặc {ok:false, loi}. */
function them({ gia, toiDa, ma, ghiChu, giaNiemYet }) {
  const g = Math.round(Number(gia));
  if (!Number.isFinite(g) || g < GIA_TOI_THIEU) return { ok: false, loi: `Giá mã phải từ ${GIA_TOI_THIEU.toLocaleString('vi-VN')}đ trở lên.` };
  if (giaNiemYet && g > giaNiemYet) return { ok: false, loi: 'Giá mã không được cao hơn giá niêm yết.' };
  const t = Math.max(0, Math.round(Number(toiDa) || 0));
  const d = doc();
  let m = chuanHoa(ma);
  if (!m) {
    do { m = taoMaNgauNhien(g); } while (d.codes.some((x) => x.ma === m));
  } else if (d.codes.some((x) => x.ma === m)) {
    return { ok: false, loi: `Mã ${m} đã có.` };
  }
  d.codes.push({ ma: m, gia: g, toiDa: t, khoa: false, ghiChu: String(ghiChu || '').slice(0, 120), tao: new Date().toISOString(), dung: [] });
  ghi(d);
  return { ok: true, ma: m, gia: g, toiDa: t };
}

function datKhoa(ma, khoa) {
  const d = doc();
  const c = d.codes.find((x) => x.ma === chuanHoa(ma));
  if (!c) return false;
  c.khoa = Boolean(khoa);
  ghi(d);
  return true;
}

function xoa(ma) {
  const d = doc();
  const n = d.codes.length;
  d.codes = d.codes.filter((x) => x.ma !== chuanHoa(ma));
  if (d.codes.length === n) return false;
  ghi(d);
  return true;
}

module.exports = { kiemTra, datCho, hoanTheoDon, timTheoDon, danhSach, banDoDon, them, datKhoa, xoa, chuanHoa, LOI_CHUNG };
