/* ============================================================
   ON-Language — logic ứng dụng
   Bố cục và luồng dựng theo bản ghi màn hình AirLearn:
   dạy trước (biển báo / thẻ từ / hội thoại) rồi mới luyện tập.
   ============================================================ */
(() => {
"use strict";

/* ---------- 0. Tiện ích ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const today = () => new Date().toISOString().slice(0, 10);
const DAY = 86400000;

function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
const sample = (a, n) => shuffle(a).slice(0, n);
const deaccent = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
const norm = s => s.toLowerCase().replace(/[.,!?;:'"’]/g, "").replace(/\s+/g, " ").trim();

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
function svgUse(id, box, cls) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", box); s.setAttribute("aria-hidden", "true");
  if (cls) s.setAttribute("class", cls);
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", "#" + id); s.appendChild(u); return s;
}
const icon = (id, cls = "ic") => svgUse(id, "0 0 24 24", cls);
const pic  = id => svgUse("p-" + id, "0 0 48 48");

/* ---------- 0b. Linh vật ----------
   Mặc định dùng hình vẽ SVG trong sprite. Nếu có file ảnh nhân vật thật ở
   assets/mascot.png thì tự thay toàn bộ sang ảnh đó — không có file cũng
   không vỡ giao diện, nên thả ảnh vào lúc nào cũng được.                */
/* Mọi ô linh vật — to hay nhỏ, tròn hay vuông — đều dùng chung một logo
   ON-Language, để đi đâu trong app cũng thấy đúng một gương mặt. */
const AVATAR_SRC = "assets/avatar.webp";

function useMascotImage() {
  const probe = new Image();
  probe.onload = () => {
    document.documentElement.classList.add("has-mascot-img");
    $$("[data-mascot]").forEach(swapMascot);
  };
  probe.src = AVATAR_SRC;
}
/** Đổi một ô linh vật SVG thành thẻ ảnh, giữ nguyên kích thước ô. */
function swapMascot(box) {
  if (box.querySelector("img")) return;
  const kind = box.dataset.mascot || "head";
  const img = el("img", "mascot-img mascot-" + kind);
  img.src = AVATAR_SRC;
  img.alt = "";
  img.decoding = "async";
  box.textContent = "";
  box.append(img);
}
/** Ô linh vật dựng bằng JS (màn Từ vựng khi chưa có từ nào). */
function mascotBox(kind, cls) {
  const box = el("div", cls);
  box.dataset.mascot = kind;
  box.append(svgUse(kind === "full" ? "m-air" : "m-air-head", "0 0 120 120"));
  if (document.documentElement.classList.contains("has-mascot-img")) swapMascot(box);
  return box;
}

let toastT;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
}
/** Đưa chuỗi có **đánh dấu** thành các thẻ <em> để tô xanh từ khoá. */
function markup(node, text) {
  String(text).split(/(\*\*[^*]+\*\*)/).forEach(part => {
    if (part.startsWith("**") && part.endsWith("**")) node.append(el("em", null, part.slice(2, -2)));
    else if (part) node.append(document.createTextNode(part));
  });
  return node;
}

/* ---------- 1. Trạng thái ---------- */
const KEY = "englishair.v3";
const DEFAULTS = {
  level: "a1",
  xp: 0, xu: 0, hearts: 15, heartAt: Date.now(),
  streak: 0, best: 0, lastDay: "", days: [],
  done: {}, srs: {},
  goal: 30, goalDay: "", todayXp: 0,
  weekXp: 0, weekStart: "", tier: 0,
  joined: today(), sound: true, nhac: true, motion: false, showVi: true, theme: "",
  kidVoice: false,
  giongChot: 0,   // đánh dấu đã áp giọng mặc định mới, chỉ áp một lần
  ten: "",
  daXep: "",      // trình độ đã đo được; rỗng nghĩa là chưa kiểm tra bao giờ
  // Đang mở sẵn hết bài để thầy kiểm tra nội dung. Khi nào cần học lần lượt
  // trở lại thì đổi về false — ai đã tự gạt công tắc thì giữ lựa chọn của họ.
  moHet: true,
  thi: {},   // kết quả đề thi theo ngày
  xemThu: false,   // đã chọn xem thử trước khi đăng ký
  // Giọng người dùng tự chọn, theo gốc ngôn ngữ: { en: "...", vi: "..." }
  giong: {},
  // Ảnh đại diện: {k:"m"} linh vật, {k:"e",i:<số>} mặt vui, {k:"a",d:"data:…"} ảnh tự tải
  avatar: { k: "m" }
};
let S = load();
function load() {
  let s;
  try { s = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch { s = Object.assign({}, DEFAULTS); }
  // Đổi giọng mặc định sang Daniel, cao độ bình thường. Máy nào đã cài rồi thì
  // vẫn phải áp một lần, không thì người đang dùng mãi không thấy đổi. Chỉ một
  // lần thôi — sau đó ai tự chọn giọng nào là giữ nguyên giọng ấy.
  // Đặt lại giọng tiếng Anh về Daniel — bình thường. Để số ở đây để sau này
  // muốn áp lại một lần nữa thì chỉ việc tăng số lên.
  if ((s.giongChot || 0) < 4) {
    s.giongChot = 4;
    s.kidVoice = false;
    if (s.giong && s.giong.en) delete s.giong.en;
  }
  return s;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* chế độ riêng tư */ }
  henDayLen();   // gửi lên máy chủ, gộp nhiều lần sửa thành một lượt
}

const HEART_MS = 30 * 60 * 1000;
// Số tim tối đa. Con số này trước nằm rải rác bảy chỗ trong file — sửa một chỗ
// mà sót chỗ khác là tim hồi tới 5 rồi đứng, hoặc mất tim mà đồng hồ không chạy.
const TIM_TOI_DA = 15;
function regenHearts() {
  if (S.hearts >= TIM_TOI_DA) { S.heartAt = Date.now(); return; }
  const got = Math.floor((Date.now() - S.heartAt) / HEART_MS);
  if (got > 0) {
    S.hearts = clamp(S.hearts + got, 0, TIM_TOI_DA);
    S.heartAt = S.hearts >= TIM_TOI_DA ? Date.now() : S.heartAt + got * HEART_MS;
    save();
  }
}
function weekKey(d = new Date()) { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.toISOString().slice(0, 10); }
function weekLeft() {
  const end = new Date(weekKey()); end.setDate(end.getDate() + 7);
  const ms = end - Date.now(), d = Math.floor(ms / DAY), h = Math.floor((ms % DAY) / 3600000);
  return d > 0 ? `Còn ${d} ngày ${h} giờ` : `Còn ${h} giờ`;
}
function rollPeriods() {
  const t = today(), wk = weekKey();
  if (S.goalDay !== t) { S.goalDay = t; S.todayXp = 0; }
  if (S.lastDay && S.lastDay !== t && Math.round((new Date(t) - new Date(S.lastDay)) / DAY) > 1) S.streak = 0;
  if (S.weekStart !== wk) {
    if (S.weekStart) {
      const pos = rankRows().findIndex(r => r.me) + 1;
      if (pos > 0 && pos <= 5 && S.tier < LEAGUES.length - 1) { S.tier++; setTimeout(() => toast("Bạn đã lên " + leagueName() + "!"), 900); }
      else if (pos >= 9 && S.tier > 0) S.tier--;
    }
    S.weekStart = wk; S.weekXp = 0;
  }
  save();
}
function markStudied() {
  const t = today();
  if (S.lastDay !== t) {
    S.streak = S.lastDay && Math.round((new Date(t) - new Date(S.lastDay)) / DAY) === 1 ? S.streak + 1 : 1;
    S.best = Math.max(S.best || 0, S.streak);
    S.lastDay = t;
    if (!S.days.includes(t)) S.days.push(t);
    S.days = S.days.slice(-400);
  }
}
function addXp(n) { S.xp += n; S.todayXp += n; S.weekXp += n; save(); }

/* Xu: kiếm được khi học xong bài, tiêu để đổ đầy tim. Có chỗ tiêu thật thì nó
   mới là phần thưởng, chứ chỉ hiện một con số thì chẳng để làm gì. */
const XU_MOI_BAI = 5;        // xong một bài
const XU_KHONG_SAI = 5;      // thưởng thêm khi không sai câu nào
const XU_DOI_TIM = 50;       // đổi đầy tim
function addXu(n) { S.xu = (S.xu || 0) + n; save(); }

/* Chuỗi ngày phải có ích thật chứ không chỉ để ngắm: giữ được chuỗi dài thì
   mỗi bài học ăn thêm XP. */
function nhanXp() { return S.streak >= 30 ? 3 : S.streak >= 7 ? 2 : 1; }

/* Các cấp của chuỗi ngày — để người học có mốc mà nhắm tới. */
const CAP_CHUOI = [
  [0,   "Bắt đầu chuỗi"],
  [3,   "Chuỗi Nhen Lửa"],
  [7,   "Chuỗi Cháy Đều"],
  [14,  "Chuỗi Rực Lửa"],
  [30,  "Chuỗi Bão Lửa"],
  [60,  "Chuỗi Không Ngừng"],
  [100, "Chuỗi Huyền Thoại"],
];
function capChuoi(n) {
  let cur = CAP_CHUOI[0], next = null;
  for (const c of CAP_CHUOI) {
    if (n >= c[0]) cur = c; else { next = c; break; }
  }
  return { ten: cur[1], toi: next };
}

/* ---------- 2. Giao diện chung ---------- */
function applyTheme() {
  // Nền đậm là mặc định của thương hiệu; người học tự bật nền sáng thì mới đổi.
  document.documentElement.dataset.theme = S.theme || "dark";
  document.documentElement.dataset.motion = S.motion ? "reduce" : "";
}
function paintStats() {
  regenHearts();
  $("#statStreak").textContent = S.streak;
  $("#statXp").textContent = S.xp >= 1000 ? (S.xp / 1000).toFixed(2) + "K" : S.xp;
  $("#statXu").textContent = S.xu || 0;
  // Hết tim thì ô tim đổi thành đồng hồ đếm tới lượt hồi tiếp theo.
  if (S.hearts > 0) {
    $("#statHeart").textContent = S.hearts;
    $("#btnHeart").classList.remove("empty");
  } else {
    const m = Math.max(1, Math.ceil((S.heartAt + HEART_MS - Date.now()) / 60000));
    $("#statHeart").textContent = m >= 60 ? Math.ceil(m / 60) + "h" : m + "p";
    $("#btnHeart").classList.add("empty");
  }
  $("#levelCode").textContent = level().code;
  $("#btnLevel").dataset.lv = S.level;   // đổi màu nút theo trình độ đang học
}

/* ---------- 3. Phát âm ---------- */
/* ON-Language nói được ba thứ tiếng. Người học KHÔNG chọn trước — cứ nói, ON-Language
   nghe ra rồi đáp lại đúng thứ tiếng đó, và bộ nghe cũng đổi theo. */
const CALL_LANGS = {
  en: { name: "English", tts: "en-GB", sr: "en-GB" },
  vi: { name: "Tiếng Việt", tts: "vi-VN", sr: "vi-VN" },
  zh: { name: "中文", tts: "zh-CN", sr: "zh-CN" },
  ja: { name: "日本語", tts: "ja-JP", sr: "ja-JP" },
  ko: { name: "한국어", tts: "ko-KR", sr: "ko-KR" },
  fr: { name: "Français", tts: "fr-FR", sr: "fr-FR" },
  es: { name: "Español", tts: "es-ES", sr: "es-ES" },
  de: { name: "Deutsch", tts: "de-DE", sr: "de-DE" },
  ru: { name: "Русский", tts: "ru-RU", sr: "ru-RU" },
  th: { name: "ไทย", tts: "th-TH", sr: "th-TH" },
};
/** ON-Language nói được thứ tiếng nào cũng được, nên gặp mã lạ thì cứ dựng tạm một mục
    rồi để trình duyệt tự tìm giọng — còn hơn là ép về tiếng Anh. */
function langInfo(code) {
  if (CALL_LANGS[code]) return CALL_LANGS[code];
  if (/^[a-z]{2}$/.test(code || "")) return { name: code.toUpperCase(), tts: code, sr: code };
  return CALL_LANGS.en;
}
/** Đoán thứ tiếng từ mặt chữ. Chỉ chắc được với chữ Hán và dấu tiếng Việt —
    câu tiếng Anh và câu tiếng Việt không dấu trông giống hệt nhau. */
function guessLang(text) {
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";
  if (/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(text)) return "vi";
  return null;
}
/** Thứ tiếng mở màn: lấy theo ngôn ngữ của máy, người Việt thì là tiếng Việt. */
function deviceLang() {
  const tag = String(navigator.language || "vi").toLowerCase();
  if (tag.startsWith("zh")) return "zh";
  if (tag.startsWith("en")) return "en";
  return "vi";
}
/* Nâng cao độ giọng lên cho ra chất con trai nhỏ, hợp với ON-Language. */
const KID_PITCH = 1.65;

let voices = [];
function pickVoice() {
  if (!window.speechSynthesis) return;
  voices = speechSynthesis.getVoices() || [];
}
const chuanTag = t => String(t || "").toLowerCase().replace("_", "-");

/** Lựa chọn giọng của người dùng cho một gốc ngôn ngữ.
    Chịu cả dạng cũ (chỉ lưu tên giọng) để ai đã chọn rồi không bị mất. */
function luaChonGiong(goc) {
  const g = (S.giong || {})[goc];
  if (!g) return { uri: null, pitch: 1, rate: 1 };
  if (typeof g === "string") return { uri: g, pitch: 1, rate: 1 };
  return { uri: g.uri || null, pitch: g.pitch || 1, rate: g.rate || 1 };
}

/** Tìm giọng khớp thứ tiếng.
    Tiếng Anh lấy giọng người Anh (en-GB) chứ không phải giọng Mỹ, tiếng Việt lấy
    giọng nữ — nghe chuẩn hơn hẳn với người Việt học tiếng Anh. */
const GIONG_NU = /female|linh|hoaimy|serena|kate|sonia|libby|hazel|samantha|victoria|karen|moira|fiona|tessa|zira|susan|catherine|amy|emma|joanna|salli/i;
/* Giọng ưu tiên khi người dùng chưa tự chọn. Thầy chốt tiếng Anh dùng Daniel
   (giọng nam Anh Quốc) — nghe đằm và rõ phụ âm cuối hơn mấy giọng nữ máy. */
/* Thầy chốt giọng tiếng Anh là Moira. Moira là giọng NỮ, mã en-IE (Ireland)
   chứ không phải en-GB — nên chỗ tìm giọng phải nhận cả tiếng Anh của nước
   khác, không được bó cứng vào en-GB. */
const GIONG_CHOT = { en: /\bmoira\b/i };
/* Tiếng Anh chốt Moira — giọng nữ. Tiếng Việt cũng lấy giọng nữ (Linh trên
   iPhone), nghe ra cùng một người chứ không phải hai người thay nhau nói. */
/* Apple cài sẵn cả một họ giọng "vui nhộn" — Rocko, Sandy, Shelley, Grandma,
   Grandpa… Chúng nằm chung danh sách với giọng đọc thật nean máy dễ vớ phải.
   Để dạy học thì không dùng được: nghe như nhân vật hoạt hình, sai cả trọng âm. */
const GIONG_TRO = /\b(rocko|sandy|shelley|grandma|grandpa|flo|eddy|reed|bubbles|jester|superstar|bells|boing|bad news|good news|trinoids|whisper|wobble|zarvox|organ|cellos|bahh|albert|junior|ralph|fred|kathy|princess|deranged|hysterical|bruce|agnes|victoria)\b/i;
/** Bỏ giọng vui nhộn ra. Hết sạch thì đành giữ nguyên, còn hơn không có gì. */
const locTro = ds => { const t = ds.filter(v => !GIONG_TRO.test(v.name)); return t.length ? t : ds; };


function voiceFor(tag) {
  const muon = chuanTag(tag);
  const goc = muon.split("-")[0];
  const pool = voices.filter(v => chuanTag(v.lang).split("-")[0] === goc);
  if (!pool.length) return null;

  // Người dùng đã tự chọn giọng cho thứ tiếng này thì tôn trọng lựa chọn đó.
  const uri = luaChonGiong(goc).uri;
  if (uri) {
    const v = pool.find(x => x.voiceURI === uri) || pool.find(x => x.name === uri);
    if (v) return v;
  }

  const dungMa = pool.filter(v => chuanTag(v.lang) === muon);
  // Chưa tự chọn thì lấy giọng đã chốt sẵn cho thứ tiếng này, nếu máy có.
  const chot = GIONG_CHOT[goc];
  if (chot) {
    const v = dungMa.find(x => chot.test(x.name)) || pool.find(x => chot.test(x.name));
    if (v) return v;
  }
  // Không có giọng đã chốt thì vẫn phải tránh họ giọng vui nhộn.
  const maThat = locTro(dungMa), gocThat = locTro(pool);
  const nu = ds => ds.find(v => GIONG_NU.test(v.name));
  // Khớp đúng mã và là giọng nữ là tốt nhất; rồi tới khớp đúng mã; rồi giọng nữ
  // cùng gốc; cuối cùng lấy tạm cái gì có.
  return nu(maThat) || maThat[0] || nu(gocThat) || gocThat[0];
}


if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
/* ═══════════ ĐỌC ĐÚNG TIẾNG ═══════════
   Lời giảng là tiếng Việt nhưng hay chèn từ tiếng Anh vào giữa: "Good night là
   chúc ngủ ngon", "Đếm được thì many, không đếm được thì much". Đọc cả câu bằng
   một giọng là sai một nửa.

   Đoán theo từng chữ thì KHÔNG được: tôi đã đo cả 553 câu giảng — chữ không dấu
   hay gặp nhất lại là tiếng Việt (anh, cho, hai, khi, trong, sau, theo, ba, xin,
   ra, nghe…), mà cụm hai chữ cũng vậy ("theo sau", "sao cho", "ngon khi").

   Tín hiệu chắc chắn là chính KHO TỪ VỰNG của khoá: chữ tiếng Anh trong lời
   giảng bao giờ cũng là từ đang dạy. Đo lại thì đúng thế — 51 từ vựng xuất hiện
   trong câu tiếng Việt đều là từ tiếng Anh thật (from, many, enough, night,
   sorry, please, yesterday, sure…), không có từ Việt nào lọt vào.

   Nên: khớp đúng từ trong kho thì đọc giọng Anh, còn lại giọng Việt. */
/* Kho từ vựng của khoá chưa đủ: "Good night" thì bắt được "night" nhưng "Good"
   rơi lại bên tiếng Việt, nghe rất kỳ. Nên thêm một danh sách từ tiếng Anh
   thông dụng hay xuất hiện trong lời giảng dạy tiếng.
   ĐÃ LOẠI ba từ trùng với chữ Việt không dấu: "may" (máy/may), "can" (cần/can),
   "ten" (tên) — giữ lại là đọc sai chữ Việt thành tiếng Anh. */
const TU_ANH_THEM = ("good morning afternoon evening night hello goodbye bye " +
  "please thank thanks sorry excuse very much many more most little few some " +
  "any every each here there this that these those what where when why how " +
  "who which and but because with without about after before during while " +
  "have has had does did done doesn didn don isn aren wasn weren was were " +
  "being been will would shall should could might must going like likes " +
  "liked want wants need needs make makes made say says said tell tells told " +
  "ask asks asked answer answers yes not never always often sometimes " +
  "usually already yet still too also only just even really quite enough " +
  "almost one two three four five six seven eight nine plural singular noun " +
  "verb adjective adverb subject object present past future simple " +
  "continuous perfect question negative positive countable uncountable mine " +
  "yours hers ours theirs myself yourself").split(" ");

let TU_ANH = null;
function khoTuAnh() {
  if (TU_ANH) return TU_ANH;
  const t = new Set();
  ALL_WORDS.forEach(w => { if (w && w.en) t.add(String(w.en).trim().toLowerCase()); });
  COURSE.levels.forEach(lv => lv.units.forEach(u => u.lessons.forEach(l => {
    (l.sentences || []).forEach(c => { if (c && c.en) t.add(String(c.en).trim().toLowerCase()); });
  })));
  // Từ một chữ ngắn quá thì bỏ: "a", "an", "in" lẫn vào câu Việt là hỏng.
  TU_ANH_THEM.forEach(x => t.add(x));
  TU_ANH = [...t].filter(x => x.includes(" ") || x.length >= 3)
                 .sort((a, b) => b.length - a.length);
  return TU_ANH;
}

/** Cắt một câu thành các khúc theo thứ tiếng, để mỗi khúc đọc đúng giọng của nó. */
function catTieng(text) {
  const s = String(text || "").trim();
  if (!s) return [];
  if (!DAU_VIET.test(s)) {
    // Không có dấu tiếng Việt KHÔNG có nghĩa cả câu là tiếng Anh — "Sorry hay
    // Excuse me?" không dấu nào nhưng "hay" (nghĩa "hoặc") vẫn là tiếng Việt. Đã
    // dò khắp 284 tiêu đề bài học: chỉ đúng chữ "hay" lặp lại nhiều lần kiểu
    // này ("X hay Y?"), nên tách riêng nó, phần còn lại vẫn coi là tiếng Anh như cũ.
    const HAY = /\bhay\b/i;
    if (HAY.test(s)) {
      const ra = []; let con = s, m;
      while ((m = HAY.exec(con))) {
        const truoc = con.slice(0, m.index).trim();
        if (truoc) ra.push({ text: truoc, lang: "en-GB" });
        ra.push({ text: m[0], lang: "vi-VN" });
        con = con.slice(m.index + m[0].length);
        HAY.lastIndex = 0;
      }
      if (con.trim()) ra.push({ text: con.trim(), lang: "en-GB" });
      return ra;
    }
    return [{ text: s, lang: tiengCua(s) }];
  }

  const kho = khoTuAnh();
  const nhan = new Array(s.length).fill(0);   // 1 = thuộc một từ tiếng Anh
  const chuCai = c => /[0-9A-Za-z']/.test(c);
  kho.forEach(tu => {
    let i = 0;
    for (;;) {
      const k = s.toLowerCase().indexOf(tu, i);
      if (k < 0) break;
      i = k + 1;
      // Phải đứng riêng thành từ, không phải nằm lẫn trong chữ khác.
      const truoc = k > 0 ? s[k - 1] : " ";
      const sau = k + tu.length < s.length ? s[k + tu.length] : " ";
      if (chuCai(truoc) || chuCai(sau)) continue;
      for (let j = k; j < k + tu.length; j++) nhan[j] = 1;
    }
  });
  if (!nhan.includes(1)) return [{ text: s, lang: "vi-VN" }];

  const khuc = [];
  let dau = 0;
  for (let i = 1; i <= s.length; i++) {
    if (i === s.length || nhan[i] !== nhan[dau]) {
      const doan = s.slice(dau, i).trim();
      if (doan) khuc.push({ text: doan, lang: nhan[dau] ? "en-GB" : "vi-VN" });
      dau = i;
    }
  }
  // Gộp hai khúc liền nhau cùng tiếng cho đỡ ngắt vụn.
  const gon = [];
  khuc.forEach(k => {
    const cuoi = gon[gon.length - 1];
    if (cuoi && cuoi.lang === k.lang) cuoi.text += " " + k.text;
    else gon.push({ ...k });
  });
  return gon;
}

/* Chữ nước nào phải đọc bằng giọng nước đó. Trước đây mọi thứ đều đặt en-US,
   nên "quả táo" bị đọc bằng giọng Anh nghe méo hết cả. */
const DAU_VIET = /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụỳýỷỹỵ]/i;
function tiengCua(text) {
  const s = String(text || "");
  // Dấu tiếng Việt xét trước: câu tiếng Việt có lẫn chữ Hán vẫn là tiếng Việt.
  if (DAU_VIET.test(s)) return "vi-VN";
  if (/[\u3040-\u30ff]/.test(s)) return "ja-JP";
  if (/[\uac00-\ud7af]/.test(s)) return "ko-KR";
  if (/[\u4e00-\u9fff]/.test(s)) return "zh-CN";
  return "en-GB";
}

// Đánh số lượt đọc nối, để lượt mới cắt được lượt cũ.
let lanLuotId = 0;

function dungGiong(u, tag) {
  u.lang = tag;
  const v = voiceFor(tag);
  if (v) u.voice = v;
  // Cùng một giọng gốc nhưng đổi cao độ và tốc độ là ra hẳn một giọng khác —
  // đó là cách có nhiều giọng trên máy vốn chỉ cài sẵn một hai giọng.
  const ch = luaChonGiong(chuanTag(tag).split("-")[0]);
  u.pitch = clamp(ch.pitch, 0.5, 2);
  u.__heSoToc = ch.rate;
}

/** Nhân tốc độ đã chọn vào tốc độ gốc của câu. */
function apToc(u, toc) {
  u.rate = clamp(toc * (u.__heSoToc || 1), 0.4, 1.6);
}

/* ==================== NHẠC NỀN NHẸ ====================
   Thầy muốn vào app là có nhạc nhẹ. Ba nguyên tắc để nhạc không thành phiền:
   1. Rất nhỏ, và TỰ NHỎ HẲN khi app đang đọc bài — tiếng học luôn phải rõ hơn
      tiếng nhạc, không thì nhạc hoá ra phá bài.
   2. Chỉ chạy được sau cú chạm đầu tiên: trình duyệt không cho tự phát tiếng,
      cố phát sớm chỉ tổ bị chặn im lặng.
   3. Có công tắc tắt hẳn trong Hồ sơ, và nhớ lựa chọn đó. */
const NHAC_TO = 0.22;         // mức thường — thầy nghe bản cũ thấy chìm quá
const NHAC_NHO = 0.06;        // mức lúc đang đọc bài
let nhacDaMoi = false;
let nhacHen = null;

function theNhac() { return document.getElementById("amNhac"); }

function batNhac() {
  const a = theNhac();
  if (!a || !S.nhac) return;
  try {
    a.volume = NHAC_TO;
    const p = a.play();
    if (p && p.catch) p.catch(() => { /* máy chưa cho, đợi cú chạm sau */ });
  } catch { /* thôi */ }
}

function tatNhac() {
  const a = theNhac();
  if (!a) return;
  try { a.pause(); } catch { /* thôi */ }
}

/** Hạ nhạc xuống lúc đang đọc, xong tự nâng lại. */
function nhacNhuong(dang) {
  const a = theNhac();
  if (!a || a.paused) return;
  clearTimeout(nhacHen);
  if (dang) {
    a.volume = NHAC_NHO;
  } else {
    // Nâng lại sau một nhịp, kẻo câu sau đọc ngay thì nhạc lại vống lên.
    nhacHen = setTimeout(() => { try { a.volume = NHAC_TO; } catch { /* thôi */ } }, 700);
  }
}

// Cú chạm đầu tiên: mồi và bật nhạc. Sau đó gỡ tay nghe, không cần nữa.
["pointerdown", "touchstart", "keydown"].forEach(ev =>
  window.addEventListener(ev, () => {
    if (nhacDaMoi) return;
    nhacDaMoi = true;
    batNhac();
  }, { once: false, passive: true }));

/* ==================== GIỌNG ĐỌC THU SẴN ====================
   Trước đây mọi câu tiếng Anh đều nhờ speechSynthesis của máy đọc. Mỗi điện
   thoại một giọng; nhiều máy bán ở Việt Nam không có giọng tiếng Anh tử tế nên
   đọc ngọng — thầy nói thẳng là "voice cùi".
   Nay giọng tiếng Anh được đọc sẵn thành file bằng MeloTTS (mã nguồn mở, chạy
   trên máy thầy, không tốn phí), máy nào cũng nghe đúng một giọng bản xứ.
   Máy nào chưa tải kịp file, hoặc câu chưa có file, thì mới rơi về giọng máy.

   Tên file = mã băm của chính câu đó nên không cần bảng tra tên. Chỉ nạp một
   danh sách mã băm (vài chục KB) để biết câu nào có sẵn, khỏi dò 404. */
const TIENG_THU = "assets/tieng/";
let khoTieng = null;            // Set các mã băm có sẵn; null = chưa nạp
let amTieng = null;             // thẻ <audio> dùng chung

/** FNV-1a 32 bit + độ dài. PHẢI khớp hàm bam() bên sinh_tieng_anh.py. */
function bamCau(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0") + (s.length & 0xFF).toString(16).padStart(2, "0");
}

const chuanCau = s => String(s || "").split(/\s+/).filter(Boolean).join(" ");

async function napKhoTieng() {
  if (khoTieng) return khoTieng;
  try {
    const r = await fetch(TIENG_THU + "kho.json");
    khoTieng = new Set(await r.json());
  } catch { khoTieng = new Set(); }
  return khoTieng;
}
napKhoTieng();

/** Địa chỉ file giọng đọc của một câu, không có thì null. */
function fileTieng(text, lang) {
  if (!khoTieng || !khoTieng.size) return null;
  // Chỉ có kho tiếng ANH; câu tiếng Việt vẫn để máy đọc.
  const t = lang || tiengCua(text);
  if (t && !/^en/i.test(t)) return null;
  const k = bamCau(chuanCau(text));
  return khoTieng.has(k) ? TIENG_THU + k + ".mp3" : null;
}

/** Phát file giọng đọc. Trả về true nếu đã nhận phát, false thì gọi bên đọc máy. */
function phatTiengThu(duong, slow, xong) {
  if (!duong) return false;
  try {
    if (!amTieng) {
      amTieng = document.getElementById("amDoc");
      if (!amTieng) return false;
    }
    try { speechSynthesis.cancel(); } catch { /* thôi */ }
    amTieng.onended = null; amTieng.onerror = null;
    amTieng.src = duong;
    amTieng.playbackRate = slow ? 0.7 : 1;
    if (xong) { amTieng.onended = xong; amTieng.onerror = xong; }
    const p = amTieng.play();
    if (p && p.catch) p.catch(() => { if (xong) xong(); });
    return true;
  } catch { return false; }
}

function speak(text, slow, lang) {
  if (!S.sound || !text) return;
  lanLuotId += 1;   // cắt lượt đọc nối đang chạy, không thì hai bên chồng tiếng
  nhacNhuong(true);
  if (phatTiengThu(fileTieng(text, lang), slow, () => nhacNhuong(false))) return;
  // Không đọc được bằng máy thì phải trả nhạc về mức cũ ngay, kẻo nhạc cứ nhỏ mãi.
  if (!window.speechSynthesis) { nhacNhuong(false); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    dungGiong(u, lang || tiengCua(text));
    apToc(u, slow ? 0.55 : 0.92);
    const nang = () => nhacNhuong(false);
    u.onend = nang;
    u.onerror = nang;
    // Vài máy nuốt mất onend, nên hẹn thêm một nhịp theo độ dài câu cho chắc.
    setTimeout(nang, 1200 + text.length * 90);
    speechSynthesis.speak(u);
  } catch { nhacNhuong(false); }
}

/* Đọc lần lượt nhiều đoạn, mỗi đoạn một thứ tiếng.
   PHẢI đọc xong câu trước rồi mới bắt đầu câu sau. Xếp cả loạt vào hàng đợi một
   lúc thì máy hay lấy giọng của câu này áp cho câu kia — câu tiếng Anh bị đọc
   bằng giọng Việt, nghe sai hoàn toàn. */
function docLanLuot(khuc, xong, batDau) {
  if (!S.sound || !window.speechSynthesis) return;
  const ds = (khuc || []).filter(k => k && k.text);
  if (!ds.length) { if (xong) xong(); return; }
  const phien = ++lanLuotId;
  try { speechSynthesis.cancel(); } catch { /* bỏ qua */ }

  nhacNhuong(true);
  const doc = i => {
    // Lượt đọc mới đè lên thì lượt cũ dừng hẳn, không chen ngang nhau.
    if (phien !== lanLuotId) return;
    if (i >= ds.length) { nhacNhuong(false); if (xong) xong(); return; }
    const k = ds[i];
    // Có file thu sẵn thì phát file, đọc xong mới sang câu kế.
    const f = fileTieng(k.text, k.lang);
    if (f && !k.onTu) {
      if (batDau && i === 0) batDau();
      if (phatTiengThu(f, k.slow, () => { if (phien === lanLuotId) doc(i + 1); })) return;
    }
    try {
      const u = new SpeechSynthesisUtterance(k.text);
      dungGiong(u, k.lang || tiengCua(k.text));
      if (k.pitch) u.pitch = clamp(k.pitch, 0.5, 2);
      if (k.onTu) u.onboundary = k.onTu;
      if (batDau) u.onstart = batDau;
      apToc(u, k.slow ? 0.55 : 0.92);
      let daSang = false;
      const sang = () => { if (daSang) return; daSang = true; doc(i + 1); };
      u.onend = sang;
      u.onerror = sang;
      // Máy nào nuốt mất onend thì vẫn phải đi tiếp: ước lượng theo độ dài câu.
      setTimeout(sang, 1200 + k.text.length * 90);
      speechSynthesis.speak(u);
    } catch { /* bỏ qua */ }
  };
  doc(0);
}

/* Dừng đọc phải cắt cả CHUỖI đọc nối, không chỉ câu đang phát. Không tăng số
   lượt thì cancel() làm onend bắn, onend lại kích câu tiếp theo — loa cứ kêu, mà
   loa đang kêu thì micro không nghe được gì. */
const stopSpeak = () => {
  lanLuotId += 1;
  if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch { /* bỏ qua */ } }
  // Giọng đọc thu sẵn cũng phải im: gỡ tay nghe trước rồi mới dừng, kẻo câu
  // sau trong hàng đợi lại tự chạy tiếp.
  const a = document.getElementById("amDoc");
  if (a) { try { a.onended = null; a.onerror = null; a.pause(); } catch { /* bỏ qua */ } }
  nhacNhuong(false);
};

/* iPhone/iPad chỉ cho phát tiếng lần đầu ngay trong lúc ngón tay còn chạm màn hình.
   Câu nói đầu của ON-Language lại đến sau một lượt chờ mạng, nên phải "mồi" sẵn lúc bấm nút,
   không thì cả cuộc gọi im lặng mà chẳng báo lỗi gì. */
let speechPrimed = false;
function primeSpeech() {
  if (!window.speechSynthesis) return;
  pickVoice();
  if (speechPrimed) return;
  speechPrimed = true;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0; u.lang = "en-GB";
    speechSynthesis.speak(u);
  } catch { /* bỏ qua */ }
}

/** ON-Language giải thích vì sao bài này chưa bấm vào được. */
function baoKhoa() {
  openSheet({
    top: mascotBox("head", "sheet-mon"),
    title: "Bài này chưa mở",
    body: "Bạn hãy hoàn thành các bài học trước mới tới bài này.",
    yes: "Đã hiểu",
    no: "",
  });
}

/* ---------- 4. Truy vấn khoá học ---------- */
const level = () => COURSE.levels.find(l => l.id === S.level) || COURSE.levels[0];
const lessonsOf = lv => lv.units.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
function lessonWords(l) {
  if (!l.teach) return [];
  return l.teach.filter(s => s.t === "vocab" || s.t === "phrase")
    .map(s => ({ en: s.en, vi: s.vi, pos: s.pos, ipa: s.ipa, pic: s.pic, note: s.note, ex: s.ex,
                 cefr: s.cefr, lop: s.lop }));
}
const unitWords = u => u.lessons.flatMap(lessonWords);
const unitSentences = u => u.lessons.flatMap(l => l.sentences || []);

/* Mỗi từ mang HAI nhãn: bậc CEFR (chuẩn châu Âu) và lớp tương đương của
   chương trình phổ thông Việt Nam — thầy đã chốt là cần cả hai, để phụ huynh
   nhìn biết con mình đang học ngang lớp mấy, còn người lớn thì nhìn bậc CEFR.
   Suy ra từ trình độ chứa từ đó, khỏi phải chép tay vào hàng trăm dòng dữ liệu.
   Mốc lớp bám theo chương trình GDPT 2018. */
const NHAN_BAC = {
  a1: { cefr: "A1", lop: "Lớp 3–5" },
  a2: { cefr: "A2", lop: "Lớp 6–7" },
  b1: { cefr: "B1", lop: "Lớp 8–9" },
};
const ALL_WORDS = COURSE.levels.flatMap(lv => {
  const n = NHAN_BAC[lv.id] || { cefr: (lv.code || "").toUpperCase(), lop: "" };
  // Từ nào tự khai nhãn riêng thì tôn trọng, không thì lấy nhãn của trình độ.
  return lv.units.flatMap(unitWords).map(w => ({ ...w, cefr: w.cefr || n.cefr, lop: w.lop || n.lop }));
});
const SINGLE = ALL_WORDS.filter(w => !w.en.includes(" "));
// Cau/cum nhieu chu - dung rieng lam kho luoi bay cho cau hoi dang cum,
// khong de tu don lac vao chung voi dap an la ca mot cau.
const PHRASES = ALL_WORDS.filter(w => w.en.includes(" "));

/* Kho từ THEO TRÌNH ĐỘ ĐANG HỌC, dùng làm mồi nhiễu (ba đáp án sai).
   Trước đây mồi nhiễu bốc từ cả ba bậc, nên bé A1 học "con mèo" lại thấy
   "environment", "technology" nằm cạnh — vừa là chữ chưa học tới, vừa lộ đáp
   án vì từ lạ hoắc thì chắc chắn sai. Lấy bậc đang học TRỞ XUỐNG: từ bậc dưới
   đã học rồi nên vẫn là mồi nhiễu tử tế, từ bậc trên thì không. */
let BAC_KHO = { lv: null, all: null, single: null, phrase: null };
function khoTheoBac() {
  if (BAC_KHO.lv === S.level) return BAC_KHO;
  const thu = COURSE.levels.findIndex(l => l.id === S.level);
  const hop = new Set(COURSE.levels.slice(0, thu < 0 ? 1 : thu + 1)
    .map(l => (NHAN_BAC[l.id] || {}).cefr || (l.code || "").toUpperCase()));
  const all = ALL_WORDS.filter(w => hop.has(w.cefr));
  const single = all.filter(w => !w.en.includes(" "));
  const phrase = all.filter(w => w.en.includes(" "));
  // Bậc nào ít từ quá thì mới nới ra kho chung, kẻo không đủ mồi nhiễu.
  BAC_KHO = {
    lv: S.level,
    all: all.length >= 8 ? all : ALL_WORDS,
    single: single.length >= 8 ? single : SINGLE,
    phrase: phrase.length >= 8 ? phrase : PHRASES,
  };
  return BAC_KHO;
}
/* Kho từ dùng cho bài chọn ảnh: chỉ những từ thật sự vẽ được.
   TÍNH MUỘN, không tính ngay lúc nạp: hàm dò cảnh khai báo mãi phía dưới, gọi
   lên là cả app chết ngay từ dòng đầu. Tính một lần rồi giữ lại. */
let PICS_KHO = null;
const picsKho = () => (PICS_KHO || (PICS_KHO = SINGLE.filter(veDuoc)));
/** Chọn n từ làm đáp án nhiễu, MỖI TỪ MỘT HÌNH KHÁC NHAU và khác hình của từ
    đang hỏi. Không đủ thì trả về ít hơn — thà ba ô mà chọn được còn hơn bốn ô
    mà hai ô giống hệt nhau. */
function nhieuKhacHinh(dung, kho, n, tron) {
  const daCo = new Set([tenHinh(dung)]);
  const ra = [];
  for (const w of (tron || shuffle)(kho)) {
    if (w.en === dung.en) continue;
    const h = tenHinh(w);
    if (!h || daCo.has(h)) continue;
    daCo.add(h); ra.push(w);
    if (ra.length >= n) break;
  }
  return ra;
}

/* ═══════════ LUYỆN HỘI THOẠI NGOAI TUYẾN ═══════════
   "Luyện hội thoại trong bài" từng gọi thẳng qua máy chủ giống hệt chế độ tự
   do — không mạng là hỏng y hệt nhau, trái với đúng cái lời hứa "chạy được cả khi
   không có mạng" hiện ngay trên màn hình. Giờ dùng hẳn câu đã đóng gói sẵn trong từng
   bài học (l.sentences) — không gọi mạng, chấm điểm phát âm cũng đã chạy ngay trên máy
   (hàm similar()) từ trước rồi, chỉ có phần lấy câu kế tiếp là đang phải chờ máy chủ. */
function offlineTeachSentences() {
  const list = lessonsOf(level());
  // Ưu tiên câu trong những bài đã học xong — đúng thứ học trò đã biết.
  let bai = list.filter(l => S.done[l.id] && l.sentences && l.sentences.length);
  if (!bai.length) bai = list.filter(l => l.sentences && l.sentences.length);
  if (!bai.length) {
    bai = COURSE.levels.flatMap(x => x.units).flatMap(u => u.lessons)
      .filter(l => l.sentences && l.sentences.length);
  }
  return bai.flatMap(l => l.sentences);
}
/* MON.L nói toàn tiếng Anh trong chế độ này (C.lang cố định "en") — giữ nguyên
   một thứ tiếng trong cùng một câu nói, đừng chẩy tiếng Việt vào kẻo đọc sai giọng. */
const TEACH_MO_DAU = ["Let's start! Listen and repeat.", "Ready? Here's your first sentence.",
  "Let's practice speaking together."];
const TEACH_KHEN = ["Great! Now try this one.", "Nice! Here's the next one.",
  "Well done! Let's continue."];
const TEACH_SUA = ["Good try! Listen again and repeat.", "Almost! Let's try once more.",
  "Close! Say it again with me."];
const TEACH_HET = "That's all the sentences for today. Great job! See you next time.";

/** Nhắt tay vấn đề: không gọi mạng, lấy câu kế trong hàng đợi đã xáo sẵn. */
function teachOffline(first, okVuaRoi) {
  C.busy = false;
  $("#btnMic").disabled = !SR;
  if (first) {
    C.teachQueue = sample(offlineTeachSentences(), 8);
    C.teachIdx = 0;
  }
  const cau = C.teachQueue[C.teachIdx++];
  if (!cau) {
    C.target = null;
    $("#callTask").hidden = true;
    monSays(TEACH_HET, "Hết câu trong bài rồi! Giỏi lắm, hẹn luyện tiếp lần sau nhé.", () => {
      if (!C.listening) setState("Tới lượt bạn");
    });
    return;
  }
  C.target = { en: cau.en, vi: cau.vi || "" };
  C.asked++;
  $("#callTarget").textContent = cau.en;
  $("#callTargetVi").textContent = S.showVi ? (cau.vi || "") : "";
  $("#callTask").hidden = false;
  const dau = first ? sample(TEACH_MO_DAU, 1)[0]
    : sample(okVuaRoi ? TEACH_KHEN : TEACH_SUA, 1)[0];
  monSays(dau + " " + cau.en, cau.vi || "", () => {
    if (!C.listening) setState("Tới lượt bạn");
  });
}

function currentLessonId() {
  const list = lessonsOf(level());
  return (list.find(l => !S.done[l.id]) || list[list.length - 1]).id;
}
/* Bốn trạng thái: đã xong, bài hiện tại, mở sẵn, còn khoá.
   "open" là bài chưa tới lượt nhưng đang bật chế độ mở hết — vẫn vào học được,
   chỉ nhìn nhạt hơn bài hiện tại để không phải nút nào cũng sáng rực. */
const lessonState = id =>
  S.done[id] ? "done"
  : id === currentLessonId() ? "current"
  : S.moHet ? "open"
  : "locked";
function findLesson(id) {
  for (const lv of COURSE.levels) for (const u of lv.units) {
    const l = u.lessons.find(x => x.id === id);
    if (l) return { ...l, unit: u, level: lv };
  }
  return null;
}

/** Số slide dạy và số câu hỏi dự kiến của một bài, để hiện trên thẻ Tiếp tục. */
function lessonMeta(l) {
  if (!l) return { teach: 0, drill: 0 };
  if (l.checkpoint) return { teach: 0, drill: 14 };
  return { teach: (l.teach || []).length,
           drill: Math.min(12, lessonWords(l).length + (l.sentences || []).length) };
}

/* ---------- 5. Điều hướng ---------- */
const VIEWS = ["learn", "words", "review", "call", "league", "nhom", "profile"];
let view = "learn";
function go(name) {
  if (!VIEWS.includes(name)) return;
  view = name;
  VIEWS.forEach(v => {
    const sec = $("#view-" + v);
    sec.hidden = v !== name;
    if (v === name) { sec.style.animation = "none"; void sec.offsetWidth; sec.style.animation = ""; }
  });
  $$("[data-nav]").forEach(b => {
    const on = b.dataset.nav === name;
    b.classList.toggle("is-active", on);
    if (b.classList.contains("tab")) { on ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"); }
  });
  ({ learn: renderLearn, words: renderWords, review: renderReview, call: renderCall,
     league: renderLeague, nhom: renderNhom, profile: renderProfile })[name]();
  window.scrollTo({ top: 0 });
  if (location.hash.slice(1) !== name) history.replaceState(null, "", "#" + name);
}
$$("[data-nav]").forEach(b => b.addEventListener("click", () => go(b.dataset.nav)));

/* ---------- 5b. Màn Hệ sinh thái ----------
   Trang tĩnh: bốn người bạn và những gì cả nhà tin. Không có gì phải dựng lại
   mỗi lần mở, chỉ cần chắc là mở ra thấy từ đầu trang. */
function renderNhom() {
  const v = $("#view-nhom");
  if (v) v.scrollTop = 0;
}

/* ---------- 6. Màn Học ---------- */
function renderLearn() {
  const lv = level();
  const list = lessonsOf(lv);
  const doneN = list.filter(l => S.done[l.id]).length;
  const cur = list.find(l => l.id === currentLessonId());

  // ON-Language nói một câu hợp với tình hình học của người dùng
  const left = clamp(S.goal - S.todayXp, 0, S.goal);
  $("#heroLine").textContent =
    !doneN                       ? "Chào bạn! Mình là ON-Language. Bắt đầu bài đầu tiên nhé?" :
    doneN === list.length        ? `Bạn xong hết trình độ ${lv.code} rồi! Đổi trình độ ở góc trên nhé.` :
    !S.streak                    ? "Lâu rồi chưa gặp! Học một bài cho ấm tay nào." :
    left === 0                   ? `Xong mục tiêu hôm nay rồi. Chuỗi ${S.streak} ngày, giỏi lắm!` :
                                   `Chuỗi ${S.streak} ngày rồi. Còn ${left} XP nữa là đạt mục tiêu hôm nay!`;

  $("#hsStreak").textContent = S.streak;
  $("#hsXp").textContent = S.xp;
  $("#hsWords").textContent = seenWords().length;

  // thẻ tiếp tục học
  const m = lessonMeta(cur);
  $("#contKick").textContent = S.done[cur.id] ? "Học lại" : doneN ? "Tiếp tục học" : "Bắt đầu";
  $("#contTitle").textContent = cur.title;
  $("#contGoal").textContent = cur.goal || cur.unit.goal || "";
  $("#contBar").style.width = Math.round((doneN / list.length) * 100) + "%";
  $("#contMeta").textContent = cur.checkpoint
    ? `Ôn tập chương · ${m.drill} câu hỏi`
    : `${m.teach} slide dạy · ${m.drill} câu hỏi`;

  const root = $("#unitList");
  root.textContent = "";
  // Chưa đo trình độ bao giờ thì mời một lần, ngay trên đầu danh sách chương.
  // Đo rồi (S.daXep) thì thôi, không nhắc nữa cho khỏi phiền.
  if (!S.daXep) {
    const moi = el("button", "xep-moi");
    moi.type = "button";
    const chu = el("span");
    chu.append(el("strong", null, "Chưa biết mình ở trình độ nào?"),
               el("small", null, "Làm 15 câu, app xếp bạn vào đúng bậc để học bài vừa sức."));
    moi.append(svgUse("i-target", "0 0 24 24", "ic"), chu);
    moi.addEventListener("click", moXep);
    root.append(moi);
  }
  // Chương nào đang học thì mở sẵn; lần đầu vào chưa ai bấm gì thì cũng chỉ mở
  // đúng chương đó — sáu chương bung hết ra một lúc là phải cuộn mỏi tay.
  if (!chuongMo.size && cur) chuongMo.add(cur.unit.id);
  lv.units.forEach(u => {
    const mo = chuongMo.has(u.id);
    const box = el("section", "unit" + (mo ? " mo" : ""));
    const words = unitWords(u).length;
    const nBai = u.lessons.filter(x => !x.checkpoint).length;
    const xong = u.lessons.filter(x => S.done[x.id]).length;

    const dau = el("button", "unit-head"); dau.type = "button";
    dau.setAttribute("aria-expanded", mo ? "true" : "false");
    dau.setAttribute("aria-controls", "nodes-" + u.id);
    const oIco = el("span", "unit-ico");
    oIco.setAttribute("aria-hidden", "true");
    oIco.append(anhChuong(u.id));
    const chu = el("span", "unit-tt");
    chu.append(el("b", null, u.title));
    chu.append(el("small", null, `${nBai} bài + ôn tập • ${words} từ vựng`));
    const dau3 = el("span", "unit-caret");
    dau3.setAttribute("aria-hidden", "true");
    dau3.append(icon("i-chevron"));
    dau.append(oIco, chu, el("span", "unit-so", `${xong}/${u.lessons.length}`), dau3);
    dau.addEventListener("click", () => {
      chuongMo.has(u.id) ? chuongMo.delete(u.id) : chuongMo.add(u.id);
      box.classList.toggle("mo");
      dau.setAttribute("aria-expanded", chuongMo.has(u.id) ? "true" : "false");
    });
    box.append(dau);

    const grid = el("div", "nodes");
    grid.id = "nodes-" + u.id;
    // Không phải mốc nào cũng là một bài học giống hệt nhau: xen thêm mốc LUYỆN
    // TỪ VỰNG và mốc GỌI VIDEO của chính chương này, để đi hết chương là được
    // học đủ kiểu chứ không phải bấm mãi một loại.
    xepMoc(u).forEach(m => {
      if (m.loai === "bai") {
        const l = m.bai;
        const st = lessonState(l.id);
        const cell = el("div", "node " + st + (l.checkpoint ? " check" : ""));
        const b = el("button", "node-btn"); b.type = "button";
        // Trước đây nút khoá bị disabled nên bấm vào không có gì xảy ra, người học
        // tưởng app hỏng. Nay vẫn bấm được, bấm thì ON-Language nói cho biết vì sao.
        b.setAttribute("aria-disabled", st === "locked" ? "true" : "false");
        const noiTrangThai = { done: "đã hoàn thành", current: "bài hiện tại", open: "mở sẵn", locked: "chưa mở khoá" };
        b.setAttribute("aria-label", `${l.title} — ${noiTrangThai[st]}`);
        b.append(icon(st === "locked" ? "i-lock" : l.checkpoint ? "i-cap" : st === "done" ? "i-check" : "i-play"));
        if (st === "current") b.append(ring(doneN / list.length));
        b.addEventListener("click", () => (st === "locked" ? baoKhoa() : startLesson(l.id)));
        cell.append(b, el("span", "node-label", l.title));
        grid.append(cell);
        return;
      }
      grid.append(mocPhu(m, u));
    });
    box.append(grid);
    root.append(box);
  });
  paintRail();
}
/* Thứ tự các mốc trong một chương. Chen mốc luyện từ vựng vào giữa chương và
   mốc gọi video ngay trước bài ôn tập — học xong mấy bài đầu thì có từ để
   luyện, học hết bài thì có cái để đem ra nói. */
function xepMoc(u) {
  const bai = u.lessons.filter(x => !x.checkpoint);
  const cuoi = u.lessons.filter(x => x.checkpoint);
  const ra = [];
  bai.forEach((l, i) => {
    ra.push({ loai: "bai", bai: l });
    if (i === 1) ra.push({ loai: "tuvung" });          // sau bài thứ hai
  });
  cuoi.forEach(l => ra.push({ loai: "bai", bai: l }));
  return ra;
}

/** Mốc luyện từ vựng của chương. Mở khoá sau khi học được 2 bài — chưa học chữ
    nào mà đã bắt luyện thì chẳng có gì trong đầu để mà luyện. */
function mocPhu(m, u) {
  const bai = u.lessons.filter(x => !x.checkpoint);
  const xong = bai.filter(x => S.done[x.id]).length;
  const mo = S.moHet || xong >= 2;
  const cell = el("div", "node phu tuvung " + (mo ? "open" : "locked"));
  const b = el("button", "node-btn"); b.type = "button";
  b.setAttribute("aria-disabled", mo ? "false" : "true");
  b.setAttribute("aria-label", `Luyện từ vựng chương ${u.title} — ${mo ? "mở" : "chưa mở khoá"}`);
  b.append(icon(mo ? "i-words" : "i-lock"));
  b.addEventListener("click", () => {
    if (!mo) return toast("Học xong 2 bài trong chương này là luyện từ vựng được.");
    const tu = unitWords(u);
    if (tu.length < 4) return toast("Chương này chưa đủ từ để luyện.");
    startLesson(null, { words: tu, max: 10 });
  });
  cell.append(b, el("span", "node-label", "Luyện từ vựng"));
  return cell;
}

/* Mỗi chương một hình cho dễ nhận ra ngay, khỏi phải đọc chữ.
   Chương lạ chưa có trong bảng thì lấy tạm quyển sách — thêm chương mới cũng
   không vỡ giao diện. */
const ANH_CHUONG = {
  a1u1: "p-hello",   a1u2: "p-family", a1u3: "p-bread",
  a1u4: "p-clock",   a1u5: "p-market", a1u6: "p-doctor",
  a2u1: "p-book",    a2u2: "p-phone",  a2u3: "p-city",
  a2u4: "p-work",    b1u1: "p-question", b1u2: "p-friend",
};
function anhChuong(id) {
  const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sv.setAttribute("viewBox", "0 0 48 48");
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", "#" + (ANH_CHUONG[id] || "p-book"));
  sv.append(u);
  return sv;
}
/** Chương nào người học đang mở. Giữ giữa các lần dựng lại màn hình. */
const chuongMo = new Set();

/** Vòng tiến độ quanh nút bài hiện tại. */
function ring(frac) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("class", "node-ring"); s.setAttribute("aria-hidden", "true");
  // Nút mốc đã đổi sang vuông bo góc, nên vòng tiến độ cũng phải là KHUNG BO
  // GÓC ôm sát nút — vẽ vòng tròn quanh nút vuông thì hai hình đá nhau.
  const X = 4, W = 92, R = 33;                       // khung 92×92, bo 33 trong khung 100
  // Chu vi khung bo góc = 4 cạnh thẳng + 4 góc tròn ghép lại thành một đường tròn.
  const C = 4 * (W - 2 * R) + 2 * Math.PI * R;
  for (const cls of ["bgc", "fgc"]) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    c.setAttribute("x", X); c.setAttribute("y", X);
    c.setAttribute("width", W); c.setAttribute("height", W);
    c.setAttribute("rx", R); c.setAttribute("ry", R); c.setAttribute("class", cls);
    if (cls === "fgc") { c.setAttribute("stroke-dasharray", C); c.setAttribute("stroke-dashoffset", C * (1 - clamp(frac, .04, 1))); }
    s.append(c);
  }
  return s;
}

$("#continueCard").addEventListener("click", () => startLesson(currentLessonId()));

/* ---------- 7. Sinh bài luyện tập ---------- */
function buildPractice(words, sentences, max) {
  const pool = words.filter(Boolean);
  if (!pool.length) return [];
  const q = [];
  if (pool.length >= 4) q.push({ type: "match", pairs: sample(pool, 4) });

  let picTurn = 0, tfTurn = 0;
  shuffle(pool).forEach((w, i) => {
    if (veDuoc(w) && !w.en.includes(" ") && picsKho().length >= 4 && picTurn++ % 2 === 0) {
      const nhieu = nhieuKhacHinh(w, picsKho(), 3);
      if (nhieu.length >= 2) q.push({ type: "picture", word: w, opts: shuffle([w, ...nhieu]) });
      return;
    }
    if (tfTurn++ % 3 === 2) {                        // cứ ba từ lại một câu đúng/sai
      const lie = Math.random() < .5;
      const other = sample(khoTheoBac().all.filter(x => x.en !== w.en), 1)[0];
      q.push({ type: "truefalse", word: w, shown: lie ? other.en : w.en, answer: !lie });
      return;
    }
    const kinds = w.en.includes(" ") ? ["choice", "reverse", "listen"] : ["choice", "listen", "reverse", "type"];
    const type = kinds[i % kinds.length];
    if (type === "type") { q.push({ type: "type", word: w }); return; }
    // Luoi bay phai CUNG KIEU voi dap an dung: cum thi lay cum, tu don thi lay
    // tu don - khong thi ra cau hoi vo ly nhu dap an la ca cau ma 3 luoi bay
    // chi la mot tu roi rac khong lien quan.
    const bac = khoTheoBac();
    const kho = w.en.includes(" ") ? bac.phrase : bac.single;
    const nguon = kho.filter(x => x.en !== w.en).length >= 3 ? kho : bac.all;
    q.push({ type, word: w, opts: shuffle([w, ...sample(nguon.filter(x => x.en !== w.en), 3)]) });
  });

  (sentences || []).forEach(s => {
    const parts = s.en.split(" ");
    if (parts.length >= 3) {
      const n = parts.length >= 5 ? 2 : 1;
      const idx = sample(parts.map((_, i) => i), n).sort((a, b) => a - b);
      const answers = idx.map(i => parts[i]);
      // Chữ thừa trong kho từ cũng phải trong tầm trình độ, kẻo bé A1 thấy
      // một chữ B1 lạ hoắc nằm chình ình giữa kho từ.
      const extra = sample(khoTheoBac().single.filter(w => !parts.includes(w.en)), 2).map(w => w.en);
      q.push({ type: "blanks", sent: s, idx, answers, bank: shuffle(answers.concat(extra)) });
    }
  });

  // Xen một lượt tô chữ cho đỡ ngán: chọn chữ cái đầu của một từ vừa học, ưu
  // tiên từ một tiếng cho khớp giữa chữ được tô và từ đọc lên sau đó.
  // Xếp ảnh vào ô: cần ít nhất 3 từ có ảnh khác nhau mới chơi được.
  const coAnhRieng = pool.filter(w => w.pic || hinhChoChu(w.en));
  const nhomKhac = [];
  coAnhRieng.forEach(w => {
    const h = w.pic || hinhChoChu(w.en);
    if (!nhomKhac.some(x => (x.pic || hinhChoChu(x.en)) === h)) nhomKhac.push(w);
  });
  if (nhomKhac.length >= 3) {
    const ba = sample(nhomKhac, 3);
    q.push({ type: "xepAnh", nhom: ba, the: shuffle(ba.slice()) });
  }

  // Ghép chữ: chỉ lấy từ NGẮN và có ảnh, từ dài quá thì ghép mãi không xong.
  const coAnh = pool.filter(w => w.en.replace(/[^a-z]/gi, "").length <= 9
    && (w.pic || hinhChoChu(w.en)));
  if (coAnh.length) {
    q.push({ type: "ghepChu", word: sample(coAnh, 1)[0] });
  }

  const netCo = window.NET_CHU || {};
  const tuNgan = pool.filter(w => !w.en.includes(" ") && netCo[w.en[0].toUpperCase()]);
  if (tuNgan.length) {
    const w = sample(tuNgan, 1)[0];
    // Kèm một câu có chứa từ đó: ưu tiên câu ví dụ của chính từ, không có thì
    // lấy trong các câu của bài. Tô xong mà chỉ có mỗi chữ cái thì phí.
    // Tách câu thành từng chữ rồi so sánh, khỏi phải dựng regex — dấu gạch chéo
    // ngược qua nhiều lớp công cụ hay bị nuốt mất, đã dính bẫy đó vài lần.
    const tuThuong = w.en.toLowerCase();
    const coTu = s => s.en.toLowerCase().split(/[^a-z']+/).includes(tuThuong);
    const cau = w.ex || (sentences || []).find(coTu) || null;
    q.push({ type: "viet", chu: w.en[0].toUpperCase(), tu: w.en, word: w, cau });
  }

  // Cắt bớt cho vừa số câu thì phải chừa chỗ cho bài tô chữ, không thì trộn xong
  // slice là nó rụng mất và người học chẳng bao giờ gặp.
  const head = q[0] && q[0].type === "match" ? [q.shift()] : [];
  const bTo = q.find(x => x.type === "viet");
  const bGhep = q.find(x => x.type === "ghepChu");
  const bXep = q.find(x => x.type === "xepAnh");
  const dacBiet = [bTo, bGhep, bXep].filter(Boolean);
  const RIENG = ["viet", "ghepChu", "xepAnh"];
  const conLai = shuffle(q.filter(x => !RIENG.includes(x.type)));
  const ds = head.concat(conLai).slice(0, Math.max(1, max - dacBiet.length));
  // Chèn vào giữa chứ không để đầu — mở bài nào cũng đúng một kiểu thì thành nhàm.
  if (bTo) ds.splice(Math.min(2, ds.length), 0, bTo);
  if (bGhep) ds.splice(Math.min(5, ds.length), 0, bGhep);
  if (bXep) ds.splice(Math.min(8, ds.length), 0, bXep);
  return ds;
}

/* ---------- 8. Trình chiếu ---------- */
const P = { slides: [], i: 0, cur: null, teachN: 0, answered: false, correct: false,
            wrong: 0, attempts: 0, startedAt: 0, lessonId: null, mode: "lesson", picked: null, hintUsed: false, laThi: null };

function startLesson(id, opts = {}) {
  regenHearts();
  P.laThi = null;          // vào bài học thì không còn là đề thi nữa
  $("#pHearts").hidden = false;
  P.slides = [];
  if (S.hearts <= 0) return sheetNoHearts();

  const lesson = id ? findLesson(id) : null;
  let words, sentences, teach = [];
  if (opts.words) { words = opts.words; sentences = []; }
  else if (lesson.checkpoint) { words = unitWords(lesson.unit); sentences = sample(unitSentences(lesson.unit), 4); }
  else { teach = chenChem(lesson.teach || []); words = lessonWords(lesson); sentences = lesson.sentences || []; }

  const drills = buildPractice(words, sentences, opts.max || 12);
  if (!drills.length) { toast("Chưa có nội dung để luyện."); return; }

  P.slides = teach.map(s => ({ phase: "learn", d: s })).concat(drills.map(d => ({ phase: "drill", d })));
  P.teachN = teach.length;
  P.i = 0; P.wrong = 0; P.attempts = 0;
  P.startedAt = Date.now(); P.lessonId = id || null; P.mode = opts.mode || "lesson";
  stkDung = 0;

  $("#player").hidden = false;
  document.body.style.overflow = "hidden";
  paintHearts();
  renderSlide();
}
function closePlayer() {
  $("#player").hidden = true; document.body.style.overflow = ""; stopSpeak();
  paintStats(); go(view);
}
const paintHearts = () => { $("#pHearts").querySelector("b").textContent = S.hearts; };

function paintProgress() {
  const pct = Math.round((P.i / P.slides.length) * 100);
  $("#pProgress").querySelector("i").style.width = pct + "%";
  $("#pProgress").setAttribute("aria-valuenow", pct);
  $("#pHearts").hidden = P.i < P.teachN;
}
function setBtn(label, cls, on) {
  const b = $("#btnNext");
  b.textContent = label; b.className = "btn p-next " + cls; b.disabled = !on;
}
function setKicker(text) { $("#slideKicker").textContent = text || ""; }
function showMascot(on) { $("#mascotTop").classList.toggle("hide", !on); }

function renderSlide() {
  donDocThu();   // đổi slide thì cắt micro và trả lại bộ nhớ đoạn ghi cũ
  paintProgress();
  P.answered = false; P.correct = false; P.picked = null; P.hintUsed = false;
  $("#feedback").hidden = true;
  $(".p-foot").className = "p-foot";
  const stage = $("#stage"); stage.textContent = ""; stage.classList.remove("da-cham");
  $(".p-body").scrollTo?.({ top: 0 });

  const s = P.slides[P.i]; P.cur = s;
  // Bài tô chữ không có gì để gợi ý — nét đã hiện sẵn rồi.
  $("#btnHint").hidden = s.phase !== "drill" || s.d.type === "viet";
  if (s.phase === "learn") { TEACH[s.d.t](s.d, stage); setBtn("Tiếp theo", "btn-primary", true); }
  else { DRILL[s.d.type](s.d, stage); setBtn("Kiểm tra", "btn-primary", false); }
  if (s.daCham) xemLaiCau(s, stage);
  veNutLui();
}

/** Bấm quay lại mà rơi vào câu đã chấm rồi thì hiện ĐÁP ÁN, khoá không cho bấm
    nữa. Cho làm lại thì mỗi lần lui một cái là trừ tim thêm một lần, và số câu
    đúng cứ thế phồng lên — điểm cuối bài thành sai. */
function xemLaiCau(s, stage) {
  P.answered = true;
  P.correct = !!s.daDung;
  stage.classList.add("da-cham", "xem-lai");
  $("#btnHint").hidden = true;      // đáp án đang hiện rồi, gợi ý làm gì nữa
  danhDauDung(s.d, stage);
  // Vài dạng bài không có đáp án gọn thành một chữ; thiếu thì bỏ trống dòng đó
  // chứ không để cả màn hình chết vì một chỗ không đọc ra chữ.
  let dap = "";
  try { dap = answerOf(s.d) || ""; } catch { dap = ""; }
  feedback(!!s.daDung, s.daDung ? "Câu này bạn làm đúng" : "Câu này bạn làm sai",
    dap ? "Đáp án: " + dap : "", []);
  setBtn("Tiếp theo", "btn-primary", true);
}

/** Nút lui chỉ hiện khi thật sự còn chỗ để lui. */
function veNutLui() {
  const n = $("#btnBack");
  if (n) n.hidden = P.i <= 0;
}

function quayLai() {
  if (P.i <= 0) return;
  stopSpeak();
  P.i -= 1;
  renderSlide();
}
$("#btnBack").addEventListener("click", quayLai);

/** Khung ảnh minh hoạ lớn cho câu hỏi — người học nhìn thấy nghĩa trước khi đọc chữ.
    Từ nào có ảnh thật (assets/pics/…) thì dùng ảnh, không thì lấy hình vẽ trong
    sprite phóng to. Từ chưa có gì thì trả null và slide bỏ qua, không để khung rỗng. */
function khungAnh(w) {
  if (!w) return null;
  if (!w.img && !w.pic) return null;
  const box = el("figure", "pic-hero");
  if (w.img) {
    const im = el("img");
    im.src = "assets/pics/" + w.img;
    im.alt = "";
    im.loading = "lazy";
    im.decoding = "async";
    // Ảnh thiếu file thì gỡ cả khung đi, thà không có còn hơn ô vỡ.
    im.addEventListener("error", () => box.remove());
    box.append(im);
  } else if (document.getElementById("s-" + w.pic)) {
    // Cảnh vẽ tay: phủ kín khung, tự mang nền và chiều sâu của nó.
    box.classList.add("canh");
    box.append(svgUse("s-" + w.pic, "0 0 320 200"));
  } else {
    // Chưa vẽ cảnh cho chủ đề này thì dùng tạm hình nét đơn trên nền dịu.
    box.classList.add("ve");
    box.append(pic(w.pic));
  }
  return box;
}

/* Phần lớn nội dung là CÂU chứ không phải từ đơn, nên gán ảnh theo từ khoá xuất
   hiện trong câu: một cảnh phủ được hàng chục câu. Xếp từ cụ thể lên trước từ
   chung, vì "coffee shop" phải ra quán cà phê chứ không ra cái cửa hàng. */
/* ── BẢNG HÌNH: MỘT HÌNH MỘT NGHĨA ────────────────────────────────────────
   Trước đây đây là 98 luật dò từ khoá gom nhóm, khớp đầu tiên thắng. Kết quả:
   920 trong 1055 mục dùng chung vỏn vẹn 58 hình — một hình "sun" phải gánh
   101 câu, "family" gánh 68 câu. Nên mới có chuyện "bút mực" ra bàn làm việc,
   "đất nước" ra làng quê, "Con trâu ở ngoài đồng" cũng ra làng quê.
   Thầy chốt: trùng nhau là bỏ, sai là không được.
   Nay chỉ còn ánh xạ THẲNG một từ vựng → một hình vẽ riêng của chính nó.
   Từ nào không có hình riêng thì KHÔNG hiện hình — thà thiếu còn hơn sai. */
const HINH_TU = {
  afraid: "afraid", age: "age", airport: "airport", angry: "angry", apple: "apple",
  arm: "arm", arrive: "arrive", artist: "artist", bag: "bag", banana: "banana",
  bank: "bank", battery: "battery", beach: "beach", beautiful: "beautiful", bed: "bed",
  bedroom: "bedroom", bee: "bee", big: "big", bike: "bike", bill: "bill",
  bird: "bird", birthday: "birthday", black: "black", blue: "blue", board: "board",
  book: "book", bored: "bored", borrow: "borrow", box: "box", bread: "bread",
  breakfast: "breakfast", brother: "brother", brown: "brown", buffalo: "buffalo", bus: "bus",
  busy: "busy", butterfly: "butterfly", buy: "buy", car: "car", card: "card",
  carrot: "carrot", cash: "cash", cat: "cat", catch: "catch", cave: "cave",
  celebrate: "celebrate", chair: "chair", charge: "charge", chicken: "chicken", christmas: "christmas",
  cinema: "cinema", city: "city", clean: "clean", clever: "clever", climate: "climate",
  cloud: "cloud", coast: "coast", coat: "coat", coffee: "coffee", cold: "cold",
  colour: "colour", cook: "cook", cough: "cough", count: "count", country: "country",
  cow: "cow", curtain: "curtain", date: "date", decorate: "decorate", delicious: "delicious",
  depart: "depart", desk: "desk", dinner: "dinner", doctor: "doctor", dog: "dog",
  download: "download", dress: "dress", drink: "drink", drive: "drive", driver: "driver",
  duck: "duck", ear: "ear", eat: "eat", egg: "egg", elephant: "elephant",
  energy: "energy", engineer: "engineer", environment: "environment", eraser: "eraser", excited: "excited",
  exercise: "exercise", eye: "eye", face: "face", family: "family", farmer: "farmer",
  fast: "fast", father: "father", feed: "feed", festival: "festival", fever: "fever",
  film: "film", firework: "firework", fish: "fish", foot: "foot", forest: "forest",
  free: "free", fridge: "fridge", friend: "friend", friendly: "friendly", funny: "funny",
  garden: "garden", generous: "generous", gift: "gift", glasses: "glasses", go: "go",
  grandfather: "grandfather", grandmother: "grandmother", green: "green", hand: "hand", happy: "happy",
  hat: "hat", head: "head", health: "health", healthy: "healthy", heavy: "heavy",
  hello: "hello", help: "help", honest: "honest", hospital: "hospital", hot: "hot",
  hotel: "hotel", house: "house", hungry: "hungry", hurry: "hurry", hurt: "hurt",
  injury: "injury", invite: "invite", iron: "iron", island: "island", jacket: "jacket",
  jeans: "jeans", join: "join", juice: "juice", kind: "kind", kitchen: "kitchen",
  lake: "lake", lamp: "lamp", lantern: "lantern", lazy: "lazy", leave: "leave",
  left: "arrowleft", leg: "leg", lend: "lend", listen: "listen", lose: "lose",
  luggage: "luggage", lunch: "lunch", man: "man", mango: "mango", map: "map",
  market: "market", match: "match", meat: "meat", medicine: "medicine", meet: "meet",
  menu: "menu", milk: "milk", minute: "minute", mirror: "mirror", month: "month",
  morning: "morning", mother: "mother", motorbike: "motorbike", mountain: "mountain", mouse: "mouse",
  mouth: "mouth", music: "music", nervous: "nervous", night: "night", noodle: "noodle",
  nose: "nose", notebook: "notebook", number: "number", nurse: "nurse", office: "office",
  old: "old", orange: "orange", order: "order", pain: "pain", paint: "paint",
  parents: "parents", park: "park", party: "party", passport: "passport", patient: "patient",
  pay: "pay", pen: "pen", pencil: "pencil", pharmacy: "pharmacy", phone: "phone",
  photo: "photo", pig: "pig", pink: "pink", plastic: "plastic", play: "play",
  police: "police", polite: "polite", pollution: "pollution", practice: "practice", prescription: "prescription",
  proud: "proud", question: "question", quiet: "quiet", rain: "rain", read: "read",
  receipt: "receipt", recover: "recover", recycle: "recycle", red: "red", repair: "repair",
  restaurant: "restaurant", rice: "rice", right: "arrowright", river: "river", rubbish: "rubbish",
  ruler: "ruler", run: "run", salary: "salary", salt: "salt", save: "save",
  school: "school", screen: "screen", sea: "sea", shelf: "shelf", shirt: "shirt",
  shoes: "shoes", shop: "shop", shout: "shout", shy: "shy", sick: "sick",
  singer: "singer", sister: "sister", skirt: "skirt", sky: "sky", sleep: "sleep",
  small: "small", socks: "socks", sofa: "sofa", soldier: "soldier", soup: "soup",
  souvenir: "souvenir", speak: "speak", spend: "spend", sport: "sport", spring: "spring",
  station: "station", story: "story", student: "student", study: "study", summer: "summer",
  sunny: "sun", sweep: "sweep", swim: "swim", symptom: "symptom", table: "table",
  tall: "tall", taxi: "taxi", tea: "tea", teacher: "teacher", team: "team",
  television: "television", ticket: "ticket", time: "time", tired: "tired", today: "today",
  tomato: "tomato", tomorrow: "tomorrow", tooth: "tooth", toy: "toy", train: "train",
  travel: "travel", treatment: "treatment", trousers: "trousers", university: "university", valley: "valley",
  vegetable: "vegetable", village: "village", visit: "visit", wait: "wait", waiter: "waiter",
  walk: "walk", wardrobe: "wardrobe", warm: "warm", wash: "wash", watch: "watch",
  water: "water", waterfall: "waterfall", weather: "weather", week: "week", whisper: "whisper",
  white: "white", win: "win", wind: "wind", winter: "winter", woman: "woman",
  work: "work", worker: "worker", worried: "worried", year: "year", yellow: "yellow",
  yesterday: "yesterday", young: "young",
};

/** Hình của MỘT TỪ. Chỉ khớp đúng từ đó, tuyệt đối không dò trong câu —
    dò trong câu chính là chỗ đẻ ra "Con trâu ở ngoài đồng" mà vẽ làng quê. */
function hinhChoChu(chu) {
  if (!chu) return null;
  const k = String(chu).toLowerCase().trim().replace(/[.,!?;:"']/g, "");
  return HINH_TU[k] || null;
}

/** Câu điền từ: CHỈ dùng ảnh riêng của từ phải điền. Không còn đoán ảnh cho cả
    câu nữa — một câu có bảy tám chữ thì đoán kiểu gì cũng có lúc ra ảnh vô lý,
    mà ảnh vô lý còn hại hơn không có ảnh. */
function anhChoCau(d) {
  const canDien = (d.answers || []).map(a => String(a).toLowerCase().replace(/[.,!?]/g, ""));
  const w = ALL_WORDS.find(x => canDien.includes(x.en.toLowerCase()) && (x.img || x.pic));
  return w ? khungAnh(w) : null;
}

/** Rung nhẹ để tay biết máy đã nhận cử chỉ. Máy nào không có thì bỏ qua. */
function rung(kieu) {
  try { navigator.vibrate?.(kieu); } catch { /* trình duyệt chặn thì thôi */ }
}

/** Hình nhỏ cho MỘT Ô CHỌN trong bài chọn ảnh. Trả null khi không có hình nào
    hợp — ô rỗng thì bài mất hết ý nghĩa, thà bỏ từ đó ra còn hơn.
    Trước đây chỗ này chỉ vẽ w.pic. Nhưng phần đề thi lại nhận cả những từ chỉ
    khớp CẢNH theo chữ (w.pic rỗng), nên bốn ô hiện ra trống trơn. */
function hinhOChon(w) {
  if (!w) return null;
  if (w.pic && document.getElementById("p-" + w.pic)) return pic(w.pic);
  const c = w.pic || hinhChoChu(w.en);
  if (!c) return null;
  if (document.getElementById("s-" + c)) {
    const sv = svgUse("s-" + c, "0 0 320 200", "hinh-canh");
    return sv;
  }
  if (document.getElementById("p-" + c)) return pic(c);
  return null;
}
/** Tên hình của một từ. Hai từ cùng tên hình là hai ô GIỐNG HỆT nhau — người
    học nhìn ảnh không thể nào chọn đúng, nên phải loại bớt trước khi ra đề. */
function tenHinh(w) {
  if (!w) return null;
  if (w.pic && document.getElementById("p-" + w.pic)) return "p-" + w.pic;
  const c = w.pic || hinhChoChu(w.en);
  if (!c) return null;
  if (document.getElementById("s-" + c)) return "s-" + c;
  if (document.getElementById("p-" + c)) return "p-" + c;
  return null;
}
/** Từ này có vẽ được không — dùng để lọc trước khi ra đề. */
const veDuoc = w => !!(w && ((w.pic && document.getElementById("p-" + w.pic)) ||
  (() => { const c = w.pic || hinhChoChu(w.en);
           return c && (document.getElementById("s-" + c) || document.getElementById("p-" + c)); })()));

/** Một mục từ vựng: ảnh riêng nếu có, không thì dò cảnh theo chính chữ tiếng Anh. */
function anhChoTu(w) {
  if (w && (w.img || w.pic)) return khungAnh(w);
  const hinh = hinhChoChu(w && w.en);
  return hinh ? khungAnh({ pic: hinh }) : null;
}

/** Loc mot chuoi khuc catTieng, chi giu lai phan tieng Anh — dung cho nhung
    cho thay bao "bo tieng Viet di, chi doc tieng Anh thoi". */
const chiAnh = khuc => (khuc || []).filter(k => k && k.lang !== "vi-VN");

/* ---------- 9. Slide dạy ---------- */
/** Chèn màn chơi Chém chữ vào NGAY TRƯỚC Góc văn hoá — thầy chốt đúng chỗ đó:
    học một lượt từ mới xong thì chơi cho giãn đầu, rồi mới đọc phần văn hoá.
    Bài nào không có góc văn hoá thì để cuối phần dạy, trước lúc vào luyện tập.
    Trả về mảng MỚI, không đụng vào dữ liệu khoá học gốc. */
function chenChem(ds) {
  if (!ds || !ds.length) return ds || [];
  let k = ds.findIndex(s => s.t === "culture");
  if (k < 0) k = ds.length;
  const ra = ds.slice();
  ra.splice(k, 0, { t: "chem" });
  return ra;
}

const TEACH = {
  /** Tấm mời chơi. Bấm nút là mở màn chém; bấm "Tiếp theo" thì bỏ qua. */
  chem(d, st) {
    showMascot(true); setKicker("Giải lao");
    st.append(el("p", "ask", "Chém chữ"));
    const box = el("div", "choi-moi");
    box.append(el("p", "choi-moi-sub",
      "Hoa quả tung lên, mỗi quả mang một chữ. Vuốt tay chém đúng quả có chữ còn thiếu trong câu."));
    const b = el("button", "btn btn-primary btn-block", "Chơi ngay");
    b.type = "button";
    b.addEventListener("click", () => {
      b.textContent = "Chơi lại";
      chemMo(null);
    });
    box.append(b);
    st.append(box);
  },

  intro(d, st) {
    showMascot(true); setKicker("Giới thiệu");
    st.append(el("p", "ask", d.title));
    st.append(markup(el("p", "sign-body"), d.body));
    if (d.bullets) {
      const ul = el("ul", "bullets");
      d.bullets.forEach(t => {
        // Mỗi gạch đầu dòng chạm vào là nghe được — có dòng lẫn tiếng Anh nên
        // để máy tự nhận thứ tiếng thay vì ép một giọng.
        const li = el("li");
        const b = el("button", "bullet-btn"); b.type = "button";
        b.setAttribute("aria-label", "Nghe: " + boDanhDau(t));
        b.append(icon("i-check", "ic ic-sm"), el("span", null, t));
        b.addEventListener("click", () => speak(boDanhDau(t)));
        li.append(b); ul.append(li);
      });
      st.append(ul);
    }
    docLanLuot([
      ...catTieng(d.title),
      ...catTieng(boDanhDau(d.body)),
    ]);
  },
  vocab(d, st) { vocabSlide(d, st, "Từ mới"); },
  phrase(d, st) { vocabSlide(d, st, "Mẫu câu"); },

  grammar(d, st) {
    showMascot(false); setKicker("Ngữ pháp");
    st.append(signpost(d.title, d.body, "i-book"));
    const t = el("div", "gtable");
    d.rows.forEach(r => {
      const g = grammarRow(r);
      // Cả hàng là một nút: chạm vào là nghe câu mẫu rồi nghe nghĩa. Đây là chỗ
      // người ta cần nghe nhất — mẫu câu mà chỉ đọc bằng mắt thì không vào đầu.
      const row = el("button", "grow"); row.type = "button";
      row.setAttribute("aria-label", "Nghe: " + g.en);
      const ex = el("div", "gex");
      ex.append(el("b", null, g.en));
      if (g.vi) ex.append(el("small", null, g.vi));
      const loa = el("span", "grow-loa"); loa.append(icon("i-sound", "ic ic-sm"));
      row.append(el("div", "gform", g.label), ex, loa);
      // KHÔNG tin tên trường g.en/g.vi — đo từ "Excuse me" phát hiện đúng
      // 84/289 hàng kiểu [nhãn, ghi chú Việt, ví dụ Anh] thì grammarRow() gán
      // NGƯỢC: g.en lại là ghi chú tiếng Việt, g.vi lại là câu ví dụ tiếng Anh — đọc
      // đúng thành sai giọng hoàn toàn. Giữ nguyên chỗ hiển thị (b/small không
      // đổi), chỉ sai khi đọc to. Giờ tự dò tiếng theo nội dung thật, và theo đúng
      // yêu cầu của thầy — phần giảng giải này chỉ đọc tiếng Anh, bỏ tiếng Việt.
      row.addEventListener("click", () => docLanLuot(
        [g.en, g.vi].filter(Boolean)
          .map(t => ({ text: t, lang: tiengCua(t) }))
          .filter(k => k.lang !== "vi-VN")
      ));
      // Hàng là nút nghe, nên nút micro phải nằm ngoài hàng chứ không lồng vào
      // trong — nút trong nút thì trình duyệt không cho.
      const boc = el("div", "grow-boc");
      boc.append(row, nutDocNho(g.en));
      t.append(boc);
    });
    st.append(t);
    if (d.tip) {
      const tip = el("button", "tip"); tip.type = "button";
      tip.setAttribute("aria-label", "Nghe mẹo: " + boDanhDau(d.tip));
      tip.append(icon("i-bulb", "ic ic-sm"), el("span", null, d.tip));
      tip.addEventListener("click", () => docLanLuot(chiAnh(catTieng(boDanhDau(d.tip)))));
      st.append(tip);
    }
    // Thầy dặn bỏ luôn: không tự đọc khi vừa mở màn hình nữa, chỉ đọc
    // khi tự tay bấm "Nghe lại" (nút đó nằm trong signpost()) — đọc giảng giải
    // bằng mắt là đủ.
  },

  culture(d, st) {
    showMascot(false); setKicker("Góc văn hoá");
    st.append(signpost(d.title, d.body, "i-globe"));
  },

  dialogue(d, st) {
    showMascot(true); setKicker("Hội thoại");
    st.append(el("p", "ask", d.title));
    const box = el("div", "dialog");
    d.lines.forEach(l => {
      const line = el("div", "dline " + (l.who === "B" ? "b" : "a"));
      const bb = el("button", "dbubble"); bb.type = "button";
      bb.setAttribute("aria-label", "Nghe: " + l.en);
      bb.append(el("b", null, l.en));
      if (S.showVi) bb.append(el("small", null, l.vi));
      bb.addEventListener("click", () => speak(l.en));
      // Mỗi lượt thoại đọc thử được luôn — hội thoại là chỗ luyện nói sát thực tế nhất.
      line.append(el("span", "dwho", l.who), bb, nutDocNho(l.en));
      box.append(line);
    });
    st.append(box);
    speak(d.lines[0].en);
  }
};

/** Biển báo: thẻ viền đậm đứng trên hai chân cột, có đồi tuyết phía dưới. */
/** Bỏ dấu ** đánh dấu từ khoá — đọc lên mà kèm dấu sao thì nghe kỳ. */
const boDanhDau = t => String(t || "").replace(/\*\*/g, "");

function signpost(title, body, ic) {
  const wrap = el("div", "sign");
  const card = el("div", "sign-card");
  const badge = el("div", "sign-badge"); badge.append(icon(ic, "ic"));
  card.append(badge, el("div", "sign-word", title));
  card.append(markup(el("div", "sign-body"), body));
  // Nut "Nghe lại" chỉ đọc PHẦN TIẾNG ANH nằm trong tiêu đề và lời giảng —
  // phần tiếng Việt đọc bằng mắt là đủ, không cần đọc to.
  const ngheLai = el("button", "sign-nghe");
  ngheLai.type = "button";
  ngheLai.append(icon("i-sound", "ic ic-sm"), el("span", null, "Nghe lại"));
  ngheLai.addEventListener("click", () => docLanLuot(chiAnh([
    ...catTieng(title),
    ...catTieng(boDanhDau(body)),
  ])));
  card.append(ngheLai);
  // ON-Language tự giơ tấm bảng lên, thay cho hai cại cột vẽ bằng CSS trước đây.
  const mon = el("img", "sign-mon");
  mon.src = "assets/mon-giobang.webp";
  mon.alt = ""; mon.decoding = "async";
  // Ghi sẵn kích thước thật của ảnh để trình duyệt chừa chỗ trước khi tải xong.
  // Không ghi thì lúc chưa tải ảnh cao 0px, tải xong mới đẩy — mạng chậm là
  // cả trang giật một cái. Cũng bỏ "tải muộn": ảnh chỉ 46 KB và luôn hiện ngay
  // khi slide mở ra, hoãn lại chẳng được gì.
  mon.width = 380; mon.height = 435;
  wrap.append(card, mon);
  const hill = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  hill.setAttribute("viewBox", "0 0 400 60"); hill.setAttribute("class", "hill"); hill.setAttribute("aria-hidden", "true");
  hill.setAttribute("preserveAspectRatio", "none");
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", "M0 60V34c60-22 130-22 200 0s140 22 200 0v26Z");
  hill.append(p);
  const box = el("div");
  box.append(wrap, hill);
  return box;
}
function grammarRow(r) {
  const third = r[2] == null ? "" : String(r[2]);
  if (third.includes(" — ")) { const [en, vi] = third.split(" — "); return { label: r[1] ? `${r[0]} · ${r[1]}` : r[0], en, vi }; }
  return { label: r[0], en: r[1], vi: third };
}

/* ═══════════ ĐỌC THỬ VÀ CHẤM ĐIỂM ═══════════
   Người học đọc theo mẫu, máy nghe rồi chấm xem lệch bao nhiêu. Dùng đúng bộ
   nghe của trình duyệt như phần gọi ON-Language, nhưng đặt sẵn tiếng Anh và chỉ nghe
   một câu rồi dừng. */
/** Dọn phần đọc thử: tắt micro, huỷ đoạn ghi cũ. Không dọn thì đèn micro sáng
    mãi và bộ nhớ cứ giữ từng đoạn thu của mọi từ đã học. */
function donDocThu() {
  if (doDangNghe) { try { doDangNghe.stop(); } catch { /* đang dừng */ } doDangNghe = null; }
  if (banGhi && banGhi.state !== "inactive") { try { banGhi.stop(); } catch { /* đã dừng */ } }
  banGhi = null;
  if (tiengMinh) { URL.revokeObjectURL(tiengMinh); tiengMinh = null; }
}

let doDangNghe = null;
let banGhi = null;      // MediaRecorder đang chạy
let tiengMinh = null;   // địa chỉ tạm của đoạn vừa thu

function khoiDocThu(mau, nhan) {
  const box = el("div", "dt");

  const nut = el("button", "dt-nut"); nut.type = "button";
  nut.setAttribute("aria-label", "Đọc thử: " + mau);
  nut.append(icon("i-mic"));

  // iPhone mở app từ màn hình chính hay chặn micro — báo trước còn hơn để họ
  // bấm mãi không hiểu vì sao.
  const nhacBanDau = !SR
    ? "Máy này chưa nghe được bằng micro."
    : isIosStandalone()
      ? "Đang mở từ màn hình chính — iPhone kiểu này micro hay không chạy. Không được thì mở bằng Safari nhé."
      : "Bấm micro rồi đọc: " + nhan;
  const chu = el("div", "dt-chu", nhacBanDau);
  const diem = el("div", "dt-diem"); diem.hidden = true;

  /* ---- Khối xin quyền micro ----
     Trước đây máy chặn micro thì chỉ hiện một dòng chữ "bạn chưa cho phép",
     người học không biết mở ở đâu. Nay có nút xin quyền ngay tại chỗ, và nếu
     máy đã chặn hẳn thì chỉ đúng đường mở lại theo từng loại máy. */
  const hangQuyen = el("div", "dt-quyen"); hangQuyen.hidden = true;
  const quyenChu = el("p", "dt-quyen-chu");
  const quyenNut = el("button", "dt-quyen-nut"); quyenNut.type = "button";
  quyenNut.append(icon("i-mic", "ic ic-sm"), el("span", null, "Cho phép dùng micro"));
  hangQuyen.append(quyenChu, quyenNut);

  /* Chỉ đường mở lại quyền micro.
     iPhone: KHÔNG bắt vào Cài đặt hệ thống — Safari cho mở lại ngay tại trang
     bằng nút chữ "ᴀA" ở thanh địa chỉ, nhanh hơn nhiều. Vào Cài đặt chỉ là
     cách hai, để dành cho máy nào không thấy nút đó. */
  function chiDuongMoQuyen() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return "Chạm chữ ᴀA bên trái thanh địa chỉ ở trên → Cài đặt trang web → " +
             "Micrô → chọn Cho phép. (Không thấy thì vào Cài đặt → Safari → Micrô.)";
    }
    if (/Android/i.test(ua)) {
      return "Chạm biểu tượng ổ khoá 🔒 cạnh địa chỉ web ở trên → Quyền → Micrô → Cho phép.";
    }
    return "Bấm biểu tượng ổ khoá 🔒 cạnh địa chỉ web ở trên → Micrô → Cho phép, " +
           "rồi tải lại trang.";
  }

  function hienXinQuyen(daChan) {
    hangQuyen.hidden = false;
    quyenChu.textContent = daChan
      ? "Máy đang chặn micro. " + chiDuongMoQuyen()
      : "Cần quyền dùng micro để nghe bạn đọc. Bấm nút bên dưới rồi chọn Cho phép nhé.";
    // Vẫn để nút bấm lại kể cả khi đang bị chặn: nhiều máy chỉ từ chối tạm,
    // bấm lần nữa là hiện hộp hỏi quyền; mà mở quyền xong cũng cần nút này để
    // kiểm tra ngay chứ không phải tải lại trang.
    quyenNut.hidden = false;
    quyenNut.lastChild.textContent = daChan ? "Thử lại quyền micro" : "Cho phép dùng micro";
  }

  quyenNut.addEventListener("click", async () => {
    try {
      const luong = await navigator.mediaDevices.getUserMedia({ audio: true });
      luong.getTracks().forEach(t => t.stop());       // xin xong thì trả lại ngay
      hangQuyen.hidden = true;
      chu.textContent = "Được rồi! Bấm micro rồi đọc: " + nhan;
    } catch {
      hienXinQuyen(true);
    }
  });

  // Dò trước trạng thái quyền để mời cho phép ngay, đừng đợi bấm rồi mới báo lỗi.
  (async () => {
    try {
      const q = await navigator.permissions.query({ name: "microphone" });
      if (q.state === "denied") hienXinQuyen(true);
      else if (q.state === "prompt") hienXinQuyen(false);
      q.onchange = () => { if (q.state === "granted") hangQuyen.hidden = true; };
    } catch { /* trình duyệt không cho hỏi trước thì thôi, bấm rồi biết */ }
  })();

  if (!SR) nut.disabled = true;

  nut.addEventListener("click", () => {
    if (doDangNghe) { try { doDangNghe.stop(); } catch { /* đang dừng */ } return; }
    stopSpeak();   // im hẳn loa đã, loa còn kêu thì micro không nghe được gì
    let xong = false;
    let r;
    try { r = new SR(); } catch { chu.textContent = "Không mở được micro."; return; }
    doDangNghe = r;
    r.lang = "en-GB";
    // Nhận cả kết quả tạm: iPhone hay trả kết quả tạm rồi kết thúc mà không gửi
    // kết quả cuối, không nhận tạm thì đọc xong chẳng thấy gì.
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 3;
    let nghePhu = "";

    let canh = null;
    const ketThuc = () => {
      if (xong) return;
      xong = true;
      clearTimeout(canh);
      doDangNghe = null;
      box.classList.remove("dang-nghe");
      dungThuAm();
      // Máy dừng mà chưa kịp gửi kết quả cuối thì vẫn chấm bằng cái nghe được.
      if (diem.hidden && nghePhu) hienDiem(diemDoc(nghePhu, mau), nghePhu);
    };

    r.onresult = ev => {
      // Gom mọi phương án của mọi đoạn, lấy phương án KHỚP NHẤT — máy hay đoán
      // sang từ thông dụng hơn, trong khi người ta đọc đúng từ đang học rồi.
      const ds = [];
      let xongHan = false;
      for (let i = 0; i < ev.results.length; i += 1) {
        const kq = ev.results[i];
        if (kq.isFinal) xongHan = true;
        for (let j = 0; j < kq.length; j += 1) ds.push(kq[j].transcript);
      }
      if (!ds.length) return;
      let tot = ds[0], cao = -1;
      ds.forEach(t => { const p = diemDoc(t, mau); if (p > cao) { cao = p; tot = t; } });
      nghePhu = tot;
      if (!xongHan) { chu.textContent = "Nghe được: " + tot + "…"; return; }
      hienDiem(cao, tot);
      ketThuc();
    };
    r.onerror = e => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        chu.textContent = "Chưa có quyền dùng micro.";
        hienXinQuyen(true);
      } else {
        chu.textContent = e.error === "no-speech"
          ? "Không nghe thấy gì. Bấm rồi đọc to hơn chút nhé."
          : "Micro trục trặc, bạn thử lại nhé.";
      }
      ketThuc();
    };
    r.onend = ketThuc;

    // Ghi âm thật để nghe lại giọng mình. Nhận dạng và ghi âm chạy song song;
    // máy nào không cho hai thứ cùng dùng micro thì vẫn còn phần nhận dạng.
    thuTiengMinh();

    try {
      r.start();
      box.classList.add("dang-nghe");
      chu.textContent = "Đang nghe… đọc đi nào!";
      diem.hidden = true;
      // Máy nào không tự dừng thì cắt sau 9 giây, đừng để nút đỏ mãi.
      canh = setTimeout(() => { try { r.stop(); } catch { /* đã dừng */ } ketThuc(); }, 9000);
    } catch { chu.textContent = "Không mở được micro."; ketThuc(); }
  });

  async function thuTiengMinh() {
    if (!navigator.mediaDevices || !window.MediaRecorder) return;
    try {
      const luong = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mieng = [];
      const mr = new MediaRecorder(luong);
      banGhi = mr;
      mr.ondataavailable = e => { if (e.data && e.data.size) mieng.push(e.data); };
      mr.onstop = () => {
        // Trả micro lại cho máy, không thì đèn micro sáng mãi.
        luong.getTracks().forEach(t => t.stop());
        banGhi = null;
        if (!mieng.length) return;
        if (tiengMinh) URL.revokeObjectURL(tiengMinh);
        tiengMinh = URL.createObjectURL(new Blob(mieng, { type: mr.mimeType || "audio/webm" }));
        veNutTiengMinh();
      };
      mr.start();
    } catch { /* không cho phép hoặc máy không hỗ trợ thì thôi */ }
  }

  function dungThuAm() {
    if (banGhi && banGhi.state !== "inactive") {
      try { banGhi.stop(); } catch { /* đã dừng */ }
    }
  }

  /* Nút nghe lại giọng mình.
     Trước đây nút này KHÔNG BAO GIỜ hiện ra: nó chỉ vẽ khi khối điểm đã mở,
     mà lúc thu xong thì khối điểm còn ẩn nên hàm thoát ngay; rồi khi chấm
     điểm, hienDiem() lại xoá sạch nội dung khối điểm nên nút có vẽ cũng mất.
     Nay để nút ở HÀNG RIÊNG bên dưới, hiện ngay khi thu xong. */
  const hangMinh = el("div", "dt-hang"); hangMinh.hidden = true;
  const nutMinh = el("button", "dt-minh"); nutMinh.type = "button";
  nutMinh.append(icon("i-play", "ic ic-sm"), el("span", null, "Nghe lại giọng mình"));
  nutMinh.addEventListener("click", () => {
    if (!tiengMinh) return;
    stopSpeak();
    const am = new Audio(tiengMinh);
    nutMinh.classList.add("dang-phat");
    const het = () => nutMinh.classList.remove("dang-phat");
    am.onended = het; am.onerror = het;
    am.play().catch(het);
  });
  hangMinh.append(nutMinh);

  function veNutTiengMinh() {
    if (!tiengMinh) return;
    hangMinh.hidden = false;
  }

  function hienDiem(p, nghe) {
    diem.hidden = false;
    diem.textContent = "";
    const muc = p >= 85 ? "tot" : p >= 60 ? "kha" : "chua";
    diem.className = "dt-diem " + muc;

    const vong = el("div", "dt-vong");
    vong.style.setProperty("--p", p + "%");
    vong.append(el("b", null, p + "%"));
    diem.append(vong);

    const loi = el("div", "dt-loi");
    loi.append(el("strong", null,
      p >= 85 ? "Chuẩn rồi!" : p >= 60 ? "Gần đúng rồi" : "Đọc lại nhé"));
    loi.append(el("small", null,
      p >= 85 ? "Nghe rõ và đúng trọng âm." : "Máy nghe thành: “" + nghe + "”"));
    diem.append(loi);

    const ngheMau = el("button", "dt-mau"); ngheMau.type = "button";
    ngheMau.setAttribute("aria-label", "Nghe lại mẫu");
    ngheMau.append(icon("i-sound", "ic ic-sm"));
    ngheMau.addEventListener("click", () => speak(mau, true, "en-GB"));
    diem.append(ngheMau);

    veNutTiengMinh();
    rung(p >= 85 ? [12, 40, 12] : 10);
    chu.textContent = "Bấm micro để đọc lại.";
  }

  box.append(nut, chu, diem, hangMinh, hangQuyen);
  return box;
}

/** Nút micro nhỏ gắn cạnh một câu mẫu: đọc theo, chấm xong hiện luôn % ngay
    trên nút. Dùng cho hội thoại và bảng ngữ pháp, nơi mỗi màn có nhiều câu nên
    không đặt vừa khối chấm điểm lớn. */
function nutDocNho(mau) {
  const b = el("button", "mic-nho"); b.type = "button";
  b.setAttribute("aria-label", "Đọc thử: " + mau);
  const ic = icon("i-mic", "ic ic-sm");
  const so = el("span", "mic-so");
  b.append(ic, so);

  b.addEventListener("click", ev => {
    ev.stopPropagation();          // đừng kích luôn nút nghe của cả dòng
    if (!SR) { toast("Máy này chưa nghe được bằng micro."); return; }
    if (doDangNghe) { try { doDangNghe.stop(); } catch { /* đang dừng */ } return; }
    stopSpeak();

    let xong = false, nghePhu = "", canh = null;
    let r;
    try { r = new SR(); } catch { toast("Không mở được micro."); return; }
    doDangNghe = r;
    r.lang = "en-GB";
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 3;

    const ketThuc = () => {
      if (xong) return;
      xong = true;
      clearTimeout(canh);
      doDangNghe = null;
      b.classList.remove("dang-nghe");
      if (!so.textContent && nghePhu) hienSo(diemDoc(nghePhu, mau));
    };
    const hienSo = p => {
      so.textContent = p + "%";
      b.classList.remove("tot", "kha", "chua");
      b.classList.add(p >= 85 ? "tot" : p >= 60 ? "kha" : "chua");
      rung(p >= 85 ? [12, 40, 12] : 10);
    };

    r.onresult = e2 => {
      const ds = [];
      let het = false;
      for (let i = 0; i < e2.results.length; i += 1) {
        const kq = e2.results[i];
        if (kq.isFinal) het = true;
        for (let j = 0; j < kq.length; j += 1) ds.push(kq[j].transcript);
      }
      if (!ds.length) return;
      let cao = -1;
      ds.forEach(t => { const p = diemDoc(t, mau); if (p > cao) { cao = p; nghePhu = t; } });
      if (!het) return;
      hienSo(cao);
      ketThuc();
    };
    r.onerror = e2 => {
      toast(e2.error === "not-allowed" ? "Bạn chưa cho phép dùng micro."
        : e2.error === "no-speech" ? "Không nghe thấy gì, đọc to hơn chút nhé."
        : "Micro trục trặc, thử lại nhé.");
      ketThuc();
    };
    r.onend = ketThuc;

    try {
      r.start();
      b.classList.add("dang-nghe");
      b.classList.remove("tot", "kha", "chua");
      so.textContent = "";
      canh = setTimeout(() => { try { r.stop(); } catch { /* đã dừng */ } ketThuc(); }, 9000);
    } catch { toast("Không mở được micro."); ketThuc(); }
  });
  return b;
}

function vocabSlide(d, st, label) {
  showMascot(true); setKicker(label);
  const card = el("div", "vcard");
  if (d.pic) { const p = el("div", "vcard-pic"); p.append(pic(d.pic)); card.append(p); }
  card.append(el("div", "vcard-en", d.en));
  // Nhãn bậc trên thẻ từ: học tới đâu biết mình đang ở mức nào.
  const wBac = ALL_WORDS.find(x => x.en === d.en);
  if (wBac && (wBac.cefr || wBac.lop)) {
    const hang = el("div", "vcard-bac");
    if (wBac.cefr) hang.append(el("span", "w-bac", wBac.cefr));
    if (wBac.lop) hang.append(el("span", "w-lop", wBac.lop));
    card.append(hang);
  }
  if (d.ipa) card.append(el("div", "vcard-ipa", d.ipa));
  const say = el("button", "vcard-say"); say.type = "button";
  say.setAttribute("aria-label", "Nghe phát âm: " + d.en);
  say.append(icon("i-sound"));
  // Bấm loa lớn: đọc chậm để nghe rõ từng âm, đó mới là lúc người ta cần nghe kỹ.
  say.addEventListener("click", () => speak(d.en, true));
  card.append(say);

  // Dòng nghĩa cũng bấm nghe được, và đọc bằng giọng Việt chứ không phải giọng Anh.
  const hangVi = el("div", "vcard-vi-row");
  const nutVi = el("button", "vcard-say-vi"); nutVi.type = "button";
  nutVi.setAttribute("aria-label", "Nghe nghĩa tiếng Việt: " + d.vi);
  nutVi.append(icon("i-sound", "ic ic-sm"));
  nutVi.addEventListener("click", () => speak(d.vi, false, "vi-VN"));
  hangVi.append(el("div", "vcard-vi", d.vi), nutVi);
  card.append(hangVi);
  st.append(card);
  // Học từ mới xong là đọc thử luôn, không đợi tới phần luyện tập.
  st.append(khoiDocThu(d.en, d.en));

  if (d.note) { const n = el("div", "note"); n.append(icon("i-bulb", "ic ic-sm"), markup(el("span"), d.note)); st.append(n); }
  if (d.ex) {
    const ex = el("div", "example");
    const s = el("button", "say"); s.type = "button";
    s.setAttribute("aria-label", "Nghe ví dụ: " + d.ex.en);
    s.append(icon("i-sound", "ic ic-sm"));
    s.addEventListener("click", () => docLanLuot([
      { text: d.ex.en, lang: "en-GB" },
      { text: d.ex.vi, lang: "vi-VN" },
    ]));
    const txt = el("div"); txt.append(el("b", null, d.ex.en), el("small", null, d.ex.vi));
    ex.append(s, txt); st.append(ex);
  }
  // Vừa mở thẻ là dạy luôn bằng tiếng, không bắt người ta tự bấm: đọc từ tiếng
  // Anh trước, rồi nghĩa tiếng Việt, mỗi bên bằng giọng bản ngữ của nó.
  docLanLuot([
    { text: d.en, lang: "en-GB" },
    { text: d.vi, lang: "vi-VN" },
  ]);
}

/* ---------- 10. Dạng bài luyện tập ---------- */
const DRILL = {
  choice(d, st) {
    setKicker("Chọn nghĩa đúng");
    const row = el("div", "say-row");
    const say = el("button", "say-btn"); say.type = "button";
    say.setAttribute("aria-label", "Nghe lại: " + d.word.en);
    say.append(icon("i-sound"));
    say.addEventListener("click", () => speak(d.word.en));
    row.append(say);
    st.append(el("p", "ask", d.word.en), row);
    const anh = anhChoTu(d.word);
    // Có ảnh minh hoạ riêng rồi thì GIẤU mặt ON-Language đi: hai cái hình chồng
    // nhau ăn hết chỗ, đẩy các thẻ đáp án rơi khỏi màn hình — đo trên máy hẹp
    // thì thẻ cuối nằm dưới mép nhìn thấy tới 145px, trẻ tưởng bài bị lỗi.
    showMascot(!anh);
    if (anh) st.append(anh);
    st.append(optList(d.opts, w => w.vi, d.word.en));
    speak(d.word.en);
  },

  reverse(d, st) {
    setKicker("Dịch sang tiếng Anh");
    st.append(cauHoiNgheDuoc("“" + d.word.vi + "”", "vi-VN", d.word.vi));
    const anh = anhChoTu(d.word);
    showMascot(!anh);
    if (anh) st.append(anh);
    st.append(optList(d.opts, w => w.en, d.word.en));
  },

  listen(d, st) {
    showMascot(true); setKicker("Nghe và chọn từ bạn nghe được");
    const row = el("div", "say-row");
    const say = el("button", "say-btn"); say.type = "button";
    say.setAttribute("aria-label", "Phát âm thanh"); say.append(icon("i-sound"));
    say.addEventListener("click", () => speak(d.word.en));
    const slow = el("button", "say-btn sm"); slow.type = "button";
    slow.setAttribute("aria-label", "Phát chậm"); slow.append(icon("i-slow"));
    slow.addEventListener("click", () => speak(d.word.en, true));
    row.append(say, slow);
    st.append(row, optList(d.opts, w => w.en, d.word.en));
    speak(d.word.en);
  },

  picture(d, st) {
    showMascot(true); setKicker("Chọn hình ảnh đúng");
    // HỎI BẰNG NGHĨA TIẾNG VIỆT. Trước đây hỏi bằng chính chữ tiếng Anh, mà mỗi
    // ô lại ghi sẵn chữ tiếng Anh bên dưới — người học chỉ việc dò chữ giống
    // nhau là xong, không cần nhìn hình, không học được gì.
    st.append(el("p", "ask", d.word.vi || d.word.en));
    const grid = el("div", "pics");
    d.opts.filter(veDuoc).forEach(w => {
      const b = el("button", "pic pic-an"); b.type = "button"; b.dataset.en = w.en;
      // Chữ tiếng Anh giấu đi cho tới lúc chấm — chấm xong mới hiện ra để học.
      b.append(hinhOChon(w), el("span", null, w.en));
      b.addEventListener("click", () => {
        if (P.answered) return;
        $$(".pic", grid).forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        P.picked = { node: b, ok: w.en === d.word.en };
        speak(w.en);
        setBtn("Kiểm tra", "btn-primary", true);
      });
      grid.append(b);
    });
    st.append(grid);
    speak(d.word.en);
  },

  truefalse(d, st) {
    showMascot(true); setKicker("Đúng hay sai");
    const ask = el("p", "ask");
    markup(ask, `Trong tiếng Anh, “${d.word.vi}” được gọi là **${d.shown}**.`);
    const tf = el("div", "tf");
    const mk = (cls, ic, val, lab) => {
      const b = el("button", cls); b.type = "button";
      b.setAttribute("aria-label", lab); b.dataset.val = String(val);
      b.append(icon(ic));
      b.addEventListener("click", () => {
        if (P.answered) return;
        $$("button", tf).forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        P.picked = { node: b, ok: val === d.answer };
        setBtn("Kiểm tra", "btn-primary", true);
      });
      return b;
    };
    tf.append(mk("yes", "i-check", true, "Đúng"), mk("no", "i-close", false, "Sai"));
    st.append(ask, tf);
    speak(d.shown);
  },

  blanks(d, st) {
    showMascot(true); setKicker("Dịch câu này");
    st.append(cauHoiNgheDuoc(d.sent.vi, "vi-VN"));
    const anh = anhChoCau(d);
    if (anh) st.append(anh);

    const parts = d.sent.en.split(" ");
    const line = el("div", "blanks");
    const slots = [];
    parts.forEach((w, i) => {
      if (d.idx.includes(i)) {
        const s = el("button", "slot"); s.type = "button";
        s.dataset.pos = String(i);
        s.setAttribute("aria-label", "Ô trống " + (slots.length + 1));
        // Bấm vào ô đã điền thì nhả từ ra, trả thẻ về ngân hàng.
        s.addEventListener("click", () => {
          if (P.answered || !s.dataset.word) return;
          const t = bank.querySelector(`.tile-w[data-w="${CSS.escape(s.dataset.word)}"].used`);
          if (t) t.classList.remove("used");
          s.textContent = ""; delete s.dataset.word; s.classList.remove("filled");
          sync();
        });
        slots.push(s); line.append(s);
      } else line.append(el("span", "fixed", w));
    });

    const bank = el("div", "bank");
    d.bank.forEach(w => {
      const t = el("button", "tile-w", w); t.type = "button"; t.dataset.w = w;
      ganKeo(t, w);
      // Bàn phím và người không kéo được vẫn dùng được: bấm là thử ô trống đầu tiên.
      t.addEventListener("click", ev => {
        if (ev.detail !== 0) return;          // chuột/cảm ứng đã đi đường kéo rồi
        const o = slots.find(x => !x.dataset.word);
        if (o) thuDat(t, w, o);
      });
      bank.append(t);
    });

    /** Đặt một từ vào ô — chỉ nhận nếu đúng, sai thì ô rung và từ ở nguyên chỗ. */
    function thuDat(t, w, o) {
      if (P.answered || !o) return false;
      const k = slots.indexOf(o);
      if (norm(w) !== norm(d.answers[k])) {
        o.classList.remove("rung");
        void o.offsetWidth;                   // ép trình duyệt chạy lại hoạt ảnh
        o.classList.add("rung");
        return false;
      }
      o.textContent = w; o.dataset.word = w; o.classList.add("filled");
      t.classList.add("used");
      sync();
      return true;
    }

    /** Kéo thả kiểu mềm: thẻ nghiêng và giãn theo tay, thả trúng ô thì bắt vào. */
    function ganKeo(t, w) {
      t.addEventListener("pointerdown", ev => {
        if (P.answered || t.classList.contains("used")) return;
        ev.preventDefault();
        // Giữ mọi sự kiện về đúng thẻ này, kể cả khi ngón tay trượt ra ngoài nó.
        try { t.setPointerCapture(ev.pointerId); } catch { /* trình duyệt cũ */ }
        const r = t.getBoundingClientRect();
        const bay = t.cloneNode(true);
        bay.className = "tile-w tile-fly";
        bay.style.width = r.width + "px";
        bay.style.height = r.height + "px";
        document.body.append(bay);

        const lech = { x: ev.clientX - r.left, y: ev.clientY - r.top };
        let x = ev.clientX, y = ev.clientY, vx = 0, truocX = ev.clientX;
        t.classList.add("dang-keo");

        const ve = () => {
          bay.style.left = (x - lech.x) + "px";
          bay.style.top = (y - lech.y) + "px";
          // Nghiêng và hơi dẹt theo tốc độ ngang — đó là cái làm nó thấy mềm.
          const ng = clamp(vx * 0.7, -15, 15);
          const gian = 1 + Math.min(Math.abs(vx) / 260, 0.12);
          bay.style.transform = `rotate(${ng}deg) scale(${1.06 * gian}, ${1.06 / gian})`;
        };
        ve();
        rung(8);

        const oGan = () => {
          const trong = slots.filter(o => !o.dataset.word);
          if (!trong.length) return null;
          // Chỉ còn đúng một ô thì thả đâu cũng nhận — bắt người ta ngắm trúng
          // một ô duy nhất là hành họ chứ chẳng để làm gì.
          if (trong.length === 1) return trong[0];

          let dangDe = null, tot = null, gan = Infinity;
          trong.forEach(o => {
            const b = o.getBoundingClientRect();
            // Ngón tay đang đè hẳn lên ô thì lấy ngay, không so đo khoảng cách.
            if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) dangDe = o;
            const dd = Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2));
            if (dd < gan) { gan = dd; tot = o; }
          });
          if (dangDe) return dangDe;
          return gan < 150 ? tot : null;
        };

        const dichuyen = e2 => {
          vx = e2.clientX - truocX; truocX = e2.clientX;
          x = e2.clientX; y = e2.clientY;
          ve();
          const o = oGan();
          slots.forEach(n => n.classList.toggle("over", n === o));
        };

        const buong = () => {
          try { t.releasePointerCapture(ev.pointerId); } catch { /* đã nhả rồi */ }
          window.removeEventListener("pointermove", dichuyen);
          window.removeEventListener("pointerup", buong);
          window.removeEventListener("pointercancel", buong);
          const o = oGan();
          slots.forEach(n => n.classList.remove("over"));
          t.classList.remove("dang-keo");

          const dich = o && !o.dataset.word && norm(w) === norm(d.answers[slots.indexOf(o)])
            ? o.getBoundingClientRect()
            : t.getBoundingClientRect();
          const nhan = !!(o && thuDat(t, w, o));
          rung(nhan ? 14 : [10, 50, 10]);

          // Cho thẻ bay về đích rồi mới biến mất, không nhảy cóc.
          bay.classList.add("ve");
          bay.style.left = dich.left + "px";
          bay.style.top = dich.top + "px";
          bay.style.transform = "rotate(0deg) scale(1)";
          if (nhan) bay.style.opacity = "0";
          setTimeout(() => bay.remove(), 220);
        };

        window.addEventListener("pointermove", dichuyen);
        window.addEventListener("pointerup", buong);
        window.addEventListener("pointercancel", buong);
      });
    }

    function sync() {
      const filled = slots.every(o => o.dataset.word);
      P.picked = { slots, ok: slots.every((o, k) => norm(o.dataset.word || "") === norm(d.answers[k])) };
      setBtn("Kiểm tra", "btn-primary", filled);
    }
    st.append(line, el("div", "bank-line"), bank);
    P.picked = null;
  },

  /* Tô chữ bằng ngón tay: người học kéo theo nét, máy chấm bằng cách rải sẵn
     các mốc dọc nét rồi xem ngón tay có đi qua LẦN LƯỢT không. Chỉ đo khoảng
     cách tới nét thì tô ngược hay tô loạn vẫn qua, nên phải xét thứ tự. */
  viet(d, st) {
    showMascot(false); setKicker("Tô chữ theo nét");
    const chu = d.chu;
    const nets = (window.NET_CHU || {})[chu] || [];
    st.append(el("p", "ask", `Chữ ${chu} — dùng ngón tay tô theo nét`));

    const khung = el("div", "to-khung");
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 120");
    svg.setAttribute("class", "to-svg");

    // Chữ mờ nằm dưới cùng, để người ta thấy hình dạng cần tô.
    nets.forEach(dd => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", dd); p.setAttribute("class", "to-nen");
      svg.append(p);
    });

    const netEls = [];
    nets.forEach(dd => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", dd); p.setAttribute("class", "to-net");
      svg.append(p);
      netEls.push(p);
    });
    khung.append(svg);
    st.append(khung);

    let iNet = 0, iMoc = 0, moc = [], xong = false;

    /** Rải mốc dọc một nét, cứ 5 đơn vị một cái. */
    function raiMoc(p) {
      const dai = p.getTotalLength();
      const n = Math.max(6, Math.round(dai / 5));
      const ds = [];
      for (let i = 0; i <= n; i += 1) ds.push(p.getPointAtLength((dai * i) / n));
      return ds;
    }

    function vaoNet(k) {
      iNet = k; iMoc = 0;
      netEls.forEach((p, i) => p.classList.toggle("dang-to", i === k));
      if (k >= netEls.length) { hoanTat(); return; }
      const p = netEls[k];
      moc = raiMoc(p);
      const dai = p.getTotalLength();
      p.style.strokeDasharray = dai;
      p.style.strokeDashoffset = dai;
      datChamBatDau(moc[0]);
    }

    let cham = null;
    function datChamBatDau(pt) {
      if (!cham) {
        cham = document.createElementNS(NS, "circle");
        cham.setAttribute("r", "5.5");
        cham.setAttribute("class", "to-cham");
        svg.append(cham);
      }
      cham.setAttribute("cx", pt.x); cham.setAttribute("cy", pt.y);
      cham.style.display = "";
    }

    function toiDiem(x, y) {
      if (xong || iNet >= netEls.length) return;
      // Cho phép lệch 11 đơn vị — ngón tay to hơn nét nhiều, khắt khe quá thì bực.
      let tien = false;
      while (iMoc < moc.length) {
        const m = moc[iMoc];
        if (Math.hypot(x - m.x, y - m.y) > 11) break;
        iMoc += 1; tien = true;
      }
      if (!tien) return;
      const p = netEls[iNet];
      const dai = p.getTotalLength();
      p.style.strokeDashoffset = dai * (1 - iMoc / (moc.length - 1));
      if (cham && iMoc > 0) cham.style.display = "none";
      if (iMoc >= moc.length) {
        p.classList.add("da-to"); p.classList.remove("dang-to");
        p.style.strokeDashoffset = 0;
        rung(12);
        vaoNet(iNet + 1);
      }
    }

    function hoanTat() {
      xong = true;
      if (cham) cham.style.display = "none";
      svg.classList.add("to-xong");
      rung([14, 60, 14]);
      P.picked = { ok: true };
      P.answered = false;
      setBtn("Kiểm tra", "btn-primary", true);

      // Phần thưởng sau khi tô: hiện hẳn câu có chứa từ, rồi đọc cả chuỗi.
      if (d.cau && !st.querySelector(".to-cau")) {
        const box = el("div", "to-cau");
        const b = el("button", "to-cau-nut"); b.type = "button";
        b.setAttribute("aria-label", "Nghe lại: " + d.cau.en);
        b.append(icon("i-sound", "ic ic-sm"));
        const chu2 = el("div", "to-cau-chu");
        chu2.append(el("b", null, d.cau.en));
        if (d.cau.vi) chu2.append(el("small", null, d.cau.vi));
        b.addEventListener("click", () => docLanLuot([
          { text: d.cau.en, lang: "en-GB" },
          d.cau.vi ? { text: d.cau.vi, lang: "vi-VN" } : null,
        ].filter(Boolean)));
        box.append(b, chu2);
        st.append(box);
      }

      docLanLuot([
        { text: chu, lang: "en-GB" },
        d.tu ? { text: d.tu, lang: "en-GB" } : null,
        d.cau ? { text: d.cau.en, lang: "en-GB" } : null,
        d.cau && d.cau.vi ? { text: d.cau.vi, lang: "vi-VN" } : null,
      ].filter(Boolean));
    }

    /** Đổi toạ độ màn hình sang toạ độ trong khung vẽ. */
    function doiToa(ev) {
      const r = svg.getBoundingClientRect();
      return { x: ((ev.clientX - r.left) / r.width) * 100,
               y: ((ev.clientY - r.top) / r.height) * 120 };
    }

    let dangVe = false;
    svg.addEventListener("pointerdown", ev => {
      if (xong) return;
      ev.preventDefault();
      dangVe = true;
      try { svg.setPointerCapture(ev.pointerId); } catch { /* trình duyệt cũ */ }
      const t = doiToa(ev); toiDiem(t.x, t.y);
    });
    svg.addEventListener("pointermove", ev => {
      if (!dangVe || xong) return;
      const t = doiToa(ev); toiDiem(t.x, t.y);
    });
    const thoi = () => {
      dangVe = false;
      // Bỏ dở giữa nét thì trả nét đó về đầu, để tô lại cho liền mạch.
      if (!xong && iMoc > 0 && iMoc < moc.length) vaoNet(iNet);
    };
    svg.addEventListener("pointerup", thoi);
    svg.addEventListener("pointercancel", thoi);
    svg.addEventListener("pointerleave", thoi);

    // Cho biết ngay chữ này dùng làm gì, chứ không bắt tô xong mới được biết.
    if (d.tu) {
      const nhac = el("button", "to-tu"); nhac.type = "button";
      nhac.setAttribute("aria-label", "Nghe: " + d.tu);
      nhac.append(el("b", null, chu), el("span", null, "như trong"), el("em", null, d.tu));
      if (d.word && d.word.vi) nhac.append(el("small", null, d.word.vi));
      nhac.addEventListener("click", () => docLanLuot([
        { text: chu, lang: "en-GB" },
        { text: d.tu, lang: "en-GB" },
        d.word && d.word.vi ? { text: d.word.vi, lang: "vi-VN" } : null,
      ].filter(Boolean)));
      st.append(nhac);
    }

    const goi = el("p", "to-goi", "Đặt ngón tay lên chấm sáng rồi kéo theo nét.");
    st.append(goi);

    vaoNet(0);
    P.picked = null;
    setBtn("Kiểm tra", "btn-primary", false);
  },

  /* Ghép chữ cái thành từ: nhìn ảnh rồi bấm các chữ cái cho đúng thứ tự.
     Luyện đúng cái mà bài chọn đáp án không luyện được — nhớ mặt chữ. */
  ghepChu(d, st) {
    showMascot(false); setKicker("Nhìn ảnh, ghép thành từ");
    const tu = d.word.en;
    st.append(el("p", "ask", d.word.vi));

    const anh = anhChoTu(d.word);
    if (anh) st.append(anh);

    const chuCan = [...tu.toUpperCase()];
    const oTrong = [];
    const hang = el("div", "gc-hang");
    chuCan.forEach((c, i) => {
      if (c === " ") { hang.append(el("span", "gc-cach")); oTrong.push(null); return; }
      const o = el("button", "gc-o"); o.type = "button";
      o.dataset.vt = String(i);
      o.setAttribute("aria-label", "Ô chữ thứ " + (oTrong.filter(Boolean).length + 1));
      o.addEventListener("click", () => {
        if (P.answered || !o.dataset.chu) return;
        const v = bang.querySelector(`.gc-chu[data-id="${o.dataset.tuO}"]`);
        if (v) v.classList.remove("used");
        o.textContent = ""; delete o.dataset.chu; delete o.dataset.tuO;
        o.classList.remove("filled");
        soat();
      });
      oTrong.push(o); hang.append(o);
    });
    st.append(hang);

    // Chữ cái của từ, xáo lên, thêm vài chữ nhiễu cho khỏi đoán bừa.
    const nhieu = "ABCDEFGHIJKLMNOPRSTUVWY".split("");
    const themN = clamp(Math.round(chuCan.filter(c => c !== " ").length / 3), 2, 4);
    const kho = shuffle(
      chuCan.filter(c => c !== " ")
        .concat(sample(nhieu.filter(c => !tu.toUpperCase().includes(c)), themN))
    );

    const bang = el("div", "gc-bang");
    kho.forEach((c, i) => {
      const b = el("button", "gc-chu", c); b.type = "button";
      b.dataset.id = String(i);
      b.addEventListener("click", () => {
        if (P.answered || b.classList.contains("used")) return;
        const o = oTrong.find(x => x && !x.dataset.chu);
        if (!o) return;
        o.textContent = c; o.dataset.chu = c; o.dataset.tuO = b.dataset.id;
        o.classList.add("filled");
        b.classList.add("used");
        rung(6);
        soat();
      });
      bang.append(b);
    });
    st.append(bang);

    function soat() {
      const day = oTrong.filter(Boolean).every(o => o.dataset.chu);
      const ghep = chuCan.map((c, i) => {
        if (c === " ") return " ";
        const o = oTrong[i];
        return (o && o.dataset.chu) || "_";
      }).join("");
      P.picked = { ghep, ok: ghep === tu.toUpperCase() };
      setBtn("Kiểm tra", "btn-primary", day);
    }
    P.picked = null;
    setBtn("Kiểm tra", "btn-primary", false);
    docLanLuot([{ text: d.word.vi, lang: "vi-VN" }]);
  },

  /* Kéo thẻ ảnh vào đúng ô: mỗi ô mang một từ tiếng Anh, thẻ nào thuộc từ nào thì
     kéo vào ô đó. Thả sai thì ô lắc đầu và thẻ bật về — cùng luật với bài điền từ. */
  xepAnh(d, st) {
    showMascot(false); setKicker("Kéo ảnh vào đúng ô");
    st.append(el("p", "ask", "Mỗi ảnh thuộc về từ nào?"));

    const oCua = new Map();
    const hangO = el("div", "xa-o-hang");
    d.nhom.forEach(w => {
      const o = el("div", "xa-o");
      o.dataset.en = w.en;
      o.append(el("b", null, w.en), el("small", null, w.vi));
      const ro = el("div", "xa-ro");
      o.append(ro);
      oCua.set(w.en, ro);
      hangO.append(o);
    });
    st.append(hangO);

    const kho = el("div", "xa-kho");
    let conLai = d.the.length;

    d.the.forEach(w => {
      const t = el("button", "xa-the"); t.type = "button";
      t.dataset.en = w.en;
      // Phải dùng anhChoTu chứ không phải khungAnh: khungAnh chỉ nhận từ có ảnh
      // RIÊNG, còn phần lọc ở trên lại dò cảnh theo chữ — nên thẻ ra trống trơn.
      const anh = anhChoTu(w);
      if (anh) { anh.classList.add("nho"); t.append(anh); }
      ganKeoThe(t, w);
      // Bấm thường: bỏ vào ô đầu tiên còn hợp, cho người không kéo được.
      t.addEventListener("click", ev => {
        if (ev.detail !== 0) return;
        thuBo(t, w, oCua.get(w.en) || null);
      });
      kho.append(t);
    });
    st.append(kho);

    function thuBo(t, w, ro) {
      if (P.answered || !ro) return false;
      const dungO = ro.parentElement.dataset.en === w.en;
      if (!dungO) {
        const o = ro.parentElement;
        o.classList.remove("rung"); void o.offsetWidth; o.classList.add("rung");
        rung([10, 50, 10]);
        return false;
      }
      const anh = t.querySelector(".pic-hero");
      if (anh) ro.append(anh);
      t.classList.add("used");
      conLai -= 1;
      rung(12);
      P.picked = { ok: conLai === 0 };
      setBtn("Kiểm tra", "btn-primary", conLai === 0);
      if (conLai === 0) docLanLuot(d.nhom.map(x => ({ text: x.en, lang: "en-GB" })));
      return true;
    }

    function ganKeoThe(t, w) {
      t.addEventListener("pointerdown", ev => {
        if (P.answered || t.classList.contains("used")) return;
        ev.preventDefault();
        try { t.setPointerCapture(ev.pointerId); } catch { /* trình duyệt cũ */ }
        const r = t.getBoundingClientRect();
        const bay = t.cloneNode(true);
        bay.className = "xa-the xa-bay";
        bay.style.width = r.width + "px";
        bay.style.height = r.height + "px";
        document.body.append(bay);
        const lech = { x: ev.clientX - r.left, y: ev.clientY - r.top };
        let x = ev.clientX, y = ev.clientY;
        const ve = () => {
          bay.style.left = (x - lech.x) + "px";
          bay.style.top = (y - lech.y) + "px";
        };
        ve();
        t.classList.add("dang-keo");

        const oGan = () => {
          let tot = null, gan = Infinity;
          $$(".xa-o", hangO).forEach(o => {
            const b = o.getBoundingClientRect();
            if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) { tot = o; gan = 0; return; }
            const dd = Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2));
            if (dd < gan) { gan = dd; tot = o; }
          });
          return gan < 140 ? tot : null;
        };

        const dichuyen = e2 => {
          x = e2.clientX; y = e2.clientY; ve();
          const o = oGan();
          $$(".xa-o", hangO).forEach(n => n.classList.toggle("over", n === o));
        };
        const buong = () => {
          try { t.releasePointerCapture(ev.pointerId); } catch { /* đã nhả */ }
          window.removeEventListener("pointermove", dichuyen);
          window.removeEventListener("pointerup", buong);
          window.removeEventListener("pointercancel", buong);
          const o = oGan();
          $$(".xa-o", hangO).forEach(n => n.classList.remove("over"));
          t.classList.remove("dang-keo");
          const nhan = o ? thuBo(t, w, o.querySelector(".xa-ro")) : false;
          const dich = nhan ? o.getBoundingClientRect() : t.getBoundingClientRect();
          bay.classList.add("ve");
          bay.style.left = dich.left + "px";
          bay.style.top = dich.top + "px";
          if (nhan) bay.style.opacity = "0";
          setTimeout(() => bay.remove(), 220);
        };
        window.addEventListener("pointermove", dichuyen);
        window.addEventListener("pointerup", buong);
        window.addEventListener("pointercancel", buong);
      });
    }

    P.picked = null;
    setBtn("Kiểm tra", "btn-primary", false);
  },

  /* Nối từ. Bản cũ chỉ là hai cột nút trơ trọi: không biết cột nào là tiếng gì,
     nối xong rồi cũng không nhìn ra cặp nào đã nối với cặp nào, còn mấy cặp nữa
     cũng chịu. Nay: có nhãn hai cột, mỗi cặp nối đúng được đánh SỐ và TÔ CÙNG
     MỘT MÀU ở cả hai bên, có thanh đếm còn lại. */
  match(d, st) {
    showMascot(false); setKicker("Nối từ với nghĩa");
    const MAU_CAP = ["c1", "c2", "c3", "c4", "c5", "c6"];
    const hop = el("div", "match-hop");

    const dem = el("p", "match-dem");
    const veDem = (con) => {
      dem.textContent = con
        ? "Còn " + con + " cặp nữa" : "Xong rồi! Bấm Tiếp theo nhé.";
      dem.classList.toggle("het", !con);
    };

    const grid = el("div", "match");
    const cotA = el("div", "match-cot"), cotB = el("div", "match-cot");
    cotA.append(el("span", "match-nhan", "Tiếng Anh"));
    cotB.append(el("span", "match-nhan", "Nghĩa tiếng Việt"));
    const colA = el("div", "opts"), colB = el("div", "opts");
    cotA.append(colA); cotB.append(colB);

    let sel = null, left = d.pairs.length, missed = 0, soCap = 0;
    const clear = () => $$(".opt", grid).forEach(n => n.classList.remove("sel"));

    const cell = (w, label, side) => {
      const b = el("button", "opt match-o"); b.type = "button";
      const so = el("i", "match-so");                 // số thứ tự cặp, hiện khi nối đúng
      b.append(so, el("span", null, label));
      b.addEventListener("click", () => {
        if (P.answered || b.classList.contains("done")) return;
        if (side === "a") speak(w.en);
        if (!sel) { clear(); b.classList.add("sel"); sel = { w, side, node: b }; return; }
        if (sel.node === b) { b.classList.remove("sel"); sel = null; return; }
        if (sel.side === side) { clear(); b.classList.add("sel"); sel = { w, side, node: b }; return; }
        if (sel.w.en === w.en) {
          const mau = MAU_CAP[soCap % MAU_CAP.length];
          soCap += 1;
          [sel.node, b].forEach(n => {
            n.classList.remove("sel");
            n.classList.add("ok", "done", mau);
            const s = $(".match-so", n);
            if (s) s.textContent = soCap;
          });
          srsUpdate(w.en, true);
          left -= 1; veDem(left);
          if (!left) { P.picked = { ok: missed === 0 }; setBtn("Tiếp theo", "btn-ok", true); }
        } else {
          missed++; srsUpdate(w.en, false);
          const a = sel.node;
          [a, b].forEach(n => n.classList.add("bad"));
          setTimeout(() => [a, b].forEach(n => n.classList.remove("bad", "sel")), 460);
        }
        sel = null;
      });
      return b;
    };

    shuffle(d.pairs).forEach(w => colA.append(cell(w, w.en, "a")));
    shuffle(d.pairs).forEach(w => colB.append(cell(w, w.vi, "b")));
    grid.append(cotA, cotB);
    veDem(left);
    hop.append(dem, grid);
    st.append(hop);
  },

  type(d, st) {
    showMascot(true); setKicker("Viết bằng tiếng Anh");
    st.append(cauHoiNgheDuoc(d.word.vi, "vi-VN"));
    const box = el("textarea", "type-in"); box.rows = 2;
    box.setAttribute("aria-label", "Nhập từ tiếng Anh cho: " + d.word.vi);
    box.autocapitalize = "off"; box.autocomplete = "off"; box.spellcheck = false;
    box.addEventListener("input", () => {
      P.picked = { built: box.value, ok: norm(box.value) === norm(d.word.en) };
      setBtn("Kiểm tra", "btn-primary", box.value.trim().length > 0);
    });
    st.append(box);
    setTimeout(() => box.focus(), 150);
  }
};

/** Câu hỏi bằng tiếng Việt, chạm vào là nghe. Trước đây chỉ có chữ để nhìn. */
function cauHoiNgheDuoc(hienThi, lang, docText) {
  const b = el("button", "ask ask-nghe"); b.type = "button";
  b.setAttribute("aria-label", "Nghe lại: " + (docText || hienThi));
  b.append(el("span", null, hienThi));
  b.append(icon("i-sound", "ic ic-sm"));
  b.addEventListener("click", () => speak(docText || hienThi, false, lang));
  return b;
}

function optList(opts, label, rightEn) {
  const list = el("div", "opts");
  opts.forEach((w, i) => {
    const b = el("button", "opt"); b.type = "button"; b.dataset.en = w.en;
    b.append(el("span", "opt-key", String(i + 1)), el("span", null, label(w)));
    b.addEventListener("click", () => {
      if (P.answered) return;
      $$(".opt", list).forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      P.picked = { node: b, ok: w.en === rightEn };
      setBtn("Kiểm tra", "btn-primary", true);
    });
    list.append(b);
  });
  return list;
}

/* ---------- 11. Gợi ý ---------- */
$("#btnHint").addEventListener("click", () => {
  const s = P.cur;
  if (!s || s.phase !== "drill" || P.answered) return;
  if (P.hintUsed) return toast("Bài này đã dùng gợi ý rồi.");
  P.hintUsed = true;
  const d = s.d, st = $("#stage");
  if (d.type === "type") return toast(`Bắt đầu bằng “${d.word.en.slice(0, 2)}…”`);
  if (d.type === "blanks") return toast(`Từ đầu tiên bắt đầu bằng “${d.answers[0].slice(0, 1)}”`);
  if (d.type === "truefalse") return toast("Đối chiếu lại nghĩa của từ trong phần Từ vựng nhé.");
  if (d.type === "match") return toast("Bắt đầu từ cặp bạn chắc chắn nhất.");
  const right = d.word.en;
  const wrong = $$(".opt:not(.done), .pic", st).filter(n => n.dataset.en !== right && !n.classList.contains("done"));
  if (wrong.length) { wrong[0].classList.add("done"); toast("Đã loại bớt một đáp án sai."); }
});

/* ---------- 12. Chấm bài ---------- */
/** Tô xanh đáp án đúng trên các ô đang hiện. Dùng cho cả lúc chấm sai lẫn lúc
    bấm quay lại xem lại câu cũ, nên tách riêng ra một chỗ. */
function danhDauDung(d, st) {
  if (d.type === "choice" || d.type === "reverse" || d.type === "listen")
    $$(".opt", st).forEach(n => { if (n.dataset.en === d.word.en) n.classList.add("ok"); });
  if (d.type === "picture")
    $$(".pic", st).forEach(n => { if (n.dataset.en === d.word.en) n.classList.add("ok"); });
  if (d.type === "truefalse")
    $$(".tf button", st).forEach(n => { if ((n.dataset.val === "true") === d.answer) n.classList.add("ok"); });
}

function nextPressed() {
  const s = P.cur;
  if (s.phase === "learn" || P.answered) return advance();
  if (!P.picked) return;
  const d = s.d;
  if (d.type === "match") { P.answered = true; return advance(); }

  P.answered = true; P.attempts++;
  P.correct = !!P.picked.ok;
  const st = $("#stage");
  // Chấm xong mới cho hiện chữ tiếng Anh dưới các ô ảnh — để học, chứ không
  // phải để dò đáp án.
  st.classList.add("da-cham");

  if (d.type === "ghepChu") {
    const dung = [...d.word.en.toUpperCase()];
    $$(".gc-o", st).forEach(o => {
      const i = +o.dataset.vt;
      o.classList.add(o.dataset.chu === dung[i] ? "ok" : "bad");
    });
  } else if (d.type === "blanks") {
    P.picked.slots.forEach((sl, k) => sl.classList.add(norm(sl.dataset.word || "") === norm(d.answers[k]) ? "ok" : "bad"));
  } else if (P.picked.node) {
    P.picked.node.classList.add(P.correct ? "ok" : "bad");
  }
  if (!P.correct) danhDauDung(d, st);
  if (d.word) srsUpdate(d.word.en, P.correct);
  // Ghi lại là câu này đã chấm rồi, để bấm nút quay lại còn biết đường hiện ra
  // ở dạng XEM LẠI chứ không bắt làm lại (làm lại thì tim và điểm tính hai lần).
  s.daCham = true; s.daDung = P.correct;

  // Đọc đáp án bằng đúng giọng của từng thứ tiếng, dùng chung cho cả đúng lẫn sai.
  const khucDoc = d.word
    ? [{ text: d.word.en, lang: "en-GB" }, { text: d.word.vi, lang: "vi-VN" }]
    : (d.sent ? [{ text: d.sent.en, lang: "en-GB" }, { text: d.sent.vi, lang: "vi-VN" }] : []);

  if (P.correct) {
    docLanLuot(khucDoc);
    feedback(true, praise(), d.word ? `${d.word.en} — ${d.word.vi}` : (d.sent ? d.sent.en : ""), khucDoc);
    if (P.laThi) P.laThi.dung += 1;
    // Câu nào đúng cũng kêu một tiếng khen ngắn. Đủ 3 câu mới mở trang thưởng
    // pháo bông, nhưng hai câu trước đó cũng phải có cái gì đó cho biết là đúng.
    keuVui();
    stkDung += 1;
  } else {
    P.wrong++;
    // Sai thì chỉ kêu một tiếng tiếc thôi. Trước có hiện ảnh nhân vật buồn,
    // nhưng nó nổi giữa màn che mất các ô chữ, không làm bài được — thầy bảo bỏ.
    keuTiec();
    rung(60);
    // Đang thi thì không trừ tim: hết tim giữa đề là phải bỏ dở, vô lý.
    if (!P.laThi) S.hearts = clamp(S.hearts - 1, 0, TIM_TOI_DA);
    // Vừa sứt quả đầu từ lúc đầy thì mới bắt đầu tính giờ hồi.
    if (S.hearts === TIM_TOI_DA - 1) S.heartAt = Date.now();
    save(); paintHearts();
    const h = $("#pHearts"); h.classList.add("hit"); setTimeout(() => h.classList.remove("hit"), 400);
    // Sai thì càng phải nghe: đọc đáp án ngay chứ không chỉ hiện chữ.
    docLanLuot(khucDoc);
    feedback(false, "Chưa đúng", "Đáp án: " + answerOf(d), khucDoc);
    // Bài học thì cho gặp lại câu sai để nhớ; đề thi thì không, sai là sai.
    // Đẩy BẢN SAO chứ không đẩy chính nó: đẩy chính nó thì lần gặp lại cũng
    // mang cờ "đã chấm", hoá ra chỉ xem lại đáp án chứ không được làm lại.
    if (!P.laThi) P.slides.push({ ...s, daCham: false, daDung: false });
  }
  setBtn("Tiếp theo", P.correct ? "btn-ok" : "btn-danger", true);
}
/* ---------- Tiếng khen / tiếng tiếc ----------
   Tự sinh bằng WebAudio chứ không tải file nhạc: nhẹ tuyệt đối, không có mạng
   vẫn kêu. Máy bật "giảm chuyển động" không được xem hiệu ứng nổ thì càng cần
   nghe thấy, nên tiếng vẫn kêu bình thường ở mọi máy. */
let acx = null;
function boTiengs() {
  if (acx) return acx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { acx = new AC(); } catch { return null; }
  return acx;
}

/* Bộ tiếng vừa tạo ra là đang NGỦ (suspended) — trình duyệt nào cũng vậy, phải
   có cú chạm của người dùng mới đánh thức được. Trước đây gọi resume() rồi hẹn
   nốt ngay, mà resume() chưa chạy xong nên currentTime vẫn đứng yên: các nốt bị
   hẹn vào mốc ĐÃ TRÔI QUA và không kêu gì cả. Nay đánh thức ngay từ cú chạm
   ĐẦU TIÊN vào màn hình, tới lúc cần kêu thì nó chạy sẵn rồi. */
let tiengDaThuc = false;
/** Mồi một thẻ tiếng ngay trong cú chạm hiện tại: phát câm rồi tắt luôn.
    Gọi lại được nhiều lần, không hại gì — mà lại cứu được trường hợp lần mồi
    đầu tiên bị máy từ chối, vì trước đây hỏng lần đó là câm cả buổi. */
function moiTheTieng(id) {
  try {
    const e = document.getElementById(id);
    if (!e || !e.paused) return;
    e.muted = true;
    const p = e.play();
    const tat = () => { e.pause(); e.currentTime = 0; e.muted = false; };
    p && p.then ? p.then(tat).catch(() => { e.muted = false; }) : tat();
  } catch { /* thôi vậy */ }
}

function danhThucTieng() {
  if (tiengDaThuc) return;
  const a = boTiengs();
  if (!a) return;
  tiengDaThuc = true;
  a.resume().catch(() => {});
  // Phát một mẩu im lặng: vài trình duyệt chỉ chịu mở loa sau khi đã thực sự
  // phát ra cái gì đó trong đúng cú chạm của người dùng.
  try {
    const b = a.createBuffer(1, 1, a.sampleRate);
    const src = a.createBufferSource();
    src.buffer = b; src.connect(a.destination); src.start(0);
  } catch { /* máy không cho thì thôi */ }
  // Mồi luôn thẻ <audio>: phát rồi tắt ngay trong đúng cú chạm này, để lần sau
  // gọi play() máy không chặn nữa. iPhone chỉ cho phát tiếng nếu đã được mồi
  // trong một cú chạm thật của người dùng.
  // Mồi MỌI thẻ tiếng của app, không riêng thẻ thưởng: thẻ nào không được mồi
  // trong đúng cú chạm này thì về sau gọi play() sẽ bị iPhone chặn.
  ["amThuong", "amVoTay", "amKaka", "amDoc"].forEach(moiTheTieng);
}
["pointerdown", "touchstart", "keydown"].forEach(ev =>
  window.addEventListener(ev, danhThucTieng, { once: false, passive: true }));

/** Chắc chắn bộ tiếng đã dậy rồi mới trả về, để nốt không bị hẹn vào quá khứ. */
function tiengSanSang() {
  const a = boTiengs();
  if (!a) return null;
  if (a.state === "suspended") {
    a.resume().catch(() => {});
    // Vẫn chưa dậy kịp thì bỏ lượt này, còn hơn hẹn bừa rồi im ru.
    if (a.state === "suspended") return null;
  }
  return a;
}

/* Mọi tiếng đều đi qua MỘT đường chung rồi mới ra loa: to nhỏ chỉnh một chỗ,
   và có bộ nén chặn ở cuối nên nhiều tiếng chồng lên nhau cũng không vỡ.
   Nối thẳng ra loa như trước thì mỗi chỗ một mức, đo ra tiếng quá nhỏ. */
let busTieng = null;
function ra(a) {
  if (busTieng && busTieng.context === a) return busTieng;
  const to = a.createGain();
  to.gain.value = 5;                    // đo được đỉnh ~0.11, nhân 5 thành ~0.55
  const nen = a.createDynamicsCompressor();
  nen.threshold.value = -8; nen.knee.value = 6; nen.ratio.value = 9;
  nen.attack.value = .003; nen.release.value = .2;
  to.connect(nen); nen.connect(a.destination);
  busTieng = to;
  return to;
}

/** Chơi một chuỗi nốt. not = [[tần số Hz, giây bắt đầu, giây ngân]] */
function chuoiNot(nots, kieu = "triangle", to = .16) {
  if (!S.sound) return;
  const a = tiengSanSang();
  if (!a) return;
  const t0 = a.currentTime + .01;
  nots.forEach(([hz, batDau, ngan]) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = kieu; o.frequency.value = hz;
    // Lên xuống mượt, không cắt cụt — cắt đột ngột nghe thành tiếng "bụp".
    g.gain.setValueAtTime(0, t0 + batDau);
    g.gain.linearRampToValueAtTime(to, t0 + batDau + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + batDau + ngan);
    o.connect(g); g.connect(ra(a));
    o.start(t0 + batDau); o.stop(t0 + batDau + ngan + .02);
  });
}

/** Một tiếng vỗ tay: nhiễu trắng tắt rất nhanh, lọc cho nghe ra tiếng "bốp"
    của bàn tay chứ không phải tiếng xì. */
function motTiengVo(a, t, to) {
  const n = Math.floor(a.sampleRate * .09);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5);
  const src = a.createBufferSource(); src.buffer = buf;
  const bp = a.createBiquadFilter(); bp.type = "bandpass";
  bp.frequency.value = 1200 + Math.random() * 900; bp.Q.value = .9;
  const g = a.createGain(); g.gain.value = to;
  src.connect(bp); bp.connect(g); g.connect(ra(a));
  src.start(t);
}

/** Cả tràng vỗ tay: rải khoảng 40 tiếng lệch nhau lộn xộn trong 1,6 giây —
    đều tăm tắp thì nghe như máy gõ, phải lệch mới ra đám đông. */
function tiengVoTay(a, t0) {
  for (let i = 0; i < 42; i++) {
    const t = t0 + .04 + Math.random() * 1.55;
    motTiengVo(a, t, .028 + Math.random() * .05);
  }
}

/** Kèn chúc mừng: bốn nốt đi lên rồi giữ một hợp âm. Đây là phần làm nên
    cảm giác "được trao thưởng". */
function tiengKen(a, t0) {
  const len = [523.3, 659.3, 784, 1046.5];
  len.forEach((hz, i) => {
    // Hai bộ dao động lệch nhau vài Hz cho tiếng dày lên, nghe như kèn thật
    // chứ không mỏng như tiếng máy tính.
    [0, 3].forEach(lech => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = "sawtooth"; o.frequency.value = hz + lech;
      const t = t0 + i * .1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.055, t + .03);
      g.gain.exponentialRampToValueAtTime(.0001, t + .34);
      const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
      o.connect(lp); lp.connect(g); g.connect(ra(a));
      o.start(t); o.stop(t + .36);
    });
  });
  // Hợp âm giữ cuối câu kèn
  [523.3, 659.3, 784].forEach(hz => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = "triangle"; o.frequency.value = hz;
    const t = t0 + .42;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.05, t + .04);
    g.gain.exponentialRampToValueAtTime(.0001, t + .9);
    o.connect(g); g.connect(ra(a));
    o.start(t); o.stop(t + .92);
  });
}

/** Tiếng lấp lánh rải rác cho có không khí hội hè. */
function tiengLapLanh(a, t0) {
  for (let i = 0; i < 9; i++) {
    const o = a.createOscillator(), g = a.createGain();
    o.type = "sine";
    o.frequency.value = 1500 + Math.random() * 1400;
    const t = t0 + .3 + Math.random() * 1.3;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.05, t + .015);
    g.gain.exponentialRampToValueAtTime(.0001, t + .22);
    o.connect(g); g.connect(ra(a));
    o.start(t); o.stop(t + .24);
  }
}

/* Tiếng trao thưởng ƯU TIÊN phát từ FILE assets/thuong.mp3 qua thẻ <audio>.
   Đường này không dính lỗi lịch hẹn của WebAudio (bộ tiếng đang ngủ thì nốt bị
   hẹn vào quá khứ nên im ru), lại dễ kiểm tra hơn nhiều. File hỏng hoặc máy
   chặn thì mới rơi về tiếng tự tổng hợp. */
let dangPhatFile = false;      // file nhạc đã có sẵn tiếng pháo nổ trong đó
function phatFileThuong() {
  if (!S.sound) return false;
  const el2 = $("#amThuong");
  if (!el2) return false;
  // Tới đây giọng đọc đã dứt hẳn rồi (xem doiDocXong). KHÔNG cắt ngang nữa:
  // thầy chỉ ra rằng phải để đọc xong thì âm mới lên — cắt ngang thì iPhone
  // vẫn còn giữ phiên âm thanh một lúc, thẻ <audio> chạy mà không ra tiếng.
  try {
    el2.currentTime = 0;
    const p = el2.play();
    dangPhatFile = true;
    // Máy chặn lần này thì lần này dùng tiếng tổng hợp — KHÔNG đánh dấu hỏng
    // vĩnh viễn như trước, vì chỉ cần một lần vướng là mất file cả buổi học.
    if (p && p.catch) p.catch(() => { dangPhatFile = false; keuThuong(); });
    return true;
  } catch { return false; }
}

/** Cúp cuối bài, theo % đúng: 80%+ Vàng, 60-79% Bạc, dưới 60% Đồng. Vàng thì
    nổ cả kèn + vỗ tay + lấp lánh (keuThuong), Bạc/Đồng chỉ vỗ tay động viên —
    không thổi kèn ầm ĩ cho một kết quả chưa tốt. */
function veCup(acc) {
  const el = $("#resTrophy");
  if (!el) return;
  const hang = acc >= 80 ? "vang" : acc >= 60 ? "bac" : "dong";
  const ten = hang === "vang" ? "Cúp Vàng" : hang === "bac" ? "Cúp Bạc" : "Cúp Đồng";
  el.hidden = false;
  el.className = "res-cup " + hang;
  $("#resCupTen").textContent = ten;
  $("#result").classList.add("co-cup");
  phatVoTay();
  // Vàng mới thổi kèn; Bạc/Đồng chỉ vỗ tay động viên, không ầm ĩ cho một kết
  // quả chưa tốt.
  if (hang === "vang" && S.sound) {
    const a = tiengSanSang();
    if (a) { const t0 = a.currentTime + .18; tiengKen(a, t0); tiengLapLanh(a, t0); }
  }
}

/** Tiếng vỗ tay hoan nghênh. Phát từ FILE cho ra tiếng người vỗ thật; máy chặn
    hoặc file hỏng thì mới rơi về tiếng tự tổng hợp. */
function phatVoTay() {
  if (!S.sound) return;
  const el2 = $("#amVoTay");
  const duPhong = () => { const a = tiengSanSang(); if (a) tiengVoTay(a, a.currentTime + .02); };
  if (!el2) { duPhong(); return; }
  try {
    el2.currentTime = 0;
    const p = el2.play();
    if (p && p.catch) p.catch(duPhong);
  } catch { duPhong(); }
}

/** Cả màn trao thưởng: kèn + vỗ tay + lấp lánh chồng lên nhau. Gọi đúng lúc
    ảnh hiện ra, để tiếng và hình cùng nổ một lượt. */
function keuThuong() {
  if (!S.sound) return;
  const a = tiengSanSang();
  if (!a) return;
  const t0 = a.currentTime + .02;
  tiengKen(a, t0);
  tiengVoTay(a, t0);
  tiengLapLanh(a, t0);
}

/** Tiếng pháo nổ "độp": một cú bụp trầm rồi tiếng lẹt xẹt tắt dần. Dùng nhiễu
    trắng chứ nốt nhạc không ra tiếng nổ được. */
function keuNo(tre = 0) {
  if (!S.sound) return;
  const a = tiengSanSang();
  if (!a) return;
  const t = a.currentTime + .01 + tre;
  // Cú bụp: nốt trầm tụt nhanh xuống.
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(46, t + .16);
  g.gain.setValueAtTime(.14, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .2);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .22);
  // Lẹt xẹt: nhiễu trắng tắt dần, cho ra tiếng tàn pháo.
  const n = Math.floor(a.sampleRate * .3);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6);
  const src = a.createBufferSource(); src.buffer = buf;
  const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1900; bp.Q.value = .7;
  const gn = a.createGain(); gn.gain.value = .07;
  src.connect(bp); bp.connect(gn); gn.connect(ra(a));
  src.start(t + .02);
}

/** Đúng: ba nốt đi lên, nghe là biết được khen. */
const keuVui = () => chuoiNot([[523.3, 0, .16], [659.3, .09, .16], [784, .18, .30]], "triangle", .05);
/** Sai: hai nốt đi xuống, nhẹ thôi — tiếc chứ không phải mắng. */
const keuTiec = () => chuoiNot([[392, 0, .20], [294.7, .13, .34]], "sine", .045);

/* Tiếng bấm nút: một cái "tách" rất ngắn. Trước đây bấm nút chẳng có tiếng gì,
   trên điện thoại không biết máy đã ăn cú chạm hay chưa. Phải THẬT ngắn và nhỏ —
   nút bấm cả trăm lần một buổi, tiếng dài một chút là thành phiền ngay. */
function keuCham(nang) {
  if (!S.sound) return;
  const a = tiengSanSang();
  if (!a) return;
  const t = a.currentTime + .005;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  // Nút chính kêu trầm và chắc hơn nút phụ, tai nghe ra được đã bấm cái gì.
  o.frequency.setValueAtTime(nang ? 880 : 1180, t);
  o.frequency.exponentialRampToValueAtTime(nang ? 520 : 760, t + .045);
  g.gain.setValueAtTime(nang ? .075 : .045, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .055);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .07);
}

/* Bắt CHUNG cho cả app: nút nào cũng kêu, khỏi phải nhớ gắn tay nghe từng chỗ.
   Nghe ở pointerdown chứ không phải click — tiếng phải ra ngay lúc ngón tay
   chạm xuống thì mới thấy nút "ăn", chờ đến click là đã trễ một nhịp. */
document.addEventListener("pointerdown", e => {
  const o = e.target;
  if (!o || !o.closest) return;
  const n = o.closest("button, .opt, .pic, .tf button, .fcard, .lienket-nut, [role='button']");
  if (!n || n.disabled || n.dataset.imLang === "1") return;
  // TRỪ màn gọi bà phù thuỷ. Tiếng ở màn đó phải mồi đúng ngay trong cú chạm,
  // đụng vào là có ngày cả cuộc gọi im ru — thầy dặn giữ nguyên phần ấy.
  if (n.closest("#kakaView")) return;
  keuCham(n.classList.contains("btn-primary") || n.classList.contains("p-next"));
}, { passive: true, capture: true });

/* ---------- Sticker ăn mừng ----------
   Cứ 2 câu đúng thì bắn ra một sticker nổ tung toé. Ảnh để 224px, nén webp
   khoảng 10KB mỗi cái — bật lên phải nhẹ, không được làm khựng máy yếu.
   Đếm theo TỔNG số câu đúng trong bài chứ không phải đúng liên tiếp: sai một
   câu mà mất luôn phần thưởng đang dồn thì nản. */
const STK_SO = 17;                // assets/sticker/s1..s17.webp
const STK_MOI = 3;                // cứ 3 câu đúng thì mở trang thưởng
let stkDung = 0;                  // đã đúng bao nhiêu câu (trong lượt học này)
let stkDo = [];                   // rổ ảnh thưởng đã trộn, bốc hết mới trộn lại

/** Bốc sticker sao cho không lặp lại liên tiếp cùng một cái. */
function stkTiep() {
  if (!stkDo.length) stkDo = shuffle([...Array(STK_SO).keys()].map(i => i + 1));
  return stkDo.pop();
}

/* ==================== KIỂM TRA XẾP TRÌNH ĐỘ ====================
   Trước đây người học tự bấm chọn A1/A2/B1. Ai cũng chọn theo cảm tính nên
   nhiều người học bài quá dễ (chán) hoặc quá khó (nản rồi bỏ). Màn này đo
   thật: mỗi bậc 5 câu, xếp vào bậc ĐẦU TIÊN mà người học chưa vững, vì đó mới
   là chỗ cần học chứ không phải chỗ đã biết rồi. */
const XEP_MOI_BAC = 5;                 // số câu mỗi bậc
const XEP_DAT = 0.6;                   // đúng từ 60% của một bậc coi như vững
const XEP_BAC = ["a1", "a2", "b1"];
let XEP = null;

function tenBac(id) {
  const lv = COURSE.levels.find(l => l.id === id);
  return lv ? lv.name : id.toUpperCase();
}

/** Dựng đề: mỗi bậc XEP_MOI_BAC câu, mồi nhiễu lấy trong CÙNG bậc cho công bằng. */
function taoDeXep() {
  const cau = [];
  XEP_BAC.forEach(id => {
    const kho = ALL_WORDS.filter(w => (w.cefr || "").toLowerCase() === id && w.en && w.vi);
    if (kho.length < 4) return;
    sample(kho, XEP_MOI_BAC).forEach(w => {
      const nhieu = sample(kho.filter(x => x.en !== w.en), 3);
      if (nhieu.length < 3) return;
      cau.push({ bac: id, w, opts: shuffle([w, ...nhieu]) });
    });
  });
  return cau;
}

function moXep() {
  XEP = { cau: taoDeXep(), i: 0, dung: { a1: 0, a2: 0, b1: 0 }, tong: { a1: 0, a2: 0, b1: 0 } };
  XEP.cau.forEach(c => { XEP.tong[c.bac] += 1; });
  $("#xepMo").hidden = false;
  $("#xepCau").hidden = true;
  $("#xepXong").hidden = true;
  $("#xepThanh").hidden = true;
  $("#xepDem").hidden = true;
  $("#xepView").hidden = false;
  document.body.style.overflow = "hidden";
}

function dongXep() {
  $("#xepView").hidden = true;
  document.body.style.overflow = "";
}

function veCauXep() {
  const c = XEP.cau[XEP.i];
  if (!c) return xongXep();
  $("#xepMo").hidden = true;
  $("#xepXong").hidden = true;
  $("#xepCau").hidden = false;
  $("#xepThanh").hidden = false;
  $("#xepDem").hidden = false;
  $("#xepThanhIn").style.width = Math.round((XEP.i / XEP.cau.length) * 100) + "%";
  $("#xepDem").textContent = (XEP.i + 1) + "/" + XEP.cau.length;
  $("#xepHoi").textContent = c.w.vi;
  const hop = $("#xepDap");
  hop.textContent = "";
  c.opts.forEach(o => {
    const b = el("button", null, o.en);
    b.type = "button";
    b.addEventListener("click", () => {
      if (o.en === c.w.en) XEP.dung[c.bac] += 1;
      XEP.i += 1;
      veCauXep();
    }, { once: true });
    hop.append(b);
  });
}

function xongXep() {
  const ti = id => (XEP.tong[id] ? XEP.dung[id] / XEP.tong[id] : 0);
  // Bậc đầu tiên chưa vững chính là bậc nên học. Vững hết thì học bậc cao nhất.
  const nen = XEP_BAC.find(id => ti(id) < XEP_DAT) || XEP_BAC[XEP_BAC.length - 1];
  XEP.nen = nen;
  $("#xepCau").hidden = true;
  $("#xepThanh").hidden = true;
  $("#xepDem").hidden = true;
  $("#xepXong").hidden = false;

  const cup = $("#xepCup");
  cup.className = "xep-cup " + nen;
  cup.innerHTML = "";
  cup.append(svgUse("i-bac" + (XEP_BAC.indexOf(nen) + 1), "0 0 24 24"));
  $("#xepMa").textContent = (NHAN_BAC[nen] || {}).cefr || nen.toUpperCase();
  $("#xepTen").textContent = tenBac(nen) + " · " + ((NHAN_BAC[nen] || {}).lop || "");

  const bang = $("#xepBang");
  bang.textContent = "";
  XEP_BAC.forEach(id => {
    const d = el("div", "xep-dong");
    const thanh = el("div", "bar");
    const trong = el("i");
    trong.style.width = Math.round(ti(id) * 100) + "%";
    thanh.append(trong);
    d.append(el("b", null, (NHAN_BAC[id] || {}).cefr || id.toUpperCase()), thanh,
             el("small", null, XEP.dung[id] + "/" + XEP.tong[id]));
    bang.append(d);
  });
  $("#xepNote").textContent = nen === XEP_BAC[0]
    ? "Bắt đầu từ gốc cho chắc, lên nhanh lắm."
    : ti(nen) < XEP_DAT && XEP_BAC.indexOf(nen) > 0
      ? "Phần dưới bạn nắm rồi, vào thẳng đây cho đỡ mất thời gian."
      : "Bạn nắm khá vững, học tiếp ở mức này nhé.";
}

$("#btnXepDong").addEventListener("click", dongXep);
$("#btnXepBatDau").addEventListener("click", () => { XEP.i = 0; veCauXep(); });
$("#btnXepLam").addEventListener("click", moXep);
$("#btnXepNhan").addEventListener("click", () => {
  S.level = XEP.nen;
  S.daXep = XEP.nen;                   // đã đo rồi thì thôi mời nữa
  save();
  dongXep();
  paintStats();
  go("learn");
  toast("Đã xếp bạn vào " + ((NHAN_BAC[XEP.nen] || {}).cefr || "") + " — " + tenBac(XEP.nen));
});

/* ==================== GỌI BÀ PHÙ THUỶ KAKA ====================
   Kho tiếng THẬT của bà phù thuỷ: 58 tên bé gọi đích danh + 40 đoạn theo
   tình huống không nêu tên.
   Thầy dặn: tên MỚI chưa có trong kho thì VẪN phải ra tiếng và đúng giọng
   mẫu. Nên tên nào có sẵn thì gọi đích danh, tên mới thì lấy đoạn tình
   huống chung — vẫn nguyên giọng thật của bà, chỉ không đọc tên, bù lại
   tên con hiện to trên màn hình.
   Kho KHÔNG nạp sẵn lúc mở app: 32MB mà tải hết thì ai cũng phải chờ. Chỉ
   tải bảng tra (vài KB) khi bấm vào, rồi tải đúng một đoạn tiếng đang cần. */
const KAKA_THU = "assets/kaka/";
let kakaKho = null;          // bảng tra, tải một lần rồi giữ
let kakaAm = null;           // thẻ tiếng đang phát
let kakaVideoXong = false;

/** Bỏ dấu, thường hoá — để "BÍN", "bin", "Bin" tra ra cùng một chỗ. */
function khongDau(s) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function napKhoKaka() {
  if (kakaKho) return kakaKho;
  try {
    const r = await fetch(KAKA_THU + "kho.json");
    kakaKho = await r.json();
  } catch { kakaKho = { ten: {}, chung: [] }; }
  return kakaKho;
}

/** Hai đoạn video của bà: nói và ngồi chờ. Nạp muộn, chỉ khi mở màn này. */
function napVideoKaka() {
  if (kakaVideoXong) return;
  kakaVideoXong = true;
  [["#kakaVidNoi", "kaka-noi.mp4"], ["#kakaVidCho", "kaka-cho.mp4"]].forEach(([id, f]) => {
    const v = $(id);
    if (!v) return;
    // Đặt bằng JS chứ không chỉ dựa vào thuộc tính trong HTML: có máy bỏ qua
    // thuộc tính, mà video không tắt tiếng thì trình duyệt CHẶN tự chạy.
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.src = KAKA_THU + f;
    v.load();
  });
}

function kakaHienVideo(dangNoi) {
  const n = $("#kakaVidNoi"), c = $("#kakaVidCho");
  if (!n || !c) return;
  const bat = dangNoi ? n : c, tat = dangNoi ? c : n;
  tat.hidden = true; try { tat.pause(); } catch {}
  bat.hidden = false;
  bat.muted = true;                       // nhắc lại cho chắc, kẻo bị chặn
  const chay = () => bat.play().catch(() => {});
  chay();
  // Máy chậm thì lần gọi đầu rơi vào lúc video chưa sẵn sàng, thử lại một nhịp.
  setTimeout(() => { if (bat.paused && !bat.hidden) chay(); }, 300);
}

let kakaViecChon = "";
let kakaDaDay = false;          // đã chèn một nấc lịch sử cho màn này chưa
let kakaPhatLai = null;         // phát lại đúng chuỗi tiếng của lần gọi vừa rồi
async function moKaka() {
  const v = $("#kakaView");
  if (!v) return;
  danhThucTieng();
  // Mồi lại thẻ tiếng Kaka NGAY trong cú chạm mở màn này. danhThucTieng() chỉ
  // chạy đúng một lần cả buổi, nên nếu lần đó máy từ chối thì thẻ vẫn khoá.
  moiTheTieng("amKaka");
  // Chèn một nấc lịch sử để nút Back của máy đóng màn này, không thoát app.
  if (!kakaDaDay) { try { history.pushState({ kaka: 1 }, ""); kakaDaDay = true; } catch { /* thôi */ } }
  const kho = await napKhoKaka();

  // Dựng danh sách tình huống từ chính kho tiếng, không viết cứng trong code
  const hop = $("#kakaChips");
  if (hop && !hop.childElementCount) {
    const ds = [...new Set(kho.chung.map(x => x.tinh_huong).filter(t => t && t !== "chung"))];
    ds.sort((a, b) => a.localeCompare(b, "vi"));
    kakaViecChon = ds[0] || "";
    ds.forEach((t, i) => {
      const b = el("button", "chip" + (i === 0 ? " on" : ""), t);
      b.type = "button";
      b.addEventListener("click", () => {
        $$(".chip", hop).forEach(x => x.classList.remove("on"));
        b.classList.add("on"); kakaViecChon = t;
      });
      hop.append(b);
    });
  }

  // Gợi ý sẵn tên người học nếu đã đặt
  const o = $("#kakaTen");
  if (o && !o.value && S.ten) o.value = S.ten;
  goiYKaka();

  $("#kakaForm").hidden = false;
  $("#kakaDangGoi").hidden = true;
  v.hidden = false;
  document.body.style.overflow = "hidden";
  napVideoKaka();
  kakaHienVideo(false);
}

/* ---- Tra tên: khớp thẳng, rồi mới tới mấy cách viết khác của cùng một tên ----
   "Tý" và "Tí", "Bíu" và "Biu", "Kem" và "Ken" là hai cách viết quen thuộc của
   cùng một tên gọi ở nhà. Chỉ gom mấy chỗ chắc chắn, KHÔNG gom bừa: gọi nhầm tên
   con còn tệ hơn là không gọi tên. */
function bienTheTen(k) {
  const ra = new Set([k]);
  ra.add(k.replace(/y/g, "i"));
  ra.add(k.replace(/i/g, "y"));
  ra.add(k.replace(/(.)\1+/g, "$1"));      // "bii" → "bi"
  ra.add(k.replace(/^be-/, ""));           // "be-bi" → "bi"
  return [...ra].filter(Boolean);
}

/** Khoá tra ĐÚNG DẤU: thường hoá, gộp khoảng trắng, giữ nguyên dấu. */
function chuanTen(s) {
  return (s || "").normalize("NFC").toLowerCase().trim().replace(/\s+/g, " ");
}

/** Người dùng có tự gõ không dấu không? Nếu có thì mới cho tra mờ. */
function goKhongDau(s) {
  const t = chuanTen(s);
  return t === t.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
}

/* Tra tên theo ba nấc, nấc nào cũng ra tiếng:
     1. ĐÚNG DẤU — chắc chắn đúng tên con. Tiếng Việt bỏ dấu thì Bông = Bống =
        Bòng, gọi bé "Bông" mà phát clip "Bống" là gọi sai tên, nên nấc này
        phải đứng trước.
     2. BỎ DẤU — chỉ dùng khi chính người dùng gõ không dấu.
     3. Không có gì thì máy đọc tên rồi nối đoạn thu thật. */
function traTenKaka(kho, ten) {
  const d = kho.dau && kho.dau[chuanTen(ten)];
  if (d) return { file: d.file, ten: d.ten, that: !!d.that };
  if (!goKhongDau(ten)) return null;
  const k = khongDau(ten);
  for (const x of bienTheTen(k)) {
    if (kho.ten[x]) return { file: kho.ten[x].file, ten: kho.ten[x].ten, that: true };
  }
  for (const x of bienTheTen(k)) {
    if (kho.goi && kho.goi[x]) return { file: kho.goi[x].file, ten: kho.goi[x].ten, that: false };
  }
  return null;
}

/* Phát lần lượt nhiều đoạn tiếng, hết đoạn này sang đoạn kia.
   Dùng ĐÚNG MỘT thẻ <audio> có sẵn trong trang (#amKaka) và chỉ đổi src.
   Trước đây mỗi đoạn tạo một new Audio() mới: thẻ mới chưa từng được mồi trong
   cú chạm nào nên iPhone chặn thẳng — bấm gọi mà im ru. Đoạn nối sau lại chạy
   trong sự kiện "ended", càng nằm ngoài cú chạm, càng chắc chắn bị chặn. */
function phatChuoiKaka(ds, xong) {
  const am = $("#amKaka") || new Audio();
  kakaAm = am;
  let i = 0;
  // Bà phù thuỷ đang nói thì nhạc nền phải nhường, nghe mới rõ.
  nhacNhuong(true);
  const tiep = () => {
    if (i >= ds.length) { nhacNhuong(false); if (xong) xong(); return; }
    am.src = ds[i++];
    am.muted = false;
    // KHÔNG đặt currentTime ở đây: lúc này tệp chưa nạp xong nên vài trình duyệt
    // ném lỗi, và lỗi đó văng ra trước khi kịp gọi play() — bấm gọi mà im ru.
    // Gán src mới thì máy tự đưa về đầu rồi.
    const p = am.play();
    if (p && p.catch) p.catch(() => {
      kakaHienVideo(false); kakaNoi(false);
      toast("Máy chưa cho phát tiếng. Chạm vào màn hình rồi bấm lại nhé.");
    });
  };
  am.onended = tiep;
  am.onerror = tiep;
  tiep();
}

/** Cho biết trước tên vừa gõ có sẵn giọng gọi đích danh hay chưa. */
function goiYKaka() {
  const o = $("#kakaTen"), g = $("#kakaGoiY");
  if (!o || !g || !kakaKho) return;
  const k = khongDau(o.value);
  if (!k) { g.hidden = true; return; }
  const co = traTenKaka(kakaKho, o.value);
  g.hidden = false;
  // Vài tên trong kho lưu chữ thường (bóc từ tên file), viết hoa lại cho lịch sự.
  const hoa = s => (s || "").replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  g.textContent = co
    ? "Có giọng bà gọi tên " + hoa(co.ten)
    : "Tên mới — bà vẫn gọi tên con bằng giọng thật";
  g.classList.toggle("co", !!co);
}

/* ---- Gọi tên con lên thành tiếng ----
   Thầy dặn: gõ tên bạn nào cũng phải nói được. Kho tiếng thật chỉ có sẵn một số
   tên, nên tên lạ thì máy đọc tên con trước (hạ giọng, đọc chậm cho ra chất bà
   phù thuỷ), xong mới nối vào đoạn tiếng thật của bà. Không bao giờ để im lặng.
   Phải đọc XONG rồi mới phát tiếng: iPhone đang đọc thì thẻ <audio> bị câm. */
function docTenKaka(ten, xong) {
  const ss = window.speechSynthesis;
  if (!ss) return xong();
  try {
    ss.cancel();
    const u = new SpeechSynthesisUtterance(ten + " ơi! Bà phù thuỷ Kaka đây!");
    const vi = (ss.getVoices() || []).find(v => /^vi/i.test(v.lang || ""));
    if (vi) { u.voice = vi; u.lang = vi.lang; } else { u.lang = "vi-VN"; }
    u.pitch = 0.6;                       // trầm xuống cho giống bà phù thuỷ
    u.rate = 0.85;
    u.onend = () => doiDocXong(xong);
    u.onerror = () => xong();
    ss.speak(u);
    // Có máy nuốt luôn onend, chặn sẵn để không đứng im mãi.
    setTimeout(() => { if (!ss.speaking) xong(); }, 4000);
  } catch { xong(); }
}

/* KHÔNG để hàm này là async: mọi lần chờ (await) đều làm đứt "cú chạm" mà
   iPhone dựa vào để cho phép phát tiếng. Kho đã nạp từ lúc mở màn rồi, nên
   thường dùng ngay được; hiếm khi chưa có thì mới nạp rồi gọi lại. */
function goiKaka() {
  const kho = kakaKho;
  if (!kho) { napKhoKaka().then(goiKaka); return; }
  const ten = ($("#kakaTen").value || "").trim();
  if (!ten) { toast("Nhập tên con đã nhé."); return; }

  // Một đoạn tình huống đúng việc con đang chưa ngoan — luôn cần tới.
  const hop = kho.chung.filter(x => x.tinh_huong === kakaViecChon);
  const dsTh = hop.length ? hop : kho.chung;
  const thUrl = dsTh.length
    ? KAKA_THU + dsTh[Math.floor(Math.random() * dsTh.length)].file : "";

  // Ba mức, mức nào cũng ra tiếng — thầy dặn tên nào cũng phải gọi được:
  //   1. băng thu thật đã gọi đích danh tên đó  → phát nguyên đoạn
  //   2. câu gọi tên dựng theo giọng bà         → gọi tên rồi nối đoạn tình huống
  //   3. chưa có gì                             → máy đọc tên rồi nối đoạn tình huống
  const co = traTenKaka(kho, ten);
  let chuoi;
  if (co && co.that) chuoi = [KAKA_THU + co.file];
  else if (co) chuoi = [KAKA_THU + co.file, thUrl].filter(Boolean);
  else chuoi = [thUrl].filter(Boolean);
  if (!chuoi.length) { toast("Chưa có đoạn tiếng nào phù hợp."); return; }

  $("#kakaTenTo").textContent = ten;
  const v = $("#kakaViec");
  v.textContent = kakaViecChon || "";
  v.hidden = !kakaViecChon;
  $("#kakaForm").hidden = true;
  $("#kakaDangGoi").hidden = false;
  kakaHienVideo(true);
  kakaNoi(true);

  const phat = () => phatChuoiKaka(chuoi, () => { kakaHienVideo(false); kakaNoi(false); });
  kakaPhatLai = () => { kakaHienVideo(true); kakaNoi(true); phat(); };
  if (co) {
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* thôi */ }
    phat();
  } else {
    docTenKaka(ten, phat);
  }
}

/** Bật/tắt sóng tiếng và dòng trạng thái cho bé biết bà đang nói hay đã xong. */
function kakaNoi(dang) {
  const s = $("#kakaSong"), t = $("#kakaTrangThai");
  if (s) s.classList.toggle("noi", !!dang);
  if (t) t.lastChild.textContent = dang ? "Bà đang nói…" : "Đã nói xong";
}

/** Ngắt mọi tiếng đang phát của màn này. */
function dungTiengKaka() {
  if (kakaAm) {
    // Gỡ tay nghe TRƯỚC khi dừng, kẻo đoạn sau trong chuỗi lại tự phát tiếp.
    try { kakaAm.onended = null; kakaAm.onerror = null; } catch { /* thôi */ }
    try { kakaAm.pause(); kakaAm.currentTime = 0; } catch { /* thôi */ }
  }
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* thôi */ }
  nhacNhuong(false);
}

/** Dọn màn hình, không đụng vào lịch sử trình duyệt. */
function dongKakaMan() {
  const v = $("#kakaView");
  if (!v) return;
  dungTiengKaka();
  [$("#kakaVidNoi"), $("#kakaVidCho")].forEach(x => { if (x) { try { x.pause(); } catch { /* thôi */ } x.hidden = true; } });
  v.hidden = true;
  document.body.style.overflow = "";
}

function dongKaka() {
  dongKakaMan();
  // Nhả luôn nấc lịch sử đã chèn lúc mở, kẻo bấm Back lại rơi vào màn trống.
  if (kakaDaDay) { kakaDaDay = false; try { history.back(); } catch { /* thôi */ } }
}

/** Về bước trước: đang gọi thì quay lại ô nhập tên, ở ô nhập tên thì thoát hẳn. */
function luiKaka() {
  if (!$("#kakaDangGoi").hidden) { veFormKaka(); return; }
  dongKaka();
}

function veFormKaka() {
  dungTiengKaka();
  kakaNoi(false);
  kakaHienVideo(false);
  $("#kakaDangGoi").hidden = true;
  $("#kakaForm").hidden = false;
}

$("#btnMoKaka").addEventListener("click", moKaka);
$("#btnKakaDong").addEventListener("click", luiKaka);
$("#btnKakaGoi").addEventListener("click", goiKaka);
$("#btnKakaThoi").addEventListener("click", veFormKaka);
// Cú chạm này là cú chạm THẬT, nên máy nào chặn tiếng lần đầu thì bấm đây là ra.
$("#btnKakaLai").addEventListener("click", () => {
  moiTheTieng("amKaka");
  dungTiengKaka();
  if (kakaPhatLai) kakaPhatLai();
});
$("#kakaTen").addEventListener("input", goiYKaka);
// Nút "Xem tất cả": mặc định danh sách tình huống chỉ một hàng trượt ngang.
$("#btnKakaXem").addEventListener("click", () => {
  const h = $("#kakaChips"), b = $("#btnKakaXem");
  const mo = h.classList.toggle("mo");
  b.textContent = mo ? "Thu gọn" : "Xem tất cả";
  b.setAttribute("aria-expanded", mo ? "true" : "false");
});
// Nút Back của máy (Android) và vuốt lùi: đóng màn Kaka chứ đừng thoát hẳn app.
window.addEventListener("popstate", () => {
  kakaDaDay = false;
  if (!$("#kakaView").hidden) dongKakaMan();
});

/* ---------- Trang thưởng đầy màn hình ----------
   Thầy chốt: cứ 3 câu đúng thì mở hẳn một trang, pháo bông nổ độp độp, đứng đó
   cho trẻ ngắm chứ đừng tự tắt, bấm "Tiếp tục" mới sang câu mới. */
let thuongDangMo = false;
let thuongDangCho = false;      // đang chờ đọc xong để mở trang thưởng
let thuongLuot = 0;             // đếm lượt thưởng để xen kẽ pháo hoa và trò chơi
let thuongSauKhiDong = null;
let phaoRaf = 0;

const KHEN_TO = ["Giỏi quá!", "Tuyệt vời!", "Cừ lắm!", "Xuất sắc!", "Đỉnh thật!"];

/** Đợi cho giọng đọc dứt hẳn rồi mới làm tiếp. Thầy chỉ đúng chỗ: phải để đọc
    xong thì tiếng thưởng mới lên được — iPhone chỉ cho một nguồn âm thanh chiếm
    loa, đang đọc dở mà bật nhạc thì nhạc chạy câm.
    Có chặn trên 6 giây: máy nào kẹt không báo đọc xong thì cũng phải đi tiếp,
    không để trẻ ngồi chờ mãi. */
function doiDocXong(xong) {
  const ss = window.speechSynthesis;
  if (!ss || !ss.speaking) return xong();
  let dem = 0;
  const hen = setInterval(() => {
    dem += 1;
    if (!ss.speaking || dem > 60) {          // 60 × 100ms = 6 giây
      clearInterval(hen);
      if (ss.speaking) { try { ss.cancel(); } catch { /* thôi */ } }
      // Nhường thêm một nhịp cho máy trả lại loa rồi mới phát nhạc.
      setTimeout(xong, 120);
    }
  }, 100);
}

let anhDangThuong = "";

/** Tải ảnh thưởng về máy.
    iPhone KHÔNG tải được bằng thẻ <a download> — nó chỉ mở ảnh ra tab khác.
    Cách đúng trên iPhone là gọi bảng Chia sẻ của máy, trong đó có "Lưu ảnh".
    Máy tính và Android thì <a download> chạy bình thường. */
async function taiAnhThuong() {
  if (!anhDangThuong) return;
  const ten = "ON-Language-" + Date.now() + ".webp";
  try {
    const res = await fetch(anhDangThuong);
    const blob = await res.blob();
    const file = new File([blob], ten, { type: blob.type || "image/webp" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Ảnh thưởng ON-Language" });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = el("a");
    a.href = url; a.download = ten;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast("Đã tải ảnh về máy.");
  } catch (e) {
    // Người học bấm huỷ trong bảng chia sẻ thì không phải lỗi, đừng báo gì.
    if (e && e.name === "AbortError") return;
    toast("Chưa tải được ảnh. Bạn thử lại nhé.");
  }
}
$("#btnTaiAnh").addEventListener("click", taiAnhThuong);

function moThuong(xong) {
  const v = $("#thuongView");
  if (!v) { xong && xong(); return; }
  thuongSauKhiDong = xong || null;
  thuongDangMo = true;

  $("#thuongTitle").textContent = KHEN_TO[Math.floor(Math.random() * KHEN_TO.length)];
  $("#thuongSub").textContent = `Đúng ${STK_MOI} câu liền rồi đó. Nghỉ tay ngắm pháo một tí nào!`;
  const im = $("#thuongAnh");
  anhDangThuong = "assets/sticker/s" + stkTiep() + ".webp";
  im.src = anhDangThuong;
  // Thiếu file thì giấu ảnh đi thôi, phần còn lại của trang vẫn dùng được.
  im.hidden = false;
  im.onerror = () => { im.hidden = true; };

  v.hidden = false;
  document.body.style.overflow = "hidden";
  // Tiếng reo mừng nổ cùng lúc ảnh hiện ra. File không phát được thì tự
  // chuyển sang tiếng tổng hợp, không để im lặng.
  if (!phatFileThuong()) keuThuong();
  banPhao();
  $("#btnThuongTiep").focus();
}

function dongThuong() {
  const v = $("#thuongView");
  v.hidden = true;
  // Tắt nhạc luôn: file dài 6 giây, không tắt thì nó kêu lấn sang câu sau,
  // trẻ đang tập trung nghe câu mới lại bị pháo nổ bên tai.
  try { const am = $("#amThuong"); am.pause(); am.currentTime = 0; } catch { /* thôi */ }
  dangPhatFile = false;
  thuongDangMo = false;
  thuongDangCho = false;
  try { $("#btnNext").disabled = false; } catch { /* thôi */ }
  document.body.style.overflow = "";
  cancelAnimationFrame(phaoRaf);
  const f = thuongSauKhiDong;
  thuongSauKhiDong = null;
  f && f();
}
$("#btnThuongTiep").addEventListener("click", dongThuong);

/** Pháo bông vẽ trên canvas: từng chùm nổ ra rồi rơi xuống theo trọng lực.
    Vẽ trên canvas chứ không dựng cả trăm thẻ DOM — máy yếu sẽ giật. */
function banPhao() {
  const cv = $("#thuongPhao");
  const ctx = cv.getContext("2d");
  const tl = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = cv.clientWidth * tl;
  cv.height = cv.clientHeight * tl;
  ctx.scale(tl, tl);
  const W = cv.clientWidth, H = cv.clientHeight;

  const MAU = ["#C084FC", "#FF9A4D", "#FBBF24", "#22C55E", "#F472B6", "#60A5FA"];
  let hat = [];
  let lanNo = 0;
  const TONG_NO = 7;

  function no(x, y) {
    const mau = MAU[Math.floor(Math.random() * MAU.length)];
    const n = 26 + Math.floor(Math.random() * 14);
    for (let i = 0; i < n; i++) {
      const g = (Math.PI * 2 * i) / n + Math.random() * .2;
      const v = 1.6 + Math.random() * 2.6;
      hat.push({ x, y, vx: Math.cos(g) * v, vy: Math.sin(g) * v, s: 1.6 + Math.random() * 2,
                 mau: Math.random() < .25 ? "#fff" : mau, doi: 1 });
    }
    // File nhạc của thầy đã có sẵn tiếng pháo nổ; kêu thêm tiếng tổng hợp
    // nữa là chồng chéo, mà file lại chuẩn hoá kịch trần nên dễ vỡ tiếng.
    if (!dangPhatFile) keuNo();
  }

  // Nổ chùm đầu ngay, các chùm sau lệch giờ nhau cho ra tiếng "độp... độp... độp".
  const hen = [];
  for (let i = 0; i < TONG_NO; i++) {
    hen.push(setTimeout(() => {
      no(W * (.18 + Math.random() * .64), H * (.16 + Math.random() * .42));
      lanNo++;
    }, i * (230 + Math.random() * 140)));
  }

  function ve() {
    // Xoá mờ dần chứ không xoá sạch — để lại vệt đuôi cho ra dáng pháo.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.18)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    hat.forEach(h => {
      h.x += h.vx; h.y += h.vy;
      h.vy += .045;                 // trọng lực
      h.vx *= .99; h.vy *= .99;
      h.doi -= .012;
      if (h.doi <= 0) return;
      ctx.globalAlpha = Math.max(0, h.doi);
      ctx.fillStyle = h.mau;
      ctx.beginPath(); ctx.arc(h.x, h.y, h.s, 0, Math.PI * 2); ctx.fill();
    });
    hat = hat.filter(h => h.doi > 0 && h.y < H + 20);
    ctx.globalAlpha = 1;
    // Bắn xong hết chùm mà hạt cũng tàn rồi thì thôi, khỏi quay vòng cho tốn pin.
    if (lanNo < TONG_NO || hat.length) phaoRaf = requestAnimationFrame(ve);
  }
  cancelAnimationFrame(phaoRaf);
  ctx.clearRect(0, 0, W, H);
  phaoRaf = requestAnimationFrame(ve);
  // Trang đóng sớm thì dọn hết hẹn giờ, đừng để pháo nổ khi đã sang câu khác.
  $("#btnThuongTiep").addEventListener("click", () => hen.forEach(clearTimeout), { once: true });
}

const PRAISE = ["Chính xác", "Tuyệt vời", "Giỏi lắm", "Đúng rồi", "Xuất sắc"];
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
function answerOf(d) {
  if (d.type === "blanks") return d.sent.en;
  if (d.type === "xepAnh") return d.nhom.map(w => w.en).join(", ");
  if (d.type === "ghepChu") return d.word.en;
  if (d.type === "choice") return d.word.vi;
  if (d.type === "truefalse") return d.answer ? "Đúng" : `Sai — “${d.word.vi}” là “${d.word.en}”`;
  return d.word.en;
}
let fbDoc = null;
function feedback(ok, title, detail, doc) {
  const fb = $("#feedback");
  fb.hidden = false;
  $(".p-foot").className = "p-foot " + (ok ? "ok" : "bad");
  $("#fbTitle").textContent = title;
  $("#fbDetail").textContent = detail;
  $("#fbIcon").firstElementChild.firstElementChild.setAttribute("href", ok ? "#i-check" : "#i-close");
  // Nghe lại đáp án — nhất là lúc sai, đó mới là lúc cần nghe nhất.
  fbDoc = (doc || []).filter(k => k && k.text);
  $("#fbSay").hidden = !fbDoc.length;
}
$("#fbSay").addEventListener("click", () => { if (fbDoc && fbDoc.length) docLanLuot(fbDoc); });
function advance() {
  // Đang chờ đọc xong để mở trang thưởng thì KHOÁ hẳn, đừng cho tiến tiếp.
  // Đây là chỗ từng nuốt mất một câu: doiDocXong chờ tới 6 giây, trong lúc đó
  // màn hình vẫn là câu cũ và nút "Tiếp theo" vẫn bấm được. Ai sốt ruột bấm
  // thêm một cái là diTiep() chạy ngay sang câu mới, rồi trang thưởng mới mở
  // đè lên; bấm "Tiếp tục" thì diTiep() chạy lần nữa — nhảy qua trọn một câu.
  if (thuongDangCho || thuongDangMo) return;
  // Đủ 3 câu đúng thì chen trang thưởng vào GIỮA hai câu: bấm "Tiếp theo" xong
  // là pháo nổ, ngắm chán rồi bấm "Tiếp tục" mới sang câu mới. Chen ở đây chứ
  // không chen lúc vừa chấm — chấm xong còn phải cho đọc lời giải đã.
  if (stkDung > 0 && stkDung % STK_MOI === 0) {
    stkDung = 0;                         // đã thưởng rồi thì đếm lại từ đầu
    thuongDangCho = true;
    $("#btnNext").disabled = true;
    return doiDocXong(() => {
      thuongDangCho = false;
      $("#btnNext").disabled = false;
      // Xoay vòng năm kiểu thưởng: pháo hoa → bắn chữ → chém chữ → ném bóng → rắn.
      // Cứ một kiểu mãi thì phần thưởng hết là phần thưởng.
      thuongLuot += 1;
      const kieu = thuongLuot % 5;
      if (kieu === 1) banMo(diTiep);
      else if (kieu === 2) chemMo(diTiep);
      else if (kieu === 3) nemMo(diTiep);
      else if (kieu === 4) ranMo(diTiep);
      else moThuong(diTiep);
    });
  }
  diTiep();
}
function diTiep() {
  if (!P.laThi && S.hearts <= 0 && P.i >= P.teachN) return sheetNoHearts();
  P.i++;
  if (P.i >= P.slides.length) return finish();
  renderSlide();
}
$("#btnNext").addEventListener("click", nextPressed);

/* ---------- 13. Lặp lại ngắt quãng ---------- */
const BOX_DAYS = [0, 1, 3, 7, 16, 35];
function srsUpdate(en, ok) {
  const r = S.srs[en] || { box: 0, due: 0, right: 0, wrong: 0, first: Date.now() };
  if (!r.first) r.first = Date.now();
  if (ok) { r.right++; r.box = clamp(r.box + 1, 0, 5); } else { r.wrong++; r.box = clamp(r.box - 1, 0, 5); }
  r.due = Date.now() + BOX_DAYS[r.box] * DAY;
  S.srs[en] = r; save();
}
const seenWords = () => ALL_WORDS.filter(w => S.srs[w.en]);
const dueWords = () => seenWords().filter(w => S.srs[w.en].due <= Date.now());
const weakWords = () => seenWords().filter(w => S.srs[w.en].wrong > 0).sort((a, b) => S.srs[b.en].wrong - S.srs[a.en].wrong);

/* ---------- 14. Kết thúc bài ---------- */
function finish() {
  if (P.laThi) return xongDeThi();
  const secs = Math.round((Date.now() - P.startedAt) / 1000);
  const tries = Math.max(1, P.attempts);
  const acc = clamp(Math.round(((tries - P.wrong) / tries) * 100), 0, 100);
  let xp = P.mode === "review" ? 8 : 12;
  if (P.wrong === 0) xp += 5;
  const xu = XU_MOI_BAI + (P.wrong === 0 ? XU_KHONG_SAI : 0);
  const firstToday = S.lastDay !== today();

  // Nhân bội tính SAU markStudied() — để con số nhân đúng bằng chuỗi ngày đang
  // hiện trên màn hình. Tính trước thì có lúc màn hình ghi "chuỗi 30 ngày" mà
  // chỉ nhân x2 (vì lúc tính chuỗi mới là 29), người học nhìn vào thấy sai.
  markStudied();
  const boi = nhanXp();
  xp *= boi;
  addXp(xp); addXu(xu);
  if (P.lessonId) {
    const prev = S.done[P.lessonId];
    S.done[P.lessonId] = { best: Math.max(acc, prev?.best || 0), tries: (prev?.tries || 0) + 1 };
  }
  save();

  $("#player").hidden = true;
  $("#result").hidden = false;
  $("#resTime").textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  $("#resAcc").textContent = acc + "%";
  $("#resXp").textContent = xp;
  $("#resXu").textContent = "+" + xu;
  $("#resBoi").hidden = boi < 2;
  $("#resBoi").textContent = boi < 2 ? "" : `Chuỗi ${S.streak} ngày đang nhân XP x${boi} cho bạn.`;
  $("#resSub").hidden = true;
  $("#resTitle").textContent = P.wrong === 0 ? "Chậm mà chắc, rất tuyệt!" : acc >= 80 ? "Làm tốt lắm, giữ nhịp nhé!" : "Xong rồi, cứ từ từ mà chắc!";
  $("#resNote").textContent = P.wrong === 0 ? "Không sai câu nào — thưởng thêm 5 XP." : "Ôn lại chương này sẽ chắc hơn.";
  $("#result").dataset.streak = firstToday ? "1" : "";
  veCup(acc);
  $("#btnResDone").focus();
}
$("#btnResDone").addEventListener("click", () => {
  const showStreak = $("#result").dataset.streak === "1";
  try { const v = $("#amVoTay"); v.pause(); v.currentTime = 0; } catch { /* thôi */ }
  $("#result").classList.remove("co-cup");
  $("#resTrophy").hidden = true;
  $("#result").hidden = true;
  paintStats();
  if (showStreak) { openStreak(); return; }
  document.body.style.overflow = ""; go(view);
});

/* ---------- 15. Màn chuỗi ngày ---------- */
let calMonth = null;
function openStreak() {
  calMonth = new Date(); calMonth.setDate(1);
  $("#streakNum").textContent = S.streak;
  $("#streakSub").textContent = S.streak >= (S.best || 0)
    ? "Đây là chuỗi dài nhất của bạn, đừng dừng lại."
    : `Chuỗi dài nhất của bạn là ${S.best} ngày.`;
  const cap = capChuoi(S.streak);
  $("#streakCap").textContent = cap.ten;
  const con = cap.toi ? cap.toi[0] - S.streak : 0;
  $("#streakToi").hidden = !cap.toi;
  if (cap.toi) $("#streakToi").textContent = `Còn ${con} ngày nữa là lên ${cap.toi[1]}.`;
  veTuan();
  renderCal();
  $("#streakView").hidden = false;
  document.body.style.overflow = "hidden";
  $("#btnStreakClose").focus();
}
/** Dải 7 ngày của TUẦN NÀY — nhìn phát biết tuần nay hụt hôm nào, đỡ phải
    dò trong cả bảng lịch tháng. */
function veTuan() {
  const box = $("#tuanStrip"); box.textContent = "";
  const t = new Date();
  const thu2 = new Date(t); thu2.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  ["T2","T3","T4","T5","T6","T7","CN"].forEach((ten, i) => {
    const d = new Date(thu2); d.setDate(thu2.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const on = S.days.includes(iso);
    const homNay = d.toDateString() === t.toDateString();
    const o = el("div", "tuan-o" + (on ? " on" : "") + (homNay ? " nay" : ""));
    o.append(el("small", "", ten));
    const v = el("span", "tuan-lua");
    if (on) v.append(svgUse("p-flame", "0 0 100 120"));
    else v.textContent = String(d.getDate());
    o.append(v);
    o.setAttribute("aria-label", `${ten}: ${on ? "đã học" : "chưa học"}`);
    box.append(o);
  });
}

function renderCal() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;                       // tuần bắt đầu từ thứ Hai
  const t = new Date(), isNow = t.getFullYear() === y && t.getMonth() === m;
  $("#calMonth").textContent = `tháng ${m + 1} ${y}`;
  const studied = S.days.filter(d => d.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).length;
  $("#calCount").textContent = `Đã học ${studied} trong ${days} ngày`;

  const g = $("#calGrid"); g.textContent = "";
  ["T2","T3","T4","T5","T6","T7","CN"].forEach((d, i) => {
    const c = el("div", "dow" + (isNow && ((t.getDay() + 6) % 7) === i ? " today" : ""), d);
    g.append(c);
  });
  for (let i = 0; i < lead; i++) g.append(el("div"));
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const on = S.days.includes(iso);
    const cell = el("div", "cal-cell" + (on ? " on" : "") + (isNow && t.getDate() === d ? " today" : ""));
    if (on) { cell.append(svgUse("p-flame", "0 0 100 120")); cell.setAttribute("aria-label", `Ngày ${d}: đã học`); }
    else cell.textContent = d;
    g.append(cell);
  }
}
$("#calPrev").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() - 1); renderCal(); });
$("#calNext").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() + 1); renderCal(); });
function dongStreak() {
  $("#streakView").hidden = true; document.body.style.overflow = ""; go(view);
}
// Dấu X nằm tít trên đỉnh, cuộn hết lịch xuống rồi thì không thấy đâu nữa —
// nên có thêm một nút quay lại ngay dưới bảng.
$$("#btnStreakClose, #btnStreakHome").forEach(b => b.addEventListener("click", dongStreak));
$("#btnStreak").addEventListener("click", openStreak);
$("#btnXu").addEventListener("click", () => {
  const du = (S.xu || 0) >= XU_DOI_TIM;
  openSheet({
    title: `Bạn có ${S.xu || 0} xu`,
    body: `Mỗi bài học xong được ${XU_MOI_BAI} xu, không sai câu nào được thêm ${XU_KHONG_SAI} xu. Đủ ${XU_DOI_TIM} xu thì đổi được một lần đầy tim.`,
    yes: du ? `Đổi ${XU_DOI_TIM} xu lấy đầy tim` : "Đã hiểu",
    no: du ? "Để sau" : "",
    onYes() {
      if (!du) return;
      S.xu -= XU_DOI_TIM; S.hearts = TIM_TOI_DA; S.heartAt = Date.now(); save();
      paintStats(); toast("Đã đầy tim, học tiếp thôi!");
    }
  });
});

/* ---------- 16. Thẻ ghi nhớ ---------- */
const F = { q: [], i: 0, shown: false };
function startFlash() {
  const pool = seenWords();
  if (pool.length < 3) return toast("Học thêm vài bài để có từ ôn nhé.");
  const due = dueWords();
  F.q = sample(due.length >= 5 ? due : pool, Math.min(12, pool.length));
  F.i = 0;
  $("#flash").hidden = false; document.body.style.overflow = "hidden";
  renderFlash();
}
function renderFlash() {
  const w = F.q[F.i]; F.shown = false;
  $("#flashFront").textContent = w.en;
  $("#flashIpa").textContent = w.ipa || "";
  $("#flashBack").textContent = w.vi;
  $("#flashEx").textContent = w.ex ? w.ex.en : "";
  $("#flashBack").hidden = true; $("#flashEx").hidden = true;
  $("#fcHint").textContent = "Bấm để xem nghĩa";
  $("#flashActions").hidden = true; $("#btnReveal").hidden = false;
  $("#flashLeft").textContent = F.q.length - F.i;
  $("#flashBar").style.width = Math.round((F.i / F.q.length) * 100) + "%";
  speak(w.en);
}
function revealFlash() {
  if (F.shown) return;
  F.shown = true;
  $("#flashBack").hidden = false;
  if ($("#flashEx").textContent) $("#flashEx").hidden = false;
  $("#fcHint").textContent = "Bạn có nhớ từ này không?";
  $("#flashActions").hidden = false; $("#btnReveal").hidden = true;
}
function gradeFlash(ok) {
  srsUpdate(F.q[F.i].en, ok);
  F.i++;
  if (F.i >= F.q.length) {
    $("#flash").hidden = true; document.body.style.overflow = "";
    markStudied(); addXp(5); save(); paintStats(); go(view);
    toast("Xong " + F.q.length + " thẻ · +5 XP");
    return;
  }
  renderFlash();
}
$("#fcard").addEventListener("click", revealFlash);
$("#btnReveal").addEventListener("click", revealFlash);
$("#btnKnew").addEventListener("click", () => gradeFlash(true));
$("#btnForgot").addEventListener("click", () => gradeFlash(false));
$("#btnFlashQuit").addEventListener("click", () => { $("#flash").hidden = true; document.body.style.overflow = ""; stopSpeak(); go(view); });
$("#btnFlash").addEventListener("click", startFlash);
$("#btnFlash2").addEventListener("click", startFlash);

/* ---------- 17. Màn Từ vựng ---------- */
const POS_ORDER = ["Danh từ", "Động từ", "Tính từ", "Trạng từ", "Đại từ", "Cụm từ", "Chào hỏi", "Giới từ"];
const LOCK_LESSONS = 5;                 // đủ 5 bài mới mở kho từ
let wordFilter = "all", wordSortAZ = false, wordGrid = false, wordQuery = "";

function renderWords() {
  const doneN = Object.keys(S.done).length;
  const locked = doneN < LOCK_LESSONS;
  const head = $("#view-words .words-head");
  [head, $("#wordSearchWrap"), $("#wordFilters"), $("#wordPromo"), $("#wordList")]
    .forEach(el => { if (el) el.hidden = locked; });
  $("#wordsLocked").hidden = !locked;
  if (locked) {
    const left = LOCK_LESSONS - doneN;
    $("#lockedLeft").textContent = `Hoàn thành thêm ${left} bài học nữa để mở khoá`;
    $("#lockedBar").style.width = Math.round((doneN / LOCK_LESSONS) * 100) + "%";
    return;
  }
  if (!$("#wordSearchWrap").dataset.open) $("#wordSearchWrap").hidden = true;

  const seen = seenWords();
  const wkStart = new Date(weekKey()).getTime();
  const thisWeek = seen.filter(w => S.srs[w.en].first >= wkStart).length;
  $("#wordCount").textContent = seen.length + " từ";
  $("#wordWeek").textContent = thisWeek + " trong tuần này.";

  // chip lọc: chỉ hiện từ loại thực sự có trong kho từ của người học
  const have = POS_ORDER.filter(p => seen.some(w => w.pos === p));
  const chips = [{ id: "all", name: "Tất cả" }]
    .concat(have.map(p => ({ id: p, name: p })))
    .concat([{ id: "due", name: "Cần ôn" }]);
  if (!chips.some(c => c.id === wordFilter)) wordFilter = "all";

  const fbox = $("#wordFilters"); fbox.textContent = "";
  chips.forEach(c => {
    const b = el("button", "chip" + (c.id === wordFilter ? " on" : ""), c.name);
    b.type = "button";
    b.setAttribute("aria-pressed", String(c.id === wordFilter));
    b.addEventListener("click", () => { wordFilter = c.id; renderWords(); });
    fbox.append(b);
  });

  let list = seen.filter(w =>
    wordFilter === "all" ? true :
    wordFilter === "due" ? S.srs[w.en].due <= Date.now() : w.pos === wordFilter);
  if (wordQuery) {
    const q = deaccent(wordQuery);
    list = list.filter(w => deaccent(w.en).includes(q) || deaccent(w.vi).includes(q));
  }
  list = wordSortAZ ? list.slice().sort((a, b) => a.en.localeCompare(b.en)) : list.slice().reverse();

  const ul = $("#wordList");
  ul.className = "wlist" + (wordGrid ? " grid" : "");
  ul.textContent = "";
  if (!list.length) {
    const box = el("div", "empty");
    box.append(mascotBox("head", "empty-mascot"),
      el("b", null, wordQuery ? `Không tìm thấy “${wordQuery}”`
        : wordFilter === "all" ? "Chưa có từ nào" : `Không tìm thấy ${chips.find(c => c.id === wordFilter).name} nào`),
      el("p", "sub", wordQuery ? "Thử từ khoá khác xem sao." : "Hãy thử tìm các từ mà bạn đã học."));
    ul.append(box);
    return;
  }
  list.slice(0, 120).forEach(w => {
    const li = el("li");
    const say = el("button", "w-say"); say.type = "button";
    say.setAttribute("aria-label", "Nghe: " + w.en);
    say.append(icon("i-sound", "ic ic-sm"));
    say.addEventListener("click", () => speak(w.en));
    const box = el("div");
    box.append(el("div", "w-en", w.en), el("div", "w-vi", w.vi));
    if (w.pos) box.append(el("span", "w-pos", w.pos));
    // Hai nhãn bậc: CEFR cho người lớn, lớp học cho phụ huynh dễ hình dung.
    if (w.cefr) box.append(el("span", "w-bac", w.cefr));
    if (w.lop) box.append(el("span", "w-lop", w.lop));
    const pips = el("div", "w-pips");
    pips.setAttribute("aria-label", `Độ nhớ ${S.srs[w.en].box} trên 5`);
    for (let i = 0; i < 5; i++) pips.append(el("i", "pip" + (i < S.srs[w.en].box ? " on" : "")));
    li.append(say, box, pips);
    if (wordGrid) li.addEventListener("click", () => speak(w.en));
    ul.append(li);
  });
}
$("#btnWordSort").addEventListener("click", () => {
  wordSortAZ = !wordSortAZ;
  $("#btnWordSort").textContent = wordSortAZ ? "A–Z" : "Mới học";
  renderWords();
});
$("#btnWordView").addEventListener("click", () => {
  wordGrid = !wordGrid;
  $("#btnWordView").setAttribute("aria-pressed", String(wordGrid));
  renderWords();
});
$("#btnWordSearch").addEventListener("click", () => {
  const wrap = $("#wordSearchWrap");
  const open = wrap.hidden;
  wrap.hidden = !open;
  if (open) wrap.dataset.open = "1"; else delete wrap.dataset.open;
  $("#btnWordSearch").setAttribute("aria-expanded", String(open));
  if (open) $("#wordSearch").focus();
  else { wordQuery = ""; $("#wordSearch").value = ""; renderWords(); }
});
$("#wordSearch").addEventListener("input", e => { wordQuery = e.target.value.trim(); renderWords(); });
$("#btnSearchClear").addEventListener("click", () => {
  wordQuery = ""; $("#wordSearch").value = ""; $("#wordSearch").focus(); renderWords();
});
$("#btnLockedStart").addEventListener("click", () => { go("learn"); startLesson(currentLessonId()); });

/* ---------- 18. Màn Ôn tập ---------- */
function renderReview() {
  const seen = seenWords(), due = dueWords(), weak = weakWords();
  $("#dueCount").textContent = seen.length ? `${due.length} từ đã đến hạn` : "Học bài đầu tiên để mở khoá";
  $("#weakCount").textContent = `${weak.length} từ bạn từng sai`;
  $("#flashCount").textContent = seen.length < 3 ? "Cần ít nhất 3 từ đã học" : `${Math.min(12, seen.length)} thẻ · nhớ chủ động`;
  $("#btnDue").disabled = due.length < 3;
  $("#btnWeak").disabled = weak.length === 0;
  $("#btnFlash2").disabled = seen.length < 3;
}
$("#btnDue").addEventListener("click", () => startLesson(null, { words: sample(dueWords(), 8), mode: "review", max: 10 }));
$("#btnWeak").addEventListener("click", () => startLesson(null, { words: weakWords().slice(0, 8), mode: "review", max: 10 }));

/* ---------- 18b. Gọi video với ON-Language ----------
   Hai chế độ:
   • "free"   — nói chuyện tự do. Máy chủ /api/english-air/chat gọi Claude,
                ON-Language trả lời theo trình độ và vốn từ của người học.
   • "teach" — luyện nói với ON-Language trong vai giáo viên: nó nói tiếng Anh chuẩn,
     ra câu cho mình nói theo, chấm phát âm rồi sửa. Cũng cần mạng. Cũ là
                không có mạng.
   Cả hai đều dùng micro (Web Speech API); gõ chữ là đường lui khi không nói được. */
/* ---------- Sổ tay cách nói ----------
   Mỗi câu người học nói trong lúc tán gẫu đều được ghi lại ngay trên máy họ.
   Từ đó rút ra cách xưng hô và những chữ họ hay dùng, gửi kèm mỗi lượt để
   ON-Language bắt đúng giọng — kể cả ở những lần gọi sau, khỏi phải làm quen lại.
   Sổ này chỉ nằm trong máy người học, và chỉ dùng cho chế độ nói tự do. */
const STYLE_MAX = 40;
const STYLE_STOP = new Set(("là và của có không được cho với thì mà ở này đó rồi nhé nha " +
  "một hai các những cái người khi nào sao thế vậy đi ra vào lên xuống " +
  "tôi bạn mình cậu anh chị em con chú cô ông bà nó họ chúng " +
  "the and for you are was that this với").split(" "));

/** Ghi một câu người học vừa nói vào sổ. */
function noteStyle(text) {
  const t = String(text || "").trim();
  if (!t || t.length > 300) return;
  if (!S.style) S.style = { says: [] };
  S.style.says.push(t);
  if (S.style.says.length > STYLE_MAX) S.style.says = S.style.says.slice(-STYLE_MAX);
  save();
}

/** Rút gọn sổ thành vài dòng đủ để ON-Language bắt giọng, không gửi cả cuốn lên. */
function styleBrief() {
  const says = (S.style && S.style.says) || [];
  if (says.length < 2) return null;
  const all = says.join(" ").toLowerCase();
  const co = w => new RegExp("(^|\\P{L})" + w + "(\\P{L}|$)", "iu").test(all);
  // Ghi rõ ON-Language phải tự xưng gì và gọi họ là gì. Có cặp đối xứng (tao–mày:
  // ai cũng "tao" khi nói về mình), có cặp lệch (em–anh: họ "em" thì mình "anh").
  const PAIRS = [
    { ho: "tao", ban: "mày", tu: "tao", goi: "mày" },
    { ho: "tớ", ban: "cậu", tu: "tớ", goi: "cậu" },
    { ho: "mình", ban: "bạn", tu: "mình", goi: "bạn" },
    { ho: "em", ban: "anh", tu: "anh", goi: "em" },
    { ho: "em", ban: "chị", tu: "chị", goi: "em" },
    { ho: "con", ban: "chú", tu: "chú", goi: "con" },
    { ho: "con", ban: "cô", tu: "cô", goi: "con" },
  ];
  let xung = null;
  for (const c of PAIRS) if (co(c.ho) && co(c.ban)) { xung = { tu: c.tu, goi: c.goi }; break; }

  const dem = new Map();
  for (const w of all.split(/[^\p{L}\p{N}]+/u)) {
    if (w.length < 2 || STYLE_STOP.has(w)) continue;
    dem.set(w, (dem.get(w) || 0) + 1);
  }
  const hay = [...dem.entries()].filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1]).slice(0, 25).map(([w]) => w);

  return { xung, hay, mau: says.slice(-6).map(x => x.slice(0, 160)) };
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

/* Khung cảnh: tính lại cỡ căn phòng để ON-Language đứng lọt giữa thanh trên và bóng nói.
   Máy nào cũng vừa, không phải đoán bằng media query. */
const SCENE = { top: 0.12561, bot: 0.65922, ratio: 0.47551 };
function fitScene() {
  const call = $("#call");
  if (call.hidden) return;
  const vh = call.clientHeight;
  const head = $(".call-top").offsetHeight + 8;
  const stage = $(".call-stage");
  const first = [...stage.children].find(n => !n.hidden && n.offsetHeight > 0);
  const limit = (first || $(".call-foot")).getBoundingClientRect().top;
  let h = Math.max(240, limit - 10 - head) / (SCENE.bot - SCENE.top);
  let t = head - SCENE.top * h;
  if (t + h < vh) { h = (vh - head) / (1 - SCENE.top); t = head - SCENE.top * h; }
  // Cửa sổ cao bất thường (màn desktop dựng đứng) thì thôi, đừng để ON-Language phình ra.
  if (h > 1500) {
    h = 1500;
    t = head + Math.max(0, (limit - head - (SCENE.bot - SCENE.top) * h) / 2) - SCENE.top * h;
  }
  call.style.setProperty("--scene-h", h + "px");
  call.style.setProperty("--scene-t", t + "px");
}
if (window.ResizeObserver) {
  // Bóng nói cao thấp tuỳ câu, cứ đổi là phải tính lại chỗ đứng cho ON-Language.
  const ro = new ResizeObserver(fitScene);
  [".call-stage", "#callBubble", "#callTask", ".call-foot"].forEach(sel => ro.observe($(sel)));
}
addEventListener("resize", fitScene);
addEventListener("orientationchange", () => setTimeout(fitScene, 120));


const CHAT_URL = "../api/english-air/chat";

const C = { mode: "free", lang: "en", speaking: false, sayDone: null,
            watch: null, im: null, chotNghe: null,
            msgs: [], target: null,
            right: 0, asked: 0, t0: 0, timer: null, rec: null, listening: false, busy: false };

function similar(heardText, target) {
  const a = norm(heardText).split(" ").filter(Boolean);
  const b = norm(target).split(" ").filter(Boolean);
  if (!b.length) return 0;
  const pool = a.slice(); let hit = 0;
  b.forEach(w => { const k = pool.indexOf(w); if (k >= 0) { pool.splice(k, 1); hit++; } });
  return hit / b.length;
}

/* Chấm phát âm mịn theo TỪNG KÝ TỰ, không phải khớp cả từ.
   similar() ở trên chỉ đếm từ trùng nguyên vẹn — với một từ đơn như "park" thì
   hoặc 0% hoặc 100%, chẳng cho biết đọc lệch nhiều hay ít. */
function khoangCach(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let truoc = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    const nay = [i];
    for (let j = 1; j <= n; j += 1) {
      nay[j] = Math.min(
        truoc[j] + 1,
        nay[j - 1] + 1,
        truoc[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    truoc = nay;
  }
  return truoc[n];
}

/** Điểm giống nhau 0–100 giữa câu nghe được và câu mẫu. */
function diemDoc(nghe, mau) {
  const a = norm(nghe).replace(/[^a-z0-9 ]/g, "");
  const b = norm(mau).replace(/[^a-z0-9 ]/g, "");
  if (!b) return 0;
  if (a === b) return 100;
  const d = khoangCach(a, b);
  return Math.max(0, Math.round((1 - d / Math.max(a.length, b.length)) * 100));
}

/* ═══════════ VIDEO NHÂN VẬT ═══════════
   Ba đoạn: đang nói, đang nghỉ, đang nhảy. Đang nói thì chạy đoạn nói; không
   nói thì luân phiên nghỉ rồi nhảy, hết đoạn này sang đoạn kia.
   Mỗi đoạn một THẺ VIDEO RIÊNG, đổi qua lại bằng ẩn hiện chứ không đổi src —
   đổi src là trình duyệt nạp lại từ đầu, chớp đen một cái mỗi lần đổi. */
const VIDEO_MON = {
  noi: "assets/mon-noi.mp4",
  cho: "assets/mon-cho.mp4",
};
const THE_VIDEO = { noi: "#monVid", cho: "#monVidCho" };
/* Vòng lúc không nói. Giữ dạng danh sách để sau này thêm đoạn nữa thì chỉ
   viết thêm một dòng, không phải sửa lại cả phần chạy video. */
const VONG_NGHI = ["cho"];
let chiNghi = 0;
/* Giây đứng yên trong đoạn nói — chỉ dùng khi KHÔNG có đoạn nghỉ nào tải được. */
const KHUNG_YEN = 13.7;
const coVideo = {};

const the = ten => $(THE_VIDEO[ten]);

let daDoVideo = false;
function doVideoMon() {
  if (daDoVideo) return;
  daDoVideo = true;
  const nap = ten => {
    const v = the(ten), duong = VIDEO_MON[ten];
    if (!v || !duong) return;
    // Chỉ nhận khi trình duyệt thật sự đọc được, chứ không chỉ vì tệp tồn tại.
    v.addEventListener("loadedmetadata", () => { coVideo[ten] = duong; batVideo(); }, { once: true });
    v.addEventListener("error", () => {}, { once: true });
    v.preload = "auto";
    v.src = duong;
  };
  nap("noi"); nap("cho");
}

/** Đoạn nghỉ nào đang tới lượt và tải được. Không có đoạn nào thì trả về rỗng. */
function nghiTiepTheo() {
  for (let i = 0; i < VONG_NGHI.length; i++) {
    const ten = VONG_NGHI[(chiNghi + i) % VONG_NGHI.length];
    if (coVideo[ten]) { chiNghi = (chiNghi + i) % VONG_NGHI.length; return ten; }
  }
  return "";
}

let canhVideo = null, daGacVideo = false;
let videoDangChay = null;     // thẻ nào đang phải chạy
let dangNoiVideo = false;
function sangDoanKe() {
  chiNghi = (chiNghi + 1) % VONG_NGHI.length;
  datVideo(false);
}
function gacVideo() {
  if (daGacVideo) return;
  daGacVideo = true;
  Object.keys(THE_VIDEO).forEach(ten => {
    const v = the(ten);
    if (!v) return;
    v.addEventListener("pause", () => { if (videoDangChay === v && !v.ended) v.play().catch(() => {}); });
    v.addEventListener("ended", () => {
      if (videoDangChay !== v) return;
      // Đang nói thì quay lại đầu đoạn nói; đang nghỉ thì sang đoạn kế tiếp.
      if (dangNoiVideo) { try { v.currentTime = 0.04; } catch (e) {} v.play().catch(() => {}); }
      else sangDoanKe();
    });
  });
  // Bắt sự kiện thôi chưa đủ tin: có máy nuốt mất pause, có máy chặn play() vì
  // chưa có cú chạm nào, có máy tự dừng video khi giọng đọc bật lên. Nên canh
  // thẳng: cứ 0,4 giây ngó một lần.
  clearInterval(canhVideo);
  canhVideo = setInterval(() => {
    const v = videoDangChay;
    if (!v || v.hidden) return;
    const het = v.duration && v.currentTime >= v.duration - 0.06;
    if (v.ended || het) {
      if (dangNoiVideo) { try { v.currentTime = 0.04; } catch (e) {} v.play().catch(() => {}); }
      else sangDoanKe();
      return;
    }
    if (v.paused) v.play().catch(() => {});
  }, 400);
}

function batVideo() {
  if (!Object.keys(coVideo).length) return;
  gacVideo();
  document.querySelector(".scene-fit").classList.add("co-video");
  datVideo(dangNoiVideo);
}

/** Chuyển giữa đoạn nói và vòng nghỉ. */
let hoiTua = null;
function datVideo(dangNoi) {
  dangNoiVideo = !!dangNoi;
  // Đang nói mà có đoạn nói thì dùng nó; còn lại lấy đoạn nghỉ tới lượt.
  const muon = (dangNoi && coVideo.noi) ? "noi" : (nghiTiepTheo() || (coVideo.noi ? "noi" : ""));
  if (!muon) return;
  const v = the(muon);
  if (!v) return;

  Object.keys(THE_VIDEO).forEach(ten => {
    const k = the(ten);
    if (!k) return;
    if (ten === muon) { k.hidden = false; return; }
    k.hidden = true;
    k.pause();
  });

  clearInterval(hoiTua); hoiTua = null;

  // Không có đoạn nghỉ nào tải được: đành dừng đoạn nói ở khung miệng ngậm.
  if (!dangNoi && muon === "noi") {
    videoDangChay = null;
    v.classList.add("dung-yen");
    v.loop = false;
    v.pause();
    const dat = () => { try { v.currentTime = KHUNG_YEN; } catch (e) {} };
    if (v.readyState >= 1) dat(); else v.addEventListener("loadedmetadata", dat, { once: true });
    let lan = 0;
    hoiTua = setInterval(() => {
      if (!v.paused || ++lan > 30) { clearInterval(hoiTua); hoiTua = null; return; }
      if (Math.abs(v.currentTime - KHUNG_YEN) > 0.12) dat();
    }, 110);
    return;
  }

  v.classList.remove("dung-yen");
  // Đoạn nói chạy vòng cho tới khi nói xong; đoạn nghỉ chạy hết rồi nhường đoạn kia.
  v.loop = dangNoi;
  videoDangChay = v;
  if (v.ended || (v.duration && v.currentTime >= v.duration - 0.06)) {
    try { v.currentTime = 0.04; } catch (e) {}
  }
  // play() có thể bị chặn nếu người dùng chưa chạm màn hình — bỏ qua cho êm.
  v.play().catch(() => {});
}

function renderCall() {
  doVideoMon();
  $("#callMicNote").textContent = !SR
    ? "Trình duyệt này chưa nghe được bằng micro, bạn gõ chữ để nói chuyện nhé."
    : (isIosStandalone()
      ? "Bạn đang mở app từ màn hình chính. Trên iPhone kiểu này micro hay không chạy — không nghe được thì mở bằng Safari, hoặc cứ gõ chữ."
      : "Lần đầu bấm micro, trình duyệt sẽ hỏi quyền dùng micro — chọn Cho phép.");
}

/* ----- hiển thị ----- */
function setState(text, cls) {
  const e = $("#callState");
  e.textContent = text;
  e.className = "call-state" + (cls ? " " + cls : "");
}
function pushLog(who, text) {
  $("#callLog").append(el("li", who, text));
  const st = $(".call-stage");
  st.scrollTop = st.scrollHeight;
}

/** Bảng nói chỉ cao một đoạn; câu dài thì cuộn. Gọi lại mỗi khi đổi chữ để
    cuộn về đầu câu và bật/tắt vệt mờ báo "còn chữ ở dưới". */
function chinhCuonNoi() {
  const hop = $("#callBubble"), cuon = $("#callRoll");
  if (!hop || !cuon) return;
  cuon.scrollTop = 0;
  const du = cuon.scrollHeight - cuon.clientHeight > 2;
  hop.classList.toggle("co-cuon", du);
  hop.classList.remove("het-cuon");
}
$("#callRoll") && $("#callRoll").addEventListener("scroll", () => {
  const cuon = $("#callRoll");
  const day = cuon.scrollTop + cuon.clientHeight >= cuon.scrollHeight - 2;
  $("#callBubble").classList.toggle("het-cuon", day);
});

/** ON-Language nói: hiện câu, chạy hoạt ảnh, nhảy một nhịp mỗi từ cho khớp miệng.
    audioUrl (nếu có): câu tiếng Anh Claude vừa nghĩ ra, máy chủ đã đọc sẵn bằng
    MeloTTS (giọng thật, không phải giọng máy) — phát file này thay vì gọi
    speechSynthesis. Không đồng bộ khớp miệng theo từng từ được (file âm thanh
    không có sự kiện onboundary như SpeechSynthesisUtterance) nên nhịp miệng ở
    đây chỉ đều đều theo thời gian, không khớp chính xác từng từ như giọng máy. */
function monSays(en, vi, after, py, audioUrl) {
  const L = langInfo(C.lang);
  $("#callSaidLang").textContent = L.name;
  $("#callSaidLang").hidden = C.mode !== "free";
  $("#callSaid").textContent = en;
  $("#callSaidPy").textContent = py || "";
  $("#callSaidPy").hidden = !py;
  $("#callSaidVi").textContent = S.showVi ? (vi || "") : "";
  chinhCuonNoi();
  const m = $("#callMascot");
  m.classList.add("talking"); datVideo(true);
  setState("Đang nói…");

  let ended = false, canh = null;
  const done = () => {
    if (ended) return;
    ended = true;
    clearInterval(canh);
    C.speaking = false; C.sayDone = null;
    m.classList.remove("talking", "pulse");
    // Nói xong là về đoạn nghỉ. Thiếu dòng này thì video chạy mãi, ON-Language nhép
    // miệng cả lúc đang nghe người học nói.
    datVideo(false);
    if (after) after();
  };
  C.speaking = true; C.sayDone = done;
  const caoDo = S.kidVoice ? KID_PITCH : 1;
  const nhip = () => { m.classList.remove("pulse"); void m.offsetWidth; m.classList.add("pulse"); };
  // Mã tiếng do máy chủ báo có lúc sai. Chữ trong câu mới là bằng chứng thật:
  // có dấu tiếng Việt, có chữ Hán, có kana… thì theo chữ, đừng theo mã.
  const tuChu = tiengCua(en);
  const gocChu = tuChu.split("-")[0], gocMa = chuanTag(L.tts).split("-")[0];
  const doc = (tuChu !== "en-GB" && gocChu !== gocMa) ? tuChu : L.tts;
  const khuc = [{ text: en, lang: doc, pitch: caoDo, onTu: nhip }];

  if (!S.sound) { setTimeout(done, 700 + en.length * 45); return; }

  // Có giọng thật (MeloTTS) cho câu tiếng Anh này thì phát file đó, khỏi qua
  // giọng máy — nhịp miệng đều đều theo thời gian vì không có mốc từng từ.
  if (audioUrl) {
    try {
      const am = new Audio(audioUrl);
      const soTu = Math.max(1, en.split(/\s+/).filter(Boolean).length);
      let nhipHen = null;
      am.addEventListener("loadedmetadata", () => {
        const khoang = isFinite(am.duration) && am.duration > 0 ? (am.duration * 1000) / soTu : 260;
        nhipHen = setInterval(nhip, Math.max(120, khoang));
      });
      const xongPhat = () => { clearInterval(nhipHen); done(); };
      am.addEventListener("ended", xongPhat);
      am.addEventListener("error", xongPhat);
      am.play().catch(xongPhat);
      return;
    } catch { /* rơi xuống giọng máy bên dưới */ }
  }

  if (!window.speechSynthesis) {
    setTimeout(done, 700 + en.length * 45);
    return;
  }
  try {
    let daBatDau = false;
    docLanLuot(khuc, done, () => { daBatDau = true; });
    // KHÔNG được chốt "nói xong" bằng đồng hồ hẹn giờ — hẹn hụt là video nhảy về
    // đoạn nghỉ trong khi loa vẫn đang kêu: nhân vật đứng im mà tiếng vẫn phát ra.
    // Hỏi thẳng máy xem còn đang đọc không, nửa giây một lần.
    const t0 = Date.now();
    canh = setInterval(() => {
      const dangDoc = speechSynthesis.speaking || speechSynthesis.pending;
      // Chưa kịp bắt đầu thì chờ thêm; quá 2 giây mà vẫn im thì máy này không có
      // giọng cho thứ tiếng đó — thoát sớm, không để người học ngồi nhìn nút khoá.
      if (!daBatDau && !dangDoc) { if (Date.now() - t0 > 2000) done(); return; }
      if (!dangDoc) done();
      else if (Date.now() - t0 > 60000) done();   // chặn trên, phòng máy treo
    }, 500);
  } catch { done(); }
}

/* ----- bắt đầu / kết thúc ----- */
function startCall(mode) {
  C.mode = mode;
  // Luyện hội thoại trong bài luôn là tiếng Anh vì đó là lời thoại đã học.
  // Giờ học luôn là tiếng Anh; tán gẫu thì bắt đầu bằng tiếng của máy rồi
  // bám theo người học từ lượt sau.
  C.lang = mode === "free" ? deviceLang() : "en";
  $("#callSaidPy").hidden = true;
  $("#callSaidLang").hidden = true;
  C.msgs = []; C.target = null;
  C.right = 0; C.asked = 0; C.busy = false;
  $("#callLog").textContent = "";
  $("#callHeard").hidden = true;
  $("#callChoices").hidden = true;
  $("#callTask").hidden = true;
  // Nói chuyện tự do thì LUÔN để sẵn ô gõ chữ. Các chế độ còn lại thì chỉ ẩn ô gõ khi
  // SR CÓ THẬT — nhưng trên iPhone mở từ màn hình chính, `SR` vẫn tồn tại (đối tượng có
  // thật) nhưng KHÔNG CHẠY được — đây chính là chỗ thầy báo "bấm mic không ghi được và
  // không có phản hồi": ô gõ bị ẩn đi vì code tưởng có SR là mic chạy được, người học không
  // còn đường nào khác để trả lời, phải chờ tới 60 giây mới thấy gì.
  $("#callType").hidden = (mode === "free" || isIosStandalone()) ? false : !!SR;
  $("#btnMic").disabled = !SR;
  $("#callYou").hidden = true;
  $("#call").classList.remove("show-log");
  $("#btnCallLog").setAttribute("aria-pressed", "false");
  $("#call").hidden = false;
  document.body.style.overflow = "hidden";
  // Dò lại ở đây nữa: vào thẳng cuộc gọi mà không qua tab Gọi thì renderCall
  // không chạy, thiếu dòng này là ngồi nhìn ảnh tĩnh.
  doVideoMon(); batVideo();
  fitScene();

  C.t0 = Date.now();
  clearInterval(C.timer);
  C.timer = setInterval(() => {
    const s = Math.floor((Date.now() - C.t0) / 1000);
    $("#callTimer").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }, 1000);
  $("#callTimer").textContent = "00:00";

  setState("Đang kết nối…");
  // "teach" giờ chạy hẳn ở máy, không gọi mạng nữa — đúng như lời hứa trên màn hình.
  if (mode === "teach") teachOffline(true);
  else askTutor(true);
}
function endCall(finished) {
  stopListening();
  clearInterval(C.timer);
  $("#callYou").hidden = true;
  $("#call").hidden = true;
  document.body.style.overflow = "";
  stopSpeak();
  const mins = (Date.now() - C.t0) / 60000;
  if (finished !== false && (C.right > 0 || C.msgs.length > 2)) {
    const xp = C.mode === "teach"
      ? 5 + (C.asked && C.right === C.asked ? 5 : 0)
      : clamp(Math.round(mins * 4), 3, 15);
    markStudied(); addXp(xp); save();
    toast(C.mode === "teach"
      ? `Xong buổi học: ${C.right}/${C.asked} câu đọc đạt · +${xp} XP`
      : `Nói chuyện ${Math.max(1, Math.round(mins))} phút · +${xp} XP`);
  }
  paintStats();
  go("call");
}

/* ----- chế độ nói chuyện tự do ----- */
async function askTutor(first) {
  if (C.busy) return;
  C.busy = true;
  setState("Đang nghĩ…", "think");
  $("#btnMic").disabled = true;
  try {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      credentials: "same-origin",   // để máy chủ biết ai đang gọi, phục vụ gói Pro
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // __START__ là dấu hiệu mở màn: ON-Language chào bằng tiếng Việt và mời
        // người học cứ nói tiếng gì cũng được.
        history: first ? [{ role: "user", content: "__START__" }] : C.msgs,
        mode: C.mode,
        style: C.mode === "free" ? styleBrief() : null,
        level: level().code,
        words: seenWords().slice(-60).map(w => w.en),
      }),
    });
    if (res.status === 402) {
      // Chưa có gói Pro. Mời nâng cấp chứ đừng báo lỗi chung chung.
      const j = await res.json().catch(() => ({}));
      C.busy = false;
      setState("Cần gói Pro");
      $("#callSaid").textContent = j.error || "Phần này nằm trong gói Pro.";
      $("#callSaidVi").textContent = "";
      chinhCuonNoi();
      openSheet({
        title: "Nâng cấp ON-Language Pro",
        body: "Học 60 bài thì miễn phí mãi. Riêng phần gọi nói chuyện tự do với ON-Language cần gói Pro.",
        yes: "Xem gói Pro", no: "Để sau",
        onYes() { endCall(false); moPro(); }   // mở ngay trong app
      });
      return;
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Không gọi được máy chủ");
    }
    const data = await res.json();
    // ON-Language đáp bằng thứ tiếng nào thì từ đây nói và nghe bằng thứ tiếng đó.
    if (/^[a-z]{2}$/.test(data.lang || "")) C.lang = data.lang;
    C.msgs.push({ role: "assistant", content: data.reply });
    if (!first) pushLog("mon", data.reply);
    // Giờ học: mỗi lượt giáo viên ra một câu cho mình đọc theo.
    if (C.mode === "teach") {
      if (data.task) {
        C.target = { en: data.task, vi: data.taskVi || "" };
        C.asked++;
        $("#callTarget").textContent = data.task;
        $("#callTargetVi").textContent = S.showVi ? (data.taskVi || "") : "";
        $("#callTask").hidden = false;
      } else {
        // Giáo viên thấy họ nói trơn nên không gợi ý gì — bỏ hẳn câu cũ đi,
        // không thì lượt sau lại đem câu cũ ra chấm.
        C.target = null;
        $("#callTask").hidden = true;
      }
    }
    // Mở micro ngay khi ON-Language bắt đầu nói, đừng đợi nó nói xong. Người học
    // phải cắt lời được, không thì ngồi chờ cả chục giây mới tới lượt mình.
    C.busy = false;
    $("#btnMic").disabled = !SR;
    monSays(data.reply, data.vi, () => {
      if (!C.listening) setState("Tới lượt bạn");
    }, data.py, data.audio);
  } catch (err) {
    C.busy = false;
    setState("Mất kết nối");
    $("#callSaid").textContent = "ON-Language chưa nói chuyện tự do được lúc này.";
    $("#callSaidVi").textContent = String(err.message || "").slice(0, 120);
    chinhCuonNoi();
    $("#btnMic").disabled = true;
    openSheet({
      title: "Chưa gọi tự do được",
      body: "Chế độ nói chuyện tự do cần mạng. Bạn chuyển sang luyện hội thoại trong bài nhé — cái này chạy được cả khi không có mạng.",
      yes: "Luyện hội thoại trong bài", no: "Đóng",
      onYes() { startCall("teach"); }
    });
  }
}

/* ----- chế độ luyện lời thoại trong bài ----- */
/* Không nói được thì gõ chữ. Trước đây còn dựng sẵn ba câu để chọn, nhưng giờ
   câu mẫu do giáo viên tự nghĩ ra từng lượt nên không bịa được câu sai nữa. */
function showChoices() {
  $("#callChoices").hidden = true;
  $("#callType").hidden = false;
  $("#callInput").focus();
}

function heardReply(text, score) {
  if (C.mode === "free") {
    const g = guessLang(text);
    if (g) C.lang = g;
    noteStyle(text);
    pushLog("you", text);
    C.msgs.push({ role: "user", content: text });
    $("#callHeard").hidden = true;
    askTutor(false);
    return;
  }
  // Giờ học. Chỗ này từng làm hỏng cả cuộc nói chuyện: câu nào cũng bị chấm so
  // với câu gợi ý rồi báo lên cho giáo viên, nên thầy tưởng lượt nào học trò cũng
  // đọc sai, cứ thế bắt đọc lại mà chẳng nghe họ NÓI GÌ.
  // Nay: nói khác hẳn câu gợi ý nghĩa là họ đang TRẢ LỜI, không phải đọc hỏng.
  const pct = C.target
    ? Math.round((score != null ? score : similar(text, C.target.en)) * 100)
    : null;
  const coDoc = pct != null && pct >= 30;   // có cố đọc theo câu gợi ý
  const ok = pct != null && pct >= 70;
  const h = $("#callHeard");
  if (coDoc) {
    h.hidden = false;
    h.className = "call-heard " + (ok ? "ok" : "bad");
    $("#callHeardText").textContent = ok
      ? `Đọc tốt: “${text}”`
      : `Nghe được: “${text}” — mới khớp ${pct}% câu gợi ý`;
  } else {
    h.hidden = true;   // họ nói ý của họ, không có gì để chấm
  }
  if (ok) C.right++;
  pushLog("you", text);
  C.msgs.push({
    role: "user",
    content: text + (coDoc ? ` [Họ đang đọc câu gợi ý "${C.target.en}" — máy nghe khớp ${pct}%]` : ""),
  });
  $("#callTask").hidden = true;
  teachOffline(false, ok);
}

/* ----- micro ----- */
/* Thứ tiếng nào máy này không nghe được thì nhớ lại, lần sau khỏi thử. */
const NO_LISTEN = {};

/** iPhone chạy app từ màn hình chính (chế độ standalone) thì bộ nghe giọng nói
    thường không hoạt động, dù trình duyệt vẫn khai là có. Phải nói trước cho người
    dùng biết, không thì họ tưởng app hỏng. */
function isIosStandalone() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone === true
    || matchMedia("(display-mode: standalone)").matches;
  return ios && standalone;
}

/** Báo cho người học biết máy không nghe được, và mở sẵn ô gõ chữ.
    Trước đây bộ nghe tắt lặng lẽ, không một dòng chữ — người dùng tưởng hỏng micro. */
function micFailed(msg) {
  setState("Không nghe được");
  toast(isIosStandalone()
    ? "Micro không chạy khi mở từ màn hình chính. Bạn gõ chữ, hoặc mở bằng Safari."
    : msg);
  $("#callType").hidden = false;
  $("#callInput").focus();
}

/* Nghe cho hết câu. Trình duyệt hay chốt sớm sau mỗi khoảng lặng ngắn, nên nếu
   cứ thấy "kết quả cuối" là gửi đi thì người ta mới ngập ngừng một nhịp đã bị
   cắt lời. Cách làm: gom hết các mẩu lại, mỗi lần còn nghe thấy tiếng thì lùi
   hạn chót; im đủ NGHE_LANG mới coi là nói xong. Trình duyệt tự tắt giữa chừng
   thì mở lại mà nghe tiếp. */
const NGHE_LANG = 2500;      // im lặng bấy nhiêu mili giây thì coi như hết câu
const NGHE_TOI_DA = 60000;   // trần an toàn cho một lượt nói
const MO_LAI_TOI_DA = 12;    // số lần mở lại bộ nghe, chặn vòng lặp khi micro hỏng

function startListening() {
  if (!SR || C.listening || C.busy) return;
  const r = new SR();
  C.rec = r; C.listening = true;
  const lg = NO_LISTEN[C.lang] ? "en" : C.lang;
  r.lang = langInfo(lg).sr;
  r.interimResults = true;
  r.maxAlternatives = 3;
  try { r.continuous = true; } catch { /* máy nào không cho thì thôi */ }

  $("#btnMic").classList.add("listening");
  $("#callMascot").classList.add("listening");
  $("#callYou").hidden = false;
  const oNghe0 = $("#callYouText");
  if (oNghe0) oNghe0.textContent = "ON-Language đang nghe bạn nói…";
  setState("Đang nghe bạn…", "listen");

  let xong = false, dungHan = false;
  let daNoi = "", tam = "", altCuoi = null;
  let moLai = 0;
  const batDau = Date.now();

  /** Chốt lượt nghe: gom hết những gì nghe được rồi gửi đi. */
  const chot = () => {
    if (xong) return;
    xong = true; dungHan = true;
    clearTimeout(C.im); clearTimeout(C.watch);
    const t = (daNoi + " " + tam).trim();
    stopListening();
    if (!t) { micFailed("Không nghe rõ, bạn nói lại hoặc gõ chữ nhé."); return; }
    const alts = altCuoi && altCuoi.length ? altCuoi : [t];
    if (C.mode === "free" || !C.target) heardReply(t);
    else heardReply(t, alts.reduce((best, x) => Math.max(best, similar(x, C.target.en)), 0));
  };
  C.chotNghe = chot;

  /** Còn nghe thấy tiếng thì lùi hạn chót ra sau. */
  const hoanLai = () => {
    clearTimeout(C.im);
    C.im = setTimeout(chot, NGHE_LANG);
  };

  r.onresult = e => {
    let fin = "", int = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) { fin += res[0].transcript + " "; altCuoi = [...res].map(x => x.transcript); }
      else int += res[0].transcript + " ";
    }
    if (fin.trim()) daNoi = (daNoi + " " + fin).trim();
    tam = int.trim();
    const hien = (daNoi + " " + tam).trim();
    if (hien) setState("Nghe: " + hien.slice(-38), "listen");
    // Hiện luôn ngay trong ô "đang nghe" cho to và rõ. Dòng nhỏ trên đỉnh dễ bỏ qua,
    // nên người học không biết máy có ăn tiếng mình hay không.
    const oNghe = $("#callYouText");
    if (oNghe) oNghe.textContent = hien || "ON-Language đang nghe bạn nói…";
    hoanLai();
  };

  r.onerror = ev => {
    if (xong) return;
    if (ev.error === "no-speech") {
      // Chưa nói gì thì cứ nghe tiếp, đừng vội tắt.
      if (!daNoi && !tam && Date.now() - batDau < NGHE_TOI_DA) return;
      chot();
      return;
    }
    if (ev.error === "language-not-supported" && C.lang !== "en") {
      xong = true; dungHan = true; clearTimeout(C.im); clearTimeout(C.watch); stopListening();
      NO_LISTEN[C.lang] = true;
      C.lang = "en";
      toast("Máy chưa nghe được tiếng đó, chuyển sang nghe tiếng Anh.");
      setTimeout(startListening, 250);
      return;
    }
    if (daNoi || tam) { chot(); return; }
    xong = true; dungHan = true; clearTimeout(C.im); clearTimeout(C.watch); stopListening();
    micFailed(ev.error === "not-allowed"
      ? "Chưa được cấp quyền micro. Vào Cài đặt cho phép rồi thử lại, hoặc gõ chữ nhé."
      : "Máy không nghe được (" + ev.error + "). Bạn gõ chữ bên dưới nhé.");
  };

  r.onend = () => {
    if (xong) return;
    // Trình duyệt tự tắt nhưng người ta chưa dừng hẳn: mở lại mà nghe tiếp.
    if (!dungHan && moLai < MO_LAI_TOI_DA && Date.now() - batDau < NGHE_TOI_DA) {
      moLai++;
      try { r.start(); return; } catch { /* mở lại không được thì chốt */ }
    }
    if (daNoi || tam) { chot(); return; }
    xong = true; clearTimeout(C.im); clearTimeout(C.watch); stopListening();
    micFailed("Máy chưa nghe được gì. Bạn bấm micro nói lại, hoặc gõ chữ bên dưới.");
  };

  clearTimeout(C.watch);
  C.watch = setTimeout(chot, NGHE_TOI_DA);

  // LOA ĐANG KÊU THÌ MICRO KHÔNG NGHE ĐƯỢC GÌ. App có thể đã coi là "nói xong"
  // trong khi máy vẫn đang phát nốt — nhất là trên iPhone, đường tiếng đổi qua
  // lại mất một nhịp. Nên cắt tiếng trước, rồi ĐỢI cho nó im hẳn mới mở micro.
  stopSpeak();
  const moMic = () => {
    if (xong) return;
    try {
      r.start();
    } catch (err) {
      xong = true; clearTimeout(C.watch); stopListening();
      micFailed("Không mở được micro. Bạn gõ chữ bên dưới nhé.");
    }
  };
  let doi = 0;
  const doiLoaTat = () => {
    const conKeu = window.speechSynthesis &&
      (speechSynthesis.speaking || speechSynthesis.pending);
    // Chờ tối đa 0,7 giây thôi — có máy báo "đang nói" mãi không thôi, chờ nữa
    // thì người học đứng đợi không biết để làm gì.
    if (!conKeu || ++doi > 7) return moMic();
    setTimeout(doiLoaTat, 100);
  };
  doiLoaTat();
}
function stopListening() {
  C.listening = false;
  C.chotNghe = null;
  clearTimeout(C.watch);
  clearTimeout(C.im);
  $("#btnMic").classList.remove("listening");
  $("#callMascot").classList.remove("listening");
  $("#callYou").hidden = true;
  if (!C.busy) setState("Tới lượt bạn");
  if (C.rec) { try { C.rec.stop(); } catch {} C.rec = null; }
}

/* ----- nút ----- */
function sendTyped() {
  const v = $("#callInput").value.trim();
  if (!v || C.busy) return;
  $("#callInput").value = "";
  // Chữ gõ tay thì đọc được chắc chắn — bắt thứ tiếng ngay, khỏi đợi máy chủ.
  const g = guessLang(v);
  if (C.mode === "free" && g) C.lang = g;
  heardReply(v);
}
$("#btnStartFree").addEventListener("click", () => { primeSpeech(); startCall("free"); });
$("#btnStartCall").addEventListener("click", () => { primeSpeech(); startCall("teach"); });
$("#btnMic").addEventListener("click", () => {
  primeSpeech();
  // Đang nói dở mà người học bấm micro thì cắt lời ngay — như nói chuyện thật.
  // Đang nghe mà bấm nút là ý "tớ nói xong rồi" — phải gửi đi, đừng vứt bỏ.
  if (C.listening) { (C.chotNghe || stopListening)(); return; }
  if (C.speaking) {
    stopSpeak();
    if (C.sayDone) C.sayDone();
    setTimeout(startListening, 200);   // iPhone cần một nhịp để đổi đường tiếng
    return;
  }
  startListening();
});
$("#btnHangup").addEventListener("click", () => endCall(true));
$("#btnCallLog").addEventListener("click", () => {
  const on = $("#call").classList.toggle("show-log");
  $("#btnCallLog").setAttribute("aria-pressed", String(on));
  if (on) { const l = $("#callLog"); l.scrollTop = l.scrollHeight; }
  fitScene();
});
$("#btnCallHear").addEventListener("click", () => { primeSpeech(); speak($("#callSaid").textContent); });

/* Thẻ Gọi Air: bấm vào là ON-Language chào ngay — để thấy nó cử động và nói được thật. */
const PREVIEW_LINES = [
  { en: "Hi! I am ON-Language. Let us speak English!", vi: "Chào! Tớ là ON-Language. Mình nói tiếng Anh nhé!" },
  { en: "Tap the green button and talk to me.", vi: "Bấm nút xanh rồi nói chuyện với tớ nhé." },
  { en: "Do not worry. Just try your best!", vi: "Đừng lo. Cứ thử hết sức nhé!" },
];
let previewTurn = 0;
$("#callPreview").addEventListener("click", () => {
  primeSpeech();
  const line = PREVIEW_LINES[previewTurn++ % PREVIEW_LINES.length];
  const box = $("#previewMon");
  toast(line.vi);
  box.classList.add("talking"); datVideo(true);
  let ended = false;
  const stop = () => { if (ended) return; ended = true; box.classList.remove("talking", "pulse"); datVideo(false); };
  if (!S.sound) { setTimeout(stop, 600 + line.en.length * 45); return; }
  // Chỗ này trước đây đọc thẳng bằng giọng máy, không đi qua kho tiếng thu sẵn
  // — nên cả app đã đổi giọng rồi mà riêng màn Gọi Air vẫn "giọng cũ".
  const fTruoc = fileTieng(line.en, "en-GB");
  if (fTruoc) {
    // Miệng nhân vật vẫn mấp máy theo nhịp, chỉ khác là tiếng lấy từ file.
    const nhip = setInterval(() => {
      box.classList.remove("pulse"); void box.offsetWidth; box.classList.add("pulse");
    }, 320);
    const dung = () => { clearInterval(nhip); stop(); };
    if (phatTiengThu(fTruoc, false, dung)) return;
    clearInterval(nhip);
  }
  if (!window.speechSynthesis) { setTimeout(stop, 600 + line.en.length * 45); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line.en);
    dungGiong(u, tiengCua(line.en)); apToc(u, 0.94);
    u.pitch = S.kidVoice ? KID_PITCH : 1;
    u.onboundary = () => { box.classList.remove("pulse"); void box.offsetWidth; box.classList.add("pulse"); };
    u.onend = stop; u.onerror = stop;
    speechSynthesis.speak(u);
    setTimeout(stop, 1400 + line.en.length * 95);
  } catch { stop(); }
});
$("#btnCallSkip").addEventListener("click", showChoices);
$("#btnCallSend").addEventListener("click", sendTyped);
$("#callInput").addEventListener("keydown", e => { if (e.key === "Enter") sendTyped(); });

/* ---------- 18c. Gói ON-Language Pro ----------
   Màn bán gói nằm hẳn trong app. Máy chủ chỉ lo hai việc app không làm được:
   sinh mã QR có sẵn số tiền, và nghe ngân hàng báo tiền về. App và web cùng
   một tên miền nên dùng chung phiên đăng nhập, chỉ cần gọi kèm credentials. */
const PRO_URL = "../pro/api";
const P2 = { data: null, don: null, dongHo: null };

const tien = n => Number(n || 0).toLocaleString("vi-VN") + " đ";
const ngayVN = d => new Date(d).toLocaleDateString("vi-VN");

async function moPro() {
  $("#pro").hidden = false;
  document.body.style.overflow = "hidden";
  $("#proBody").textContent = "";
  $("#proBody").append(el("h1", null, "Đang tải…"));
  try {
    const r = await fetch(PRO_URL + "/goi", { credentials: "same-origin" });
    P2.data = await r.json();
    veManPro();
  } catch {
    $("#proBody").textContent = "";
    $("#proBody").append(el("h1", null, "Chưa xem được gói"));
    $("#proBody").append(el("p", "pro-sub", "Kiểm tra lại mạng rồi mở lại nhé."));
  }
}

function dongPro() {
  clearInterval(P2.dongHo);
  P2.dongHo = null; P2.don = null;
  $("#pro").hidden = true;
  document.body.style.overflow = "";
}

/** Màn chính: tiêu đề, các gói, nút dùng thử. */
function veManPro() {
  const d = P2.data;
  const b = $("#proBody");
  b.textContent = "";

  const h = el("h1");
  h.append(document.createTextNode("Gọi video với ON-Language, "));
  h.append(el("em", null, `miễn phí ${d.ngayDungThu} ngày`));
  b.append(h);
  b.append(el("p", "pro-sub", "Kèm toàn bộ tính năng Pro."));

  if (!d.thuPhi) {
    const n = el("div", "pro-note free");
    n.append(document.createTextNode("Mọi thứ đang miễn phí cho tất cả mọi người."));
    n.append(el("small", null, "Màn này đang chờ sẵn. Khi nào bắt đầu thu phí sẽ báo trước."));
    b.append(n);
  }
  if (d.pro) {
    const n = el("div", "pro-note have");
    n.append(document.createTextNode(`Bạn đang có gói Pro, hạn tới ${ngayVN(d.proUntil)}.`));
    if (d.maNhom) {
      n.append(el("small", null,
        `Mã nhóm gia đình: ${d.maNhom} — đang có ${d.soThanhVien}/${d.toiDaNhom} người dùng chung.`));
    }
    b.append(n);
  }
  if (!d.sanSang) {
    b.append(el("div", "pro-note warn", "Thầy chưa bật tài khoản nhận tiền, chưa mua được."));
  }

  // Xếp gói năm lên trước cho nổi bật, đúng kiểu các app hay làm.
  const thuTu = ["year", "family", "month"];
  thuTu.forEach(ma => {
    const g = d.goi.find(x => x.ma === ma);
    if (!g) return;
    b.append(theGoi(g, ma === "year", d));
  });

  if (!d.dangNhap) {
    const nut = el("button", "pro-cta", "Đăng nhập để bắt đầu");
    nut.type = "button";
    nut.addEventListener("click", () => { location.href = "../auth/login?next=/english-air/"; });
    b.append(nut);
  } else if (d.duocDungThu) {
    const nut = el("button", "pro-cta", "Bắt đầu dùng thử miễn phí");
    nut.type = "button";
    nut.addEventListener("click", dungThu);
    b.append(nut);
  }

  b.append(el("p", "pro-fine",
    `Dùng thử ${d.ngayDungThu} ngày, không cần thẻ. Hết ${d.ngayDungThu} ngày tài khoản tự quay ` +
    "về bản miễn phí — không tự trừ tiền của bạn, vì app không giữ thông tin thanh toán nào cả."));

  if (d.dangNhap && !d.maNhom) b.append(oVaoNhom());
}

function theGoi(g, noiBat, d) {
  const the = el("div", "pro-plan" + (noiBat ? " best" : ""));
  if (noiBat) the.append(el("span", "pro-tag", "Đề xuất"));

  const hang = el("div", "pro-row");
  hang.append(el("b", null, g.ten));
  const gia = el("span", "pro-price");
  gia.append(document.createTextNode(tien(g.moiThang)));
  gia.append(el("span", null, "/thg"));
  hang.append(gia);
  the.append(hang);

  if (g.nguoi > 1) the.append(el("p", "sub", `Dành cho tối đa ${g.nguoi} thành viên.`));
  else if (g.thang === 1) the.append(el("p", "sub", "Trả từng tháng, dừng lúc nào cũng được."));

  if (g.thang > 1) {
    the.append(el("div", "pro-dash"));
    const full = el("div", "pro-full");
    full.append(el("span", null, "Trả một lần cả năm"));
    full.append(document.createTextNode(tien(g.tien) + "/năm"));
    the.append(full);
    if (g.nguoi > 1) {
      the.append(el("div", "pro-save",
        `Chỉ ${tien(Math.round(g.tien / g.nguoi / 12))} mỗi người mỗi tháng nếu đủ ${g.nguoi} người`));
    } else {
      const thang = d.goi.find(x => x.ma === "month");
      if (thang) {
        const re = Math.round((1 - g.moiThang / thang.moiThang) * 100);
        the.append(el("div", "pro-save", `Rẻ hơn ${re}% so với trả từng tháng`));
      }
    }
  }

  // Nút luôn hiện. Trước đây chưa cấu hình ngân hàng thì tôi ẩn nút đi, thành ra
  // bấm vào thẻ chẳng có gì xảy ra — người dùng tưởng app hỏng.
  const nut = el("button", "btn " + (noiBat ? "btn-primary" : "btn-soft") + " btn-block mt");
  nut.type = "button";
  nut.textContent = "Mua " + g.ten.toLowerCase();
  nut.addEventListener("click", ev => { ev.stopPropagation(); chonGoi(g.ma); });
  the.append(nut);

  // Bấm vào chỗ nào trong thẻ cũng được, không phải nhắm đúng cái nút.
  the.addEventListener("click", () => chonGoi(g.ma));
  the.style.cursor = "pointer";
  return the;
}

/** Bấm chọn một gói. Mỗi nhánh đều phải nói cho người ta biết chuyện gì đang xảy ra. */
function chonGoi(ma) {
  const d = P2.data || {};
  if (!d.dangNhap) {
    openSheet({
      title: "Cần đăng nhập trước",
      body: "Gói Pro gắn với tài khoản của bạn, nên phải đăng nhập rồi mới mua được.",
      yes: "Đăng nhập", no: "Để sau",
      onYes() { location.href = "../auth/login?next=/english-air/"; }
    });
    return;
  }
  if (!d.sanSang) {
    openSheet({
      title: "Chưa mở bán được",
      body: "Thầy Đinh Thi chưa bật tài khoản nhận tiền cho app, nên chưa ai mua gói được. " +
            "Khi nào bật xong, bấm vào đây sẽ ra mã QR để quét bằng app ngân hàng.",
      yes: "Đã hiểu", no: "Đóng",
      onYes() {}
    });
    return;
  }
  muaGoi(ma);
}

function oVaoNhom() {
  const box = el("div", "pro-join");
  box.append(el("b", null, "Người nhà đã mua gói gia đình?"));
  box.append(el("p", "sub", "Nhập mã nhóm họ gửi cho bạn để dùng chung."));
  const f = el("form");
  const inp = el("input"); inp.placeholder = "VD: GD7F3KQP"; inp.required = true;
  const nut = el("button", "btn btn-soft"); nut.type = "submit"; nut.textContent = "Vào nhóm";
  f.append(inp, nut);
  f.addEventListener("submit", async ev => {
    ev.preventDefault();
    const r = await fetch(PRO_URL + "/vao-nhom", {
      method: "POST", credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ma: inp.value }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      box.querySelectorAll(".pro-err").forEach(x => x.remove());
      box.append(el("p", "pro-err", j.error || "Không vào được nhóm."));
      return;
    }
    toast("Đã vào nhóm gia đình!");
    moPro();
  });
  box.append(f);
  return box;
}

async function dungThu() {
  const r = await fetch(PRO_URL + "/dung-thu", { method: "POST", credentials: "same-origin" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { toast(j.error || "Chưa bật dùng thử được."); return; }
  toast(`Đã mở ${P2.data.ngayDungThu} ngày dùng thử!`);
  moPro();
}

/** Chọn gói xong thì hiện mã QR ngay trong app, và chờ tiền về. */
async function muaGoi(plan) {
  const r = await fetch(PRO_URL + "/mua", {
    method: "POST", credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) { location.href = j.dangNhap || "../auth/login"; return; }
  if (!r.ok) { toast(j.error || "Chưa tạo được đơn."); return; }
  P2.don = j;
  veManQR(j);
}

function veManQR(don) {
  const b = $("#proBody");
  b.textContent = "";
  b.append(el("h1", null, "Quét mã để trả tiền"));
  b.append(el("p", "pro-sub", `${don.ten} · ${tien(don.tien)}`));

  const box = el("div", "pro-qr mt");
  if (don.qr) {
    const img = el("img"); img.src = don.qr; img.alt = "Mã QR chuyển khoản"; img.decoding = "async";
    box.append(img);
  }
  box.append(el("p", "pro-fine",
    "Mở app ngân hàng bất kỳ rồi quét. Số tiền và nội dung đã điền sẵn. "
    + "Bạn KHÔNG phải nhập số thẻ ở đâu cả."));
  const cho = el("span", "pro-wait");
  cho.append(el("i"));
  // Chưa nối tự đối soát thì đừng hứa "vài giây" — thầy còn phải bấm duyệt tay.
  cho.append(document.createTextNode(don.tuDong
    ? "Đang chờ tiền về…"
    : "Đã chuyển rồi? Thầy sẽ xác nhận trong ít phút."));
  box.append(cho);
  b.append(box);

  const ck = el("div", "pro-ck");
  ck.append(el("b", null, "Không quét được thì chuyển tay"));
  const dl = el("dl");
  [["Ngân hàng", don.ck.nganHang], ["Số tài khoản", don.ck.soTaiKhoan],
   ["Chủ tài khoản", don.ck.chuTaiKhoan], ["Số tiền", tien(don.ck.soTien)]].forEach(([k, v]) => {
    const r = el("div", "r"); r.append(el("dt", null, k)); r.append(el("dd", null, String(v))); dl.append(r);
  });
  const rMa = el("div", "r");
  rMa.append(el("dt", null, "Nội dung"));
  rMa.append(el("dd", "ma", don.ck.noiDung));
  dl.append(rMa);
  ck.append(dl);
  ck.append(el("p", "pro-fine",
    `Nội dung chuyển khoản phải giữ đúng mã ${don.ck.noiDung}, sai mã thì máy không biết đơn của ai.`));
  b.append(ck);

  const quay = el("button", "btn btn-text btn-block mt", "Quay lại chọn gói");
  quay.type = "button";
  quay.addEventListener("click", () => { clearInterval(P2.dongHo); moPro(); });
  b.append(quay);

  // Hỏi máy chủ 3 giây một lần, tối đa 10 phút.
  clearInterval(P2.dongHo);
  const het = Date.now() + 10 * 60 * 1000;
  P2.dongHo = setInterval(async () => {
    if (Date.now() > het) { clearInterval(P2.dongHo); return; }
    try {
      const r = await fetch(PRO_URL + "/don/" + don.code, { credentials: "same-origin" });
      const j = await r.json();
      if (j.status !== "paid") return;
      clearInterval(P2.dongHo);
      veManXong();
    } catch { /* mất mạng một nhịp thì thôi, lát hỏi lại */ }
  }, 3000);
}

function veManXong() {
  const b = $("#proBody");
  b.textContent = "";
  const box = el("div", "pro-done");
  box.append(el("div", "tick", "✓"));
  box.append(el("h1", null, "Đã nhận được tiền"));
  box.append(el("p", "pro-sub", "Gói Pro đã mở. Cảm ơn bạn nhiều!"));
  const nut = el("button", "pro-cta", "Bắt đầu nói chuyện với ON-Language");
  nut.type = "button";
  nut.addEventListener("click", () => { dongPro(); primeSpeech(); startCall("free"); });
  box.append(nut);
  b.append(box);
}

$("#btnProClose").addEventListener("click", dongPro);


$$("#btnOpenPro, #btnOpenPro2").forEach(b => b.addEventListener("click", moPro));

/** Cập nhật chữ trên thẻ Pro: chưa mua thì khoe giá, mua rồi thì khoe hạn. */
async function veThePro() {
  try {
    const r = await fetch(PRO_URL + "/goi", { credentials: "same-origin" });
    const d = await r.json();
    P2.data = d;
    const re = d.goi.find(x => x.ma === "year");
    const phu = d.pro
      ? "Đang dùng Pro · hạn " + ngayVN(d.proUntil)
      : (d.thuPhi ? "Gọi thoải mái, không giới hạn" : "Đang mở miễn phí cho tất cả");
    const nut = d.pro ? "Gói của tôi" : (re ? "Từ " + tien(re.moiThang) + "/thg" : "Xem gói");
    $$("#pbSub, #pbSub2").forEach(x => { x.textContent = phu; });
    $$("#pbGia, #pbGia2").forEach(x => { x.textContent = nut; });
  } catch { /* mất mạng thì cứ để chữ mặc định */ }
}
veThePro();

/* ---------- 18d. Ảnh đại diện ----------
   Ba kiểu: giữ linh vật, chọn một mặt vui có sẵn, hoặc tải ảnh của mình.
   Ảnh tải lên được thu nhỏ về 256px rồi mới lưu — localStorage chỉ chứa được
   vài MB, nhét thẳng ảnh gốc từ máy ảnh điện thoại vào là tràn ngay. */
const MAT_VUI = [
  { e: "🦊", n: "linear-gradient(135deg,#F97316,#FDBA74)" },
  { e: "🐼", n: "linear-gradient(135deg,#334155,#94A3B8)" },
  { e: "🐱", n: "linear-gradient(135deg,#8B5CF6,#C4B5FD)" },
  { e: "🐨", n: "linear-gradient(135deg,#0EA5E9,#7DD3FC)" },
  { e: "🦁", n: "linear-gradient(135deg,#D97706,#FCD34D)" },
  { e: "🐸", n: "linear-gradient(135deg,#16A34A,#86EFAC)" },
  { e: "🐧", n: "linear-gradient(135deg,#1E293B,#64748B)" },
  { e: "🦉", n: "linear-gradient(135deg,#92400E,#D6AE7B)" },
  { e: "🐙", n: "linear-gradient(135deg,#DB2777,#F9A8D4)" },
  { e: "🦄", n: "linear-gradient(135deg,#A21CAF,#F0ABFC)" },
  { e: "🐯", n: "linear-gradient(135deg,#EA580C,#FDE047)" },
  { e: "🐵", n: "linear-gradient(135deg,#78350F,#FCD9A8)" },
];
const ANH_TOI_DA = 256;

/** Vẽ lại ô avatar trên màn Hồ sơ theo lựa chọn đang lưu. */
function veAvatar() {
  const o = $("#avFace");
  if (!o) return;
  const a = S.avatar || { k: "m" };
  o.textContent = "";
  o.className = "av-face";
  o.style.background = "";
  delete o.dataset.mascot;

  if (a.k === "a" && a.d) {
    const img = el("img");
    img.src = a.d; img.alt = ""; img.decoding = "async";
    o.append(img);
    return;
  }
  if (a.k === "e") {
    const m = MAT_VUI[a.i] || MAT_VUI[0];
    o.className = "av-face emoji";
    o.style.background = m.n;
    o.append(document.createTextNode(m.e));
    return;
  }
  // Mặc định: linh vật ON-Language, dùng lại đúng cơ chế thay ảnh sẵn có
  o.dataset.mascot = "head";
  o.append(svgUse("m-air-head", "0 0 120 120"));
  if (document.documentElement.classList.contains("has-mascot-img")) swapMascot(o);
}

function datAvatar(a) {
  S.avatar = a;
  save();
  veAvatar();
  closeSheet();
  toast("Đã đổi ảnh đại diện.");
}

function moChonAvatar() {
  const box = el("div");
  const luoi = el("div", "av-grid");

  // Ô đầu tiên trả về linh vật
  const oMon = el("button", "av-opt" + (!S.avatar || S.avatar.k === "m" ? " on" : ""));
  oMon.type = "button";
  oMon.setAttribute("aria-label", "Dùng linh vật ON-Language");
  oMon.style.background = "var(--brand-soft)";
  const mini = el("span", "av-mini");
  mini.dataset.mascot = "head";
  mini.append(svgUse("m-air-head", "0 0 120 120"));
  if (document.documentElement.classList.contains("has-mascot-img")) swapMascot(mini);
  oMon.append(mini);
  oMon.addEventListener("click", () => datAvatar({ k: "m" }));
  luoi.append(oMon);

  MAT_VUI.forEach((m, i) => {
    const b = el("button", "av-opt" + (S.avatar && S.avatar.k === "e" && S.avatar.i === i ? " on" : ""));
    b.type = "button";
    b.style.background = m.n;
    b.append(document.createTextNode(m.e));
    b.setAttribute("aria-label", "Chọn mặt " + m.e);
    b.addEventListener("click", () => datAvatar({ k: "e", i }));
    luoi.append(b);
  });
  box.append(luoi);

  const up = el("button", "av-up");
  up.type = "button";
  up.append(svgUse("i-camera", "0 0 24 24"));
  up.append(document.createTextNode("Tải ảnh từ máy"));
  up.addEventListener("click", () => $("#avFile").click());
  box.append(up);

  openSheet({
    title: "Ảnh đại diện",
    body: "Chọn một mặt có sẵn, hoặc tải ảnh của bạn lên. Ảnh chỉ lưu trên máy này.",
    no: "Đóng",
    slot: box,
  });
}

/** Thu nhỏ ảnh người dùng chọn về ô vuông 256px rồi lưu dạng chuỗi. */
function nhanAnh(file) {
  if (!file) return;
  if (!/^image\//.test(file.type)) { toast("Chọn một tệp ảnh nhé."); return; }
  const doc = new FileReader();
  doc.onerror = () => toast("Không đọc được ảnh.");
  doc.onload = () => {
    const img = new Image();
    img.onerror = () => toast("Ảnh này không mở được.");
    img.onload = () => {
      // Cắt vuông ở giữa rồi mới thu nhỏ, để mặt không bị bóp méo.
      const c = Math.min(img.width, img.height);
      const cv = el("canvas");
      cv.width = cv.height = ANH_TOI_DA;
      const g = cv.getContext("2d");
      g.drawImage(img, (img.width - c) / 2, (img.height - c) / 2, c, c, 0, 0, ANH_TOI_DA, ANH_TOI_DA);
      let data;
      try { data = cv.toDataURL("image/jpeg", 0.82); }
      catch { toast("Không xử lý được ảnh này."); return; }
      datAvatar({ k: "a", d: data });
    };
    img.src = doc.result;
  };
  doc.readAsDataURL(file);
}

const TEN_TOI_DA = 24;

function veTen() {
  const o = $("#profName");
  if (o) o.textContent = S.ten || "Người học";
}

function moDoiTen() {
  const box = el("div");
  const o = el("input", "ten-o");
  o.type = "text";
  o.value = S.ten || "";
  o.placeholder = "Người học";
  o.maxLength = TEN_TOI_DA;
  o.autocomplete = "nickname";
  o.setAttribute("aria-label", "Tên của bạn");
  box.append(o);

  const luu = () => {
    // Gộp khoảng trắng thừa: dán từ chỗ khác hay lọt cả tab và xuống dòng.
    S.ten = o.value.replace(/\s+/g, " ").trim().slice(0, TEN_TOI_DA);
    save();
    veTen();
    closeSheet();
    toast(S.ten ? "Đã đổi tên." : "Đã trả về tên mặc định.");
  };
  o.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); luu(); } });

  openSheet({
    title: "Tên của bạn",
    body: "Tên này chỉ hiện trong app trên máy bạn.",
    yes: "Lưu",
    no: "Huỷ",
    onYes: luu,
    slot: box,
  });
  // Bàn phím phải bật lên ngay, nhưng chỉ sau khi tấm trượt đã dựng xong.
  setTimeout(() => { o.focus(); o.select(); }, 60);
}

$("#btnName").addEventListener("click", moDoiTen);
veTen();

$("#btnAvatar").addEventListener("click", moChonAvatar);
$("#avFile").addEventListener("change", ev => {
  nhanAnh(ev.target.files && ev.target.files[0]);
  ev.target.value = "";   // chọn lại đúng ảnh cũ vẫn phải kích hoạt được
});
veAvatar();

/* ---------- 18d-b. Giữ tiến độ theo tài khoản ----------
   localStorage chỉ nằm trên đúng một máy: xoá app, đổi điện thoại hay dọn dữ
   liệu trình duyệt là mất sạch. Nay mỗi lần đổi gì thì đẩy lên máy chủ, và
   máy chủ GỘP chứ không đè — học lúc mất mạng rồi mới đồng bộ vẫn còn nguyên. */
const DB = { hen: null, dangGui: false, no: false, bat: false };
const DOI_MS = 4000;

/** Gộp nhiều lần lưu sát nhau thành một lượt gửi, đỡ phiền máy chủ. */
function henDayLen() {
  if (!DB.bat) return;
  clearTimeout(DB.hen);
  DB.hen = setTimeout(dayLen, DOI_MS);
}

async function dayLen() {
  if (!DB.bat) return;
  // Đang gửi dở thì ghi nợ, gửi xong sẽ gửi tiếp lần cuối.
  if (DB.dangGui) { DB.no = true; return; }
  DB.dangGui = true;
  try {
    const r = await fetch(TK_URL + "/tien-do", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tienDo: S }),
    });
    if (r.status === 401) { DB.bat = false; return; }   // đã đăng xuất
  } catch {
    // Mất mạng thì thôi, lần lưu sau sẽ gửi lại — tiến độ vẫn nằm trên máy.
  } finally {
    DB.dangGui = false;
    if (DB.no) { DB.no = false; henDayLen(); }
  }
}

/** Lúc đăng nhập: kéo bản trên máy chủ về, gộp với bản đang có rồi dùng bản gộp. */
async function keoVe() {
  try {
    const r = await fetch(TK_URL + "/tien-do", { credentials: "same-origin" });
    if (!r.ok) return false;
    const j = await r.json();
    DB.bat = true;
    if (!j.co || !j.tienDo) { dayLen(); return true; }   // máy chủ chưa có gì, đẩy bản máy lên

    // Gửi bản của máy lên để máy chủ gộp, rồi lấy về đúng bản đã gộp.
    const r2 = await fetch(TK_URL + "/tien-do", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tienDo: S }),
    });
    if (!r2.ok) return true;
    const j2 = await r2.json();
    if (!j2.tienDo) return true;

    S = Object.assign({}, DEFAULTS, j2.tienDo);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* riêng tư */ }
    applyTheme(); paintStats(); veTen(); veAvatar();
    if (!$("#view-learn").hidden) renderLearn();
    return true;
  } catch {
    return false;
  }
}

// Đóng app hay chuyển sang app khác thì gửi nốt, đừng để mất buổi học vừa rồi.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && DB.bat) { clearTimeout(DB.hen); dayLen(); }
});

/* ---------- 18e. Cửa vào: đăng ký / đăng nhập ----------
   App và web cùng tên miền nên dùng chung một phiên: gọi kèm credentials là
   cookie đăng nhập tự đi theo, app không phải giữ mật khẩu hay token nào. */
const TK_URL = "../api/english-air";
const TK = { toi: null, kieu: "dangKy" };

async function hoiTaiKhoan() {
  try {
    const r = await fetch(TK_URL + "/toi", { credentials: "same-origin" });
    TK.toi = await r.json();
  } catch {
    // Mất mạng thì đừng chặn người ta học — tiến độ vẫn nằm trên máy.
    TK.toi = { dangNhap: false, ngoaiTuyen: true };
  }
  return TK.toi;
}

function veCong() {
  const dangKy = TK.kieu === "dangKy";
  $("#congTitle").textContent = dangKy ? "Chào bạn, tớ là ON-Language" : "Chào bạn quay lại";
  $("#congSub").textContent = dangKy
    ? "Đăng ký để giữ tiến độ học của bạn trên mọi máy."
    : "Nhập số điện thoại và mật khẩu để học tiếp.";
  $("#oTen").hidden = !dangKy;
  $("#fTen").required = dangKy;
  $("#oEmail").hidden = !dangKy;
  $("#fEmail").required = dangKy;
  $("#fMk").autocomplete = dangKy ? "new-password" : "current-password";
  $("#fMk").placeholder = dangKy ? "Ít nhất 6 ký tự" : "Mật khẩu của bạn";
  $("#congGui").textContent = dangKy ? "Đăng ký" : "Đăng nhập";
  // "Quên mật khẩu" chỉ có nghĩa ở màn ĐĂNG NHẬP. Đặt ở đây chứ không đặt riêng
  // trong moBuoc1(), vì bấm đổi qua lại giữa hai màn cũng phải cập nhật theo.
  $("#congQuen").hidden = dangKy;
  // Tách phần dẫn và VIỆC CẦN LÀM ra hai thẻ: chữ "Đăng nhập" phải nổi hẳn lên,
  // chứ nằm lẫn trong một dòng chữ mờ thì không ai nhận ra là bấm được.
  const doi = $("#congDoi");
  doi.textContent = "";
  doi.append(el("span", "cong-doi-dan", dangKy ? "Đã có tài khoản?" : "Chưa có tài khoản?"),
             el("b", "cong-doi-viec", dangKy ? "Đăng nhập" : "Đăng ký"));
  loiCong("");
}

function loiCong(msg) {
  const o = $("#congLoi");
  o.textContent = msg || "";
  o.hidden = !msg;
}
function loiOtp(msg) {
  const o = $("#congOtpLoi");
  o.textContent = msg || "";
  o.hidden = !msg;
}

// Bước 1 (tên/sđt/email/mật khẩu, hoặc sđt/mật khẩu nếu đăng nhập).
function moBuoc1() {
  $("#congOtpForm").hidden = true;
  $("#congQuenForm").hidden = true;
  $("#congMkForm").hidden = true;
  $("#congForm").hidden = false;
  $("#congChanDuoi").hidden = false;
  veCong();
}

/* ---------- Quên mật khẩu ----------
   Trước đây ai quên mật khẩu là mất luôn tài khoản, không có đường nào lấy
   lại. Nay: nhập số điện thoại (hoặc email) → máy chủ gửi mã 6 số về email đã
   gắn với tài khoản → nhập mã và mật khẩu mới là vào được ngay. */
let QUEN_TOKEN = "";

function loiQuen(msg) { const o = $("#congQuenLoi"); o.textContent = msg || ""; o.hidden = !msg; }
function loiMkMoi(msg) { const o = $("#congMkLoi"); o.textContent = msg || ""; o.hidden = !msg; }

function moQuenMk() {
  $("#congForm").hidden = true;
  $("#congOtpForm").hidden = true;
  $("#congMkForm").hidden = true;
  $("#congChanDuoi").hidden = true;
  $("#congQuenForm").hidden = false;
  loiQuen("");
  $("#fQuen").value = $("#fSdt") ? $("#fSdt").value : "";
  setTimeout(() => $("#fQuen").focus(), 80);
}

function moDatLaiMk(email) {
  $("#congQuenForm").hidden = true;
  $("#congMkForm").hidden = false;
  $("#congMkSub").textContent = email
    ? `Nhập mã 6 số vừa gửi tới ${email}.`
    : "Nhập mã 6 số vừa gửi tới email của tài khoản.";
  loiMkMoi("");
  $("#fMaQuen").value = ""; $("#fMkMoi").value = "";
  setTimeout(() => $("#fMaQuen").focus(), 80);
}
// Bước 2 (nhập mã OTP vừa gửi qua email) — chỉ khi đăng ký.
function moBuocOtp(email) {
  $("#congForm").hidden = true;
  $("#congChanDuoi").hidden = true;
  $("#congOtpForm").hidden = false;
  $("#congOtpSub").textContent = `Nhập mã 6 số vừa gửi tới ${email}.`;
  loiOtp("");
  $("#fMa").value = "";
  setTimeout(() => $("#fMa").focus(), 80);
}

function moCong() {
  $("#cong").hidden = false;
  document.body.style.overflow = "hidden";
  moBuoc1();
  batGoogle();
  setTimeout(() => $(dangKyDangMo() ? "#fTen" : "#fSdt").focus(), 80);
}
const dangKyDangMo = () => TK.kieu === "dangKy";

function dongCong() {
  $("#cong").hidden = true;
  document.body.style.overflow = "";
}

/* Cửa đăng ký trước đây không có lối ra nào — ai chưa muốn đăng ký thì kẹt luôn,
   chẳng xem được app có gì mà quyết. Cho vào xem thử, tiến độ vẫn giữ trên máy,
   chỉ là chưa đồng bộ lên tài khoản. */
$("#congXemThu").addEventListener("click", () => {
  S.xemThu = true;
  save();
  dongCong();
  toast("Cứ xem thoải mái. Đăng ký lúc nào cũng được ở mục Hồ sơ.");
});

$("#congDoi").addEventListener("click", () => {
  TK.kieu = TK.kieu === "dangKy" ? "dangNhap" : "dangKy";
  veCong();
  $(dangKyDangMo() ? "#fTen" : "#fSdt").focus();
});

let OTP_TOKEN = null;

// Đăng ký giờ qua 2 bước — bấm "Đăng ký" chỉ gửi mã OTP tới email, chưa tạo
// tài khoản thật; tài khoản chỉ được tạo sau khi xác nhận đúng mã ở
// #congOtpForm bên dưới. Đăng nhập (tài khoản đã có sẵn) thì vẫn 1 bước như
// cũ, không cần OTP.
$("#congForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nut = $("#congGui");
  if (nut.disabled) return;

  const dangKy = dangKyDangMo();
  const ten = $("#fTen").value.trim();
  const sdt = $("#fSdt").value.trim();
  const email = $("#fEmail").value.trim();
  const mk = $("#fMk").value;

  // Bắt lỗi ngay tại chỗ trước khi phiền tới máy chủ.
  if (dangKy && !ten) return neuThieu("#fTen", "Bạn tên là gì nhỉ?");
  if (!sdt) return neuThieu("#fSdt", "Bạn nhập số điện thoại nhé.");
  if (dangKy && !email) return neuThieu("#fEmail", "Bạn nhập email để nhận mã xác nhận nhé.");
  if (!mk) return neuThieu("#fMk", "Bạn nhập mật khẩu nhé.");
  if (dangKy && mk.length < 6) return neuThieu("#fMk", "Mật khẩu cần ít nhất 6 ký tự.");

  $$(".cong-o").forEach(o => o.classList.remove("sai"));
  nut.disabled = true;
  nut.textContent = dangKy ? "Đang gửi mã…" : "Đang vào…";
  loiCong("");

  try {
    const r = await fetch(TK_URL + (dangKy ? "/dang-ky-yeu-cau" : "/dang-nhap"), {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dangKy ? { ten, sdt, matKhau: mk, email } : { sdt, matKhau: mk }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { loiCong(j.error || "Chưa xong được, bạn thử lại nhé."); return; }

    if (dangKy) {
      OTP_TOKEN = j.token;
      moBuocOtp(j.email || email);
    } else {
      xongDangNhap(j);
    }
  } catch {
    loiCong("Không nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé.");
  } finally {
    nut.disabled = false;
    veCongNut();
  }
});

$("#congQuen").addEventListener("click", moQuenMk);
$("#congQuenVe").addEventListener("click", moBuoc1);
$("#congMkVe").addEventListener("click", moQuenMk);

$("#congQuenForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nut = $("#congQuenGui");
  if (nut.disabled) return;
  const v = $("#fQuen").value.trim();
  if (!v) { loiQuen("Nhập số điện thoại hoặc email của tài khoản nhé."); return; }
  const laEmail = v.includes("@");
  nut.disabled = true; nut.textContent = "Đang gửi…"; loiQuen("");
  try {
    const r = await fetch(TK_URL + "/quen-mk", {
      method: "POST", credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(laEmail ? { email: v } : { sdt: v }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { loiQuen(j.error || "Chưa gửi được, bạn thử lại nhé."); return; }
    QUEN_TOKEN = j.token || "";
    moDatLaiMk(j.email);
  } catch {
    loiQuen("Mất mạng rồi, bạn kiểm tra lại đường truyền nhé.");
  } finally {
    nut.disabled = false; nut.textContent = "Gửi mã về email";
  }
});

$("#congMkGuiLai").addEventListener("click", async () => {
  const nut = $("#congMkGuiLai");
  if (nut.disabled) return;
  nut.disabled = true; loiMkMoi("");
  try {
    const r = await fetch(TK_URL + "/quen-mk-gui-lai", {
      method: "POST", credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: QUEN_TOKEN }),
    });
    const j = await r.json().catch(() => ({}));
    loiMkMoi(r.ok ? "" : (j.error || "Chưa gửi lại được."));
    if (r.ok) toast("Đã gửi lại mã, bạn xem email nhé.");
  } catch { loiMkMoi("Mất mạng rồi."); }
  finally { nut.disabled = false; }
});

$("#congMkForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nut = $("#congMkXong");
  if (nut.disabled) return;
  const code = $("#fMaQuen").value.trim();
  const mk = $("#fMkMoi").value;
  if (code.length !== 6) { loiMkMoi("Mã gồm 6 chữ số, bạn kiểm tra lại nhé."); return; }
  if (!mk || mk.length < 6) { loiMkMoi("Mật khẩu mới cần ít nhất 6 ký tự."); return; }
  nut.disabled = true; nut.textContent = "Đang đổi…"; loiMkMoi("");
  try {
    const r = await fetch(TK_URL + "/quen-mk-dat-lai", {
      method: "POST", credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: QUEN_TOKEN, code, matKhau: mk }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { loiMkMoi(j.error || "Chưa đổi được, bạn thử lại nhé."); return; }
    toast("Đổi mật khẩu xong, vào học thôi!");
    xongDangNhap(j);
  } catch {
    loiMkMoi("Mất mạng rồi, bạn kiểm tra lại đường truyền nhé.");
  } finally {
    nut.disabled = false; nut.textContent = "Đặt mật khẩu mới";
  }
});

$("#congOtpForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nut = $("#congOtpXacNhan");
  if (nut.disabled) return;
  const code = $("#fMa").value.trim();
  if (code.length !== 6) { loiOtp("Mã gồm 6 chữ số, bạn kiểm tra lại nhé."); return; }

  nut.disabled = true;
  nut.textContent = "Đang xác nhận…";
  loiOtp("");
  try {
    const r = await fetch(TK_URL + "/dang-ky-xac-nhan", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: OTP_TOKEN, code }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { loiOtp(j.error || "Chưa xong được, bạn thử lại nhé."); return; }
    xongDangNhap(j);
  } catch {
    loiOtp("Không nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé.");
  } finally {
    nut.disabled = false;
    nut.textContent = "Xác nhận";
  }
});

$("#congOtpGuiLai").addEventListener("click", async () => {
  const nut = $("#congOtpGuiLai");
  if (nut.disabled) return;
  nut.disabled = true;
  loiOtp("");
  try {
    const r = await fetch(TK_URL + "/dang-ky-gui-lai", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: OTP_TOKEN }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) loiOtp(j.error || "Chưa gửi lại được, bạn thử lại nhé.");
  } catch {
    loiOtp("Không nối được máy chủ.");
  } finally {
    setTimeout(() => { nut.disabled = false; }, 3000);
  }
});

$("#congOtpQuayLai").addEventListener("click", () => moBuoc1());

function xongDangNhap(j) {
  TK.toi = j;
  $("#fMk").value = "";
  // Lần đầu đăng ký thì lấy luôn tên đó làm tên hiển thị trong app.
  if (j.ten && !S.ten) { S.ten = j.ten; save(); veTen(); }
  dongCong();
  toast(dangKyDangMo() ? `Chào ${j.ten}, bắt đầu thôi!` : `Chào bạn quay lại, ${j.ten}!`);
  veTheTaiKhoan();
  veThePro();
  keoVe();
}

function veCongNut() {
  $("#congGui").textContent = dangKyDangMo() ? "Đăng ký" : "Đăng nhập";
}

function neuThieu(sel, msg) {
  const o = $(sel);
  o.closest(".cong-o").classList.add("sai");
  o.focus();
  loiCong(msg);
}

// Số điện thoại chỉ gồm chữ số và dấu cộng — chặn ngay lúc gõ cho đỡ sai.
$("#fSdt").addEventListener("input", ev => {
  const v = ev.target.value.replace(/[^0-9+ ]/g, "");
  if (v !== ev.target.value) ev.target.value = v;
});
$("#fMa").addEventListener("input", ev => {
  const v = ev.target.value.replace(/[^0-9]/g, "").slice(0, 6);
  if (v !== ev.target.value) ev.target.value = v;
});

/** Thẻ tài khoản dưới phần Cài đặt. */
function veTheTaiKhoan() {
  const the = $("#tkThe");
  if (!the) return;
  const t = TK.toi;
  if (!t || !t.dangNhap) {
    // Đang xem thử thì mời đăng ký ngay tại đây, đừng để họ quên mất.
    the.hidden = false;
    $("#tkTen").textContent = "Chưa có tài khoản";
    $("#tkSdt").textContent = "Đăng ký để giữ tiến độ trên mọi máy";
    $("#btnThoat").textContent = "Đăng ký";
    return;
  }
  $("#btnThoat").textContent = "Đăng xuất";
  the.hidden = false;
  $("#tkTen").textContent = t.ten || "Tài khoản của bạn";
  $("#tkSdt").textContent = t.sdt || t.email || "";
}

$("#btnThoat").addEventListener("click", () => {
  if (!TK.toi || !TK.toi.dangNhap) { TK.kieu = "dangKy"; moCong(); return; }
  openSheet({
  title: "Đăng xuất?",
  body: "Tiến độ học vẫn nằm trên máy này. Đăng nhập lại lúc nào cũng được.",
  yes: "Đăng xuất",
  yesClass: "btn-danger",
  no: "Ở lại",
  onYes: async () => {
    try { await fetch(TK_URL + "/thoat", { method: "POST", credentials: "same-origin" }); }
    catch { /* mất mạng thì thôi, cookie hết hạn sau */ }
    TK.toi = { dangNhap: false };
    TK.kieu = "dangNhap";
    DB.bat = false; clearTimeout(DB.hen);
    veTheTaiKhoan();
    moCong();
  },
  });
});

/* ĐĂNG NHẬP BẰNG GMAIL
   Ai đã có Gmail thì khỏi phải nghĩ mật khẩu mới. Máy chủ tự hỏi Google xem tấm
   vé có thật không — không bao giờ tin lời trình duyệt nói nó là ai. */
let gsiDaNap = false;
async function batGoogle() {
  const oNut = $("#gsiNut");
  if (!oNut) return;
  let tin;
  try {
    const r = await fetch(TK_URL + "/google-info", { credentials: "same-origin" });
    tin = await r.json();
  } catch { return; }
  if (!tin.bat || !tin.clientId) return;   // thầy chưa bật thì không hiện gì cả

  const dung = () => {
    if (!window.google || !google.accounts || !google.accounts.id) return;
    google.accounts.id.initialize({
      client_id: tin.clientId,
      callback: async res => {
        loiCong("");
        try {
          const r = await fetch(TK_URL + "/google", {
            method: "POST",
            credentials: "same-origin",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token: res.credential }),
          });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) { loiCong(j.error || "Chưa vào được bằng Gmail."); return; }
          TK.toi = j;
          if (j.ten && !S.ten) { S.ten = j.ten; save(); veTen(); }
          dongCong();
          toast(j.moi ? `Chào ${j.ten}, bắt đầu thôi!` : `Chào bạn quay lại, ${j.ten}!`);
          veTheTaiKhoan();
          veThePro();
          keoVe();
        } catch {
          loiCong("Không nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé.");
        }
      },
    });
    google.accounts.id.renderButton(oNut, {
      theme: "filled_blue", size: "large", shape: "pill",
      text: "continue_with", locale: "vi", width: 300,
    });
    $("#congGoogle").hidden = false;
  };

  if (gsiDaNap) return dung();
  const sc = document.createElement("script");
  sc.src = "https://accounts.google.com/gsi/client";
  sc.async = true;
  sc.defer = true;
  sc.onload = () => { gsiDaNap = true; dung(); };
  // Không tải được thì thôi, người ta vẫn đăng ký bằng số điện thoại được.
  sc.onerror = () => {};
  document.head.append(sc);
}

/** Chưa đăng nhập thì chặn ở cửa; mất mạng thì cho vào để không kẹt người học. */
async function gacCua() {
  const t = await hoiTaiKhoan();
  veTheTaiKhoan();
  if (t.dangNhap || t.ngoaiTuyen || S.xemThu) {
    if (t.dangNhap && t.ten && !S.ten) { S.ten = t.ten; save(); veTen(); }
    if (t.dangNhap) keoVe();
    return;
  }
  moCong();
}
gacCua();

/* ═══════════════ ĐỀ THI MỖI NGÀY ═══════════════
   Mỗi ngày một đề mới, nhưng trong cùng một ngày thì đề GIỮ NGUYÊN — làm dở
   thoát ra vào lại vẫn đúng đề đó, không phải đề khác. Muốn vậy phải sinh đề
   từ một hạt giống cố định theo ngày, chứ không dùng ngẫu nhiên thường. */
/* Ba cấp theo chuẩn Cambridge YLE cho thiếu nhi — Starters (Pre-A1),
   Movers (A1), Flyers (A2). Giữ đúng các DẠNG BÀI của kỳ thi thật:
   nghe chọn tranh, đọc rồi tick đúng/sai, sắp chữ cái thành từ, điền từ
   vào chỗ trống, nối từ. Số câu rút bớt cho vừa một lượt học trên điện thoại. */
const MUC_THI = [
  {
    ma: "starters", ten: "Starters", cefr: "Pre-A1",
    mo: "20 câu · nghe chọn tranh, tick đúng sai, sắp chữ cái",
    so: 20, kieu: ["picture", "listen", "truefalse", "ghepChu", "choice"],
  },
  {
    ma: "movers", ten: "Movers", cefr: "A1",
    mo: "30 câu · thêm điền từ vào chỗ trống và nối từ",
    so: 30, kieu: ["picture", "listen", "truefalse", "ghepChu", "choice", "reverse", "blanks"],
  },
  {
    ma: "flyers", ten: "Flyers", cefr: "A2",
    mo: "40 câu · thêm tự viết từ, câu dài hơn",
    so: 40, kieu: ["listen", "truefalse", "ghepChu", "reverse", "blanks", "type", "picture"],
  },
];


/** Bộ sinh số giả ngẫu nhiên có hạt giống — cùng hạt thì cùng dãy số. */
function mayNgau(hat) {
  let x = hat >>> 0;
  return () => {
    // Thuật toán xorshift32: gọn, đủ đều cho việc trộn đề.
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5;  x >>>= 0;
    return x / 4294967296;
  };
}

function hatCuaNgay(ngay, mucMa, lv) {
  const chuoi = ngay + "|" + mucMa + "|" + lv;
  let h = 2166136261;
  for (let i = 0; i < chuoi.length; i += 1) {
    h ^= chuoi.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Trộn một danh sách theo máy ngẫu nhiên có hạt — luôn ra cùng thứ tự. */
function tronTheoHat(ds, r) {
  const a = ds.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Dựng đề của hôm nay cho một mức khó. */
function deHomNay(mucMa) {
  const muc = MUC_THI.find(m => m.ma === mucMa) || MUC_THI[0];
  const lv = level();
  const r = mayNgau(hatCuaNgay(today(), muc.ma, lv.id));

  // Chỉ lấy từ trong trình độ đang học, để đề không hỏi thứ chưa dạy.
  const tuLv = lv.units.flatMap(unitWords).filter(Boolean);
  const cauLv = lv.units.flatMap(unitSentences).filter(Boolean);
  if (tuLv.length < 4) return [];

  const q = [];
  const kho = tronTheoHat(tuLv, r);
  const khoCau = tronTheoHat(cauLv, r);
  let iCau = 0;

  for (let i = 0; i < muc.so; i += 1) {
    const kieu = muc.kieu[Math.floor(r() * muc.kieu.length)];
    const w = kho[i % kho.length];

    if (kieu === "blanks") {
      const s = khoCau[iCau++ % Math.max(1, khoCau.length)];
      const phan = s && s.en ? s.en.split(" ") : [];
      if (phan.length >= 3) {
        const n = phan.length >= 5 ? 2 : 1;
        const idx = tronTheoHat(phan.map((_, k) => k), r).slice(0, n).sort((x, y) => x - y);
        const dap = idx.map(k => phan[k]);
        const them = tronTheoHat(khoTheoBac().single.filter(x => !phan.includes(x.en)), r).slice(0, 2).map(x => x.en);
        q.push({ type: "blanks", sent: s, idx, answers: dap, bank: tronTheoHat(dap.concat(them), r) });
        continue;
      }
    }
    if (kieu === "picture") {
      const coAnh = kho.filter(x => veDuoc(x) && !x.en.includes(" "));
      if (coAnh.length >= 4) {
        const w2 = coAnh[i % coAnh.length];
        const khac = nhieuKhacHinh(w2, coAnh, 3, ds => tronTheoHat(ds, r));
        if (khac.length >= 2) {
          q.push({ type: "picture", word: w2, opts: tronTheoHat([w2].concat(khac), r) });
          continue;
        }
      }
    }
    if (kieu === "ghepChu") {
      const ngan = kho.filter(x => x.en.replace(/[^a-z]/gi, "").length <= 9);
      if (ngan.length) { q.push({ type: "ghepChu", word: ngan[i % ngan.length] }); continue; }
    }
    if (kieu === "truefalse") {
      const noiDoi = r() < 0.5;
      const khac = kho[(i + 3) % kho.length];
      q.push({ type: "truefalse", word: w, shown: noiDoi ? khac.en : w.en, answer: !noiDoi });
      continue;
    }
    if (kieu === "type") { q.push({ type: "type", word: w }); continue; }

    const khac = tronTheoHat(tuLv.filter(x => x.en !== w.en), r).slice(0, 3);
    q.push({ type: kieu, word: w, opts: tronTheoHat([w].concat(khac), r) });
  }
  return q;
}

/** Đã làm đề hôm nay chưa, và được bao nhiêu điểm. */
function ketQuaThi(mucMa) {
  const kho = S.thi || {};
  const k = today() + "|" + S.level + "|" + mucMa;
  return kho[k] || null;
}
function luuKetQuaThi(mucMa, diem, tong) {
  const kho = Object.assign({}, S.thi || {});
  kho[today() + "|" + S.level + "|" + mucMa] = { diem, tong, luc: Date.now() };
  // Chỉ giữ 60 kết quả gần nhất, không thì càng học càng phình.
  const khoa = Object.keys(kho).sort();
  while (khoa.length > 60) delete kho[khoa.shift()];
  S.thi = kho;
  save();
}

function xongDeThi() {
  const t = P.laThi;
  const secs = Math.round((Date.now() - P.startedAt) / 1000);
  const pc = Math.round((t.dung / t.tong) * 100);
  luuKetQuaThi(t.ma, t.dung, t.tong);

  // Thi xong vẫn được XP, nhưng theo điểm chứ không cào bằng.
  const xp = Math.round((pc / 100) * (t.tong / 2));
  markStudied(); addXp(xp); save();

  P.laThi = null;
  $("#pHearts").hidden = false;
  $("#player").hidden = true;
  $("#result").hidden = false;
  $("#resTime").textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  $("#resAcc").textContent = pc + "%";
  $("#resXp").textContent = xp;
  $("#resTitle").textContent =
    pc >= 90 ? "Xuất sắc! Đề " + t.ten + " không làm khó được bạn."
    : pc >= 70 ? "Khá lắm! Còn vài chỗ nữa là trọn vẹn."
    : pc >= 50 ? "Qua rồi, nhưng nên ôn lại mấy chỗ sai."
    : "Chưa đạt. Học lại vài bài rồi thi tiếp nhé.";
  $("#resSub").hidden = false;
  $("#resSub").textContent = "Đề " + t.ten + " · đúng " + t.dung + "/" + t.tong + " câu";
  veCup(pc);
}

function moManThi() {
  const box = el("div", "thi-ds");
  MUC_THI.forEach(m => {
    const kq = ketQuaThi(m.ma);
    const b = el("button", "thi-o" + (kq ? " xong" : ""));
    b.type = "button";
    const txt = el("span");
    const ten = el("strong");
    ten.append(document.createTextNode(m.ten), el("em", "thi-cefr", m.cefr));
    txt.append(ten, el("small", null, m.mo));
    b.append(el("i", "thi-ma", m.ten[0]), txt);
    if (kq) {
      const pc = Math.round((kq.diem / kq.tong) * 100);
      b.append(el("span", "thi-diem" + (pc >= 80 ? " tot" : pc >= 50 ? " kha" : " chua"), pc + "%"));
    } else {
      b.append(icon("i-chevron", "ic ic-sm"));
    }
    b.addEventListener("click", () => {
      closeSheet();
      batDauThi(m.ma);
    });
    box.append(b);
  });

  openSheet({
    title: "Đề thi hôm nay",
    body: "Ba cấp theo chuẩn Cambridge cho thiếu nhi. Mỗi ngày một đề mới; trong ngày làm lại vẫn đúng đề đó.",
    no: "Đóng",
    slot: box,
  });
}

function batDauThi(mucMa) {
  const muc = MUC_THI.find(m => m.ma === mucMa) || MUC_THI[0];
  const de = deHomNay(mucMa);
  if (!de.length) return toast("Trình độ này chưa đủ từ để ra đề.");

  P.slides = de.map(d => ({ phase: "drill", d }));
  P.i = 0; P.teachN = 0; P.wrong = 0; P.attempts = 0;
  P.lessonId = null;
  P.laThi = { ma: mucMa, ten: muc.ten, dung: 0, tong: de.length };
  P.startedAt = Date.now();
  P.mode = "thi";
  $("#player").hidden = false;
  document.body.style.overflow = "hidden";
  $("#pHearts").hidden = true;   // thi thì không mất tim, cứ làm hết đề
  renderSlide();
}

/* ---------- 19. Giải đấu ---------- */
const AVCOL = ["#0369A1", "#B45309", "#047857", "#BE185D", "#6D28D9", "#B91C1C", "#0F766E", "#4F46E5"];
const leagueName = () => "Giải " + LEAGUES[clamp(S.tier, 0, LEAGUES.length - 1)].name;
const rankRows = () => RIVALS.concat({ name: "Bạn", xp: S.weekXp, me: true }).sort((a, b) => b.xp - a.xp);

function renderLeague() {
  const tier = LEAGUES[clamp(S.tier, 0, LEAGUES.length - 1)];
  $("#leagueName").textContent = leagueName();
  $("#leagueBadge").style.color = "#fff";
  $("#leagueBadge").style.background = tier.color;
  $("#leagueTimer").textContent = weekLeft();
  const ol = $("#rankList"); ol.textContent = "";
  rankRows().forEach((r, i) => {
    const li = el("li", r.me ? "me" : "");
    const av = el("div", "r-av", r.name.charAt(0).toUpperCase());
    av.style.background = AVCOL[i % AVCOL.length];
    li.append(el("div", "r-pos", String(i + 1)), av, el("div", "r-name", r.name), el("div", "r-xp", r.xp + " XP"));
    ol.append(li);
    if (i === 4) ol.append(zone("z-up", "KHU VỰC LÊN HẠNG"));
    if (i === 7) ol.append(zone("z-down", "KHU VỰC XUỐNG HẠNG"));
  });
  paintRail();
}
function zone(cls, text) { const li = el("li", "zone " + cls, text); li.setAttribute("aria-hidden", "true"); return li; }
function paintRail() {
  if (!$("#railRank")) return;
  $("#railRank").textContent = rankRows().findIndex(r => r.me) + 1;
  $("#railStreak").textContent = S.streak;
  $("#railLeagueName").textContent = leagueName();
  $("#railGoal").textContent = S.todayXp + " / " + S.goal;
  $("#railBar").style.width = clamp(Math.round((S.todayXp / S.goal) * 100), 0, 100) + "%";
  const dots = $("#weekDots"); dots.textContent = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    dots.append(el("i", S.days.includes(d) ? "on" : ""));
  }
}

/* ---------- 20. Hồ sơ ---------- */
function renderProfile() {
  const seen = seenWords();
  const r = seen.reduce((s, w) => s + S.srs[w.en].right, 0);
  const w = seen.reduce((s, x) => s + S.srs[x.en].wrong, 0);
  $("#tileStreak").textContent = S.streak;
  $("#tileXp").textContent = S.xp;
  $("#tileLessons").textContent = Object.keys(S.done).length;
  $("#tileAcc").textContent = (r + w) ? Math.round((r / (r + w)) * 100) + "%" : "—";
  $("#joinDate").textContent = new Date(S.joined).toLocaleDateString("vi-VN");
  const pct = clamp(Math.round((S.todayXp / S.goal) * 100), 0, 100);
  $("#goalNow").textContent = S.todayXp;
  $("#goalTarget").textContent = S.goal;
  $("#goalBar").querySelector("i").style.width = pct + "%";
  $("#goalBar").setAttribute("aria-valuenow", pct);
  $$("[data-goal]").forEach(b => b.classList.toggle("on", +b.dataset.goal === S.goal));
  $("#optSound").checked = S.sound;
  $("#optNhac").checked = S.nhac;
  $("#optMotion").checked = S.motion;
  $("#optVi").checked = S.showVi;
  $("#optKid").checked = S.kidVoice !== false;
  $("#optMoHet").checked = !!S.moHet;
  paintRail();
}
$$("[data-goal]").forEach(b => b.addEventListener("click", () => {
  S.goal = +b.dataset.goal; save(); renderProfile(); toast("Mục tiêu: " + S.goal + " XP mỗi ngày");
}));
$("#optSound").addEventListener("change", e => { S.sound = e.target.checked; save(); });
$("#optNhac").addEventListener("change", e => {
  S.nhac = e.target.checked; save();
  if (S.nhac) batNhac(); else tatNhac();
});
// Nút nghe thử: bấm một cái là biết ngay máy có kêu được không, khỏi phải học
// ba câu mới thử được tiếng thưởng.
$("#btnThuTieng").addEventListener("click", () => {
  danhThucTieng();
  if (!S.sound) return toast("Đang tắt Phát âm tự động — bật lên rồi thử lại nhé.");
  const a = tiengSanSang();
  if (!a) return toast("Máy chưa cho phát tiếng. Chạm vào màn hình một cái rồi bấm lại.");
  const bangFile = phatFileThuong();
  if (!bangFile) keuThuong();
  toast(bangFile
    ? "Đang phát thử bằng file tiếng. Không nghe thấy gì thì kiểm tra nút gạt im lặng và âm lượng máy."
    : "Đang phát thử bằng tiếng tự tạo. Không nghe thấy gì thì kiểm tra nút gạt im lặng và âm lượng máy.");
});
$("#optMotion").addEventListener("change", e => { S.motion = e.target.checked; save(); applyTheme(); });
$("#optVi").addEventListener("change", e => { S.showVi = e.target.checked; save(); });
$("#optKid").addEventListener("change", e => { S.kidVoice = e.target.checked; save(); });
/* Mỗi máy có sẵn một bộ giọng khác nhau, và giọng máy tự chọn không phải lúc nào
   cũng dễ nghe. Cho người dùng tự chọn, nghe thử ngay trong lúc chọn. */
const CAU_THU = { en: "Good morning. Nice to meet you.", vi: "Chào bạn, hôm nay học gì nào?" };

function tenGiong(v) {
  // Bỏ phần thừa kiểu "Microsoft David Desktop - English (United States)"
  return String(v.name).replace(/^(Microsoft|Google)\s+/i, "").replace(/\s*-\s*.*$/, "").trim() || v.name;
}

function veDongGiong(goc) {
  const o = $(goc === "en" ? "#giongAnh" : "#giongViet");
  if (!o) return;
  const v = voiceFor(goc === "en" ? "en-GB" : "vi-VN");
  if (!v) { o.textContent = "máy chưa có giọng này"; o.classList.add("thieu"); return; }
  const ch = luaChonGiong(goc);
  const kieu = KIEU_GIONG.find(k => Math.abs(ch.pitch - k.pitch) < 0.01 && Math.abs(ch.rate - k.rate) < 0.01);
  // Ghi rõ giọng nước nào: "Daniel · Anh" khác hẳn "Samantha · Mỹ", nhìn là biết
  // ngay máy có đúng giọng bản ngữ mình muốn hay chỉ có giọng thay thế.
  o.textContent = tenGiong(v) + " · " + nuocCuaGiong(v.lang) + (ch.uri && kieu ? " — " + kieu.ten : "");
  // Moira là en-IE, Daniel là en-GB, Samantha là en-US — đều là tiếng Anh thật.
  // Chỉ báo thiếu khi máy KHÔNG có giọng tiếng Anh nào cả.
  o.classList.toggle("thieu", goc === "en" && !chuanTag(v.lang).startsWith("en"));
}

/** Đổi mã ngôn ngữ thành tên nước cho dễ đọc. */
function nuocCuaGiong(lang) {
  const t = chuanTag(lang);
  const bang = {
    "en-gb": "Anh", "en-us": "Mỹ", "en-au": "Úc", "en-ie": "Ireland",
    "en-in": "Ấn Độ", "en-za": "Nam Phi", "en-ca": "Canada", "en-nz": "New Zealand",
    "vi-vn": "Việt Nam",
  };
  return bang[t] || t.toUpperCase();
}

/* Máy thường chỉ cài sẵn một hai giọng cho mỗi thứ tiếng. Từ mỗi giọng gốc ta
   dựng thêm mấy kiểu bằng cách đổi cao độ và tốc độ — nghe ra hẳn người khác. */
const KIEU_GIONG = [
  { ten: "bình thường", pitch: 1,    rate: 1 },
  { ten: "trẻ trung",   pitch: 1.35, rate: 1.05 },
  { ten: "trầm ấm",     pitch: 0.78, rate: 0.95 },
  { ten: "chậm rãi",    pitch: 1,    rate: 0.78 },
  { ten: "nhanh nhẹn",  pitch: 1.1,  rate: 1.25 },
];

function moChonGiong(goc) {
  pickVoice();
  const ds = voices.filter(v => chuanTag(v.lang).split("-")[0] === goc);
  const dangDung = luaChonGiong(goc);
  const box = el("div", "giong-ds");

  if (!ds.length) {
    box.append(el("p", "pro-fine",
      "Máy này chưa cài giọng " + (goc === "en" ? "tiếng Anh" : "tiếng Việt") +
      ". Vào Cài đặt máy → Trợ năng → Nội dung đọc để tải thêm."));
  }

  ds.forEach(v => {
    box.append(el("div", "giong-dau", tenGiong(v) + " · " + v.lang +
      (v.localService ? " · trên máy" : " · qua mạng")));
    KIEU_GIONG.forEach(k => {
      const dangChon = dangDung.uri === v.voiceURI
        && Math.abs(dangDung.pitch - k.pitch) < 0.01
        && Math.abs(dangDung.rate - k.rate) < 0.01;
      const b = el("button", "giong-o" + (dangChon ? " on" : ""));
      b.type = "button";
      const txt = el("span");
      txt.append(el("strong", null, tenGiong(v) + " — " + k.ten));
      b.append(txt, icon("i-sound", "ic ic-sm"));
      b.addEventListener("click", () => {
        S.giong = Object.assign({}, S.giong, { [goc]: { uri: v.voiceURI, pitch: k.pitch, rate: k.rate } });
        save();
        $$(".giong-o", box).forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        veDongGiong(goc);
        speak(CAU_THU[goc], false, goc === "en" ? "en-GB" : "vi-VN");
      });
      box.append(b);
    });
  });

  if (ds.length) {
    const tuChon = el("button", "btn btn-text btn-block mt", "Để máy tự chọn");
    tuChon.type = "button";
    tuChon.addEventListener("click", () => {
      const g = Object.assign({}, S.giong); delete g[goc];
      S.giong = g; save(); veDongGiong(goc); closeSheet();
      toast("Đã trả về giọng mặc định của máy.");
    });
    box.append(tuChon);
  }

  openSheet({
    title: goc === "en" ? "Giọng tiếng Anh" : "Giọng tiếng Việt",
    body: "Chạm vào một kiểu để nghe thử và chọn luôn.",
    no: "Xong",
    slot: box,
  });
}

$("#btnGiongAnh").addEventListener("click", () => moChonGiong("en"));
$("#btnGiongViet").addEventListener("click", () => moChonGiong("vi"));
$("#btnThuGiong").addEventListener("click", () => {
  pickVoice();
  const anh = voiceFor("en-GB");
  if (anh && chuanTag(anh.lang) !== "en-gb") {
    toast("Máy chưa có giọng Anh-Anh, đang dùng tạm giọng " + nuocCuaGiong(anh.lang) + ".");
  }
  docLanLuot([
    { text: CAU_THU.en, lang: "en-GB" },
    { text: CAU_THU.vi, lang: "vi-VN" },
  ]);
});
// Danh sách giọng đến muộn trên vài máy, nên vẽ lại khi có.
if (window.speechSynthesis) {
  const veCa = () => { veDongGiong("en"); veDongGiong("vi"); };
  veCa();
  const cu = speechSynthesis.onvoiceschanged;
  speechSynthesis.onvoiceschanged = () => { if (cu) cu(); veCa(); };
}


$("#optMoHet").addEventListener("change", e => {
  S.moHet = e.target.checked;
  save();
  renderLearn();
  toast(S.moHet ? "Đã mở hết bài học." : "Đã trả về học lần lượt.");
});
$("#btnTheme").addEventListener("click", () => {
  S.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; save(); applyTheme();
});
$("#btnReset").addEventListener("click", () => openSheet({
  title: "Xoá toàn bộ tiến độ?",
  body: "Mọi bài đã học, XP và chuỗi ngày sẽ mất. Không thể hoàn tác.",
  yes: "Xoá hết", yesClass: "btn-danger", no: "Giữ lại",
  onYes() { localStorage.removeItem(KEY); S = load(); applyTheme(); paintStats(); go("learn"); toast("Đã xoá tiến độ."); }
}));

/* ---------- 21. Sheet ---------- */
let sheetYes = null;
function openSheet({ title, body, yes, no, yesClass = "btn-primary", onYes, slot, top }) {
  // 'top' là chỗ đặt hình phía TRÊN tiêu đề — slot thường nằm dưới phần chữ.
  const t = $("#sheetTop"); t.textContent = ""; t.hidden = !top; if (top) t.append(top);
  $("#sheetTitle").textContent = title;
  $("#sheetBody").textContent = body || "";
  $("#sheetBody").hidden = !body;
  const s = $("#sheetSlot"); s.textContent = ""; if (slot) s.append(slot);
  const y = $("#sheetYes");
  y.textContent = yes || ""; y.hidden = !yes; y.className = "btn btn-block mt " + yesClass;
  // Truyền no rỗng khi chỉ muốn một nút duy nhất; bỏ trống thì vẫn có nút Đóng.
  $("#sheetNo").hidden = no === "";
  $("#sheetNo").textContent = no || "Đóng";
  sheetYes = onYes || null;
  $("#sheetWrap").hidden = false;
  (no === "" ? $("#sheetYes") : $("#sheetNo")).focus();
}
const closeSheet = () => { $("#sheetWrap").hidden = true; sheetYes = null; };
$("#sheetNo").addEventListener("click", closeSheet);
$("#sheetScrim").addEventListener("click", closeSheet);
$("#sheetYes").addEventListener("click", () => { const f = sheetYes; closeSheet(); f && f(); });

function sheetNoHearts() {
  $("#player").hidden = true; document.body.style.overflow = "";
  const mins = clamp(Math.ceil((S.heartAt + HEART_MS - Date.now()) / 60000), 1, 30);
  // Đủ xu thì cho đổi đầy tim luôn — đây chính là chỗ tiêu xu, nên phải mời
  // ngay lúc người học đang cần, chứ giấu trong menu thì chẳng ai tìm ra.
  if ((S.xu || 0) >= XU_DOI_TIM) {
    openSheet({
      title: "Bạn đã hết tim",
      body: `Bạn đang có ${S.xu} xu. Đổi ${XU_DOI_TIM} xu để đầy lại ${TIM_TOI_DA} tim và học tiếp ngay, hoặc chờ tim tự hồi (quả tiếp theo sau khoảng ${mins} phút).`,
      yes: `Đổi ${XU_DOI_TIM} xu lấy đầy tim`, no: "Để sau",
      onYes() {
        S.xu -= XU_DOI_TIM; S.hearts = TIM_TOI_DA; S.heartAt = Date.now(); save();
        paintStats(); toast("Đã đầy tim, học tiếp thôi!");
      }
    });
    return;
  }
  openSheet({
    title: "Bạn đã hết tim",
    body: `Tim tự hồi 1 quả mỗi 30 phút — quả tiếp theo sau khoảng ${mins} phút. Học xong mỗi bài được ${XU_MOI_BAI} xu, đủ ${XU_DOI_TIM} xu là đổi được đầy tim. Ôn tập bằng thẻ ghi nhớ vẫn học được ngay.`,
    yes: "Ôn bằng thẻ ghi nhớ", no: "Để sau",
    onYes() { go("review"); startFlash(); }
  });
}
$("#btnQuit").addEventListener("click", () => openSheet({
  title: "Dừng bài học?", body: "Tiến độ của bài này sẽ không được lưu.",
  yes: "Thoát bài học", yesClass: "btn-danger", no: "Học tiếp",
  onYes: closePlayer
}));
$("#btnLevel").addEventListener("click", () => {
  const box = el("div");
  COURSE.levels.forEach(lv => {
    const b = el("button", "lv-opt" + (lv.id === S.level ? " on" : "")); b.type = "button";
    const txt = el("span"); txt.append(el("strong", null, lv.name), el("small", null, lv.desc));
    b.append(el("b", null, lv.code), txt);
    b.addEventListener("click", () => {
      S.level = lv.id; save(); closeSheet(); paintStats(); go("learn");
      toast("Đang học trình độ " + lv.code + " — " + lv.name);
    });
    box.append(b);
  });
  const do2 = el("button", "btn btn-primary btn-block mt", "Kiểm tra xếp trình độ");
  do2.type = "button";
  do2.addEventListener("click", () => { closeSheet(); moXep(); });
  box.append(do2);
  const thi = el("button", "btn btn-soft btn-block mt", "Đề thi Cambridge hôm nay");
  thi.type = "button";
  thi.addEventListener("click", () => { closeSheet(); moManThi(); });
  box.append(thi);

  openSheet({ title: "Chọn trình độ", body: "Không chắc mình ở đâu thì làm bài kiểm tra bên dưới, app xếp giúp.", no: "Đóng", slot: box });
});
$("#btnXp").addEventListener("click", () => toast(`${S.xp} XP · tuần này ${S.weekXp} XP`));
$("#btnHeart").addEventListener("click", () => {
  regenHearts();
  if (S.hearts >= TIM_TOI_DA) return toast("Tim đầy — học thoải mái.");
  toast(`${S.hearts}/${TIM_TOI_DA} tim. Quả tiếp theo sau khoảng ${clamp(Math.ceil((S.heartAt + HEART_MS - Date.now()) / 60000), 1, 30)} phút.`);
});

/* ---------- 22. Phím tắt ---------- */
document.addEventListener("keydown", e => {
  if (!$("#streakView").hidden) { if (e.key === "Escape") $("#btnStreakClose").click(); return; }
  if (!$("#flash").hidden) {
    if (e.key === "Escape") $("#btnFlashQuit").click();
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); F.shown ? $("#btnKnew").click() : revealFlash(); }
    return;
  }
  if ($("#player").hidden) return;
  if (e.key === "Escape") return $("#btnQuit").click();
  if (e.target.tagName === "TEXTAREA") return;
  if (e.key === "Enter" && !$("#btnNext").disabled) { e.preventDefault(); return nextPressed(); }
  if (/^[1-4]$/.test(e.key)) $$("#stage .opt:not(.done), #stage .pic, #stage .tf button")[+e.key - 1]?.click();
});

/* ---------- 23. Cài lên màn hình chính ---------- */
const isStandalone = () => window.navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); deferredPrompt = e;
  $("#installCard").hidden = false; $("#btnInstall").hidden = false;
  $("#installHow").textContent = "Dùng như một app thật, mở được cả khi không có mạng.";
});
$("#btnInstall").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice;
  deferredPrompt = null; $("#installCard").hidden = true;
});
function setupInstallHint() {
  if (isStandalone() || deferredPrompt) return;
  if (isIOS()) {
    $("#installCard").hidden = false;
    $("#installHow").textContent = "Trên iPhone/iPad: mở bằng Safari, bấm nút Chia sẻ ở thanh dưới, chọn “Thêm vào MH chính”. Sau đó app chạy toàn màn hình và dùng được khi không có mạng.";
  }
}
if ("serviceWorker" in navigator) {
  /* Máy đã cài app lên màn hình chính thì trước đây phải mở HAI lần mới thấy bản
     mới: lần đầu chỉ tải về bản mới, lần sau mới dùng. Tệ hơn, giữa chừng có thể
     dính HTML mới ghép với mã cũ. Nay bản mới vừa nắm quyền là tự nạp lại một
     lần, để mọi tệp luôn cùng một đời. */
  let daNapLai = false;
  let choNapLai = false;
  const daCoNguoiDieuKhien = !!navigator.serviceWorker.controller;

  function thuNapLai() {
    if (daNapLai) return;
    // Đang học dở thì khoan — nạp lại lúc đó là mất bài người ta đang làm.
    const dangBan = ["#player", "#flash", "#call", "#result", "#cong", "#pro"]
      .some(sel => { const o = $(sel); return o && !o.hidden; });
    if (dangBan) { choNapLai = true; return; }
    daNapLai = true;
    location.reload();
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Lần cài đầu tiên cũng bắn sự kiện này, nhưng lúc đó nạp lại là thừa.
    if (!daCoNguoiDieuKhien) return;
    thuNapLai();
  });
  setInterval(() => { if (choNapLai) thuNapLai(); }, 3000);

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      // App đã cài thì người ta mở đi mở lại chứ ít khi đóng hẳn, nên mỗi lần
      // quay lại là hỏi luôn có bản mới không, đừng chờ trình duyệt tự kiểm.
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) reg.update().catch(() => {});
      });
      // Có người mở app rồi để đó cả buổi, không đóng cũng không chuyển đi đâu —
      // chỉ nghe theo lúc quay lại thì họ chẳng bao giờ nhận được bản mới. Nửa
      // tiếng hỏi một lần, hỏi khi đang mở màn hình thôi cho đỡ tốn pin.
      setInterval(() => {
        if (!document.hidden) reg.update().catch(() => {});
      }, 30 * 60 * 1000);
    } catch { /* không có service worker thì app vẫn chạy bình thường */ }
  });
}

/* ---------- 23b. Trò chơi thưởng: BẮN CHỮ ----------
   Thầy đặt bài: câu thiếu một chữ nằm dưới, các chữ bay lơ lửng trong bóng bay
   ở trên, dưới cùng là cây cung phải ngắm rồi mới bắn được. Bắn trúng chữ đúng
   thì chữ bay về lấp vào chỗ trống; bắn nhầm chữ khác thì hiện chữ "No"; để chữ
   đúng bay khỏi màn hình là thua.

   Chơi nhưng vẫn là học: câu và chữ mồi đều lấy theo ĐÚNG trình độ người học,
   và bắn trúng thì máy đọc lại cả câu cho nghe. */

const BAN_TONG = 12;         // thầy bảo cho chơi dài ra — mười hai câu một ván
const BAN_MANG = 3;          // ba lần bắn nhầm
/* Bóng bay giữ đúng họ màu của app — tím dẫn đầu, hồng/xanh/cam phụ hoạ — chứ
   không bốc bừa bảy màu cầu vồng như trước. */
const BAN_MAU = ["#7C3AED", "#DB2777", "#16A34A", "#EA580C", "#4F46E5", "#C026D3"];

/* Chữ mồi phải CÙNG LOẠI với chữ đúng thì mới đáng để cân nhắc. Thầy lấy ví dụ
   my / the / we — đúng là ba loại chữ nhỏ hay lẫn nhau nhất. */
const BAN_HO = [
  ["my", "your", "his", "her", "our", "their", "its"],
  ["the", "a", "an", "this", "that", "these", "those"],
  ["i", "you", "he", "she", "we", "they", "it"],
  ["am", "is", "are", "was", "were", "be"],
  ["do", "does", "did", "have", "has", "had"],
  ["in", "on", "at", "to", "from", "with", "for", "of", "by", "about"],
  ["and", "but", "or", "so", "because"],
  ["can", "could", "will", "would", "must", "should", "may"],
  ["not", "very", "too", "also", "always", "never", "often", "sometimes"],
  ["what", "where", "when", "who", "why", "how"],
  ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
];

const banGoc = s => String(s || "").toLowerCase().replace(/[^a-z']/g, "");

/* Kho câu theo trình độ: câu luyện của bài + câu ví dụ của từng từ vựng. Lấy
   bậc đang học TRỞ XUỐNG, y như kho mồi nhiễu của các bài tập khác. */
let BAN_KHO = { lv: null, ds: null };
function banKhoCau() {
  if (BAN_KHO.lv === S.level && BAN_KHO.ds) return BAN_KHO.ds;
  const thu = COURSE.levels.findIndex(l => l.id === S.level);
  const dsLv = COURSE.levels.slice(0, thu < 0 ? 1 : thu + 1);
  const gap = new Set();
  const ds = [];
  const them = (en, vi) => {
    const c = String(en || "").trim();
    if (!c || !vi) return;
    const so = c.replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean);
    if (so.length < 3 || so.length > 8) return;      // ngắn quá thì không có gì để đoán
    const k = c.toLowerCase();
    if (gap.has(k)) return;
    gap.add(k);
    ds.push({ en: c, vi: String(vi).trim(), tu: so });
  };
  for (const lv of dsLv) {
    for (const u of lv.units) for (const l of (u.lessons || [])) {
      (l.sentences || []).forEach(s => them(s.en, s.vi));
      (l.teach || []).forEach(s => { if (s.ex) them(s.ex.en, s.ex.vi); });
    }
  }
  BAN_KHO = { lv: S.level, ds };
  return ds;
}

/** Chọn chỗ khoét và hai chữ mồi. Ưu tiên khoét chữ nhỏ có họ hàng — đó mới là
    chỗ người học hay sai, và mồi mới cùng loại để phải nghĩ thật. */
function banRaDe() {
  const kho = banKhoCau();
  if (!kho.length) return null;
  for (const c of shuffle(kho).slice(0, 40)) {
    const co = c.tu.map(banGoc);
    // Vòng 1: tìm chữ có họ. Vòng 2: chấp nhận chữ bất kỳ, mồi lấy từ kho từ.
    for (const chiHo of [true, false]) {
      const thu = shuffle(c.tu.map((t, i) => i));
      for (const i of thu) {
        const g = co[i];
        if (!g || g.length < 1) continue;
        if (co.filter(x => x === g).length > 1) continue;   // chữ lặp thì khoét xong mơ hồ
        const ho = BAN_HO.find(h => h.includes(g));
        if (chiHo && !ho) continue;
        let moi = [];
        if (ho) {
          moi = shuffle(ho.filter(x => x !== g && !co.includes(x))).slice(0, 2);
        } else {
          const kt = khoTheoBac().single || SINGLE;
          moi = shuffle(kt.map(w => w.en.toLowerCase())
            .filter(x => /^[a-z]+$/.test(x) && x !== g && !co.includes(x)
                      && Math.abs(x.length - g.length) <= 3))
            .slice(0, 2);
        }
        if (moi.length < 2) continue;
        // Ba quả bóng phải viết hoa/thường GIỐNG HỆT nhau. Để nguyên chữ đúng
        // là "They" còn hai chữ mồi là "you", "i" thì nhìn cái biết ngay, khỏi
        // cần nghĩ — thành ra trò chơi chẳng dạy được gì.
        const hoaCa = i === 0 || /^[A-Z]/.test(c.tu[i]);
        const hien = w => (hoaCa ? w.charAt(0).toUpperCase() + w.slice(1)
                                 : (w === "i" ? "I" : w));
        return {
          en: c.en, vi: c.vi,
          truoc: c.tu.slice(0, i).join(" "),
          sau: c.tu.slice(i + 1).join(" "),
          dap: c.tu[i],                 // giữ nguyên hoa/thường và dấu câu để lấp vào cho khớp
          goc: g,
          chu: shuffle([g, ...moi].map(hien)),
        };
      }
    }
  }
  return null;
}

/* ---- Trạng thái ván chơi ---- */
const BAN = {
  mo: false, raf: 0, truoc: 0,
  cv: null, ctx: null, W: 0, H: 0,
  bong: [], hat: [], may: [], ten: null,
  mau: { net: "#3B0764", mui: "#C2410C", tim: "#7C3AED", may: "#7E22CE", day: "#C9B6E4" },
  goc: 0, luc: .62, keo: false, ngam: false,
  diem: 0, mang: BAN_MANG, vong: 0, de: null, cho: true,
};
let banSauKhiDong = null;

/* ---- Tiếng: tự tổng hợp cho nhẹ, không thêm file nào ---- */
function banTiengCung() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .01;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(300, t);
  o.frequency.exponentialRampToValueAtTime(88, t + .13);
  g.gain.setValueAtTime(.11, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .16);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .18);
}
function banTiengDung() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .01;
  [1046.5, 1318.5].forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t + i * .1);
    g.gain.exponentialRampToValueAtTime(.1, t + i * .1 + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + i * .1 + .26);
    o.connect(g); g.connect(ra(a));
    o.start(t + i * .1); o.stop(t + i * .1 + .3);
  });
}
function banTiengSai() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .01;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(196, t);
  o.frequency.setValueAtTime(146, t + .13);
  g.gain.setValueAtTime(.07, t);
  g.gain.setValueAtTime(.07, t + .13);
  g.gain.exponentialRampToValueAtTime(.0001, t + .3);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .32);
}

/* ---- Dựng màn ---- */
function banCoCanvas() {
  const cv = BAN.cv;
  const tl = Math.min(window.devicePixelRatio || 1, 2);
  BAN.W = cv.clientWidth;
  BAN.H = cv.clientHeight;
  cv.width = Math.round(BAN.W * tl);
  cv.height = Math.round(BAN.H * tl);
  BAN.ctx.setTransform(tl, 0, 0, tl, 0, 0);
}
/* Cây cung: thầy bảo cho to lên. Mọi kích thước vẽ cung đều nhân theo BAN_CUNG,
   chỉnh một số là cả cung, dây và mũi tên đặt sẵn cùng to nhỏ theo. */
const BAN_CUNG = 46;         // bán kính cánh cung
const banGocCung = () => ({ x: BAN.W / 2, y: BAN.H - BAN_CUNG - 12 });

/* Canvas không hiểu biến CSS, nên đọc thẳng bộ màu của app ra rồi vẽ bằng màu
   đó. Nhờ vậy cung, tên, mây trong trò chơi luôn cùng tông với cả app, và bật
   chế độ tối là tự đổi theo chứ không phải chép tay hai bảng màu. */
function banLayMau() {
  const c = getComputedStyle(document.documentElement);
  const l = (k, dp) => (c.getPropertyValue(k) || "").trim() || dp;
  BAN.mau = {
    net: l("--ink-deep", "#3B0764"),     // cánh cung, thân mũi tên
    mui: l("--flame", "#C2410C"),        // đầu mũi tên
    tim: l("--brand-fill", "#7C3AED"),   // đường ngắm, vệt tên
    may: l("--brand", "#7E22CE"),        // mây
    day: l("--line-hi", "#C9B6E4"),      // dây buộc bóng
  };
}

function banMayMoi() {
  BAN.may = [];
  for (let i = 0; i < 4; i++) {
    BAN.may.push({
      x: Math.random() * BAN.W, y: 30 + Math.random() * (BAN.H * .55),
      r: 26 + Math.random() * 26, toc: 4 + Math.random() * 7, mo: .10 + Math.random() * .10,
    });
  }
}

/** Đặt một quả bóng: đo chữ trước để quả bóng vừa đúng chữ, chữ dài không tràn. */
function banQua(chu, dung, y) {
  const c = BAN.ctx;
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const rong = c.measureText(chu).width;
  const rx = clamp(rong / 2 + 17, 30, BAN.W / 2 - 14);
  return {
    chu, dung, rx, ry: rx * 1.14,
    x: 0, y,
    pha: Math.random() * Math.PI * 2,
    lac: 8 + Math.random() * 10,
    // Bay chậm cho kịp ngắm. Ván dài mười hai câu nên phần nhanh dần phải có
    // trần, không thì mấy câu cuối bóng vụt lên nhanh quá, không ai bắn kịp.
    toc: 10 + Math.random() * 4 + Math.min(6, BAN.vong * 0.6),
    mau: BAN_MAU[Math.floor(Math.random() * BAN_MAU.length)],
  };
}

/** Xếp bóng dàn ngang, không quả nào chồng lên quả nào. */
function banXepNgang() {
  const n = BAN.bong.length;
  if (!n) return;
  const o = BAN.W / n;
  BAN.bong.forEach((b, i) => {
    b.x = clamp(o * (i + .5) + (Math.random() - .5) * (o * .3), b.rx + 6, BAN.W - b.rx - 6);
    b.goc0 = b.x;
  });
}

function banVongMoi() {
  const de = banRaDe();
  if (!de) { toast("Chưa đủ câu để chơi ở trình độ này."); return banDong(); }
  BAN.de = de;
  BAN.vong += 1;
  BAN.cho = false;
  BAN.ten = null;
  BAN.hat = [];

  // Câu có chỗ trống ở dưới
  const o = $("#banCau");
  o.textContent = "";
  if (de.truoc) o.append(de.truoc + " ");
  const trong = el("span", "ban-o", ".....");
  trong.id = "banO";
  o.append(trong);
  if (de.sau) o.append(" " + de.sau);
  $("#banViet").textContent = de.vi;
  banChayHieuUng(o);
  // Phải chỉ rõ trong màn nào: hai trò chơi dùng chung tên lớp, tìm trống
  // không thì luôn vớ phải cái của màn Bắn chữ.
  banChayHieuUng($("#banView .ban-hang-viet"));

  BAN.bong = de.chu.map((chu, i) =>
    banQua(chu, banGoc(chu) === de.goc, BAN.H * (.44 + i * .12) + Math.random() * 16));
  banXepNgang();
  banVeMang();
  $("#banBan").disabled = false;
  $("#banChi").textContent = "Câu " + BAN.vong + "/" + BAN_TONG + " — nghe câu rồi bắn vào chữ còn thiếu.";
  // Đọc CẢ CÂU đầy đủ ngay từ đầu. Không đọc thì có câu ba chữ mồi đều đúng
  // ngữ pháp (Open his/their/your notebook) — người học bắn đúng vẫn bị báo
  // sai, thế là oan. Nghe rồi thì chỉ còn một chữ đúng, mà lại được luyện nghe.
  clearTimeout(banDocHen);
  banDocHen = setTimeout(() => { if (BAN.mo) speak(de.en, false, "en-GB"); }, 420);
}
let banDocHen = null;

/* Gỡ lớp rồi gắn lại thì hoạt hình mới chạy lại từ đầu. Chỉ gắn lớp không thì
   lần thứ hai trở đi trình duyệt coi như "vẫn lớp cũ", chữ hiện đánh phịch. */
function banChayHieuUng(n) {
  if (!n) return;
  n.classList.remove("vao");
  void n.offsetWidth;
  n.classList.add("vao");
}

/** MON.L đứng dưới góc trời: trúng thì nhảy mừng, nhầm thì lắc đầu. Hết hoạt
    hình phải gỡ lớp ra, không thì lần sau gắn lại nó nằm im. */
let banAvaHen = null;
function banAvaTo(loai) {
  const n = $("#banAva");
  if (!n) return;
  n.classList.remove("vui", "buon");
  void n.offsetWidth;
  n.classList.add(loai);
  clearTimeout(banAvaHen);
  banAvaHen = setTimeout(() => n.classList.remove("vui", "buon"), 800);
}

function banVeMang() {
  // Vẽ tim bằng ký tự thường rồi tô màu bằng CSS: hình trái tim emoji mỗi máy
  // một kiểu, có máy ra tim đen thui, nhìn không biết còn mấy mạng.
  const o = $("#banMang");
  o.textContent = "";
  for (let i = 0; i < BAN_MANG; i++) {
    o.append(el("span", "ban-tim" + (i < BAN.mang ? "" : " tat"), "♥"));
  }
  $("#banDiem").textContent = BAN.diem;
}

function banKeu(chu, loai) {
  const p = $("#banKeu");
  p.hidden = true;
  p.textContent = chu;
  p.className = "ban-keu " + loai;
  void p.offsetWidth;            // ép vẽ lại để chạy lại hoạt hình
  p.hidden = false;
  clearTimeout(banKeuHen);
  banKeuHen = setTimeout(() => { p.hidden = true; }, 900);
}
let banKeuHen = null;

/* ---- Bắn ---- */
function banNhaTen() {
  if (BAN.cho || BAN.ten || !BAN.mo) return;
  const g = banGocCung();
  const v = 470 + BAN.luc * 470;
  BAN.ten = {
    x: g.x + Math.sin(BAN.goc) * 58, y: g.y - Math.cos(BAN.goc) * 58,
    vx: Math.sin(BAN.goc) * v, vy: -Math.cos(BAN.goc) * v, vet: [],
  };
  $("#banBan").disabled = true;
  banTiengCung();
}

function banNo(b) {
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 180;
    BAN.hat.push({ x: b.x, y: b.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, mau: b.mau, doi: 1 });
  }
  keuNo(0);
}

/** Chữ vừa bắn trúng bay xuống lấp vào ô trống. */
function banChuBayVe(b) {
  const o = $("#banO");
  const cv = BAN.cv.getBoundingClientRect();
  const s = el("span", "ban-bay", b.chu);
  s.style.left = (cv.left + b.x) + "px";
  s.style.top = (cv.top + b.y) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(() => {
    const r = o.getBoundingClientRect();
    s.style.left = (r.left + r.width / 2) + "px";
    s.style.top = (r.top + r.height / 2) + "px";
    s.style.fontSize = "1.32rem";
  });
  setTimeout(() => {
    s.remove();
    o.textContent = BAN.de.dap.replace(/[.,!?]/g, "");
    o.classList.add("day");
  }, 640);
}

function banTrungDung(b) {
  BAN.cho = true;
  BAN.diem += 10;
  banNo(b);
  BAN.bong = BAN.bong.filter(x => x !== b);
  banKeu("Yes!", "dung");
  banAvaTo("vui");
  banTiengDung();
  banChuBayVe(b);
  banVeMang();
  setTimeout(() => { if (BAN.mo) speak(BAN.de.en, false, "en-GB"); }, 700);
  setTimeout(() => {
    if (!BAN.mo) return;
    if (BAN.vong >= BAN_TONG) return banXong(true);
    banVongMoi();
  }, 2100);
}

function banTrungSai(b) {
  banNo(b);
  BAN.bong = BAN.bong.filter(x => x !== b);
  BAN.mang -= 1;
  banKeu("No", "sai");
  banAvaTo("buon");
  banTiengSai();
  banVeMang();
  if (BAN.mang <= 0) return banXong(false, "Bắn nhầm ba lần rồi.");
  // Thả lại một chữ mồi khác cho bầu trời khỏi vắng, mà cũng khó dần lên.
  const co = new Set(BAN.bong.map(x => banGoc(x.chu)).concat(BAN.de.goc));
  const ho = BAN_HO.find(h => h.includes(BAN.de.goc));
  const con = (ho || []).filter(x => !co.has(x));
  if (con.length) {
    const q = banQua(con[Math.floor(Math.random() * con.length)], false, BAN.H + 40);
    q.x = clamp(Math.random() * BAN.W, q.rx + 6, BAN.W - q.rx - 6);
    q.goc0 = q.x;
    BAN.bong.push(q);
  }
}

function banXong(thang, vi) {
  BAN.cho = true;
  BAN.ten = null;
  $("#banBan").disabled = true;
  $("#banHetTit").textContent = thang ? "Giỏi quá!" : "Hết lượt rồi";
  $("#banHetSub").textContent = thang
    ? "Bắn trúng cả " + BAN_TONG + " câu, được " + BAN.diem + " điểm."
    : (vi || "Chữ đúng bay mất rồi.") + " Được " + BAN.diem + " điểm.";
  $("#banHet").hidden = false;
  if (thang) phatVoTay();
}

/* ---- Vẽ ---- */
function banVeMay(c) {
  for (const m of BAN.may) {
    c.globalAlpha = m.mo;
    c.fillStyle = BAN.mau.may;
    c.beginPath();
    c.ellipse(m.x, m.y, m.r * 1.7, m.r * .62, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(m.x - m.r * .5, m.y - m.r * .2, m.r * .8, m.r * .5, 0, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;
  }
}

function banVeBong(c, b) {
  // Dây bóng
  c.strokeStyle = BAN.mau.day;
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(b.x, b.y + b.ry);
  c.quadraticCurveTo(b.x + 7, b.y + b.ry + 16, b.x - 3, b.y + b.ry + 30);
  c.stroke();
  // Nút thắt
  c.fillStyle = b.mau;
  c.beginPath();
  c.moveTo(b.x - 5, b.y + b.ry - 1);
  c.lineTo(b.x + 5, b.y + b.ry - 1);
  c.lineTo(b.x, b.y + b.ry + 7);
  c.closePath(); c.fill();
  // Thân bóng
  const g = c.createRadialGradient(b.x - b.rx * .34, b.y - b.ry * .38, 2, b.x, b.y, b.rx * 1.25);
  g.addColorStop(0, "rgba(255,255,255,.55)");
  g.addColorStop(.35, b.mau);
  g.addColorStop(1, "rgba(0,0,0,.28)");
  c.fillStyle = g;
  c.beginPath(); c.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1.5; c.stroke();
  // Chữ
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(0,0,0,.45)";
  c.fillText(b.chu, b.x, b.y + 1.5);
  c.fillStyle = "#fff";
  c.fillText(b.chu, b.x, b.y);
}

function banVeCung(c) {
  const g = banGocCung();
  c.save();
  c.translate(g.x, g.y);
  c.rotate(BAN.goc);
  const R = BAN_CUNG;
  // Cánh cung
  c.strokeStyle = BAN.mau.net; c.lineWidth = 8; c.lineCap = "round";
  c.beginPath(); c.arc(0, 0, R, -Math.PI * .78, -Math.PI * .22, false); c.stroke();
  // Dây cung, kéo lùi theo lực
  const k = 8 + BAN.luc * 22;
  const t1 = { x: Math.cos(-Math.PI * .78) * R, y: Math.sin(-Math.PI * .78) * R };
  const t2 = { x: Math.cos(-Math.PI * .22) * R, y: Math.sin(-Math.PI * .22) * R };
  c.strokeStyle = BAN.mau.net; c.globalAlpha = .7; c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(t1.x, t1.y); c.lineTo(0, k); c.lineTo(t2.x, t2.y); c.stroke();
  c.globalAlpha = 1;
  // Mũi tên đặt sẵn trên dây, chỉ vẽ khi chưa có tên nào đang bay
  if (!BAN.ten) {
    c.strokeStyle = BAN.mau.net; c.lineWidth = 4;
    c.beginPath(); c.moveTo(0, k); c.lineTo(0, k - 70); c.stroke();
    c.fillStyle = BAN.mau.mui;
    c.beginPath();
    c.moveTo(0, k - 84); c.lineTo(-8, k - 64); c.lineTo(8, k - 64);
    c.closePath(); c.fill();
    c.strokeStyle = BAN.mau.tim; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(-7, k + 6); c.lineTo(0, k - 6); c.lineTo(7, k + 6); c.stroke();
  }
  c.restore();
  // Tay cầm
  c.globalAlpha = .12; c.fillStyle = BAN.mau.net;
  c.beginPath(); c.ellipse(g.x, g.y + 28, 38, 14, 0, 0, Math.PI * 2); c.fill();
  c.globalAlpha = 1;
}

/** Đường tên sẽ bay — không có nó thì ngắm chỉ là đoán mò. */
function banVeDuong(c) {
  if (BAN.ten || BAN.cho) return;
  const g = banGocCung();
  const v = 470 + BAN.luc * 470;
  let x = g.x + Math.sin(BAN.goc) * 58, y = g.y - Math.cos(BAN.goc) * 58;
  let vx = Math.sin(BAN.goc) * v, vy = -Math.cos(BAN.goc) * v;
  c.fillStyle = BAN.mau.tim; c.globalAlpha = .55;
  for (let i = 0; i < 46; i++) {
    vy += 380 * .022; x += vx * .022; y += vy * .022;
    if (y > BAN.H || x < 0 || x > BAN.W) break;
    if (i % 3 === 0) { c.beginPath(); c.arc(x, y, 2.1, 0, Math.PI * 2); c.fill(); }
  }
  c.globalAlpha = 1;
}

function banVeTen(c) {
  const t = BAN.ten;
  if (!t) return;
  c.strokeStyle = BAN.mau.tim; c.globalAlpha = .35; c.lineWidth = 2;
  c.beginPath();
  t.vet.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.stroke();
  c.globalAlpha = 1;
  const a = Math.atan2(t.vy, t.vx);
  c.save(); c.translate(t.x, t.y); c.rotate(a);
  c.strokeStyle = BAN.mau.net; c.lineWidth = 4; c.lineCap = "round";
  c.beginPath(); c.moveTo(-44, 0); c.lineTo(0, 0); c.stroke();
  c.fillStyle = BAN.mau.mui;
  c.beginPath(); c.moveTo(12, 0); c.lineTo(-4, -7); c.lineTo(-4, 7); c.closePath(); c.fill();
  c.strokeStyle = BAN.mau.tim; c.lineWidth = 2.6;
  c.beginPath(); c.moveTo(-44, -7); c.lineTo(-35, 0); c.lineTo(-44, 7); c.stroke();
  c.restore();
}

/* ---- Vòng chạy ---- */
function banChay(nay) {
  if (!BAN.mo) return;
  const dt = Math.min(50, nay - BAN.truoc) / 1000;
  BAN.truoc = nay;
  const c = BAN.ctx;
  c.clearRect(0, 0, BAN.W, BAN.H);

  // Mây trôi
  for (const m of BAN.may) {
    m.x += m.toc * dt;
    if (m.x - m.r * 2 > BAN.W) m.x = -m.r * 2;
  }
  banVeMay(c);

  // Bóng bay lên, lắc nhẹ sang hai bên
  const dangChay = $("#banHet").hidden;   // còn thấy bảng kết thúc thì ván đã dừng
  for (const b of BAN.bong) {
    if (dangChay) {
      b.y -= b.toc * dt;
      b.pha += dt * 1.1;
      b.x = clamp(b.goc0 + Math.sin(b.pha) * b.lac, b.rx + 4, BAN.W - b.rx - 4);
    }
    banVeBong(c, b);
  }

  // Bay khỏi màn: chữ đúng bay mất là thua, chữ mồi thì thả lại quả khác
  if (dangChay && !BAN.cho) {
    for (const b of BAN.bong.slice()) {
      if (b.y + b.ry > -4) continue;
      if (b.dung) { banXong(false, "Chữ đúng bay mất rồi."); break; }
      b.y = BAN.H + b.ry + 10;
      b.goc0 = clamp(Math.random() * BAN.W, b.rx + 6, BAN.W - b.rx - 6);
    }
  }

  // Hạt bóng nổ
  for (const h of BAN.hat.slice()) {
    h.vy += 520 * dt;
    h.x += h.vx * dt; h.y += h.vy * dt;
    h.doi -= dt * 1.5;
    if (h.doi <= 0) { BAN.hat.splice(BAN.hat.indexOf(h), 1); continue; }
    c.globalAlpha = Math.max(0, h.doi);
    c.fillStyle = h.mau;
    c.beginPath(); c.arc(h.x, h.y, 3.2, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  // Mũi tên
  const t = BAN.ten;
  if (t) {
    // Chia nhỏ bước để tên bay nhanh không xuyên qua quả bóng mà không chạm.
    const buoc = 4;
    for (let k = 0; k < buoc && BAN.ten; k++) {
      const d = dt / buoc;
      t.vy += 380 * d;
      t.x += t.vx * d; t.y += t.vy * d;
      for (const b of BAN.bong) {
        const dx = (t.x - b.x) / b.rx, dy = (t.y - b.y) / b.ry;
        if (dx * dx + dy * dy <= 1) {
          BAN.ten = null;
          $("#banBan").disabled = false;
          if (b.dung) banTrungDung(b); else banTrungSai(b);
          break;
        }
      }
    }
    if (BAN.ten) {
      t.vet.push({ x: t.x, y: t.y });
      if (t.vet.length > 12) t.vet.shift();
      if (t.x < -60 || t.x > BAN.W + 60 || t.y > BAN.H + 60 || t.y < -400) {
        BAN.ten = null;
        $("#banBan").disabled = false;
      }
    }
  }
  banVeTen(c);
  banVeDuong(c);
  banVeCung(c);

  BAN.raf = requestAnimationFrame(banChay);
}

/* ---- Ngắm ---- */
function banNgamTai(px, py) {
  const g = banGocCung();
  const dx = px - g.x, dy = py - g.y;
  if (dy > -12) return;                       // chỉ ngắm lên trời
  BAN.goc = clamp(Math.atan2(dx, -dy), -1.15, 1.15);
  const xa = Math.hypot(dx, dy);
  BAN.luc = clamp(xa / (BAN.H * .72), .35, 1);
}

function banGanTay() {
  // Gắn tay nghe ngay lúc nạp app, nên phải tự tìm lấy canvas — banMo() chạy sau.
  const cv = $("#banTroi");
  BAN.cv = cv;
  BAN.ctx = cv.getContext("2d");
  const toa = e => {
    const r = cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  cv.addEventListener("pointerdown", e => {
    if (BAN.cho || BAN.ten) return;
    BAN.keo = true;
    try { cv.setPointerCapture(e.pointerId); } catch { /* thôi */ }
    banNgamTai(...toa(e));
  });
  cv.addEventListener("pointermove", e => { if (BAN.keo) banNgamTai(...toa(e)); });
  const tha = () => { if (!BAN.keo) return; BAN.keo = false; banNhaTen(); };
  cv.addEventListener("pointerup", tha);
  cv.addEventListener("pointercancel", () => { BAN.keo = false; });

  const xoay = d => { BAN.goc = clamp(BAN.goc + d, -1.15, 1.15); };
  // Giữ nút thì cung xoay đều, không phải bấm từng nhát.
  [["#banTrai", -.07], ["#banPhai", .07]].forEach(([id, d]) => {
    const n = $(id);
    let hen = null, lap = null;
    const thoi = () => { clearTimeout(hen); clearInterval(lap); hen = lap = null; };
    n.addEventListener("pointerdown", () => {
      xoay(d);
      hen = setTimeout(() => { lap = setInterval(() => xoay(d), 60); }, 340);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => n.addEventListener(ev, thoi));
  });
  $("#banBan").addEventListener("click", banNhaTen);
}

/* ---- Mở / đóng ---- */
function banMo(xong) {
  const v = $("#banView");
  if (!v) { xong && xong(); return; }
  if (!banKhoCau().length) { toast("Chưa đủ câu để chơi ở trình độ này."); xong && xong(); return; }
  banSauKhiDong = xong || null;
  BAN.cv = $("#banTroi");
  BAN.ctx = BAN.cv.getContext("2d");
  v.hidden = false;
  document.body.style.overflow = "hidden";
  thuongDangMo = true;                       // dùng chung khoá với trang thưởng
  BAN.mo = true;
  BAN.diem = 0; BAN.mang = BAN_MANG; BAN.vong = 0;
  BAN.goc = 0; BAN.luc = .62; BAN.ten = null; BAN.hat = [];
  $("#banHet").hidden = true;
  $("#banKeu").hidden = true;
  banLayMau();
  banCoCanvas();
  banMayMoi();
  banVongMoi();
  BAN.truoc = performance.now();
  cancelAnimationFrame(BAN.raf);
  BAN.raf = requestAnimationFrame(banChay);
}

function banDong() {
  cancelAnimationFrame(BAN.raf);
  clearTimeout(banDocHen);
  BAN.mo = false;
  BAN.keo = false;
  stopSpeak();
  $("#banView").hidden = true;
  $("#banHet").hidden = true;
  // Đóng trò chơi mà bên dưới còn màn học hay trang kết quả thì PHẢI giữ nguyên
  // khoá cuộn của lớp đó, không thì trang nền tự trôi lung tung.
  const conMo = !$("#player").hidden || !$("#result").hidden;
  document.body.style.overflow = conMo ? "hidden" : "";
  thuongDangMo = false;
  thuongDangCho = false;
  try { $("#btnNext").disabled = false; } catch { /* thôi */ }
  const f = banSauKhiDong;
  banSauKhiDong = null;
  f && f();
}

$("#banNghe").addEventListener("click", () => { if (BAN.de) speak(BAN.de.en, false, "en-GB"); });
$("#btnBanDong").addEventListener("click", banDong);
$("#banHetVe").addEventListener("click", banDong);
$("#banHetLai").addEventListener("click", () => {
  BAN.diem = 0; BAN.mang = BAN_MANG; BAN.vong = 0;
  BAN.goc = 0; BAN.luc = .62; BAN.ten = null; BAN.hat = [];
  $("#banHet").hidden = true;
  banVongMoi();
  $("#banBan").disabled = false;
});
$("#btnResChoi").addEventListener("click", () => banMo(null));
$("#btnResChem").addEventListener("click", () => chemMo(null));
$("#btnResNem").addEventListener("click", () => nemMo(null));
$("#btnResRan").addEventListener("click", () => ranMo(null));
banGanTay();

// Xoay máy hay hiện bàn phím thì khung đổi cỡ — phải dựng lại canvas, không thì
// bóng bay nằm lệch ra ngoài chỗ chạm được.
window.addEventListener("resize", () => {
  if (!BAN.mo) return;
  const cu = BAN.W;
  banCoCanvas();
  const ti = cu ? BAN.W / cu : 1;
  BAN.bong.forEach(b => {
    b.rx = Math.min(b.rx, BAN.W / 2 - 14);
    b.ry = b.rx * 1.14;
    b.goc0 = clamp((b.goc0 || b.x) * ti, b.rx + 6, BAN.W - b.rx - 6);
    b.x = b.goc0;
  });
});

/* ---------- 23c. Trò chơi: CHÉM CHỮ ----------
   Thầy đặt bài: chém hoa quả kiểu Fruit Ninja, nhưng trên mỗi quả có một chữ
   tiếng Anh. Câu thiếu một chữ nằm dưới; chém trúng quả mang chữ đúng thì chữ
   rơi xuống nhảy vào đúng chỗ trống, chém nhầm thì hiện "No" và quả nổ đụp một
   cái như pháo. Phải có vệt chém, màu theo màu app.

   Dùng chung bộ đề với trò Bắn chữ (banRaDe) nên câu và chữ mồi vẫn đúng trình
   độ người học, và vẫn đọc cả câu đầu mỗi lượt cho khỏi có chữ nào cũng đúng. */

const CHEM_TONG = 10;        // mười câu một ván
const CHEM_MANG = 3;
const CHEM_G = 520;          // trọng lực: quả bay lên rồi rơi xuống trong ~2,2 giây
const CHEM_VET_DOI = 260;    // vệt chém sống 0,26 giây rồi tan

const CHEM = {
  mo: false, raf: 0, truoc: 0,
  cv: null, ctx: null, W: 0, H: 0,
  qua: [], manh: [], hat: [], vet: [],
  de: null, cho: true, keo: false,
  diem: 0, mang: CHEM_MANG, vong: 0,
  mau: { net: "#3B0764", la: "#16A34A", vet: "#7C3AED" },
};
let chemSauKhiDong = null;
let chemKeuHen = null, chemAvaHen = null, chemDocHen = null;

/* ---- Tiếng ---- */
function chemTiengChem() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .005;
  // Tiếng "vút": nhiễu trắng lọc cao, tắt rất nhanh — nghe ra lưỡi dao đi qua.
  const n = Math.floor(a.sampleRate * .16);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2);
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 2200;
  const g = a.createGain(); g.gain.value = .1;
  src.connect(f); f.connect(g); g.connect(ra(a));
  src.start(t);
}
const chemTiengDung = () => chuoiNot([[659.3, 0, .16], [880, .09, .28]], "triangle", .07);

/* ---- Dựng màn ---- */
function chemCoCanvas() {
  const cv = CHEM.cv;
  const tl = Math.min(window.devicePixelRatio || 1, 2);
  CHEM.W = cv.clientWidth;
  CHEM.H = cv.clientHeight;
  cv.width = Math.round(CHEM.W * tl);
  cv.height = Math.round(CHEM.H * tl);
  CHEM.ctx.setTransform(tl, 0, 0, tl, 0, 0);
}

function chemLayMau() {
  const c = getComputedStyle(document.documentElement);
  const l = (k, dp) => (c.getPropertyValue(k) || "").trim() || dp;
  CHEM.mau = {
    net: l("--ink-deep", "#3B0764"),
    la: l("--ok", "#16A34A"),
    vet: l("--brand", "#7E22CE"),
  };
}

/** Một quả: to nhỏ theo chữ in trên nó, chữ dài thì quả to ra cho vừa. */
function chemQua(chu, dung) {
  const c = CHEM.ctx;
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const rong = c.measureText(chu).width;
  const r = clamp(rong / 2 + 20, 36, Math.min(58, CHEM.W / 2 - 16));
  return {
    chu, dung, r,
    mau: BAN_MAU[Math.floor(Math.random() * BAN_MAU.length)],
    x: 0, y: 0, vx: 0, vy: 0, goc: 0, xoay: 0, song: false, cho: 0,
  };
}

/** Tung một quả lên từ đáy màn. Đỉnh bay lên khoảng 2/3 chiều cao trời. */
function chemNem(q) {
  q.r = Math.min(q.r, Math.max(30, CHEM.W / 2 - 16));
  q.x = q.r + 20 + Math.random() * Math.max(1, CHEM.W - 2 * q.r - 40);
  q.y = CHEM.H + q.r + 10;
  const cao = (0.58 + Math.random() * 0.14) * CHEM.H;
  q.vy = -Math.sqrt(2 * CHEM_G * cao);
  // Hơi chụm vào giữa để quả không bay thẳng ra mép rồi mất hút.
  q.vx = (CHEM.W / 2 - q.x) * 0.42 + (Math.random() - .5) * 70;
  q.goc = Math.random() * Math.PI;
  q.xoay = (Math.random() - .5) * 2.6;
  q.song = true;
  q.cho = 0;
}

function chemVongMoi() {
  const de = banRaDe();
  if (!de) { toast("Chưa đủ câu để chơi ở trình độ này."); return chemDong(); }
  CHEM.de = de;
  CHEM.vong += 1;
  CHEM.cho = false;
  CHEM.manh = []; CHEM.hat = []; CHEM.vet = [];

  const o = $("#chemCau");
  o.textContent = "";
  if (de.truoc) o.append(de.truoc + " ");
  const trong = el("span", "ban-o", ".....");
  trong.id = "chemO";
  o.append(trong);
  if (de.sau) o.append(" " + de.sau);
  $("#chemViet").textContent = de.vi;
  banChayHieuUng(o);
  banChayHieuUng($("#chemView .ban-hang-viet"));

  // Tung lệch nhau vài nhịp cho quả không chồng lên nhau giữa không trung.
  CHEM.qua = de.chu.map(chu => chemQua(chu, banGoc(chu) === de.goc));
  CHEM.qua.forEach((q, i) => { q.song = false; q.cho = i * 0.55; });

  chemVeMang();
  $("#chemChi").textContent = "Câu " + CHEM.vong + "/" + CHEM_TONG + " — vuốt tay chém quả mang chữ đúng.";
  clearTimeout(chemDocHen);
  chemDocHen = setTimeout(() => { if (CHEM.mo) speak(de.en, false, "en-GB"); }, 420);
}

function chemVeMang() {
  const o = $("#chemMang");
  o.textContent = "";
  for (let i = 0; i < CHEM_MANG; i++) {
    o.append(el("span", "ban-tim" + (i < CHEM.mang ? "" : " tat"), "♥"));
  }
  $("#chemDiem").textContent = CHEM.diem;
}

function chemKeu(chu, loai) {
  const p = $("#chemKeu");
  p.hidden = true;
  p.textContent = chu;
  p.className = "ban-keu " + loai;
  void p.offsetWidth;
  p.hidden = false;
  clearTimeout(chemKeuHen);
  chemKeuHen = setTimeout(() => { p.hidden = true; }, 900);
}

function chemAvaTo(loai) {
  const n = $("#chemAva");
  if (!n) return;
  n.classList.remove("vui", "buon");
  void n.offsetWidth;
  n.classList.add(loai);
  clearTimeout(chemAvaHen);
  chemAvaHen = setTimeout(() => n.classList.remove("vui", "buon"), 800);
}

/* ---- Chém trúng ---- */
/** Quả vỡ đôi: hai nửa văng ra hai bên rồi rơi xuống. */
function chemVoDoi(q, gocDao) {
  for (const ben of [-1, 1]) {
    CHEM.manh.push({
      x: q.x, y: q.y, r: q.r, mau: q.mau, ben,
      dao: gocDao,
      vx: q.vx + Math.cos(gocDao + ben * Math.PI / 2) * 150,
      vy: q.vy + Math.sin(gocDao + ben * Math.PI / 2) * 150 - 60,
      goc: q.goc, xoay: q.xoay + ben * 1.6, doi: 1,
    });
  }
  // Nước quả bắn ra
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2, s = 50 + Math.random() * 170;
    CHEM.hat.push({ x: q.x, y: q.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      mau: q.mau, r: 2.6 + Math.random() * 2.4, doi: 1 });
  }
}

/** Chém nhầm: nổ đụp một cái như pháo — thầy dặn phải nghe ra tiếng nổ. */
function chemNoDup(q) {
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, s = 90 + Math.random() * 280;
    CHEM.hat.push({ x: q.x, y: q.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      mau: i % 3 === 0 ? CHEM.mau.vet : q.mau, r: 2.4 + Math.random() * 3.2, doi: 1 });
  }
  keuNo(0);
}

/** Chữ vừa chém rơi xuống, nhảy vào đúng chỗ trống trong câu. */
function chemChuRoiVe(q) {
  const o = $("#chemO");
  if (!o) return;
  const cv = CHEM.cv.getBoundingClientRect();
  const s = el("span", "ban-bay", q.chu);
  s.style.left = (cv.left + q.x) + "px";
  s.style.top = (cv.top + q.y) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(() => {
    const r = o.getBoundingClientRect();
    s.style.left = (r.left + r.width / 2) + "px";
    s.style.top = (r.top + r.height / 2) + "px";
  });
  setTimeout(() => {
    s.remove();
    o.textContent = CHEM.de.dap.replace(/[.,!?]/g, "");
    o.classList.add("day");
  }, 640);
}

function chemTrungDung(q, gocDao) {
  CHEM.cho = true;
  CHEM.diem += 10;
  chemVoDoi(q, gocDao);
  CHEM.qua = CHEM.qua.filter(x => x !== q);
  chemKeu("Yes!", "dung");
  chemAvaTo("vui");
  chemTiengDung();
  chemChuRoiVe(q);
  chemVeMang();
  setTimeout(() => { if (CHEM.mo) speak(CHEM.de.en, false, "en-GB"); }, 700);
  setTimeout(() => {
    if (!CHEM.mo) return;
    if (CHEM.vong >= CHEM_TONG) return chemXong(true);
    chemVongMoi();
  }, 2100);
}

function chemTrungSai(q) {
  chemNoDup(q);
  CHEM.mang -= 1;
  chemKeu("No", "sai");
  chemAvaTo("buon");
  chemVeMang();
  if (CHEM.mang <= 0) return chemXong(false, "Chém nhầm ba lần rồi.");
  // Quả đó tung lại sau một nhịp, bầu trời khỏi vắng.
  q.song = false;
  q.cho = 0.9;
}

function chemXong(thang, vi) {
  CHEM.cho = true;
  clearTimeout(chemDocHen);
  $("#chemHetTit").textContent = thang ? "Giỏi quá!" : "Hết lượt rồi";
  $("#chemHetSub").textContent = thang
    ? "Chém trúng cả " + CHEM_TONG + " câu, được " + CHEM.diem + " điểm."
    : (vi || "Hết lượt rồi.") + " Được " + CHEM.diem + " điểm.";
  $("#chemHet").hidden = false;
  if (thang) phatVoTay();
}

/* ---- Vẽ ---- */
function chemVeQua(c, q) {
  c.save();
  c.translate(q.x, q.y);
  c.rotate(q.goc);
  // Cuống và lá
  c.strokeStyle = CHEM.mau.net; c.lineWidth = 3; c.lineCap = "round";
  c.beginPath(); c.moveTo(0, -q.r); c.lineTo(0, -q.r - 9); c.stroke();
  c.fillStyle = CHEM.mau.la;
  c.beginPath();
  c.ellipse(q.r * .34, -q.r - 8, q.r * .34, q.r * .17, -.5, 0, Math.PI * 2);
  c.fill();
  // Thân quả
  const g = c.createRadialGradient(-q.r * .34, -q.r * .36, 2, 0, 0, q.r * 1.22);
  g.addColorStop(0, "rgba(255,255,255,.6)");
  g.addColorStop(.38, q.mau);
  g.addColorStop(1, "rgba(0,0,0,.3)");
  c.fillStyle = g;
  c.beginPath(); c.arc(0, 0, q.r, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; c.stroke();
  c.restore();
  // Chữ vẽ THẲNG, không xoay theo quả — chữ mà quay lộn ngược thì đọc sao kịp.
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(0,0,0,.45)";
  c.fillText(q.chu, q.x, q.y + 1.5);
  c.fillStyle = "#fff";
  c.fillText(q.chu, q.x, q.y);
}

function chemVeManh(c, m) {
  c.save();
  c.translate(m.x, m.y);
  c.rotate(m.goc);
  c.globalAlpha = Math.max(0, Math.min(1, m.doi));
  // Nửa quả: cắt theo đúng góc lưỡi dao đi qua.
  c.beginPath();
  c.arc(0, 0, m.r, m.dao, m.dao + Math.PI, m.ben < 0);
  c.closePath();
  const g = c.createRadialGradient(0, 0, 2, 0, 0, m.r * 1.2);
  g.addColorStop(0, "rgba(255,255,255,.66)");
  g.addColorStop(.42, m.mau);
  g.addColorStop(1, "rgba(0,0,0,.3)");
  c.fillStyle = g; c.fill();
  // Mặt cắt sáng màu, nhìn ra ruột quả
  c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 3; c.stroke();
  c.globalAlpha = 1;
  c.restore();
}

/** Vệt chém: nối các điểm ngón tay vừa đi qua, càng cũ càng mảnh và mờ. */
function chemVeVet(c) {
  const n = CHEM.vet.length;
  if (n < 2) return;
  const nay = performance.now();
  for (let i = 1; i < n; i++) {
    const a = CHEM.vet[i - 1], b = CHEM.vet[i];
    const con = 1 - (nay - b.t) / CHEM_VET_DOI;
    if (con <= 0) continue;
    c.strokeStyle = CHEM.mau.vet;
    c.globalAlpha = con * .85;
    c.lineWidth = 2 + con * 9;
    c.lineCap = "round";
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    // Lõi trắng cho ra ánh thép
    c.strokeStyle = "#fff";
    c.globalAlpha = con * .6;
    c.lineWidth = 1 + con * 3;
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
  }
  c.globalAlpha = 1;
}

/* ---- Vòng chạy ---- */
function chemChay(nay) {
  if (!CHEM.mo) return;
  const dt = Math.min(50, nay - CHEM.truoc) / 1000;
  CHEM.truoc = nay;
  const c = CHEM.ctx;
  c.clearRect(0, 0, CHEM.W, CHEM.H);
  const dangChay = $("#chemHet").hidden;

  // Quả bay
  for (const q of CHEM.qua) {
    if (!q.song) {
      if (!dangChay || CHEM.cho) continue;
      q.cho -= dt;
      if (q.cho <= 0) chemNem(q);
      continue;
    }
    q.vy += CHEM_G * dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.goc += q.xoay * dt;
    // Chạm mép thì nảy vào, đỡ mất hút ra ngoài màn
    if (q.x < q.r && q.vx < 0) { q.x = q.r; q.vx = -q.vx * .7; }
    if (q.x > CHEM.W - q.r && q.vx > 0) { q.x = CHEM.W - q.r; q.vx = -q.vx * .7; }
    // Rơi hết xuống đáy thì tung lại, không phạt gì — hụt tay là chuyện thường
    if (q.y - q.r > CHEM.H + 20) { q.song = false; q.cho = .5 + Math.random() * .5; }
    chemVeQua(c, q);
  }

  // Nửa quả rơi
  for (const m of CHEM.manh.slice()) {
    m.vy += CHEM_G * dt;
    m.x += m.vx * dt; m.y += m.vy * dt;
    m.goc += m.xoay * dt;
    m.doi -= dt * .7;
    if (m.doi <= 0 || m.y - m.r > CHEM.H + 40) { CHEM.manh.splice(CHEM.manh.indexOf(m), 1); continue; }
    chemVeManh(c, m);
  }

  // Nước quả / mảnh pháo
  for (const h of CHEM.hat.slice()) {
    h.vy += CHEM_G * dt;
    h.x += h.vx * dt; h.y += h.vy * dt;
    h.doi -= dt * 1.3;
    if (h.doi <= 0) { CHEM.hat.splice(CHEM.hat.indexOf(h), 1); continue; }
    c.globalAlpha = Math.max(0, h.doi);
    c.fillStyle = h.mau;
    c.beginPath(); c.arc(h.x, h.y, h.r, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  // Vệt chém: bỏ điểm đã quá hạn rồi mới vẽ
  const han = nay - CHEM_VET_DOI;
  while (CHEM.vet.length && CHEM.vet[0].t < han) CHEM.vet.shift();
  chemVeVet(c);

  CHEM.raf = requestAnimationFrame(chemChay);
}

/* ---- Vuốt để chém ---- */
/** Đoạn thẳng ngón tay vừa quét có cắt qua quả không. */
function chemCham(q, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const d2 = dx * dx + dy * dy;
  let t = d2 ? ((q.x - x1) * dx + (q.y - y1) * dy) / d2 : 0;
  t = clamp(t, 0, 1);
  const gx = x1 + dx * t, gy = y1 + dy * t;
  return (gx - q.x) ** 2 + (gy - q.y) ** 2 <= q.r * q.r;
}

function chemQuet(x1, y1, x2, y2) {
  if (CHEM.cho) return;
  // Vuốt quá ngắn thì không tính là chém, chỉ là chạm hụt.
  if ((x2 - x1) ** 2 + (y2 - y1) ** 2 < 36) return;
  const dao = Math.atan2(y2 - y1, x2 - x1);
  for (const q of CHEM.qua.slice()) {
    if (!q.song || !chemCham(q, x1, y1, x2, y2)) continue;
    chemTiengChem();
    q.song = false;
    if (q.dung) return chemTrungDung(q, dao);
    chemTrungSai(q);
    return;
  }
}

function chemGanTay() {
  const cv = $("#chemTroi");
  CHEM.cv = cv;
  CHEM.ctx = cv.getContext("2d");
  const toa = e => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  cv.addEventListener("pointerdown", e => {
    CHEM.keo = true;
    try { cv.setPointerCapture(e.pointerId); } catch { /* thôi */ }
    const p = toa(e);
    CHEM.vet = [{ x: p.x, y: p.y, t: performance.now() }];
  });
  cv.addEventListener("pointermove", e => {
    if (!CHEM.keo) return;
    const p = toa(e);
    const cuoi = CHEM.vet[CHEM.vet.length - 1];
    CHEM.vet.push({ x: p.x, y: p.y, t: performance.now() });
    if (CHEM.vet.length > 24) CHEM.vet.shift();
    if (cuoi) chemQuet(cuoi.x, cuoi.y, p.x, p.y);
  });
  const tha = () => { CHEM.keo = false; };
  cv.addEventListener("pointerup", tha);
  cv.addEventListener("pointercancel", tha);
  cv.addEventListener("pointerleave", tha);
}

/* ---- Mở / đóng ---- */
function chemMo(xong) {
  const v = $("#chemView");
  if (!v) { xong && xong(); return; }
  if (!banKhoCau().length) { toast("Chưa đủ câu để chơi ở trình độ này."); xong && xong(); return; }
  chemSauKhiDong = xong || null;
  v.hidden = false;
  document.body.style.overflow = "hidden";
  CHEM.mo = true;
  CHEM.diem = 0; CHEM.mang = CHEM_MANG; CHEM.vong = 0;
  CHEM.qua = []; CHEM.manh = []; CHEM.hat = []; CHEM.vet = [];
  $("#chemHet").hidden = true;
  $("#chemKeu").hidden = true;
  chemLayMau();
  chemCoCanvas();
  chemVongMoi();
  CHEM.truoc = performance.now();
  cancelAnimationFrame(CHEM.raf);
  CHEM.raf = requestAnimationFrame(chemChay);
}

function chemDong() {
  cancelAnimationFrame(CHEM.raf);
  clearTimeout(chemDocHen);
  CHEM.mo = false;
  CHEM.keo = false;
  stopSpeak();
  $("#chemView").hidden = true;
  $("#chemHet").hidden = true;
  const conMo = !$("#player").hidden || !$("#result").hidden;
  document.body.style.overflow = conMo ? "hidden" : "";
  const f = chemSauKhiDong;
  chemSauKhiDong = null;
  f && f();
}

$("#btnChemDong").addEventListener("click", chemDong);
$("#chemHetVe").addEventListener("click", chemDong);
$("#chemHetLai").addEventListener("click", () => {
  CHEM.diem = 0; CHEM.mang = CHEM_MANG; CHEM.vong = 0;
  CHEM.qua = []; CHEM.manh = []; CHEM.hat = []; CHEM.vet = [];
  $("#chemHet").hidden = true;
  chemVongMoi();
});
$("#chemNghe").addEventListener("click", () => { if (CHEM.de) speak(CHEM.de.en, false, "en-GB"); });
chemGanTay();

window.addEventListener("resize", () => {
  if (!CHEM.mo) return;
  chemCoCanvas();
  CHEM.qua.forEach(q => { q.x = clamp(q.x, q.r, Math.max(q.r, CHEM.W - q.r)); });
});

/* ---------- 23d. Trò chơi: NÉM BÓNG ----------
   Thầy đặt bài: MON.L đứng ném bóng vào NHỮNG đáp án đúng — số nhiều, nên mỗi
   lượt có BA đích đúng chứ không phải một. Thầy dặn "tư duy thêm đi", nên trò
   này cố tình làm khác hẳn hai trò kia:

     Bắn chữ  — thi tay ngắm.
     Chém chữ — thi tay nhanh.
     Ném bóng — THI ĐẦU. Không phải ngắm, chạm vào đích nào là MON.L ném trúng
                đích đó; cái khó nằm ở chỗ PHẢI PHÂN LOẠI mới biết ném vào đâu.

   Ba kiểu đề, kiểu nào cũng suy ra được từ dữ liệu khoá học nên không thể sai:
     1. Từ loại   — "Ném vào những từ là ĐỘNG TỪ" (lấy theo pos đã ghi sẵn)
     2. A hay AN  — "Ném vào những từ đi với AN" (có danh sách ngoại lệ)
     3. Ghép nghĩa — "Ném vào những từ nghĩa là: quả táo, cái ghế, con mèo"

   Không có đồng hồ đếm ngược: đây là trò để NGHĨ, không phải để cuống. */

const NEM_TONG = 8;          // tám lượt một ván
const NEM_MANG = 3;
const NEM_DUNG = 3;          // mỗi lượt ba đích đúng
const NEM_SAI = 3;           // và ba đích mồi
const NEM_G = 900;           // trọng lực đường bóng bay

/* Chữ bắt đầu bằng nguyên âm mà vẫn đi với "a", và ngược lại. Không có bảng này
   thì máy dạy sai: "an university" là sai, "a hour" cũng sai. */
const NEM_A_DU = ["university", "uniform", "user", "union", "unit", "useful", "european", "one", "once", "unique"];
const NEM_AN_DU = ["hour", "honest", "honour", "honor", "heir"];
function nemDiVoiAn(en) {
  const s = String(en || "").toLowerCase();
  if (NEM_AN_DU.includes(s)) return true;
  if (NEM_A_DU.includes(s)) return false;
  return /^[aeiou]/.test(s);
}

const NEM_LOAI = ["Danh từ", "Động từ", "Tính từ", "Trạng từ"];

const NEM = {
  mo: false, raf: 0, truoc: 0,
  cv: null, ctx: null, W: 0, H: 0,
  bia: [], hat: [], bong: null,
  de: null, cho: true, xong: 0,
  diem: 0, mang: NEM_MANG, vong: 0,
  mau: { net: "#3B0764", bong: "#EA580C", vong: "#7C3AED" },
};
let nemSauKhiDong = null;
let nemKeuHen = null, nemAvaHen = null;

/* ---- Ra đề ---- */
/** Lấy kho từ đơn theo trình độ, mỗi từ chỉ giữ một lần. */
function nemKhoTu() {
  const kho = (khoTheoBac().single || SINGLE)
    .filter(w => w && w.en && w.vi && !w.en.includes(" ") && /^[A-Za-z]+$/.test(w.en));
  const gap = new Set();
  return kho.filter(w => {
    const k = w.en.toLowerCase();
    if (gap.has(k)) return false;
    gap.add(k);
    return true;
  });
}

function nemRaDe() {
  const tu = nemKhoTu();
  if (tu.length < NEM_DUNG + NEM_SAI) return null;

  // Thử lần lượt ba kiểu đề, kiểu nào đủ từ thì lấy. Xáo thứ tự cho khỏi lặp.
  for (const kieu of shuffle(["loai", "an", "nghia"])) {

    if (kieu === "loai") {
      for (const l of shuffle(NEM_LOAI)) {
        const hop = tu.filter(w => w.pos === l);
        const khac = tu.filter(w => w.pos && w.pos !== l);
        if (hop.length < NEM_DUNG || khac.length < NEM_SAI) continue;
        return {
          lenh: "Ném vào những từ là " + l.toUpperCase(),
          meo: "Chạm vào quả bóng bay có từ đúng — chọn đủ ba từ.",
          dung: sample(hop, NEM_DUNG),
          sai: sample(khac, NEM_SAI),
        };
      }
    }

    if (kieu === "an") {
      const danh = tu.filter(w => w.pos === "Danh từ");
      const co = danh.filter(w => nemDiVoiAn(w.en));
      const khong = danh.filter(w => !nemDiVoiAn(w.en));
      if (co.length >= NEM_DUNG && khong.length >= NEM_SAI) {
        // Hỏi cả hai chiều cho khỏi học vẹt "cứ nguyên âm là an".
        const hoiAn = Math.random() < .5;
        return {
          lenh: hoiAn ? "Ném vào những từ đi với AN" : "Ném vào những từ đi với A",
          meo: hoiAn ? "an apple, an egg… — nghe chữ đầu chứ đừng nhìn mặt chữ."
                     : "a book, a university… — nghe chữ đầu chứ đừng nhìn mặt chữ.",
          dung: sample(hoiAn ? co : khong, NEM_DUNG),
          sai: sample(hoiAn ? khong : co, NEM_SAI),
        };
      }
    }

    if (kieu === "nghia") {
      const ds = sample(tu, NEM_DUNG + NEM_SAI);
      const dung = ds.slice(0, NEM_DUNG);
      const sai = ds.slice(NEM_DUNG);
      return {
        lenh: "Ném vào những từ nghĩa là: " + dung.map(w => w.vi).join(" · "),
        meo: "Ba nghĩa ở trên, tìm đúng ba từ tiếng Anh.",
        dung, sai,
      };
    }
  }
  return null;
}

/* ---- Dựng màn ---- */
function nemCoCanvas() {
  const cv = NEM.cv;
  const tl = Math.min(window.devicePixelRatio || 1, 2);
  NEM.W = cv.clientWidth;
  NEM.H = cv.clientHeight;
  cv.width = Math.round(NEM.W * tl);
  cv.height = Math.round(NEM.H * tl);
  NEM.ctx.setTransform(tl, 0, 0, tl, 0, 0);
}
const nemGoc = () => ({ x: NEM.W / 2, y: NEM.H - 30 });

function nemLayMau() {
  const c = getComputedStyle(document.documentElement);
  const l = (k, dp) => (c.getPropertyValue(k) || "").trim() || dp;
  NEM.mau = {
    net: l("--ink-deep", "#3B0764"),
    bong: l("--flame", "#C2410C"),
    vong: l("--brand", "#7E22CE"),
  };
}

function nemBia(w, dung) {
  const c = NEM.ctx;
  c.font = "900 16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const rong = c.measureText(w.en).width;
  const rx = clamp(rong / 2 + 18, 34, Math.max(36, NEM.W / 2 - 16));
  return {
    tu: w, dung, rx, ry: rx * 1.1,
    x: 0, y: 0, troi: (Math.random() < .5 ? -1 : 1) * (10 + Math.random() * 14),
    pha: Math.random() * Math.PI * 2,
    mau: BAN_MAU[Math.floor(Math.random() * BAN_MAU.length)],
    vo: false,
  };
}

/** Xếp sáu quả thành ba hàng, hai quả một hàng — không quả nào đè quả nào. */
function nemXep() {
  const n = NEM.bia.length;
  const cot = 2, hang = Math.ceil(n / cot);
  // Chừa khoảng trên cho MON.L không đứng lẫn vào, và chừa đáy cho chỗ ném.
  const tren = NEM.H * .10, duoi = NEM.H * .74;
  NEM.bia.forEach((b, i) => {
    const h = Math.floor(i / cot), c = i % cot;
    b.x = NEM.W * (c === 0 ? .28 : .72) + (Math.random() - .5) * 20;
    b.y = tren + (duoi - tren) * (hang <= 1 ? .5 : h / (hang - 1));
    b.x = clamp(b.x, b.rx + 6, NEM.W - b.rx - 6);
    b.goc0 = b.x;
  });
}

function nemVongMoi() {
  const de = nemRaDe();
  if (!de) { toast("Chưa đủ từ để chơi ở trình độ này."); return nemDong(); }
  NEM.de = de;
  NEM.vong += 1;
  NEM.cho = false;
  NEM.xong = 0;
  NEM.bong = null;
  NEM.hat = [];

  const o = $("#nemCau");
  o.textContent = de.lenh;
  banChayHieuUng(o);
  $("#nemMeo").textContent = de.meo;
  banChayHieuUng($("#nemView .ban-hang-viet"));

  // Ba ô chờ ở dưới, đúng được từ nào thì lấp từ đó vào
  const khay = $("#nemKhay");
  khay.textContent = "";
  for (let i = 0; i < NEM_DUNG; i++) {
    const s = el("span", "nem-o", "?");
    s.id = "nemO" + i;
    khay.append(s);
  }

  NEM.bia = shuffle(de.dung.map(w => nemBia(w, true))
    .concat(de.sai.map(w => nemBia(w, false))));
  nemXep();
  nemVeMang();
  $("#nemChi").textContent = "Lượt " + NEM.vong + "/" + NEM_TONG + " — chọn đủ ba từ đúng.";
}

function nemVeMang() {
  const o = $("#nemMang");
  o.textContent = "";
  for (let i = 0; i < NEM_MANG; i++) {
    o.append(el("span", "ban-tim" + (i < NEM.mang ? "" : " tat"), "♥"));
  }
  $("#nemDiem").textContent = NEM.diem;
}

function nemKeu(chu, loai) {
  const p = $("#nemKeu");
  p.hidden = true;
  p.textContent = chu;
  p.className = "ban-keu " + loai;
  void p.offsetWidth;
  p.hidden = false;
  clearTimeout(nemKeuHen);
  nemKeuHen = setTimeout(() => { p.hidden = true; }, 900);
}

function nemAvaTo(loai) {
  const n = $("#nemAva");
  if (!n) return;
  n.classList.remove("vui", "buon", "nem");
  void n.offsetWidth;
  n.classList.add(loai);
  clearTimeout(nemAvaHen);
  nemAvaHen = setTimeout(() => n.classList.remove("vui", "buon", "nem"), 800);
}

/* ---- Ném ---- */
/** Chạm vào đích nào là ném trúng đích đó. Trò này thi cái đầu, không thi tay
    ngắm — nên đường bóng tính sẵn sao cho luôn tới đúng chỗ quả sẽ bay tới. */
function nemNem(b) {
  if (NEM.cho || NEM.bong || !NEM.mo) return;
  const g = nemGoc();
  const t = .52;
  const dx = (b.x + b.troi * t) - g.x;
  const dy = b.y - g.y;
  NEM.bong = {
    x: g.x, y: g.y,
    vx: dx / t,
    vy: dy / t - 0.5 * NEM_G * t,
    con: t, dich: b,
  };
  nemAvaTo("nem");
  nemTiengNem();
}

function nemTiengNem() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .005;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(520, t);
  o.frequency.exponentialRampToValueAtTime(240, t + .18);
  g.gain.setValueAtTime(.06, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .2);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .22);
}

function nemHat(b, manh) {
  const n = manh ? 24 : 14;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (manh ? 90 : 50) + Math.random() * (manh ? 260 : 160);
    NEM.hat.push({ x: b.x, y: b.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      mau: i % 3 === 0 ? NEM.mau.vong : b.mau, r: 2.4 + Math.random() * 2.8, doi: 1 });
  }
}

/** Từ vừa ném trúng rơi xuống lấp vào ô chờ. */
function nemChuVeO(b, chiSo) {
  const o = $("#nemO" + chiSo);
  if (!o) return;
  const cv = NEM.cv.getBoundingClientRect();
  const s = el("span", "ban-bay", b.tu.en);
  s.style.left = (cv.left + b.x) + "px";
  s.style.top = (cv.top + b.y) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(() => {
    const r = o.getBoundingClientRect();
    s.style.left = (r.left + r.width / 2) + "px";
    s.style.top = (r.top + r.height / 2) + "px";
  });
  setTimeout(() => {
    s.remove();
    o.textContent = b.tu.en;
    o.classList.add("day");
  }, 640);
}

function nemTrungDung(b) {
  nemHat(b, false);
  NEM.bia = NEM.bia.filter(x => x !== b);
  nemChuVeO(b, NEM.xong);
  NEM.xong += 1;
  NEM.diem += 10;
  nemVeMang();
  nemAvaTo("vui");
  chemTiengDung();
  // Đọc từ vừa chọn kèm nghĩa — trúng hay trượt cũng phải học được một từ.
  docLanLuot([{ text: b.tu.en, lang: "en-GB" }, { text: b.tu.vi, lang: "vi-VN" }]);
  if (NEM.xong < NEM_DUNG) { nemKeu("Yes!", "dung"); return; }

  // Đủ ba từ thì sang lượt mới
  NEM.cho = true;
  nemKeu("Giỏi!", "dung");
  NEM.diem += 5;                       // thưởng thêm cho việc gom đủ cả ba
  nemVeMang();
  setTimeout(() => {
    if (!NEM.mo) return;
    if (NEM.vong >= NEM_TONG) return nemXong(true);
    nemVongMoi();
  }, 1700);
}

function nemTrungSai(b) {
  nemHat(b, true);
  keuNo(0);
  NEM.bia = NEM.bia.filter(x => x !== b);
  NEM.mang -= 1;
  nemKeu("No", "sai");
  nemAvaTo("buon");
  banTiengSai();
  nemVeMang();
  docLanLuot([{ text: b.tu.en, lang: "en-GB" }, { text: b.tu.vi, lang: "vi-VN" }]);
  if (NEM.mang <= 0) nemXong(false, "Ném nhầm ba lần rồi.");
}

function nemXong(thang, vi) {
  NEM.cho = true;
  NEM.bong = null;
  $("#nemHetTit").textContent = thang ? "Đầu óc sáng lắm!" : "Hết lượt rồi";
  $("#nemHetSub").textContent = thang
    ? "Xong cả " + NEM_TONG + " lượt, được " + NEM.diem + " điểm."
    : (vi || "Hết lượt rồi.") + " Được " + NEM.diem + " điểm.";
  $("#nemHet").hidden = false;
  if (thang) phatVoTay();
}

/* ---- Vẽ ---- */
function nemVeBia(c, b) {
  // Dây treo, cho ra dáng quả bóng bay đang lơ lửng
  c.strokeStyle = NEM.mau.net; c.globalAlpha = .22; c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(b.x, b.y + b.ry);
  c.quadraticCurveTo(b.x + 6, b.y + b.ry + 14, b.x - 2, b.y + b.ry + 26);
  c.stroke();
  c.globalAlpha = 1;
  // Thân
  const g = c.createRadialGradient(b.x - b.rx * .34, b.y - b.ry * .36, 2, b.x, b.y, b.rx * 1.25);
  g.addColorStop(0, "rgba(255,255,255,.58)");
  g.addColorStop(.36, b.mau);
  g.addColorStop(1, "rgba(0,0,0,.28)");
  c.fillStyle = g;
  c.beginPath(); c.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(255,255,255,.42)"; c.lineWidth = 2; c.stroke();
  // Chữ
  c.font = "900 16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(0,0,0,.45)";
  c.fillText(b.tu.en, b.x, b.y + 1.5);
  c.fillStyle = "#fff";
  c.fillText(b.tu.en, b.x, b.y);
}

function nemVeBong(c) {
  const q = NEM.bong;
  if (!q) return;
  c.fillStyle = NEM.mau.bong;
  c.beginPath(); c.arc(q.x, q.y, 11, 0, Math.PI * 2); c.fill();
  c.fillStyle = "rgba(255,255,255,.55)";
  c.beginPath(); c.arc(q.x - 3.5, q.y - 3.5, 3.6, 0, Math.PI * 2); c.fill();
}

/* ---- Vòng chạy ---- */
function nemChay(nay) {
  if (!NEM.mo) return;
  const dt = Math.min(50, nay - NEM.truoc) / 1000;
  NEM.truoc = nay;
  const c = NEM.ctx;
  c.clearRect(0, 0, NEM.W, NEM.H);
  const dangChay = $("#nemHet").hidden;

  for (const b of NEM.bia) {
    if (dangChay) {
      // Trôi ngang chầm chậm, chạm mép thì quay đầu; thêm nhịp bồng bềnh lên xuống.
      b.x += b.troi * dt;
      if (b.x < b.rx + 6) { b.x = b.rx + 6; b.troi = Math.abs(b.troi); }
      if (b.x > NEM.W - b.rx - 6) { b.x = NEM.W - b.rx - 6; b.troi = -Math.abs(b.troi); }
      b.pha += dt * 1.2;
    }
    const yv = b.y + Math.sin(b.pha) * 5;
    nemVeBia(c, { ...b, y: yv });
  }

  // Bóng bay theo đường vòng cung, tới nơi là xử lý
  if (NEM.bong) {
    const q = NEM.bong;
    q.vy += NEM_G * dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.con -= dt;
    nemVeBong(c);
    if (q.con <= 0) {
      const b = q.dich;
      NEM.bong = null;
      if (NEM.bia.includes(b)) {
        if (b.dung) nemTrungDung(b); else nemTrungSai(b);
      }
    }
  }

  for (const h of NEM.hat.slice()) {
    h.vy += 620 * dt;
    h.x += h.vx * dt; h.y += h.vy * dt;
    h.doi -= dt * 1.3;
    if (h.doi <= 0) { NEM.hat.splice(NEM.hat.indexOf(h), 1); continue; }
    c.globalAlpha = Math.max(0, h.doi);
    c.fillStyle = h.mau;
    c.beginPath(); c.arc(h.x, h.y, h.r, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  NEM.raf = requestAnimationFrame(nemChay);
}

/* ---- Chạm để chọn ---- */
function nemGanTay() {
  const cv = $("#nemTroi");
  NEM.cv = cv;
  NEM.ctx = cv.getContext("2d");
  cv.addEventListener("pointerdown", e => {
    if (NEM.cho || NEM.bong) return;
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // Chạm hụt một tí vẫn tính là chọn quả gần nhất — ngón tay to hơn quả bóng.
    let gan = null, xa = 1e9;
    for (const b of NEM.bia) {
      const d = ((x - b.x) / b.rx) ** 2 + ((y - b.y) / b.ry) ** 2;
      if (d < xa) { xa = d; gan = b; }
    }
    if (gan && xa <= 1.6) nemNem(gan);
  });
}

/* ---- Mở / đóng ---- */
function nemMo(xong) {
  const v = $("#nemView");
  if (!v) { xong && xong(); return; }
  nemSauKhiDong = xong || null;
  v.hidden = false;
  document.body.style.overflow = "hidden";
  NEM.mo = true;
  NEM.diem = 0; NEM.mang = NEM_MANG; NEM.vong = 0;
  NEM.bia = []; NEM.hat = []; NEM.bong = null;
  $("#nemHet").hidden = true;
  $("#nemKeu").hidden = true;
  nemLayMau();
  nemCoCanvas();
  nemVongMoi();
  if (!NEM.mo) return;                 // hết từ thì nemVongMoi đã tự đóng màn
  NEM.truoc = performance.now();
  cancelAnimationFrame(NEM.raf);
  NEM.raf = requestAnimationFrame(nemChay);
}

function nemDong() {
  cancelAnimationFrame(NEM.raf);
  NEM.mo = false;
  stopSpeak();
  $("#nemView").hidden = true;
  $("#nemHet").hidden = true;
  const conMo = !$("#player").hidden || !$("#result").hidden;
  document.body.style.overflow = conMo ? "hidden" : "";
  const f = nemSauKhiDong;
  nemSauKhiDong = null;
  f && f();
}

$("#btnNemDong").addEventListener("click", nemDong);
$("#nemHetVe").addEventListener("click", nemDong);
$("#nemHetLai").addEventListener("click", () => {
  NEM.diem = 0; NEM.mang = NEM_MANG; NEM.vong = 0;
  NEM.bia = []; NEM.hat = []; NEM.bong = null;
  $("#nemHet").hidden = true;
  nemVongMoi();
});
nemGanTay();

window.addEventListener("resize", () => {
  if (!NEM.mo) return;
  nemCoCanvas();
  nemXep();
});

/* ---------- 23e. Trò chơi: RẮN CẮN CHỮ ----------
   Thầy đặt bài: con rắn màu tím, điều khiển bằng tay, đi cắn chữ đúng. Cắn
   trúng thì chữ (hoặc số) bốc hơi rồi bay vào đúng chỗ; cắn nhầm thì rắn NÔN
   chữ đó ra. Rắn phải mềm mại.

   Rắn đi LIÊN TỤC chứ không đứng yên chờ — ngón tay chỉ hướng, rắn ngoặt dần
   về hướng đó chứ không bẻ gập một cái. Chính cái ngoặt dần ấy làm nó mềm, và
   cũng làm việc căn chữ thành một việc phải khéo tay. */

const RAN_TONG = 10;         // mười câu một ván
const RAN_MANG = 3;
const RAN_TOC = 158;         // tốc độ bò, px mỗi giây
const RAN_NGOAT = 4.6;       // ngoặt tối đa, radian mỗi giây — càng nhỏ càng "nặng đuôi"
const RAN_DAU = 15;          // bán kính đầu
const RAN_DOT = 8.5;         // khoảng cách giữa hai đốt
const RAN_DAI = 14;          // số đốt lúc mới vào

const RAN_SO = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty"];

const RAN = {
  mo: false, raf: 0, truoc: 0,
  cv: null, ctx: null, W: 0, H: 0,
  x: 0, y: 0, goc: -Math.PI / 2, duong: [], dai: RAN_DAI,
  dich: null, mieng: [], chu: [], hat: [],
  de: null, cho: true,
  diem: 0, mang: RAN_MANG, vong: 0,
  mau: { than: "#7C3AED", sang: "#A855F7", net: "#3B0764" },
};
let ranSauKhiDong = null;
let ranKeuHen = null, ranAvaHen = null, ranDocHen = null;

/* ---- Ra đề ---- */
/** Cứ ba lượt thì một lượt đố SỐ — thầy dặn "chữ hoặc số". Đố số vẫn dựng đúng
    khuôn câu-có-chỗ-trống nên cả màn chơi không phải đổi gì. */
function ranRaDe() {
  if (RAN.vong % 3 === 2) {
    const n = Math.floor(Math.random() * RAN_SO.length);
    const sai = shuffle(RAN_SO.map((_, i) => i).filter(i => i !== n)).slice(0, 3);
    return {
      truoc: RAN_SO[n] + "  =", sau: "", dap: String(n),
      doc: RAN_SO[n], vi: "Cắn vào con số đúng.",
      chu: shuffle([String(n), ...sai.map(String)]),
      dungChu: String(n),
    };
  }
  const de = banRaDe();
  if (!de) return null;
  return {
    truoc: de.truoc, sau: de.sau, dap: de.dap,
    doc: de.en, vi: de.vi,
    chu: de.chu,
    dungChu: de.chu.find(c => banGoc(c) === de.goc),
  };
}

/* ---- Dựng màn ---- */
function ranCoCanvas() {
  const cv = RAN.cv;
  const tl = Math.min(window.devicePixelRatio || 1, 2);
  RAN.W = cv.clientWidth;
  RAN.H = cv.clientHeight;
  cv.width = Math.round(RAN.W * tl);
  cv.height = Math.round(RAN.H * tl);
  RAN.ctx.setTransform(tl, 0, 0, tl, 0, 0);
}

function ranLayMau() {
  const c = getComputedStyle(document.documentElement);
  const l = (k, dp) => (c.getPropertyValue(k) || "").trim() || dp;
  RAN.mau = {
    than: l("--brand-fill", "#7C3AED"),
    sang: l("--brand", "#7E22CE"),
    net: l("--ink-deep", "#3B0764"),
  };
}

function ranDatRan() {
  RAN.x = RAN.W / 2;
  RAN.y = RAN.H * .78;
  RAN.goc = -Math.PI / 2;
  RAN.dai = RAN_DAI;
  RAN.dich = null;
  RAN.duong = [];
  for (let i = 0; i < 400; i++) RAN.duong.push({ x: RAN.x, y: RAN.y + i * 0.6 });
}

/** Một miếng chữ trôi lơ lửng. Tránh thả ngay trước mũi rắn kẻo vừa vào đã cắn. */
function ranMieng(chu, dung) {
  const c = RAN.ctx;
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  const r = clamp(c.measureText(chu).width / 2 + 17, 30, Math.max(32, RAN.W / 2 - 18));
  let x = 0, y = 0, thu = 0;
  do {
    x = r + 14 + Math.random() * Math.max(1, RAN.W - 2 * r - 28);
    y = RAN.H * .12 + Math.random() * Math.max(1, RAN.H * .62);
    thu++;
  } while (thu < 30 && Math.hypot(x - RAN.x, y - RAN.y) < 130);
  const a = Math.random() * Math.PI * 2;
  return {
    chu, dung, r, x, y,
    vx: Math.cos(a) * 16, vy: Math.sin(a) * 16,
    pha: Math.random() * Math.PI * 2,
    mau: BAN_MAU[Math.floor(Math.random() * BAN_MAU.length)],
    nuot: 0, non: 0, mien: 0,
  };
}

function ranVongMoi() {
  const de = ranRaDe();
  if (!de) { toast("Chưa đủ câu để chơi ở trình độ này."); return ranDong(); }
  RAN.de = de;
  RAN.vong += 1;
  RAN.cho = false;
  RAN.hat = [];

  const o = $("#ranCau");
  o.textContent = "";
  if (de.truoc) o.append(de.truoc + " ");
  const trong = el("span", "ban-o", ".....");
  trong.id = "ranO";
  o.append(trong);
  if (de.sau) o.append(" " + de.sau);
  $("#ranViet").textContent = de.vi;
  banChayHieuUng(o);
  banChayHieuUng($("#ranView .ban-hang-viet"));

  RAN.mieng = de.chu.map(c => ranMieng(c, c === de.dungChu));
  ranVeMang();
  $("#ranChi").textContent = "Câu " + RAN.vong + "/" + RAN_TONG + " — lái rắn đi cắn chữ đúng.";
  clearTimeout(ranDocHen);
  ranDocHen = setTimeout(() => { if (RAN.mo) speak(de.doc, false, "en-GB"); }, 420);
}

function ranVeMang() {
  const o = $("#ranMang");
  o.textContent = "";
  for (let i = 0; i < RAN_MANG; i++) {
    o.append(el("span", "ban-tim" + (i < RAN.mang ? "" : " tat"), "♥"));
  }
  $("#ranDiem").textContent = RAN.diem;
}

function ranKeu(chu, loai) {
  const p = $("#ranKeu");
  p.hidden = true;
  p.textContent = chu;
  p.className = "ban-keu " + loai;
  void p.offsetWidth;
  p.hidden = false;
  clearTimeout(ranKeuHen);
  ranKeuHen = setTimeout(() => { p.hidden = true; }, 900);
}

function ranAvaTo(loai) {
  const n = $("#ranAva");
  if (!n) return;
  n.classList.remove("vui", "buon");
  void n.offsetWidth;
  n.classList.add(loai);
  clearTimeout(ranAvaHen);
  ranAvaHen = setTimeout(() => n.classList.remove("vui", "buon"), 800);
}

/* ---- Tiếng ---- */
function ranTiengNon() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .005;
  // Tiếng "ọe": nốt trượt xuống kèm chút nhiễu — nghe là biết nhả ra.
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(300, t);
  o.frequency.exponentialRampToValueAtTime(90, t + .32);
  g.gain.setValueAtTime(.07, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .36);
  const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
  o.connect(lp); lp.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .38);
}
function ranTiengBocHoi() {
  if (!S.sound) return;
  const a = tiengSanSang(); if (!a) return;
  const t = a.currentTime + .005;
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(660, t);
  o.frequency.exponentialRampToValueAtTime(1760, t + .3);
  g.gain.setValueAtTime(.075, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .34);
  o.connect(g); g.connect(ra(a));
  o.start(t); o.stop(t + .36);
}

/* ---- Cắn ---- */
function ranHat(m, n, mau) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 140;
    RAN.hat.push({ x: m.x, y: m.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40,
      mau: mau || m.mau, r: 2 + Math.random() * 2.6, doi: 1 });
  }
}

/** Chữ bốc hơi rồi bay vào chỗ trống. */
function ranChuBayVe(m) {
  const o = $("#ranO");
  if (!o) return;
  const cv = RAN.cv.getBoundingClientRect();
  const s = el("span", "ban-bay ran-hoi", m.chu);
  s.style.left = (cv.left + m.x) + "px";
  s.style.top = (cv.top + m.y) + "px";
  document.body.appendChild(s);
  requestAnimationFrame(() => {
    const r = o.getBoundingClientRect();
    s.style.left = (r.left + r.width / 2) + "px";
    s.style.top = (r.top + r.height / 2) + "px";
  });
  setTimeout(() => {
    s.remove();
    o.textContent = RAN.de.dap.replace(/[.,!?]/g, "");
    o.classList.add("day");
  }, 640);
}

function ranCanDung(m) {
  RAN.cho = true;
  RAN.diem += 10;
  RAN.dai += 3;                        // ăn được thì dài ra, đuôi quét rộng hơn
  ranHat(m, 18, RAN.mau.sang);
  RAN.mieng = RAN.mieng.filter(x => x !== m);
  ranKeu("Yes!", "dung");
  ranAvaTo("vui");
  ranTiengBocHoi();
  ranChuBayVe(m);
  ranVeMang();
  setTimeout(() => { if (RAN.mo) speak(RAN.de.doc, false, "en-GB"); }, 700);
  setTimeout(() => {
    if (!RAN.mo) return;
    if (RAN.vong >= RAN_TONG) return ranXong(true);
    ranVongMoi();
  }, 2000);
}

/** Cắn nhầm: nuốt vào rồi nôn ngược ra đằng miệng. */
function ranCanSai(m) {
  m.nuot = .34;                        // biến mất trong mồm 0,34 giây
  RAN.mang -= 1;
  RAN.dai = Math.max(8, RAN.dai - 2);  // nôn xong thì ngắn lại một chút
  ranKeu("No", "sai");
  ranAvaTo("buon");
  ranTiengNon();
  ranVeMang();
  if (RAN.mang <= 0) setTimeout(() => { if (RAN.mo) ranXong(false, "Cắn nhầm ba lần rồi."); }, 600);
}

function ranXong(thang, vi) {
  RAN.cho = true;
  clearTimeout(ranDocHen);
  $("#ranHetTit").textContent = thang ? "Giỏi quá!" : "Hết lượt rồi";
  $("#ranHetSub").textContent = thang
    ? "Cắn trúng cả " + RAN_TONG + " câu, được " + RAN.diem + " điểm."
    : (vi || "Hết lượt rồi.") + " Được " + RAN.diem + " điểm.";
  $("#ranHet").hidden = false;
  if (thang) phatVoTay();
}

/* ---- Vẽ ---- */
/** Lấy điểm nằm cách đầu một quãng dọc theo đường vừa bò qua. */
function ranDiem(quang) {
  const d = RAN.duong;
  let di = 0;
  for (let i = 1; i < d.length; i++) {
    const b = Math.hypot(d[i].x - d[i - 1].x, d[i].y - d[i - 1].y);
    if (di + b >= quang) {
      const t = b ? (quang - di) / b : 0;
      return { x: d[i - 1].x + (d[i].x - d[i - 1].x) * t,
               y: d[i - 1].y + (d[i].y - d[i - 1].y) * t };
    }
    di += b;
  }
  return d[d.length - 1] || { x: RAN.x, y: RAN.y };
}

function ranVeRan(c) {
  const n = Math.round(RAN.dai);
  // Thân: vẽ từ đuôi lên đầu, đốt sau đè lên đốt trước nên nhìn liền một khối.
  for (let i = n; i >= 0; i--) {
    const p = ranDiem(i * RAN_DOT);
    const t = i / n;
    const r = RAN_DAU * (1 - t * .62);
    const g = c.createRadialGradient(p.x - r * .34, p.y - r * .34, 1, p.x, p.y, r * 1.2);
    g.addColorStop(0, RAN.mau.sang);
    g.addColorStop(.55, RAN.mau.than);
    g.addColorStop(1, "rgba(0,0,0,.30)");
    c.fillStyle = g;
    c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI * 2); c.fill();
    // Vạch sáng chạy dọc lưng cho ra vảy
    if (i % 2 === 0 && i < n) {
      c.fillStyle = "rgba(255,255,255,.16)";
      c.beginPath(); c.arc(p.x, p.y - r * .3, r * .32, 0, Math.PI * 2); c.fill();
    }
  }
  // Đầu
  const h = { x: RAN.x, y: RAN.y };
  const g = c.createRadialGradient(h.x - 5, h.y - 5, 1, h.x, h.y, RAN_DAU * 1.3);
  g.addColorStop(0, RAN.mau.sang);
  g.addColorStop(.5, RAN.mau.than);
  g.addColorStop(1, "rgba(0,0,0,.3)");
  c.fillStyle = g;
  c.beginPath(); c.arc(h.x, h.y, RAN_DAU, 0, Math.PI * 2); c.fill();
  // Lưỡi thè ra thụt vào
  const le = (Math.sin(performance.now() / 190) + 1) / 2;
  c.strokeStyle = "#F43F5E"; c.lineWidth = 2.4; c.lineCap = "round";
  const lx = h.x + Math.cos(RAN.goc) * (RAN_DAU + 4 + le * 9);
  const ly = h.y + Math.sin(RAN.goc) * (RAN_DAU + 4 + le * 9);
  c.beginPath();
  c.moveTo(h.x + Math.cos(RAN.goc) * RAN_DAU, h.y + Math.sin(RAN.goc) * RAN_DAU);
  c.lineTo(lx, ly); c.stroke();
  // Mắt
  for (const ben of [-1, 1]) {
    const a = RAN.goc + ben * .62;
    const ex = h.x + Math.cos(a) * RAN_DAU * .58;
    const ey = h.y + Math.sin(a) * RAN_DAU * .58;
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(ex, ey, 4.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = RAN.mau.net;
    c.beginPath();
    c.arc(ex + Math.cos(RAN.goc) * 1.6, ey + Math.sin(RAN.goc) * 1.6, 2.2, 0, Math.PI * 2);
    c.fill();
  }
}

function ranVeMieng(c, m) {
  if (m.nuot > 0) return;              // đang nằm trong bụng thì không vẽ
  const co = m.non > 0 ? 1 + m.non * .5 : 1;
  c.save();
  c.translate(m.x, m.y);
  c.scale(co, co);
  const g = c.createRadialGradient(-m.r * .3, -m.r * .34, 2, 0, 0, m.r * 1.25);
  g.addColorStop(0, "rgba(255,255,255,.55)");
  g.addColorStop(.36, m.mau);
  g.addColorStop(1, "rgba(0,0,0,.26)");
  c.fillStyle = g;
  c.beginPath(); c.arc(0, 0, m.r, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(255,255,255,.42)"; c.lineWidth = 2; c.stroke();
  c.font = "900 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(0,0,0,.45)"; c.fillText(m.chu, 0, 1.5);
  c.fillStyle = "#fff"; c.fillText(m.chu, 0, 0);
  c.restore();
}

/* ---- Vòng chạy ---- */
function ranChay(nay) {
  if (!RAN.mo) return;
  const dt = Math.min(50, nay - RAN.truoc) / 1000;
  RAN.truoc = nay;
  const c = RAN.ctx;
  c.clearRect(0, 0, RAN.W, RAN.H);
  const dangChay = $("#ranHet").hidden;

  if (dangChay) {
    // Ngoặt DẦN về hướng ngón tay — chính chỗ này làm con rắn mềm.
    if (RAN.dich) {
      const muon = Math.atan2(RAN.dich.y - RAN.y, RAN.dich.x - RAN.x);
      let lech = muon - RAN.goc;
      while (lech > Math.PI) lech -= Math.PI * 2;
      while (lech < -Math.PI) lech += Math.PI * 2;
      RAN.goc += clamp(lech, -RAN_NGOAT * dt, RAN_NGOAT * dt);
    }
    RAN.x += Math.cos(RAN.goc) * RAN_TOC * dt;
    RAN.y += Math.sin(RAN.goc) * RAN_TOC * dt;
    // Chạm mép thì trượt dọc mép chứ không dừng sững, nhìn vẫn mượt.
    if (RAN.x < RAN_DAU) { RAN.x = RAN_DAU; RAN.goc = Math.PI - RAN.goc; }
    if (RAN.x > RAN.W - RAN_DAU) { RAN.x = RAN.W - RAN_DAU; RAN.goc = Math.PI - RAN.goc; }
    if (RAN.y < RAN_DAU) { RAN.y = RAN_DAU; RAN.goc = -RAN.goc; }
    if (RAN.y > RAN.H - RAN_DAU) { RAN.y = RAN.H - RAN_DAU; RAN.goc = -RAN.goc; }
    RAN.duong.unshift({ x: RAN.x, y: RAN.y });
    const cang = Math.round(RAN.dai) * RAN_DOT + 60;
    if (RAN.duong.length > cang) RAN.duong.length = cang;
  }

  // Chữ trôi
  for (const m of RAN.mieng) {
    if (m.nuot > 0) {
      m.nuot -= dt;
      m.x = RAN.x; m.y = RAN.y;
      if (m.nuot <= 0) {
        // Nôn ra: bắn ngược khỏi miệng rồi trôi tiếp, có một nhịp miễn nhiễm
        // để người chơi không vừa nhả đã cắn lại ngay.
        m.non = 1;
        m.mien = 1.1;
        m.vx = -Math.cos(RAN.goc) * 210;
        m.vy = -Math.sin(RAN.goc) * 210;
        ranHat(m, 12, "#A3E635");
      }
      continue;
    }
    if (m.non > 0) m.non = Math.max(0, m.non - dt * 2.2);
    if (m.mien > 0) m.mien -= dt;
    if (dangChay) {
      m.pha += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      // Trôi chậm dần về lại nhịp lững lờ sau khi bị nôn ra
      m.vx *= (1 - Math.min(1, dt * 1.6));
      m.vy *= (1 - Math.min(1, dt * 1.6));
      if (Math.hypot(m.vx, m.vy) < 18) {
        const a = m.pha * .7;
        m.vx = Math.cos(a) * 16; m.vy = Math.sin(a) * 16;
      }
      if (m.x < m.r) { m.x = m.r; m.vx = Math.abs(m.vx); }
      if (m.x > RAN.W - m.r) { m.x = RAN.W - m.r; m.vx = -Math.abs(m.vx); }
      if (m.y < m.r) { m.y = m.r; m.vy = Math.abs(m.vy); }
      if (m.y > RAN.H - m.r) { m.y = RAN.H - m.r; m.vy = -Math.abs(m.vy); }
    }
    ranVeMieng(c, m);
  }

  ranVeRan(c);

  for (const h of RAN.hat.slice()) {
    h.vy += 300 * dt;
    h.x += h.vx * dt; h.y += h.vy * dt;
    h.doi -= dt * 1.4;
    if (h.doi <= 0) { RAN.hat.splice(RAN.hat.indexOf(h), 1); continue; }
    c.globalAlpha = Math.max(0, h.doi);
    c.fillStyle = h.mau;
    c.beginPath(); c.arc(h.x, h.y, h.r, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  // Cắn
  if (dangChay && !RAN.cho) {
    for (const m of RAN.mieng.slice()) {
      if (m.nuot > 0 || m.mien > 0) continue;
      if (Math.hypot(m.x - RAN.x, m.y - RAN.y) > m.r + RAN_DAU * .8) continue;
      if (m.dung) ranCanDung(m); else ranCanSai(m);
      break;
    }
  }

  RAN.raf = requestAnimationFrame(ranChay);
}

/* ---- Điều khiển bằng tay ---- */
function ranGanTay() {
  const cv = $("#ranTroi");
  RAN.cv = cv;
  RAN.ctx = cv.getContext("2d");
  const dat = e => {
    const r = cv.getBoundingClientRect();
    RAN.dich = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  cv.addEventListener("pointerdown", e => {
    try { cv.setPointerCapture(e.pointerId); } catch { /* thôi */ }
    dat(e);
  });
  cv.addEventListener("pointermove", e => { if (e.buttons || e.pointerType !== "mouse") dat(e); });
}

/* ---- Mở / đóng ---- */
function ranMo(xong) {
  const v = $("#ranView");
  if (!v) { xong && xong(); return; }
  ranSauKhiDong = xong || null;
  v.hidden = false;
  document.body.style.overflow = "hidden";
  RAN.mo = true;
  RAN.diem = 0; RAN.mang = RAN_MANG; RAN.vong = 0;
  RAN.mieng = []; RAN.hat = [];
  $("#ranHet").hidden = true;
  $("#ranKeu").hidden = true;
  ranLayMau();
  ranCoCanvas();
  ranDatRan();
  ranVongMoi();
  if (!RAN.mo) return;
  RAN.truoc = performance.now();
  cancelAnimationFrame(RAN.raf);
  RAN.raf = requestAnimationFrame(ranChay);
}

function ranDong() {
  cancelAnimationFrame(RAN.raf);
  clearTimeout(ranDocHen);
  RAN.mo = false;
  stopSpeak();
  $("#ranView").hidden = true;
  $("#ranHet").hidden = true;
  const conMo = !$("#player").hidden || !$("#result").hidden;
  document.body.style.overflow = conMo ? "hidden" : "";
  const f = ranSauKhiDong;
  ranSauKhiDong = null;
  f && f();
}

$("#btnRanDong").addEventListener("click", ranDong);
$("#ranHetVe").addEventListener("click", ranDong);
$("#ranHetLai").addEventListener("click", () => {
  RAN.diem = 0; RAN.mang = RAN_MANG; RAN.vong = 0;
  RAN.mieng = []; RAN.hat = [];
  $("#ranHet").hidden = true;
  ranDatRan();
  ranVongMoi();
});
$("#ranNghe").addEventListener("click", () => { if (RAN.de) speak(RAN.de.doc, false, "en-GB"); });
ranGanTay();

window.addEventListener("resize", () => {
  if (!RAN.mo) return;
  ranCoCanvas();
  RAN.x = clamp(RAN.x, RAN_DAU, Math.max(RAN_DAU, RAN.W - RAN_DAU));
  RAN.y = clamp(RAN.y, RAN_DAU, Math.max(RAN_DAU, RAN.H - RAN_DAU));
  RAN.mieng.forEach(m => {
    m.x = clamp(m.x, m.r, Math.max(m.r, RAN.W - m.r));
    m.y = clamp(m.y, m.r, Math.max(m.r, RAN.H - m.r));
  });
});

/* ---------- 24. Khởi động ---------- */
rollPeriods();
applyTheme();
paintStats();
useMascotImage();
setupInstallHint();
setInterval(() => { regenHearts(); paintStats(); }, 60000);
setInterval(() => { if (!$("#view-league").hidden) $("#leagueTimer").textContent = weekLeft(); }, 60000);

const start = (location.hash || "").replace("#", "");
go(VIEWS.includes(start) ? start : "learn");
window.addEventListener("hashchange", () => {
  const h = location.hash.replace("#", "");
  if (VIEWS.includes(h) && h !== view) go(h);
});

})();
