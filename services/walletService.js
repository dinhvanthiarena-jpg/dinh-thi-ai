/**
 * Ví trên web — nạp tiền một lần bằng chuyển khoản VietQR, tiêu dần cho việc
 * mua tool trả phí hoặc đóng học phí khóa học, không phải quét mã mỗi lần
 * mua một món nhỏ.
 *
 * Cách tiền về — giống hệt cơ chế gói Pro (proService.js) đã chạy ổn:
 *   1. Người dùng chọn số tiền muốn nạp, hệ thống tạo 1 giao dịch với mã
 *      riêng, ví dụ VIF3K9QZ.
 *   2. Trang hiện mã QR VietQR đã nhúng sẵn số tiền và mã trong nội dung
 *      chuyển khoản.
 *   3. Tiền vào THẲNG tài khoản của thầy. SePay đọc được biến động số dư rồi
 *      gọi webhook (dùng CHUNG endpoint /pro/webhook/sepay với gói Pro, xem
 *      routes/pro.js — chỉ khác tiền tố mã: MONL... là gói Pro, VI... là nạp
 *      ví, để không phải cấu hình thêm webhook thứ hai bên SePay).
 *
 * Dùng chung các biến môi trường BANK_ID/BANK_ACCOUNT/BANK_ACCOUNT_NAME/
 * SEPAY_WEBHOOK_KEY với gói Pro — cùng 1 tài khoản ngân hàng nhận tiền.
 */
const { WalletTransaction, ToolLicense, Tool, User, Order, Course, Enrollment } = require('../models');
const { sequelize } = require('../config/db');
const telegram = require('./telegramService');
const commission = require('./commissionService');
const exchangeRate = require('./exchangeRateService');
const fbaiLicense = require('./fbaiLicenseService');
const fbaiKeyPricing = require('./fbaiKeyPricing');
const { WebsiteDomain } = require('../models');

// "24h ra web" (SA-BOTAI): web ĐẦU TIÊN kèm key lần đầu miễn phí; mỗi TÊN MIỀN MỚI từ tên miền thứ 2 thu 35$ (thầy chốt
// 2026-10-05), quy đổi VNĐ theo tỷ giá CỐ ĐỊNH 26.000đ/$ — xem fbaiKeyPricing.js. Giá lấy từ cấu hình, không hard-code.
const PHI_TAO_WEB_USD = fbaiKeyPricing.getWebFee().usd; // chỉ dùng làm mốc tính giá gói nhiều web bên dưới

// Mua GÓI nhiều web trả trước (thầy chốt 2026-10-01) — tỷ giá CỐ ĐỊNH (khác
// tỷ giá thị trường tự động dùng cho phí lẻ $50/web ở trên), giá NIÊM YẾT
// đã gồm thuế, giảm theo số lượng mua 1 lần:
//   1 web: không giảm (50$/web)
//   2-3 web: giảm 10% (45$/web)
//   4 web: giảm 15% (42.5$/web) — mốc giảm sâu nhất
//   5 web trở lên: về lại mức giảm 10% (45$/web), không giảm thêm nữa
const TY_GIA_CO_DINH_GOI_WEB = fbaiKeyPricing.USD_RATE;
function donGiaTaoWebTheoSoLuong(soLuong) {
  if (soLuong <= 1) return PHI_TAO_WEB_USD;
  if (soLuong === 4) return PHI_TAO_WEB_USD * 0.85;
  return PHI_TAO_WEB_USD * 0.9; // 2-3 web và 5+ web đều ở mức giảm 10%
}

/** Mã ngắn, dễ đọc, không có ký tự dễ nhìn nhầm (0/O, 1/I) — giống proService. */
function chuoiNgau(n) {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i += 1) s += CHU[Math.floor(Math.random() * CHU.length)];
  return s;
}
const taoMaNap = () => `VI${chuoiNgau(6)}`;
const taoLicenseKey = () => `TOOL-${chuoiNgau(4)}-${chuoiNgau(4)}-${chuoiNgau(4)}`;

const tuDongDoiSoat = () => Boolean(process.env.SEPAY_WEBHOOK_KEY);
function sanSangNhanTien() {
  return Boolean(process.env.BANK_ID && process.env.BANK_ACCOUNT && process.env.BANK_ACCOUNT_NAME);
}

async function baoThay(text) {
  const chat = process.env.TELEGRAM_ADMIN_CHAT;
  if (!chat) return;
  try {
    await telegram.sendMessage(chat, text);
  } catch (err) {
    console.error('[walletService/telegram]', err.message);
  }
}

function anhQR(tx) {
  const bank = process.env.BANK_ID;
  const stk = process.env.BANK_ACCOUNT;
  const ten = process.env.BANK_ACCOUNT_NAME || '';
  if (!bank || !stk) return '';
  const q = new URLSearchParams({ amount: String(tx.amount), addInfo: tx.code, accountName: ten });
  return `https://img.vietqr.io/image/${bank}-${stk}-compact2.png?${q.toString()}`;
}

function thongTinChuyenKhoan(tx) {
  return {
    nganHang: process.env.BANK_NAME || process.env.BANK_ID || '',
    soTaiKhoan: process.env.BANK_ACCOUNT || '',
    chuTaiKhoan: process.env.BANK_ACCOUNT_NAME || '',
    soTien: tx.amount,
    noiDung: tx.code,
  };
}

function soDu(user) {
  return (user && user.walletBalance) || 0;
}

/** Tạo giao dịch nạp ví — CHƯA cộng tiền, chỉ cộng khi có xác nhận đã trả. */
async function taoDonNapVi(userId, amount) {
  const soTien = Number(amount);
  if (!Number.isInteger(soTien) || soTien < 10000) {
    throw new Error('Số tiền nạp tối thiểu 10.000đ.');
  }
  let code = taoMaNap();
  for (let i = 0; i < 5 && (await WalletTransaction.findOne({ where: { code } })); i += 1) code = taoMaNap();

  const tx = await WalletTransaction.create({
    code,
    type: 'topup',
    amount: soTien,
    status: 'pending',
    description: 'Nạp tiền vào ví',
    UserId: userId,
  });

  const user = await User.findByPk(userId);
  baoThay(
    `Có người tạo lệnh nạp ví ${soTien.toLocaleString('vi-VN')}đ\n` +
    `Người nạp: ${user ? user.name + ' (' + (user.email || user.phone || '') + ')' : '#' + userId}\n` +
    `Nội dung chuyển khoản: ${code}\n` +
    (tuDongDoiSoat()
      ? 'Tiền về là hệ thống tự cộng vào ví.'
      : 'Chưa nối SePay — xem tiền về thì vào 3dvietpro.com/admin/wallet bấm duyệt.')
  );
  return tx;
}

/**
 * Tạo đơn mua GÓI nhiều lượt "tạo web" trả trước — CHƯA cộng credit, chỉ
 * cộng khi xác nhận đã trả (giống hệt cơ chế taoDonNapVi ở trên, dùng LẠI
 * nguyên QR/mã giao dịch/trang xác nhận — chỉ khác relatedType để
 * ghiNhanNapVi() biết đường cộng CREDIT thay vì cộng thẳng vào walletBalance).
 */
async function taoDonMuaGoiTaoWeb(userId, soLuong) {
  const qty = Number(soLuong);
  if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
    throw new Error('Số lượng web phải là số nguyên từ 1 đến 50.');
  }
  const donGiaUsd = donGiaTaoWebTheoSoLuong(qty);
  const tongUsd = donGiaUsd * qty;
  const tongVnd = Math.round(tongUsd * TY_GIA_CO_DINH_GOI_WEB);

  let code = taoMaNap();
  for (let i = 0; i < 5 && (await WalletTransaction.findOne({ where: { code } })); i += 1) code = taoMaNap();

  const tx = await WalletTransaction.create({
    code,
    type: 'topup',
    amount: tongVnd,
    status: 'pending',
    description: `Mua gói ${qty} lượt tạo web (SA-AI BOT) — ${donGiaUsd}$/web${qty > 1 ? ` (đã giảm giá)` : ''}`,
    relatedType: 'WebsiteBuildPackage',
    relatedId: qty,
    UserId: userId,
  });

  const user = await User.findByPk(userId);
  baoThay(
    `Có người tạo lệnh mua gói ${qty} lượt tạo web — ${tongVnd.toLocaleString('vi-VN')}đ (~$${tongUsd})\n` +
    `Người mua: ${user ? user.name + ' (' + (user.email || user.phone || '') + ')' : '#' + userId}\n` +
    `Nội dung chuyển khoản: ${code}\n` +
    (tuDongDoiSoat()
      ? 'Tiền về là hệ thống tự cộng credit.'
      : 'Chưa nối SePay — xem tiền về thì vào 3dvietpro.com/admin/wallet bấm duyệt.')
  );
  return { tx, donGiaUsd, tongUsd, tongVnd, qty };
}

/**
 * Ghi nhận nạp ví thành công — idempotent, gọi lại nhiều lần không cộng
 * trùng. Khoá cả 2 dòng (giao dịch + user) trong 1 transaction DB thật —
 * webhook SePay có thể gọi lại (retry) đúng lúc admin cũng đang bấm duyệt
 * tay, nếu không khoá thì cả 2 đường đều đọc thấy status='pending' cùng
 * lúc và CỘNG TIỀN 2 LẦN trước khi dòng nào kịp ghi 'paid' xong.
 */
async function ghiNhanNapVi(tx, { bankRef = '', bankAmount = null, raw = '', boi = '' } = {}) {
  const ketQua = await sequelize.transaction(async (t) => {
    const txKhoa = await WalletTransaction.findByPk(tx.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!txKhoa || txKhoa.status === 'paid') return { txKhoa: txKhoa || tx, laGoiTaoWeb: false, laGoiKey: false };
    const user = await User.findByPk(txKhoa.UserId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new Error('Không tìm thấy người nạp của giao dịch này');

    // Đơn mua GÓI "tạo web" trả trước: KHÔNG cộng vào walletBalance, cộng
    // vào websiteBuildCredits (số lượt) thay vào đó — relatedId lúc tạo đơn
    // (taoDonMuaGoiTaoWeb) chính là số lượng đã mua.
    const laGoiTaoWeb = txKhoa.relatedType === 'WebsiteBuildPackage';
    const balanceAfter = soDu(user) + (laGoiTaoWeb ? 0 : txKhoa.amount);
    const capNhat = laGoiTaoWeb
      ? { websiteBuildCredits: (user.websiteBuildCredits || 0) + (txKhoa.relatedId || 0) }
      : { walletBalance: balanceAfter };
    await user.update(capNhat, { transaction: t });
    await txKhoa.update(
      {
        status: 'paid',
        balanceAfter,
        paidAt: new Date(),
        bankRef,
        bankAmount,
        rawPayload: typeof raw === 'string' ? raw.slice(0, 4000) : JSON.stringify(raw).slice(0, 4000),
        confirmedBy: boi,
      },
      { transaction: t }
    );

    baoThay(
      laGoiTaoWeb
        ? `Đã cộng ${txKhoa.relatedId} lượt tạo web cho ${user.name} (${user.email || user.phone || ''})\n` +
          `Giao dịch ${txKhoa.code} — ${txKhoa.amount.toLocaleString('vi-VN')}đ` +
          (boi === 'sepay' ? '' : ` — duyệt bởi ${boi || 'tay'}`)
        : `Đã cộng ${txKhoa.amount.toLocaleString('vi-VN')}đ vào ví của ${user.name} (${user.email || user.phone || ''})\n` +
          `Giao dịch ${txKhoa.code} — số dư mới ${balanceAfter.toLocaleString('vi-VN')}đ` +
          (boi === 'sepay' ? '' : ` — duyệt bởi ${boi || 'tay'}`)
    );
    return { txKhoa, laGoiTaoWeb, laGoiKey: txKhoa.relatedType === 'FbaiKeyPlan' };
  });

  // Hoa hồng cho đại lý tính NGAY LÚC MUA GÓI (không phải lúc tiêu từng
  // lượt) — đây mới là lúc tiền thật đã về, nhất quán với cách thuPhiTaoWeb
  // tính hoa hồng ngay lúc trừ ví.
  if (ketQua.laGoiTaoWeb) {
    const user = await User.findByPk(ketQua.txKhoa.UserId);
    if (user) await commission.distributeCommission(user, ketQua.txKhoa.amount, 'WebsiteBuildPackage', ketQua.txKhoa.id);
  }
  // Đơn mua GÓI THÁNG SA-BOTAI: tiền đã cộng vào ví ở trên → TỰ MUA/GIA HẠN luôn (idempotent: chỉ chạy ở lần xác nhận
  // ĐẦU TIÊN vì lần gọi lại đã bị chặn bởi status='paid'). Lỗi ở đây không làm mất tiền — số dư vẫn nằm trong ví.
  if (ketQua.laGoiKey) {
    try {
      const user = await User.findByPk(ketQua.txKhoa.UserId);
      const [, cur] = String(ketQua.txKhoa.description || '').split('|');
      if (user) await muaKeyFbai(user, { months: ketQua.txKhoa.relatedId, currentKey: cur || '' });
    } catch (e) {
      console.error('[wallet] tự mua gói key sau khi tiền về lỗi:', e.message);
    }
  }
  return ketQua.txKhoa;
}

/**
 * Mua 1 tool trả phí bằng số dư ví — trừ tiền, sinh license key, trả về cả
 * hai. Khoá dòng user trong transaction + kiểm tra lại số dư/đã-mua-chưa
 * NGAY TRONG transaction đó — bấm mua 2 lần liền tay (double-click) không
 * thể trừ tiền 2 lần trước khi lần đầu kịp ghi xong.
 */
async function muaTool(user, tool) {
  if (!tool.price || tool.price <= 0) throw new Error('Tool này không phải trả phí.');
  const daMuaTruoc = await ToolLicense.findOne({ where: { UserId: user.id, ToolId: tool.id } });
  if (daMuaTruoc) return { transaction: null, license: daMuaTruoc, daSoHuu: true };

  const ketQua = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    const daMua = await ToolLicense.findOne({ where: { UserId: user.id, ToolId: tool.id }, transaction: t });
    if (daMua) return { transaction: null, license: daMua, daSoHuu: true };

    if (soDu(userKhoa) < tool.price) {
      throw new Error(`Số dư ví không đủ. Cần ${tool.price.toLocaleString('vi-VN')}đ, hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ.`);
    }

    const balanceAfter = soDu(userKhoa) - tool.price;
    const tx = await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -tool.price,
        status: 'paid',
        balanceAfter,
        description: `Mua tool: ${tool.title}`,
        relatedType: 'Tool',
        relatedId: tool.id,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });

    let licenseKey = taoLicenseKey();
    for (let i = 0; i < 5 && (await ToolLicense.findOne({ where: { licenseKey }, transaction: t })); i += 1) licenseKey = taoLicenseKey();
    const license = await ToolLicense.create(
      { licenseKey, UserId: user.id, ToolId: tool.id, WalletTransactionId: tx.id },
      { transaction: t }
    );

    return { transaction: tx, license, daSoHuu: false };
  });

  if (!ketQua.daSoHuu) {
    baoThay(`${user.name} vừa mua tool "${tool.title}" — ${tool.price.toLocaleString('vi-VN')}đ (trừ từ ví).`);
    await commission.distributeCommission(user, tool.price, 'Tool', tool.id);
  }
  return ketQua;
}

/**
 * Đóng học phí 1 khóa học bằng số dư ví — trừ tiền, mở khóa học ngay. Khoá
 * dòng user + kiểm tra lại "đã ghi danh chưa"/"đủ tiền chưa" NGAY TRONG
 * transaction, cùng lý do với muaTool() ở trên.
 */
async function thanhToanHocPhiBangVi(user, course) {
  const daGhiDanhTruoc = await Enrollment.findOne({ where: { UserId: user.id, CourseId: course.id } });
  if (daGhiDanhTruoc) throw new Error('Bạn đã sở hữu khóa học này rồi.');

  const amount = course.salePrice != null ? course.salePrice : course.price;

  const { order, enrollment } = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    const alreadyEnrolled = await Enrollment.findOne({ where: { UserId: user.id, CourseId: course.id }, transaction: t });
    if (alreadyEnrolled) throw new Error('Bạn đã sở hữu khóa học này rồi.');

    if (soDu(userKhoa) < amount) {
      throw new Error(`Số dư ví không đủ. Cần ${amount.toLocaleString('vi-VN')}đ, hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ.`);
    }

    const order_ = await Order.create(
      {
        UserId: user.id,
        CourseId: course.id,
        amount,
        provider: 'mock',
        status: 'paid',
        paidAt: new Date(),
        transactionRef: `VI-${Date.now().toString(36)}`,
      },
      { transaction: t }
    );
    const enrollment_ = await Enrollment.create({ UserId: user.id, CourseId: course.id, OrderId: order_.id }, { transaction: t });
    await Course.increment('enrollmentCount', { by: 1, where: { id: course.id }, transaction: t });

    const balanceAfter = soDu(userKhoa) - amount;
    await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -amount,
        status: 'paid',
        balanceAfter,
        description: `Đóng học phí: ${course.title}`,
        relatedType: 'Course',
        relatedId: course.id,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });

    return { order: order_, enrollment: enrollment_ };
  });

  baoThay(`${user.name} vừa đóng học phí "${course.title}" — ${amount.toLocaleString('vi-VN')}đ (trừ từ ví).`);
  await commission.distributeCommission(user, amount, 'Course', course.id);
  return { order, enrollment };
}

/**
 * Thu phí "tạo 1 web" trong SA-AI BOT — $50 quy đổi VNĐ theo tỷ giá thị
 * trường lúc trừ tiền, trừ thẳng vào ví (không qua bước QR/chờ duyệt như
 * nạp ví, vì đây là TRỪ số dư đã có sẵn). Khoá dòng user trong transaction
 * + kiểm tra lại số dư NGAY TRONG đó, giống hệt lý do khoá của muaTool() —
 * bấm "Tạo web" 2 lần liền tay không trừ tiền 2 lần cho cùng 1 lần tạo.
 * Trả về cả `usdRate` đã dùng để tool có thể hiển thị minh bạch cho khách.
 */
function chuanHoaTenMien(raw) {
  return String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[\/?#].*$/, '').replace(/:\d+$/, '');
}

/**
 * XEM TRƯỚC phí tạo web cho 1 tên miền (không trừ gì): miễn phí nếu là tên miền đã tạo trước đó (sửa/đưa
 * lên lại không giới hạn) hoặc là tên miền ĐẦU TIÊN của khách có key còn hạn; còn lại thu phí web mới
 * (35$ x 26.000đ = 910.000đ) — dùng lượt trả trước nếu có.
 */
async function xemPhiTaoWeb(user, websiteDomain, licenseKey) {
  const domain = chuanHoaTenMien(websiteDomain);
  const phi = fbaiKeyPricing.getWebFee();
  if (!domain) return { domain: '', mienPhi: false, lyDo: 'thieu_ten_mien', usd: phi.usd, vnd: phi.vnd };
  const daCo = await WebsiteDomain.findOne({ where: { UserId: user.id, domain } });
  if (daCo) return { domain, mienPhi: true, lyDo: 'cung_ten_mien', usd: 0, vnd: 0, daDeploy: daCo.deployCount };
  const soTenMien = await WebsiteDomain.count({ where: { UserId: user.id } });
  const coKey = !!(licenseKey && fbaiLicense.isActiveLicense(licenseKey));
  if (soTenMien === 0 && coKey) return { domain, mienPhi: true, lyDo: 'web_dau_tien', usd: 0, vnd: 0 };
  const credits = user.websiteBuildCredits || 0;
  return { domain, mienPhi: false, lyDo: soTenMien === 0 ? 'chua_co_key' : 'ten_mien_moi', usd: phi.usd, vnd: phi.vnd, dungCredit: credits > 0, soDu: soDu(user) };
}

/**
 * Thu phí tạo web THEO TÊN MIỀN (gọi TRƯỚC khi tool chạy deploy thật):
 *  - tên miền đã tạo trước đó → miễn phí (khách sửa tới khi hài lòng, đưa lên lại bao nhiêu lần cũng được);
 *  - tên miền ĐẦU TIÊN của khách + key còn hạn → miễn phí (web tặng kèm key lần đầu);
 *  - tên miền mới khác → thu 35$ x 26.000đ: ưu tiên lượt trả trước (gói), hết lượt mới trừ ví.
 * Khoá dòng user trong transaction: bấm 2 lần liền tay không đếm/thu 2 lần.
 */
async function thuPhiTaoWeb(user, websiteDomain, { licenseKey } = {}) {
  const domain = chuanHoaTenMien(websiteDomain);
  if (!domain || !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(domain)) throw new Error('Cần nhập tên miền hợp lệ (VD abc.com) — hệ thống đếm số web theo tên miền.');
  const phi = fbaiKeyPricing.getWebFee();
  const coKey = !!(licenseKey && fbaiLicense.isActiveLicense(licenseKey));

  const ketQua = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    const daCo = await WebsiteDomain.findOne({ where: { UserId: user.id, domain }, transaction: t, lock: t.LOCK.UPDATE });
    if (daCo) {
      await daCo.update({ deployCount: daCo.deployCount + 1, lastDeployedAt: new Date() }, { transaction: t });
      return { mienPhi: true, lyDo: 'cung_ten_mien', amountVnd: 0, usdRate: 0, balanceAfter: soDu(userKhoa) };
    }
    const soTenMien = await WebsiteDomain.count({ where: { UserId: user.id }, transaction: t });
    if (soTenMien === 0 && coKey) {
      await WebsiteDomain.create({ UserId: user.id, domain, feeVnd: 0, freeReason: 'web_dau_tien', licenseKey: String(licenseKey).slice(0, 40) }, { transaction: t });
      return { mienPhi: true, lyDo: 'web_dau_tien', amountVnd: 0, usdRate: 0, balanceAfter: soDu(userKhoa) };
    }

    // Tên miền MỚI phải trả phí: lượt trả trước trước, rồi tới ví.
    if ((userKhoa.websiteBuildCredits || 0) > 0) {
      const conLai = userKhoa.websiteBuildCredits - 1;
      await userKhoa.update({ websiteBuildCredits: conLai }, { transaction: t });
      await WebsiteDomain.create({ UserId: user.id, domain, feeVnd: 0, freeReason: 'dung_luot_tra_truoc', licenseKey: licenseKey ? String(licenseKey).slice(0, 40) : null }, { transaction: t });
      return { mienPhi: false, dungCredit: true, creditsConLai: conLai, lyDo: 'ten_mien_moi', amountVnd: 0, usdRate: 0, balanceAfter: soDu(userKhoa) };
    }
    if (soDu(userKhoa) < phi.vnd) {
      const err = new Error(`Tên miền ${domain} là web mới (từ web thứ 2 trở đi) — phí ${phi.vnd.toLocaleString('vi-VN')}đ (${phi.usd}$). Số dư ví hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ, cần nạp thêm ${(phi.vnd - soDu(userKhoa)).toLocaleString('vi-VN')}đ.`);
      err.thieu = phi.vnd - soDu(userKhoa);
      throw err;
    }
    const balanceAfter = soDu(userKhoa) - phi.vnd;
    const tx = await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -phi.vnd,
        status: 'paid',
        balanceAfter,
        description: `Tạo web SA-BOTAI: ${domain} — ${phi.usd}$ x ${fbaiKeyPricing.USD_RATE.toLocaleString('vi-VN')}đ`,
        relatedType: 'WebsiteBuild',
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });
    await WebsiteDomain.create({ UserId: user.id, domain, feeVnd: phi.vnd, freeReason: null, licenseKey: licenseKey ? String(licenseKey).slice(0, 40) : null }, { transaction: t });
    return { mienPhi: false, lyDo: 'ten_mien_moi', amountVnd: phi.vnd, usdRate: fbaiKeyPricing.USD_RATE, balanceAfter, txId: tx.id };
  });

  if (ketQua.mienPhi) {
    baoThay(`${user.name} ${ketQua.lyDo === 'web_dau_tien' ? 'tạo WEB ĐẦU TIÊN (miễn phí kèm key)' : 'đưa lại web lên'} qua SA-BOTAI — tên miền ${domain}.`);
  } else if (ketQua.dungCredit) {
    baoThay(`${user.name} tạo web mới ${domain} qua SA-BOTAI — dùng 1 lượt trả trước (còn ${ketQua.creditsConLai} lượt).`);
  } else {
    baoThay(`${user.name} tạo web mới ${domain} qua SA-BOTAI — thu ${ketQua.amountVnd.toLocaleString('vi-VN')}đ (${phi.usd}$ x ${fbaiKeyPricing.USD_RATE.toLocaleString('vi-VN')}).`);
    await commission.distributeCommission(user, ketQua.amountVnd, 'WebsiteBuild', ketQua.txId);
  }
  return { ...ketQua, domain, dungCredit: !!ketQua.dungCredit };
}

/**
 * KHÁCH TỰ MUA/GIA HẠN SA-BOTAI theo gói tháng bằng số dư ví — trừ tiền, tự cấp key mới (hoặc cộng thêm
 * số ngày của gói vào key đang dùng) và gắn vào đúng tài khoản, KHÔNG cần thầy duyệt (thầy chốt
 * 2026-10-05: "khi khách đóng tiền xong tự mở cho tool chạy tiếp"). Giá từng gói lấy từ fbaiKeyPricing
 * (35$/55$/149$... x 26.000đ). Khoá dòng user + kiểm tra số dư NGAY TRONG transaction; cấp key là bước CUỐI
 * trong transaction nên lỗi ở đâu thì tiền cũng được hoàn (rollback). Hoa hồng giới thiệu như mọi sản phẩm.
 */
async function muaKeyFbai(user, { currentKey, months } = {}) {
  const goi = fbaiKeyPricing.getPlan(months || 1);
  if (!goi) throw new Error('Gói này chưa mở bán tự động — nhắn Zalo 0977317988 để được hỗ trợ.');
  const gia = goi.vnd;

  const owner = { userId: user.id, email: user.email || user.phone || String(user.id) };
  const ketQua = await sequelize.transaction(async (t) => {
    const userKhoa = await User.findByPk(user.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (soDu(userKhoa) < gia) {
      const err = new Error(`Số dư ví không đủ để mua gói ${goi.months} tháng. Cần ${gia.toLocaleString('vi-VN')}đ, hiện có ${soDu(userKhoa).toLocaleString('vi-VN')}đ.`);
      err.thieu = gia - soDu(userKhoa);
      throw err;
    }
    const balanceAfter = soDu(userKhoa) - gia;
    const tx = await WalletTransaction.create(
      {
        type: 'purchase',
        amount: -gia,
        status: 'paid',
        balanceAfter,
        description: `Gia hạn SA-BOTAI ${goi.months} tháng (${goi.usd}$)`,
        relatedType: 'FbaiKey',
        relatedId: goi.months,
        paidAt: new Date(),
        UserId: user.id,
      },
      { transaction: t }
    );
    await userKhoa.update({ walletBalance: balanceAfter }, { transaction: t });

    let entry = null;
    let giaHan = false;
    if (currentKey) {
      const r = fbaiLicense.extendKey(currentKey, owner, goi.days);
      if (r.entry) { entry = r.entry; giaHan = true; }
    }
    if (!entry) entry = fbaiLicense.issueKey(`Tự mua qua ví (${goi.months} tháng) — ${owner.email}`, owner, goi.days);
    return { tx, entry, giaHan, balanceAfter };
  });

  baoThay(`${user.name} vừa ${ketQua.giaHan ? 'gia hạn' : 'mua'} SA-BOTAI ${goi.months} tháng — ${gia.toLocaleString('vi-VN')}đ (${goi.usd}$).`);
  await commission.distributeCommission(user, gia, 'FbaiKey', ketQua.tx.id);
  return { key: ketQua.entry.key, expiresAt: ketQua.entry.expiresAt, giaHan: ketQua.giaHan, soDuConLai: ketQua.balanceAfter, gia, months: goi.months };
}

/**
 * Tạo đơn mua gói tháng bằng QR chuyển khoản (khách chưa nạp ví): khi tiền về (SePay webhook → ghiNhanNapVi),
 * hệ thống cộng ví RỒI TỰ MUA/GIA HẠN luôn gói đã chọn — khách không phải bấm thêm gì, tool tự mở lại.
 * currentKey lưu tạm trong description sau dấu "|" để biết gia hạn key nào.
 */
async function taoDonMuaGoiKey(userId, months, currentKey) {
  const goi = fbaiKeyPricing.getPlan(months);
  if (!goi) throw new Error('Gói này chưa mở bán tự động.');
  let code = taoMaNap();
  for (let i = 0; i < 5 && (await WalletTransaction.findOne({ where: { code } })); i += 1) code = taoMaNap();
  const mo = `Mua gói SA-BOTAI ${goi.months} tháng (${goi.usd}$)`;
  const tx = await WalletTransaction.create({
    code,
    type: 'topup',
    amount: goi.vnd,
    status: 'pending',
    description: (currentKey ? `${mo}|${String(currentKey).slice(0, 24)}` : mo).slice(0, 250),
    relatedType: 'FbaiKeyPlan',
    relatedId: goi.months,
    UserId: userId,
  });
  const user = await User.findByPk(userId);
  baoThay(
    `Có người tạo lệnh mua gói SA-BOTAI ${goi.months} tháng — ${goi.vnd.toLocaleString('vi-VN')}đ (${goi.usd}$)\n` +
    `Người mua: ${user ? user.name + ' (' + (user.email || user.phone || '') + ')' : '#' + userId}\nNội dung chuyển khoản: ${code}\n` +
    (tuDongDoiSoat() ? 'Tiền về là hệ thống tự cấp/gia hạn key.' : 'Chưa nối SePay — xem tiền về thì vào 3dvietpro.com/admin/wallet bấm duyệt.')
  );
  return { tx, goi };
}

module.exports = {
  muaKeyFbai,
  taoDonMuaGoiKey,
  xemPhiTaoWeb,
  chuanHoaTenMien,
  tuDongDoiSoat,
  sanSangNhanTien,
  anhQR,
  thongTinChuyenKhoan,
  soDu,
  taoDonNapVi,
  ghiNhanNapVi,
  muaTool,
  thanhToanHocPhiBangVi,
  thuPhiTaoWeb,
  taoDonMuaGoiTaoWeb,
  donGiaTaoWebTheoSoLuong,
  PHI_TAO_WEB_USD,
  TY_GIA_CO_DINH_GOI_WEB,
};
