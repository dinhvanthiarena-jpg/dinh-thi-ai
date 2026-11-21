// Trang công khai: khách đăng ký mua tool Sa Muse Ai (mount ở /dang-ky-tool-muse).
const express = require('express');
const rateLimit = require('express-rate-limit');
const svc = require('../services/museRegistrationService');
const promo = require('../services/musePromoService');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false });

const TITLE = 'Đăng ký mua tool Sa Muse Ai — làm video AI hàng loạt';

// Hạn và giá cũ dùng chung cho mọi lần render (hiển thị "1 năm (365 ngày)" thay vì "30 ngày").
router.use((req, res, next) => {
  res.locals.han = svc.HAN_TEXT;
  res.locals.giaCu = svc.GIA_CU;
  next();
});

// Mã ưu đãi đang nhập (từ link ?ma= hoặc ô trong form): mã đúng thì trang hiện giá của mã, mã sai thì không hiện gì.
function xemMa(nhap) {
  const kt = nhap ? promo.kiemTra(nhap) : null;
  return kt && kt.ok ? kt : null;
}

const render = (res, status, extra) => {
  const promoPre = extra.promoPre || null;
  return res.status(status).render('muse-register', {
    title: TITLE, gia: svc.GIA, giaHien: promoPre ? promoPre.gia : svc.GIA, promoPre,
    ngay: svc.NGAY, zalo: svc.ZALO, old: {}, errors: [], done: null, pay: null, ...extra,
  });
};

router.get('/', (req, res) => {
  const ma = String(req.query.ma || '').slice(0, 40);
  render(res, 200, { promoPre: xemMa(ma), old: ma ? { promo: promo.chuanHoa(ma) } : {} });
});

// Trang tải tool (link trong mail trỏ về đây thay vì link .exe trực tiếp, để mail ít bị coi là spam).
router.get('/tai-tool', (req, res) =>
  res.render('muse-download', { title: 'Tải tool Sa Muse Ai', zalo: svc.ZALO, linkExe: svc.linkTai() }));

router.post('/', limiter, async (req, res) => {
  // Ô bẫy chống bot: người thật không thấy nên không điền.
  if (req.body.website) return render(res, 200, {});
  const pre = xemMa(req.body.promo);
  if (!req.body.hieu) {
    return render(res, 400, { old: req.body, promoPre: pre, errors: [{ msg: 'Vui lòng tick xác nhận bạn đã đọc và hiểu các yêu cầu.' }] });
  }
  const e1 = String(req.body.email || '').trim().toLowerCase();
  const e2 = String(req.body.email2 || '').trim().toLowerCase();
  if (e1 !== e2) {
    return render(res, 400, { old: req.body, promoPre: pre, errors: [{ msg: 'Hai ô Gmail chưa giống nhau, vui lòng kiểm tra lại để nhận được key.' }] });
  }
  try {
    const r = await svc.dangKy(req.body);
    if (r.loi) {
      return render(res, 400, { old: req.body, promoPre: pre, errors: r.loi.map((msg) => ({ msg })) });
    }
    return render(res, 200, {
      done: { code: r.reg.code, name: r.reg.name, email: r.reg.email, amount: r.reg.amount, maUuDai: r.maUuDai || '' },
      pay: svc.thongTinThanhToan(r.reg),
    });
  } catch (e) {
    console.error('[museRegister]', e);
    return render(res, 500, { old: req.body, promoPre: pre, errors: [{ msg: `Có lỗi, vui lòng thử lại hoặc nhắn Zalo ${svc.ZALO}.` }] });
  }
});

module.exports = router;
