/**
 * Hoa hồng "Giới thiệu bạn bè" — mô hình 3 cấp WEB -> A -> B -> C (đúng theo
 * đặc tả thầy gửi 23/09/2026, "Dac_ta_he_thong_ban_hang_Affiliate_3_cap"):
 *   - Khách mua hàng qua link của C -> C nhận hoa hồng Cấp 1 (trực tiếp).
 *   - B (người giới thiệu C) nhận hoa hồng Cấp 2 trên CHÍNH đơn hàng đó.
 *   - A (người giới thiệu B) nhận hoa hồng Cấp 3 trên CHÍNH đơn hàng đó.
 * Hệ thống hiện KHÔNG có role A/B/C cố định riêng — MỌI user đều bình đẳng,
 * "là A hay B hay C" chỉ là vị trí tương đối trong cây parentId tại thời
 * điểm 1 đơn hàng cụ thể phát sinh (một người có thể vừa là B của đơn này
 * vừa là A của đơn khác). Điều này đơn giản hơn nhiều so với việc quản lý
 * role/quyền tách biệt theo cấp, mà vẫn tự nhiên thỏa "chỉ xem được mình +
 * cấp dưới" (mỗi dashboard vốn đã tự lọc theo req.user.id).
 *
 * WALLET LEDGER — Pending -> Available (mục 13 trong đặc tả, "không sửa
 * trực tiếp số dư ví"): mỗi hoa hồng khi phát sinh được ghi
 * WalletTransaction với status='pending' TRƯỚC, CHƯA cộng vào
 * user.walletBalance (walletBalance = số dư "khả dụng", chỉ tính giao dịch
 * status='paid'). Sau PENDING_DAYS ngày (mặc định chốt 7 ngày — đủ thời
 * gian huỷ/hoàn đơn trước khi tiền thật sự khả dụng để rút), hệ thống tự
 * chuyển sang 'paid' và CỘNG vào walletBalance lúc đó (xem
 * duyetHoaHongDaHan, chạy định kỳ trong server.js). Admin cũng duyệt sớm
 * tay được cho 1 người cụ thể (xem duyetHoaHongSom).
 *
 * Gọi distributeCommission() ở ĐÚNG 3 nơi tiền thật/ví thật đã được ghi
 * nhận thanh toán xong (KHÔNG gọi lúc tạo đơn, chỉ gọi khi đã chắc chắn đã
 * trả tiền):
 *   - services/walletService.js#muaTool
 *   - services/walletService.js#thanhToanHocPhiBangVi
 *   - controllers/checkoutController.js#mockPayConfirm
 *   - services/proService.js#ghiNhanDaTra
 */
const { Op } = require('sequelize');
const { Setting, User, WalletTransaction, WithdrawRequest, Order, ProOrder, AuditLog, Course, Tool } = require('../models');
const { sequelize } = require('../config/db');

const PENDING_DAYS = 7;
// Chỉ Cấp 1-3 tính từ WEB CHỦ mới được là đại lý (đúng mô hình WEB->A->B->C
// trong đặc tả) — Cấp 4 trở đi LUÔN LUÔN là khách hàng thông thường, không
// đăng ký/đăng nhập với vai trò đại lý được, dù hoa hồng vẫn tính bình
// thường CHO 3 người giới thiệu phía trên họ khi họ mua hàng (yêu cầu
// 2026-09-24: "cấu hình toàn bộ cứ cấp 4 chỉ là khách hàng thông thường").
const CAP_TOI_DA_LAM_DAI_LY = 3;

/** Đếm Cấp của 1 user tính từ WEB CHỦ (Cấp 1 = không có parentId). Có chốt
 * an toàn 50 vòng phòng dữ liệu lỗi tạo vòng lặp parentId. */
async function doSauTuWeb(userId) {
  let cap = 1;
  let currentId = userId;
  for (let i = 0; i < 50; i += 1) {
    const u = await User.findByPk(currentId, { attributes: ['parentId'] });
    if (!u || !u.parentId) return cap;
    cap += 1;
    currentId = u.parentId;
  }
  return cap;
}

async function ghiAuditLog(actor, action, targetType, targetId, oldValue, newValue, reason) {
  try {
    await AuditLog.create({
      actor: actor || 'admin',
      action,
      targetType: targetType || '',
      targetId: targetId != null ? String(targetId) : '',
      oldValue: oldValue != null ? String(oldValue) : '',
      newValue: newValue != null ? String(newValue) : '',
      reason: reason || '',
    });
  } catch (err) {
    console.error('[commissionService] lỗi ghi audit log:', err.message);
  }
}

async function getRates() {
  const [l1, l2, l3] = await Promise.all([
    Setting.findByPk('commissionL1Percent'),
    Setting.findByPk('commissionL2Percent'),
    Setting.findByPk('commissionL3Percent'),
  ]);
  return {
    l1Percent: Number(l1 ? l1.value : process.env.COMMISSION_L1_PERCENT || 10),
    l2Percent: Number(l2 ? l2.value : process.env.COMMISSION_L2_PERCENT || 5),
    l3Percent: Number(l3 ? l3.value : process.env.COMMISSION_L3_PERCENT || 2),
  };
}

async function setRates({ l1Percent, l2Percent, l3Percent }, boi) {
  const truoc = await getRates();
  await Promise.all([
    Setting.upsert({ key: 'commissionL1Percent', value: String(l1Percent) }),
    Setting.upsert({ key: 'commissionL2Percent', value: String(l2Percent) }),
    Setting.upsert({ key: 'commissionL3Percent', value: String(l3Percent) }),
  ]);
  await ghiAuditLog(
    boi,
    'change_commission_rate',
    'Setting',
    'commission',
    `L1=${truoc.l1Percent}% L2=${truoc.l2Percent}% L3=${truoc.l3Percent}%`,
    `L1=${l1Percent}% L2=${l2Percent}% L3=${l3Percent}%`
  );
}

/**
 * Ghi 1 dòng hoa hồng ở trạng thái PENDING (chưa cộng ví) — dùng chung mã
 * "COM-{relatedType}-{relatedId}-{cap}" làm khóa CHỐNG CỘNG TRÙNG:
 * WalletTransaction.code có ràng buộc UNIQUE sẵn, nên nếu hàm này lỡ bị gọi
 * 2 lần cho cùng 1 đơn hàng, lần thứ 2 sẽ vỡ unique constraint và bị bỏ qua
 * an toàn — không cần thêm bảng khóa riêng.
 */
async function ghiHoaHongCho(recipient, amount, cap, relatedType, relatedId, moTa) {
  if (amount <= 0) return null;
  const code = `COM-${relatedType}-${relatedId}-${cap}`.toUpperCase();
  const loaiGiaoDich = { L1: 'commission_l1', L2: 'commission_l2', L3: 'commission_l3' }[cap];
  try {
    return await WalletTransaction.create({
      code,
      type: loaiGiaoDich,
      amount,
      status: 'pending', // Ledger: CHƯA cộng vào walletBalance — xem duyetHoaHongDaHan.
      description: moTa,
      relatedType,
      relatedId,
      UserId: recipient.id,
    });
  } catch (err) {
    // Unique constraint trên `code` = đã ghi cho đơn này rồi, bỏ qua êm.
    if (err.name === 'SequelizeUniqueConstraintError') return null;
    throw err;
  }
}

/**
 * @param {User} buyer Người vừa mua hàng qua link giới thiệu (khách của C).
 * @param {number} amount Giá trị đơn hàng để tính % hoa hồng trên đó.
 * @param {string} relatedType 'Tool' | 'Course' | 'Pro'
 * @param {number} relatedId id của Tool/Course/ProOrder tương ứng.
 */
async function distributeCommission(buyer, amount, relatedType, relatedId) {
  if (!buyer.parentId || !amount) return;
  const rates = await getRates();
  const tenSanPham = relatedType === 'Course' ? 'khóa học' : relatedType === 'Tool' ? 'tool' : 'gói Pro';

  const c = await User.findByPk(buyer.parentId); // người giới thiệu trực tiếp (Cấp 1)
  if (!c) return;
  await ghiHoaHongCho(
    c,
    Math.round((amount * rates.l1Percent) / 100),
    'L1',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 1 (${rates.l1Percent}%) từ ${buyer.name} mua ${tenSanPham}`
  );

  if (!c.parentId) return;
  const b = await User.findByPk(c.parentId); // Cấp 2
  if (!b) return;
  await ghiHoaHongCho(
    b,
    Math.round((amount * rates.l2Percent) / 100),
    'L2',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 2 (${rates.l2Percent}%) từ ${buyer.name} (qua ${c.name})`
  );

  if (!b.parentId) return;
  const a = await User.findByPk(b.parentId); // Cấp 3
  if (!a) return;
  await ghiHoaHongCho(
    a,
    Math.round((amount * rates.l3Percent) / 100),
    'L3',
    relatedType,
    relatedId,
    `Hoa hồng Cấp 3 (${rates.l3Percent}%) từ ${buyer.name} (qua ${b.name})`
  );
}

/**
 * Chạy định kỳ (xem server.js) — mọi hoa hồng đã "chờ" đủ PENDING_DAYS ngày
 * thì tự chuyển 'paid' và CỘNG vào walletBalance lúc này (không cộng lúc
 * phát sinh — xem ghi chú Ledger ở đầu file).
 */
async function duyetHoaHongDaHan() {
  const hanChot = new Date(Date.now() - PENDING_DAYS * 24 * 60 * 60 * 1000);
  const dsChoDuyet = await WalletTransaction.findAll({
    where: {
      type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] },
      status: 'pending',
      createdAt: { [Op.lte]: hanChot },
    },
  });
  for (const tx of dsChoDuyet) {
    await duyetMotHoaHong(tx, 'he-thong-tu-dong');
  }
  return dsChoDuyet.length;
}

/** Khoá dòng WalletTransaction + user trong 1 transaction DB thật, kiểm tra
 * lại status='pending' ngay trong đó — chặn trường hợp bấm "Duyệt sớm" 2
 * lần liền tay (hoặc trùng với job tự động duyệt sau 7 ngày chạy cùng lúc)
 * cộng tiền vào ví 2 lần cho cùng 1 dòng hoa hồng. */
async function duyetMotHoaHong(tx, boi) {
  return sequelize.transaction(async (t) => {
    const txKhoa = await WalletTransaction.findByPk(tx.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!txKhoa || txKhoa.status !== 'pending') return txKhoa;
    const user = await User.findByPk(txKhoa.UserId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) return txKhoa;
    const balanceAfter = (user.walletBalance || 0) + txKhoa.amount;
    await user.update({ walletBalance: balanceAfter }, { transaction: t });
    await txKhoa.update({ status: 'paid', balanceAfter, paidAt: new Date(), confirmedBy: boi }, { transaction: t });
    return txKhoa;
  });
}

/** Admin duyệt SỚM 1 dòng hoa hồng cụ thể (chưa đủ 7 ngày) — có audit log. */
async function duyetHoaHongSom(walletTransactionId, boi) {
  const tx = await WalletTransaction.findByPk(walletTransactionId);
  if (!tx || tx.status !== 'pending') return tx;
  await duyetMotHoaHong(tx, boi);
  await ghiAuditLog(boi, 'approve_commission_early', 'WalletTransaction', tx.id, 'pending', 'paid');
  return tx;
}

/**
 * Admin duyệt yêu cầu rút tiền — trừ ví + ghi 1 WalletTransaction. Khoá dòng
 * WithdrawRequest + user trong 1 transaction DB thật và kiểm tra lại
 * status='pending' cùng số dư NGAY TRONG đó — bấm "Duyệt" 2 lần liền tay
 * (double-click) không thể trừ ví 2 lần cho cùng 1 yêu cầu rút tiền, đây là
 * thao tác động tới tiền thật nên phải chặn chắc nhất trong cả hệ thống.
 */
async function duyetRutTien(withdrawRequestId, boi) {
  return sequelize.transaction(async (t) => {
    const req_ = await WithdrawRequest.findByPk(withdrawRequestId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!req_ || req_.status !== 'pending') return req_;

    const user = await User.findByPk(req_.UserId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new Error('Không tìm thấy người rút tiền.');
    if ((user.walletBalance || 0) < req_.amount) throw new Error('Số dư ví không đủ tại thời điểm duyệt.');

    const balanceAfter = user.walletBalance - req_.amount;
    await user.update({ walletBalance: balanceAfter }, { transaction: t });
    await WalletTransaction.create(
      {
        type: 'withdraw',
        amount: -req_.amount,
        status: 'paid',
        balanceAfter,
        description: `Rút hoa hồng về ${req_.bankName} - ${req_.bankAccount}`,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await req_.update({ status: 'approved', approvedBy: boi, approvedAt: new Date() }, { transaction: t });
    await ghiAuditLog(boi, 'approve_withdraw', 'WithdrawRequest', req_.id, '', `${req_.amount}đ`);
    return req_;
  });
}

async function tuChoiRutTien(withdrawRequestId, boi, note) {
  const req_ = await WithdrawRequest.findByPk(withdrawRequestId);
  if (!req_ || req_.status !== 'pending') return req_;
  await req_.update({ status: 'rejected', approvedBy: boi, approvedAt: new Date(), note: note || '' });
  await ghiAuditLog(boi, 'reject_withdraw', 'WithdrawRequest', req_.id, '', `${req_.amount}đ`, note);
  return req_;
}

/** Admin duyệt đăng ký đại lý — chỉ tác dụng khi đang 'pending' (tránh duyệt
 * trùng), và chặn nếu user đã ở Cấp 4 trở đi (chỉ Cấp 1-3 được là đại lý). */
async function duyetDaiLy(userId, boi) {
  const user = await User.findByPk(userId);
  if (!user || user.agentStatus !== 'pending') return user;
  const cap = await doSauTuWeb(userId);
  if (cap > CAP_TOI_DA_LAM_DAI_LY) {
    await user.update({ agentStatus: 'rejected' });
    await ghiAuditLog(boi, 'reject_agent_qua_sau', 'User', user.id, 'pending', 'rejected', `Cấp ${cap} > ${CAP_TOI_DA_LAM_DAI_LY}`);
    return user;
  }
  await user.update({ agentStatus: 'approved' });
  await ghiAuditLog(boi, 'approve_agent', 'User', user.id, 'pending', 'approved');
  return user;
}

async function tuChoiDaiLy(userId, boi) {
  const user = await User.findByPk(userId);
  if (!user || user.agentStatus !== 'pending') return user;
  await user.update({ agentStatus: 'rejected' });
  await ghiAuditLog(boi, 'reject_agent', 'User', user.id, 'pending', 'rejected');
  return user;
}

/**
 * Báo cáo tài chính tổng cho Admin — đúng 4 số theo mục 12 của đặc tả:
 *   - tongThuNhap: doanh thu toàn web (khóa học + tool + gói Pro, đã PAID).
 *   - hoaHongChoDuyet: đang trong 7 ngày chờ (status='pending').
 *   - hoaHongDaDuyet: đã qua 7 ngày, khả dụng nhưng CHƯA rút.
 *   - hoaHongDaChiTra: đã duyệt rút về ngân hàng.
 */
async function baoCaoTaiChinh() {
  const [doanhThuKhoaHoc, doanhThuPro, doanhThuTool, hoaHongChoDuyet, tongHoaHongDaDuyetTatCa, tongDaRut] =
    await Promise.all([
      Order.sum('amount', { where: { status: 'paid' } }),
      ProOrder.sum('amount', { where: { status: 'paid' } }),
      WalletTransaction.sum('amount', { where: { type: 'purchase', relatedType: 'Tool' } }),
      WalletTransaction.sum('amount', {
        where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'pending' },
      }),
      WalletTransaction.sum('amount', {
        where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'paid' },
      }),
      WalletTransaction.sum('amount', { where: { type: 'withdraw' } }),
    ]);

  const tongThuNhap = (doanhThuKhoaHoc || 0) + (doanhThuPro || 0) + Math.abs(doanhThuTool || 0);
  const hoaHongDaChiTra = Math.abs(tongDaRut || 0);
  const hoaHongDaDuyet = (tongHoaHongDaDuyetTatCa || 0) - hoaHongDaChiTra;

  return {
    tongThuNhap,
    hoaHongChoDuyet: hoaHongChoDuyet || 0,
    hoaHongDaDuyet,
    hoaHongDaChiTra,
  };
}

/** Tổng doanh thu PAID (khóa học + tool + Pro) của đúng nhóm buyerIds cho trước. */
async function doanhThuCuaNhomNguoiMua(buyerIds) {
  if (!buyerIds.length) return 0;
  const [khoaHoc, pro, tool] = await Promise.all([
    Order.sum('amount', { where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    ProOrder.sum('amount', { where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    WalletTransaction.sum('amount', {
      where: { type: 'purchase', relatedType: 'Tool', UserId: { [Op.in]: buyerIds } },
    }),
  ]);
  return (khoaHoc || 0) + (pro || 0) + Math.abs(tool || 0);
}

async function demSoDonHang(buyerIds) {
  if (!buyerIds.length) return 0;
  const [khoaHoc, pro, tool] = await Promise.all([
    Order.count({ where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    ProOrder.count({ where: { status: 'paid', UserId: { [Op.in]: buyerIds } } }),
    WalletTransaction.count({ where: { type: 'purchase', relatedType: 'Tool', UserId: { [Op.in]: buyerIds } } }),
  ]);
  return khoaHoc + pro + tool;
}

/** 3 tầng buyer/con cháu (F1/F2/F3) của 1 thành viên — dùng chung cho
 * chiTietThanhVien và danhSachDonHangMang, tránh lặp lại 3 query giống hệt. */
async function layCacCapDuoi(memberId) {
  const capF1 = await User.findAll({ where: { parentId: memberId }, attributes: ['id', 'name'] });
  const idsF1 = capF1.map((u) => u.id);
  const capF2 = idsF1.length ? await User.findAll({ where: { parentId: { [Op.in]: idsF1 } }, attributes: ['id', 'name'] }) : [];
  const idsF2 = capF2.map((u) => u.id);
  const capF3 = idsF2.length ? await User.findAll({ where: { parentId: { [Op.in]: idsF2 } }, attributes: ['id', 'name'] }) : [];
  const idsF3 = capF3.map((u) => u.id);
  return { capF1, idsF1, capF2, idsF2, capF3, idsF3 };
}

/**
 * Dashboard chi tiết 1 thành viên khi Admin click vào node trên Mindmap
 * (mục 8 của đặc tả) — doanh thu trực tiếp/từ cấp B/từ cấp C, hoa hồng theo
 * trạng thái, số dư ví, tổng khách hàng, tổng đơn hàng.
 */
async function chiTietThanhVien(memberId) {
  const { idsF1, idsF2, idsF3 } = await layCacCapDuoi(memberId);

  const [
    doanhThuTrucTiep,
    doanhThuCapB,
    doanhThuCapC,
    tongHoaHongCho,
    tongHoaHongDaDuyet,
    tongDaRut,
    tongDonHang,
    hoaHongTrucTiep,
    hoaHongCapB,
    hoaHongCapC,
  ] = await Promise.all([
    doanhThuCuaNhomNguoiMua(idsF1),
    doanhThuCuaNhomNguoiMua(idsF2),
    doanhThuCuaNhomNguoiMua(idsF3),
    WalletTransaction.sum('amount', {
      where: { UserId: memberId, type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'pending' },
    }),
    WalletTransaction.sum('amount', {
      where: { UserId: memberId, type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3'] }, status: 'paid' },
    }),
    WalletTransaction.sum('amount', { where: { UserId: memberId, type: 'withdraw' } }),
    demSoDonHang(idsF1),
    // Hoa hồng chính người này nhận ứng với TỪNG tầng doanh thu — commission_l1
    // là hoa hồng từ doanh thu trực tiếp (F1), l2 từ cấp B (F2), l3 từ cấp C
    // (F3) — xem distributeCommission() ở trên (yêu cầu 2026-09-24: hiện luôn
    // hoa hồng ngay trong ô doanh thu tương ứng).
    WalletTransaction.sum('amount', { where: { UserId: memberId, type: 'commission_l1' } }),
    WalletTransaction.sum('amount', { where: { UserId: memberId, type: 'commission_l2' } }),
    WalletTransaction.sum('amount', { where: { UserId: memberId, type: 'commission_l3' } }),
  ]);

  const hoaHongDaChiTra = Math.abs(tongDaRut || 0);
  return {
    doanhThuTrucTiep,
    doanhThuCapB,
    doanhThuCapC,
    hoaHongTrucTiep: hoaHongTrucTiep || 0,
    hoaHongCapB: hoaHongCapB || 0,
    hoaHongCapC: hoaHongCapC || 0,
    tongDoanhThuMang: doanhThuTrucTiep + doanhThuCapB + doanhThuCapC,
    hoaHongChoDuyet: tongHoaHongCho || 0,
    hoaHongDaDuyet: (tongHoaHongDaDuyet || 0) - hoaHongDaChiTra,
    hoaHongDaChiTra,
    tongHoaHong: (tongHoaHongCho || 0) + (tongHoaHongDaDuyet || 0),
    tongKhachHangTrucTiep: idsF1.length,
    tongDonHang,
  };
}

/**
 * Danh sách đơn hàng CỤ THỂ (không chỉ đếm tổng) do cả mạng lưới của 1
 * thành viên tạo ra — dùng cho dashboard đại lý xem "đơn hàng của cấp
 * dưới mình" (yêu cầu 2026-09-23). Gộp cả 3 nguồn (khóa học/Pro/tool),
 * kèm cấp độ buyer (1/2/3 tính từ memberId) và tên người mua.
 */
async function danhSachDonHangMang(memberId, limit = 20) {
  const { capF1, capF2, capF3, idsF1, idsF2, idsF3 } = await layCacCapDuoi(memberId);
  const tenTheoId = new Map([...capF1, ...capF2, ...capF3].map((u) => [u.id, u.name]));
  const capTheoId = new Map([
    ...idsF1.map((id) => [id, 1]),
    ...idsF2.map((id) => [id, 2]),
    ...idsF3.map((id) => [id, 3]),
  ]);
  const tatCaIds = [...idsF1, ...idsF2, ...idsF3];
  if (!tatCaIds.length) return [];

  const [donKhoaHoc, donPro, donTool] = await Promise.all([
    Order.findAll({
      where: { status: 'paid', UserId: { [Op.in]: tatCaIds } },
      include: [{ model: Course, as: 'course', attributes: ['title'] }],
      order: [['createdAt', 'DESC']],
      limit,
    }),
    ProOrder.findAll({ where: { status: 'paid', UserId: { [Op.in]: tatCaIds } }, order: [['createdAt', 'DESC']], limit }),
    WalletTransaction.findAll({
      where: { type: 'purchase', relatedType: 'Tool', UserId: { [Op.in]: tatCaIds } },
      order: [['createdAt', 'DESC']],
      limit,
    }),
  ]);

  const toolIds = [...new Set(donTool.map((tx) => tx.relatedId))];
  const tools = toolIds.length ? await Tool.findAll({ where: { id: { [Op.in]: toolIds } }, attributes: ['id', 'title'] }) : [];
  const tenToolTheoId = new Map(tools.map((t) => [t.id, t.title]));

  const goiPro = { month: 'Gói tháng', year: 'Gói năm', family: 'Gói gia đình' };

  const gopLai = [
    ...donKhoaHoc.map((o) => ({
      ngay: o.createdAt,
      nguoiMua: tenTheoId.get(o.UserId) || '—',
      capDo: capTheoId.get(o.UserId),
      sanPham: `Khóa học: ${o.course ? o.course.title : '—'}`,
      soTien: o.amount,
    })),
    ...donPro.map((o) => ({
      ngay: o.createdAt,
      nguoiMua: tenTheoId.get(o.UserId) || '—',
      capDo: capTheoId.get(o.UserId),
      sanPham: `Gói Pro: ${goiPro[o.plan] || o.plan}`,
      soTien: o.amount,
    })),
    ...donTool.map((tx) => ({
      ngay: tx.createdAt,
      nguoiMua: tenTheoId.get(tx.UserId) || '—',
      capDo: capTheoId.get(tx.UserId),
      sanPham: `Tool: ${tenToolTheoId.get(tx.relatedId) || '—'}`,
      soTien: Math.abs(tx.amount),
    })),
  ];
  gopLai.sort((a, b) => new Date(b.ngay) - new Date(a.ngay));
  return gopLai.slice(0, limit);
}

module.exports = {
  getRates,
  setRates,
  distributeCommission,
  duyetHoaHongDaHan,
  duyetHoaHongSom,
  duyetRutTien,
  tuChoiRutTien,
  duyetDaiLy,
  tuChoiDaiLy,
  baoCaoTaiChinh,
  chiTietThanhVien,
  danhSachDonHangMang,
  doSauTuWeb,
  PENDING_DAYS,
  CAP_TOI_DA_LAM_DAI_LY,
};
