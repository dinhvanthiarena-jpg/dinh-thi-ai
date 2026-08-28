/**
 * Đồng bộ tiến độ học Mon.L giữa máy người dùng và máy chủ.
 *
 * Nguyên tắc: KHÔNG BAO GIỜ LÀM MẤT TIẾN ĐỘ. Hai bên lệch nhau thì gộp lại chứ
 * không lấy bên này đè bên kia — người ta có thể học trên điện thoại lúc mất
 * mạng rồi mở máy tính, cả hai buổi đều phải còn.
 */
const MonlTienDo = require('../models/MonlTienDo');

const soNguyen = (v) => (Number.isFinite(+v) ? Math.max(0, Math.trunc(+v)) : 0);

/** Gộp hai gói tiến độ. Cái gì tăng dần thì lấy lớn hơn, danh sách thì lấy hợp. */
function gop(may, chu) {
  if (!chu || typeof chu !== 'object') return may || {};
  if (!may || typeof may !== 'object') return chu;

  const r = { ...chu, ...may };

  // Các con số chỉ có tăng: lấy bên nào lớn hơn.
  ['xp', 'streak', 'best', 'weekXp', 'tier'].forEach((k) => {
    r[k] = Math.max(soNguyen(may[k]), soNguyen(chu[k]));
  });

  // Bài đã xong: hợp của hai bên, học rồi thì không bao giờ quay lại chưa học.
  r.done = { ...(chu.done || {}), ...(may.done || {}) };

  // Ngày đã học: hợp, bỏ trùng, giữ thứ tự.
  const ngay = new Set([...(chu.days || []), ...(may.days || [])]);
  r.days = [...ngay].sort();

  // Lịch ôn từ: mỗi từ lấy bản ôn xa hơn, tức là người ta đã thuộc hơn.
  const srs = { ...(chu.srs || {}) };
  Object.entries(may.srs || {}).forEach(([tu, m]) => {
    const c = srs[tu];
    if (!c) { srs[tu] = m; return; }
    srs[tu] = soNguyen(m && m.n) >= soNguyen(c && c.n) ? m : c;
  });
  r.srs = srs;

  // Tim và ngày hôm nay thì lấy của máy đang dùng — đó mới là hiện tại của họ.
  ['hearts', 'heartAt', 'lastDay', 'goalDay', 'todayXp', 'weekStart'].forEach((k) => {
    if (may[k] !== undefined) r[k] = may[k];
  });

  // Ngày tham gia lấy sớm nhất, cho đúng với lúc người ta thật sự bắt đầu.
  if (chu.joined && may.joined) r.joined = chu.joined < may.joined ? chu.joined : may.joined;

  return r;
}

async function doc(userId) {
  const row = await MonlTienDo.findOne({ where: { UserId: userId } });
  if (!row) return null;
  try {
    return JSON.parse(row.duLieu || '{}');
  } catch {
    // Gói hỏng thì coi như chưa có, đừng để một bản lỗi chặn cả việc học.
    return null;
  }
}

async function ghi(userId, goi) {
  const chuoi = JSON.stringify(goi || {});
  // Chặn gói phình bất thường: 512KB đã thừa sức cho toàn bộ tiến độ.
  if (chuoi.length > 512 * 1024) throw new Error('Gói tiến độ lớn bất thường');

  const soBai = Object.keys(goi.done || {}).length;
  const chung = {
    duLieu: chuoi,
    xp: soNguyen(goi.xp),
    soBai,
    chuoiNgay: soNguyen(goi.streak),
    hocLanCuoi: new Date(),
  };
  const [row, moi] = await MonlTienDo.findOrCreate({
    where: { UserId: userId },
    defaults: { UserId: userId, ...chung },
  });
  if (!moi) await row.update(chung);
  return row;
}

/** Máy gửi lên bản của nó, ta gộp với bản đang giữ rồi trả lại bản đã gộp. */
async function dongBo(userId, cuaMay) {
  const cuaChu = await doc(userId);
  const daGop = gop(cuaMay, cuaChu);
  await ghi(userId, daGop);
  return daGop;
}

module.exports = { doc, ghi, dongBo, gop };
