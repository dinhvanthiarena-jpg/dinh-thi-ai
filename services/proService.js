/**
 * Gói Pro của app Mon.L — bán bằng VietQR, tự đối soát.
 *
 * Cách tiền về:
 *   1. Người học chọn gói, hệ thống tạo một đơn với mã riêng, ví dụ MONL7F3K.
 *   2. Trang hiện mã QR VietQR đã nhúng sẵn số tiền và mã đơn trong nội dung
 *      chuyển khoản. Người học mở app ngân hàng bất kỳ, quét, bấm xác nhận.
 *   3. Tiền vào THẲNG tài khoản của thầy. SePay (hoặc PayOS) đọc được biến động
 *      số dư rồi gọi webhook sang đây. Khớp mã trong nội dung là mở gói.
 *
 * Không ai phải nhập số thẻ ở bất cứ đâu, kể cả người mua.
 *
 * Số tài khoản nhận tiền nằm trong biến môi trường, KHÔNG ghi trong mã nguồn:
 *   BANK_ID            mã ngân hàng theo chuẩn VietQR, ví dụ "970422" (MB Bank)
 *   BANK_ACCOUNT       số tài khoản nhận tiền
 *   BANK_ACCOUNT_NAME  tên chủ tài khoản, viết hoa không dấu
 *   SEPAY_WEBHOOK_KEY  chuỗi bí mật SePay gửi kèm mỗi lần báo, để chặn người lạ
 *   PRO_MODE           "off" (mặc định) hoặc "on" — xem ghi chú bên dưới
 *
 * PRO_MODE = "off" nghĩa là mọi tính năng vẫn MIỄN PHÍ cho tất cả mọi người.
 * Trang bán gói vẫn chạy được để thầy thử, nhưng không ai bị chặn. Khi nào muốn
 * bắt đầu thu tiền thì đổi thành "on" trong bảng biến môi trường của cPanel.
 */

const { ProOrder, User } = require('../models');

const PLANS = {
  month: { months: 1, amount: 29000, ten: 'Gói tháng', nguoi: 1 },
  year: { months: 12, amount: 249000, ten: 'Gói năm', nguoi: 1 },
  family: { months: 12, amount: 349000, ten: 'Gói gia đình', nguoi: 5 },
};

const NGAY_DUNG_THU = 7;
const TOI_DA_GIA_DINH = 5;

/** Giá quy về mỗi tháng, để người ta so được gói năm rẻ hơn bao nhiêu. */
function giaMoiThang(plan) {
  const g = PLANS[plan];
  return Math.round(g.amount / g.months);
}

const proMode = () => (process.env.PRO_MODE || 'off').toLowerCase();
const dangThuPhi = () => proMode() === 'on';

/** Đã cấu hình đủ để nhận tiền chưa. */
function sanSangNhanTien() {
  return Boolean(process.env.BANK_ID && process.env.BANK_ACCOUNT && process.env.BANK_ACCOUNT_NAME);
}

/** Mã ngắn, dễ đọc, không có ký tự dễ nhìn nhầm (0/O, 1/I). */
function chuoiNgau(n) {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i += 1) s += CHU[Math.floor(Math.random() * CHU.length)];
  return s;
}
const taoMa = () => `MONL${chuoiNgau(6)}`;
const taoMaGiaDinh = () => `GD${chuoiNgau(6)}`;

/** Ảnh QR do vietqr.io sinh, đã nhúng sẵn số tiền và nội dung chuyển khoản. */
function anhQR(order) {
  const bank = process.env.BANK_ID;
  const stk = process.env.BANK_ACCOUNT;
  const ten = process.env.BANK_ACCOUNT_NAME || '';
  if (!bank || !stk) return '';
  const q = new URLSearchParams({
    amount: String(order.amount),
    addInfo: order.code,
    accountName: ten,
  });
  return `https://img.vietqr.io/image/${bank}-${stk}-compact2.png?${q.toString()}`;
}

/** Thông tin để người mua tự chuyển khoản tay nếu không quét được QR. */
function thongTinChuyenKhoan(order) {
  return {
    nganHang: process.env.BANK_NAME || process.env.BANK_ID || '',
    soTaiKhoan: process.env.BANK_ACCOUNT || '',
    chuTaiKhoan: process.env.BANK_ACCOUNT_NAME || '',
    soTien: order.amount,
    noiDung: order.code,
  };
}

async function taoDon(userId, plan) {
  const goi = PLANS[plan];
  if (!goi) throw new Error('Gói không hợp lệ');
  // Mã trùng thì bốc lại, xác suất gần như không có nhưng cứ chắc.
  let code = taoMa();
  for (let i = 0; i < 5 && (await ProOrder.findOne({ where: { code } })); i += 1) code = taoMa();
  return ProOrder.create({
    code,
    plan,
    amount: goi.amount,
    months: goi.months,
    UserId: userId,
  });
}

/**
 * Ghi nhận một đơn đã trả tiền và cộng hạn dùng cho người học.
 * Cộng DỒN: đang còn hạn mà mua tiếp thì nối vào cuối, không bị mất ngày.
 */
async function ghiNhanDaTra(order, { bankRef = '', bankAmount = null, raw = '', boi = '' } = {}) {
  if (order.status === 'paid') return order;
  const user = await User.findByPk(order.UserId);
  if (!user) throw new Error('Không tìm thấy người mua của đơn này');

  const mocBatDau = user.proUntil && new Date(user.proUntil) > new Date()
    ? new Date(user.proUntil)
    : new Date();
  const hetHan = new Date(mocBatDau);
  hetHan.setMonth(hetHan.getMonth() + order.months);

  const thayDoi = { proUntil: hetHan };
  let maNha = order.familyCode || user.familyCode;
  if (order.plan === 'family') {
    // Chưa có nhóm thì lập nhóm mới, người mua làm chủ nhóm.
    if (!maNha || !user.familyOwner) {
      maNha = taoMaGiaDinh();
      thayDoi.familyCode = maNha;
      thayDoi.familyOwner = true;
    }
  }
  await user.update(thayDoi);

  // Chủ nhóm gia hạn thì cả nhà được kéo hạn theo, khỏi ai phải làm gì.
  if (user.familyOwner && maNha) {
    await User.update({ proUntil: hetHan }, { where: { familyCode: maNha, familyOwner: false } });
  }

  await order.update({
    familyCode: order.plan === 'family' ? maNha : '',
    status: 'paid',
    paidAt: new Date(),
    bankRef,
    bankAmount,
    rawPayload: typeof raw === 'string' ? raw.slice(0, 4000) : JSON.stringify(raw).slice(0, 4000),
    confirmedBy: boi,
  });
  return order;
}

/**
 * Nhận lời mời vào nhóm gia đình. Hạn dùng lấy theo chủ nhóm, nên chủ nhóm gia
 * hạn là cả nhà được theo, không ai phải trả thêm gì.
 */
async function vaoNhom(user, ma) {
  const code = String(ma || '').trim().toUpperCase();
  if (!code) return { loi: 'Bạn chưa nhập mã nhóm.' };
  if (user.familyOwner) return { loi: 'Bạn đang là chủ một nhóm rồi.' };

  const chu = await User.findOne({ where: { familyCode: code, familyOwner: true } });
  if (!chu) return { loi: 'Không tìm thấy nhóm nào mang mã này.' };
  if (!chu.proUntil || new Date(chu.proUntil) <= new Date()) {
    return { loi: 'Nhóm này đã hết hạn Pro rồi.' };
  }
  if (user.familyCode === code) return { loi: 'Bạn đã ở trong nhóm này rồi.' };

  const dangCo = await User.count({ where: { familyCode: code } });
  if (dangCo >= TOI_DA_GIA_DINH) {
    return { loi: `Nhóm đã đủ ${TOI_DA_GIA_DINH} người.` };
  }
  await user.update({ familyCode: code, familyOwner: false, proUntil: chu.proUntil });
  return { ok: true, hetHan: chu.proUntil };
}

/** Danh sách người trong nhóm, để chủ nhóm nhìn thấy ai đang dùng chung. */
async function nguoiTrongNhom(ma) {
  if (!ma) return [];
  return User.findAll({
    where: { familyCode: ma },
    attributes: ['id', 'name', 'email', 'familyOwner'],
    order: [['familyOwner', 'DESC'], ['createdAt', 'ASC']],
  });
}

/**
 * Bật 7 ngày dùng thử. KHÔNG giữ thẻ, KHÔNG tự trừ tiền — hết 7 ngày là tự về
 * bản miễn phí. Mỗi tài khoản chỉ dùng thử một lần.
 */
async function batDungThu(user) {
  if (user.trialUsed) return { loi: 'Bạn đã dùng thử một lần rồi.' };
  if (conHanPro(user)) return { loi: 'Bạn đang có gói Pro rồi.' };
  const hetHan = new Date();
  hetHan.setDate(hetHan.getDate() + NGAY_DUNG_THU);
  await user.update({ proUntil: hetHan, trialUsed: true });
  return { ok: true, hetHan };
}

/** Người này còn hạn Pro không. */
function conHanPro(user) {
  return Boolean(user && user.proUntil && new Date(user.proUntil) > new Date());
}

/**
 * Người này có được dùng tính năng trả phí không.
 * Khi PRO_MODE tắt thì AI CŨNG ĐƯỢC — đang để miễn phí cho mọi người.
 */
function duocDung(user) {
  return !dangThuPhi() || conHanPro(user);
}

module.exports = {
  PLANS,
  NGAY_DUNG_THU,
  TOI_DA_GIA_DINH,
  giaMoiThang,
  vaoNhom,
  nguoiTrongNhom,
  batDungThu,
  proMode,
  dangThuPhi,
  sanSangNhanTien,
  anhQR,
  thongTinChuyenKhoan,
  taoDon,
  ghiNhanDaTra,
  conHanPro,
  duocDung,
};
