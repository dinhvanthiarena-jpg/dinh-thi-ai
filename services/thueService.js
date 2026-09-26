/**
 * TÍNH THUẾ CHO TỪNG ĐƠN BÁN GÓI PRO
 *
 * ════════ NÓI RÕ CÁI KHÔNG LÀM ĐƯỢC ════════
 * Không có cách nào để app TỰ NỘP tiền thuế theo từng đơn. Cá nhân ở Việt Nam
 * nộp thuế qua eTax Mobile / cổng Thuế điện tử bằng chính tài khoản của mình,
 * và khai theo KỲ (quý, năm) chứ không theo từng giao dịch. Không có API công
 * khai nào cho phép bên thứ ba nộp thay.
 *
 * Vậy file này lo phần làm được, và làm cho tử tế:
 *   1. Mỗi đơn đã thu tiền thì tính sẵn phần thuế phải trích, LƯU LẠI ngay lúc
 *      đó — không tính lại về sau. Thuế suất có thể đổi, mà đơn cũ phải giữ
 *      đúng con số của thời điểm bán.
 *   2. Cộng theo tháng / quý / năm để lúc khai thuế chỉ việc chép số.
 *   3. Canh ngưỡng miễn thuế: chưa vượt thì không phải nộp, vượt rồi thì báo.
 *
 * ════════ THUẾ SUẤT ════════
 * Cá nhân kinh doanh nộp thuế theo TỶ LỆ TRÊN DOANH THU, không trừ chi phí.
 * Với nhóm DỊCH VỤ, tỷ lệ thường dùng là 5% GTGT + 2% TNCN = 7% doanh thu.
 * Dưới ngưỡng doanh thu năm thì được miễn cả hai.
 *
 * TẤT CẢ đều đọc từ biến môi trường, không viết chết số nào:
 *   THUE_GTGT_PCT    mặc định 5
 *   THUE_TNCN_PCT    mặc định 2
 *   THUE_NGUONG_NAM  mặc định 200000000
 *   THUE_BAT         "on" thì tính, để trống/off thì mọi con số thuế bằng 0
 *
 * LƯU Ý CHO THẦY: mấy con số trên là mức phổ biến, KHÔNG phải lời tư vấn thuế.
 * Trước khi khai thật, thầy hỏi lại cơ quan thuế hoặc kế toán xem app của mình
 * xếp vào nhóm ngành nào và ngưỡng năm nay là bao nhiêu, rồi chỉnh lại biến.
 */
const { Op } = require('sequelize');
const { ProOrder } = require('../models');

const so = (v, mac) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : mac;
};

const batThue = () => String(process.env.THUE_BAT || '').toLowerCase() === 'on';
const tyLeGtgt = () => so(process.env.THUE_GTGT_PCT, 5);
const tyLeTncn = () => so(process.env.THUE_TNCN_PCT, 2);
const nguongNam = () => so(process.env.THUE_NGUONG_NAM, 200000000);

/** Cấu hình đang áp dụng — để hiện lên trang quản trị cho thầy nhìn. */
function cauHinh() {
  return {
    bat: batThue(),
    gtgt: tyLeGtgt(),
    tncn: tyLeTncn(),
    nguong: nguongNam(),
    tong: tyLeGtgt() + tyLeTncn(),
  };
}

/**
 * Tính phần thuế phải trích từ MỘT khoản doanh thu.
 * Làm tròn tới đồng, và trích theo cách có lợi cho ngân sách (làm tròn lên) để
 * không bao giờ nộp thiếu vì lẻ đồng.
 */
function tinhThue(doanhThu) {
  const dt = Math.max(0, Math.round(so(doanhThu, 0)));
  if (!batThue()) {
    return { doanhThu: dt, gtgt: 0, tncn: 0, tongThue: 0, thucNhan: dt, tyLe: 0 };
  }
  const gtgt = Math.ceil((dt * tyLeGtgt()) / 100);
  const tncn = Math.ceil((dt * tyLeTncn()) / 100);
  return {
    doanhThu: dt,
    gtgt,
    tncn,
    tongThue: gtgt + tncn,
    thucNhan: dt - gtgt - tncn,
    tyLe: tyLeGtgt() + tyLeTncn(),
  };
}

/** Ghi số thuế vào đơn NGAY LÚC xác nhận đã thu tiền, rồi không đụng lại nữa. */
async function ghiThueVaoDon(order) {
  if (!order || order.thueDaTinh) return order;
  const t = tinhThue(order.amount);
  order.thueGtgt = t.gtgt;
  order.thueTncn = t.tncn;
  order.thueTyLe = t.tyLe;
  order.thueDaTinh = true;
  await order.save();
  return order;
}

/** Khoảng thời gian của một kỳ: 'thang' | 'quy' | 'nam'. */
function khoangKy(kieu, nam, so2) {
  const y = Number(nam);
  if (kieu === 'nam') return [new Date(y, 0, 1), new Date(y + 1, 0, 1)];
  if (kieu === 'quy') {
    const q = Math.min(4, Math.max(1, Number(so2) || 1));
    return [new Date(y, (q - 1) * 3, 1), new Date(y, q * 3, 1)];
  }
  const m = Math.min(12, Math.max(1, Number(so2) || 1));
  return [new Date(y, m - 1, 1), new Date(y, m, 1)];
}

/** Tổng hợp một kỳ: bao nhiêu đơn, doanh thu bao nhiêu, thuế phải nộp bao nhiêu. */
async function tongHop(kieu, nam, so2) {
  const [tu, den] = khoangKy(kieu, nam, so2);
  const ds = await ProOrder.findAll({
    where: { status: 'paid', paidAt: { [Op.gte]: tu, [Op.lt]: den } },
    order: [['paidAt', 'ASC']],
  });
  const gop = ds.reduce(
    (a, d) => {
      a.soDon += 1;
      a.doanhThu += d.amount || 0;
      a.gtgt += d.thueGtgt || 0;
      a.tncn += d.thueTncn || 0;
      return a;
    },
    { soDon: 0, doanhThu: 0, gtgt: 0, tncn: 0 }
  );
  gop.tongThue = gop.gtgt + gop.tncn;
  gop.thucNhan = gop.doanhThu - gop.tongThue;
  gop.tu = tu;
  gop.den = den;
  gop.donHang = ds;
  return gop;
}

/** Doanh thu cộng dồn cả năm và tình hình so với ngưỡng miễn thuế. */
async function tinhHinhNam(nam) {
  const y = Number(nam) || new Date().getFullYear();
  const n = await tongHop('nam', y);
  const nguong = nguongNam();
  return {
    nam: y,
    ...n,
    nguong,
    daVuot: n.doanhThu > nguong,
    conCachNguong: Math.max(0, nguong - n.doanhThu),
    phanTram: nguong > 0 ? Math.min(100, Math.round((n.doanhThu / nguong) * 100)) : 0,
  };
}

/** Mười hai tháng của một năm, để vẽ bảng trong trang quản trị. */
async function banThang(nam) {
  const y = Number(nam) || new Date().getFullYear();
  const ra = [];
  for (let m = 1; m <= 12; m += 1) {
    const t = await tongHop('thang', y, m);
    delete t.donHang;
    ra.push({ thang: m, ...t });
  }
  return ra;
}

module.exports = {
  cauHinh, tinhThue, ghiThueVaoDon,
  tongHop, tinhHinhNam, banThang, khoangKy,
};
