const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const gameApiController = require('../controllers/gameApiController');

// One ping per app launch, generous headroom for a teacher restarting the
// game a lot while testing something.
const pingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60 });

// Homework photos never touch disk or become web-accessible — memory
// storage only, buffer is discarded after the Gemini call completes.
const homeworkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});
// Free-tier Gemini has its own rate limits; this caps abuse from one IP
// well below that so one class doesn't starve everyone else.
const homeworkLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30 });

// A student's own device subscribing/unsubscribing — cheap, but still capped
// well above any real usage pattern to block abuse.
const pushLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30 });

// One call turn per mic/typed answer — generous enough for a real
// conversation, capped well below what would meaningfully burn tokens.
const boomChatLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40 });

// Đăng nhập sai thì chặn dần lại, để không ai ngồi dò mật khẩu của người
// khác — cùng ngưỡng với /api/english-air/dang-nhap.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8 });

// Mỗi lần yêu cầu mã là 1 email gửi đi thật — giới hạn để không ai lợi
// dụng ô đăng ký để spam email người khác.
const otpRequestLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post('/ping', pingLimiter, gameApiController.ping);
router.post('/homework-help', homeworkLimiter, homeworkUpload.single('image'), gameApiController.homeworkHelp);
router.get('/vapid-public-key', gameApiController.vapidPublicKey);
router.post('/push-subscribe', pushLimiter, gameApiController.pushSubscribe);
router.post('/push-unsubscribe', pushLimiter, gameApiController.pushUnsubscribe);
router.post('/boom-chat', boomChatLimiter, gameApiController.boomChat);

// Tài khoản (đăng ký / đăng nhập bằng số điện thoại) — port từ English Air.
// Đăng ký giờ qua 2 bước, xác nhận bằng mã OTP gửi email trước khi tạo
// tài khoản thật (yêu-cầu -> gửi lại nếu cần -> xác-nhận).
router.get('/toi', gameApiController.toi);
router.post('/dang-ky-yeu-cau', otpRequestLimiter, gameApiController.dangKyYeuCau);
router.post('/dang-ky-gui-lai', otpRequestLimiter, gameApiController.dangKyGuiLai);
router.post('/dang-ky-xac-nhan', loginLimiter, gameApiController.dangKyXacNhan);
router.post('/dang-nhap', loginLimiter, gameApiController.dangNhap);
router.post('/thoat', gameApiController.thoat);

module.exports = router;
