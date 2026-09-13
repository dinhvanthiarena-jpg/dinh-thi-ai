/* Nhắc học cho app English Air.
 *
 * Thầy đặt bài: "cứ lâu lâu trong ngày không học, không mở app là thông báo".
 * Nên chạy nhiều mốc trong ngày, nhưng chỉ nhắc ĐÚNG NGƯỜI CHƯA HỌC hôm đó —
 * nhắc nhầm người vừa học xong là kiểu chắc chắn bị tắt thông báo ngay.
 *
 * Ba cái chốt để không thành phiền:
 *   1. Học rồi thì thôi, ngày đó không nhắc nữa.
 *   2. Nhiều nhất 3 lần một ngày, dù có 4 mốc.
 *   3. Mỗi mốc chỉ nhắc một lần, kể cả khi máy chủ khởi động lại giữa chừng.
 */
const webpush = require('web-push');
const { Op } = require('sequelize');
const PushSubscription = require('../models/PushSubscription');
const NhacHoc = require('../models/NhacHoc');

const APP = 'english-air';
const MOC = [8, 12, 16, 20];      // giờ Việt Nam
const TOI_DA_NGAY = 3;            // nhiều nhất bấy nhiêu lần một ngày

/* Lời nhắc — đúng giọng thầy muốn: rủ rê, không ra lệnh. Bốc ngẫu nhiên để
   không ngày nào giống ngày nào, đọc mãi một câu là người ta thành mù chữ. */
const LOI = [
  { title: 'Bạn ơi, hôm nay chưa học kìa!', body: 'Mở app ra làm một bài thôi, mười phút là xong.' },
  { title: 'Bạn ơi, vào học thôi nào!', body: 'Một bài ngắn hôm nay, mai đỡ quên.' },
  { title: 'Có bài mới và trò chơi rất hay!', body: 'Bắn chữ, chém chữ, ném bóng, rắn cắn chữ — vào chơi mà học.' },
  { title: 'Bạn đang làm gì đấy? Học thôi nào!', body: 'Mười phút thôi, ON-Language đang đợi.' },
  { title: 'Bạn chưa mở app ra học sao?', body: 'Hôm nay chưa có bài nào cả. Vào làm một bài nhé.' },
  { title: 'ON-Language nhớ bạn rồi đấy!', body: 'Học một bài cho đỡ quên từ hôm qua.' },
  { title: 'Mười phút cho tiếng Anh hôm nay?', body: 'Một bài thôi cũng được, đều đặn mới ăn thua.' },
];

/* Sắp đứt chuỗi ngày thì nhắc riêng — câu này ăn hơn hẳn câu thường, vì người
   ta tiếc công đã bỏ ra chứ không ham cái mới. */
const LOI_CHUOI = chuoi => ({
  title: `Chuỗi ${chuoi} ngày sắp đứt!`,
  body: 'Học một bài hôm nay là giữ được chuỗi. Tiếc lắm đấy.',
});

const sanSang = () => !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. Máy chủ chạy giờ nào cũng
    ra đúng, vì tính thẳng từ UTC cộng bảy tiếng. */
function ngayVN(d = new Date()) {
  return new Date(d.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}
function gioVN(d = new Date()) {
  return new Date(d.getTime() + 7 * 3600 * 1000).getUTCHours();
}

/** Người này vừa học xong một bài — ghi nhận để hôm nay khỏi nhắc nữa. */
async function danhDauDaHoc(endpoint, chuoi) {
  if (!endpoint) return;
  const hom = ngayVN();
  const [h] = await NhacHoc.findOrCreate({
    where: { endpoint },
    defaults: { endpoint, hocNgay: hom, chuoi: chuoi || 0 },
  });
  await h.update({ hocNgay: hom, chuoi: Number(chuoi) || h.chuoi });
}

async function datBat(endpoint, bat) {
  if (!endpoint) return;
  const [h] = await NhacHoc.findOrCreate({ where: { endpoint }, defaults: { endpoint, bat: !!bat } });
  await h.update({ bat: !!bat });
}

/** Gửi một lượt nhắc cho mốc giờ hiện tại. */
async function nhacMotLuot() {
  if (!sanSang()) return;
  const gio = gioVN();
  const moc = MOC.indexOf(gio);
  if (moc < 0) return;                 // không phải mốc nhắc

  const hom = ngayVN();
  const ds = await PushSubscription.findAll({ where: { appId: APP } });
  if (!ds.length) return;

  let gui = 0, bo = 0, hong = 0;
  for (const sub of ds) {
    let h = await NhacHoc.findOne({ where: { endpoint: sub.endpoint } });
    if (!h) h = await NhacHoc.create({ endpoint: sub.endpoint });

    if (!h.bat) { bo++; continue; }
    if (h.hocNgay === hom) { bo++; continue; }          // hôm nay học rồi
    if (h.nhacNgay === hom && h.mocCuoi === moc) { bo++; continue; }  // mốc này nhắc rồi
    if (h.nhacNgay === hom && h.soNhac >= TOI_DA_NGAY) { bo++; continue; }

    // Hôm qua có học và đang giữ chuỗi thì dùng lời nhắc tiếc chuỗi
    const homQua = ngayVN(new Date(Date.now() - 24 * 3600 * 1000));
    const loi = (h.chuoi >= 2 && h.hocNgay === homQua)
      ? LOI_CHUOI(h.chuoi)
      : LOI[Math.floor(Math.random() * LOI.length)];

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({
          title: loi.title,
          body: loi.body,
          tag: 'nhac-hoc',
          url: '/english-air/',
        })
      );
      gui++;
      await h.update({
        nhacNgay: hom,
        soNhac: h.nhacNgay === hom ? h.soNhac + 1 : 1,
        mocCuoi: moc,
      });
    } catch (e) {
      hong++;
      // 404/410 nghĩa là trình duyệt đó đã gỡ đăng ký — dọn đi cho sạch
      if (e.statusCode === 404 || e.statusCode === 410) {
        await PushSubscription.destroy({ where: { endpoint: sub.endpoint } });
        await NhacHoc.destroy({ where: { endpoint: sub.endpoint } });
      }
    }
  }
  if (gui || hong) console.log(`[nhac-hoc] mốc ${MOC[moc]}h — gửi ${gui}, bỏ qua ${bo}, hỏng ${hong}`);
}

function batDauNhacHoc() {
  if (!sanSang()) {
    console.log('[nhac-hoc] chưa có khoá VAPID, không bật nhắc học');
    return;
  }
  // Soi mỗi 10 phút. Mốc nào đã nhắc thì lượt sau tự bỏ qua, nên chạy dày
  // cũng không gửi trùng — và máy chủ khởi động lại giữa chừng vẫn bắt kịp mốc.
  nhacMotLuot().catch(e => console.error('[nhac-hoc]', e.message));
  setInterval(() => {
    nhacMotLuot().catch(e => console.error('[nhac-hoc]', e.message));
  }, 10 * 60 * 1000);
  console.log('[nhac-hoc] đã bật, các mốc:', MOC.join('h, ') + 'h (giờ Việt Nam)');
}

module.exports = { batDauNhacHoc, nhacMotLuot, danhDauDaHoc, datBat, ngayVN };
