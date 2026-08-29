/* ============================================================
   Mon.L — logic ứng dụng
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
const MASCOT_SRC = "assets/mascot.png";

function useMascotImage() {
  const probe = new Image();
  probe.onload = () => {
    document.documentElement.classList.add("has-mascot-img");
    $$("[data-mascot]").forEach(swapMascot);
  };
  probe.src = MASCOT_SRC;
}
/** Đổi một ô linh vật SVG thành thẻ ảnh, giữ nguyên kích thước ô. */
function swapMascot(box) {
  if (box.querySelector("img")) return;
  const img = el("img", "mascot-img mascot-" + (box.dataset.mascot || "head"));
  img.src = MASCOT_SRC;
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
  xp: 0, hearts: 15, heartAt: Date.now(),
  streak: 0, best: 0, lastDay: "", days: [],
  done: {}, srs: {},
  goal: 30, goalDay: "", todayXp: 0,
  weekXp: 0, weekStart: "", tier: 0,
  joined: today(), sound: true, motion: false, showVi: true, theme: "",
  kidVoice: true,
  ten: "",
  // Đang mở sẵn hết bài để thầy kiểm tra nội dung. Khi nào cần học lần lượt
  // trở lại thì đổi về false — ai đã tự gạt công tắc thì giữ lựa chọn của họ.
  moHet: true,
  // Ảnh đại diện: {k:"m"} linh vật, {k:"e",i:<số>} mặt vui, {k:"a",d:"data:…"} ảnh tự tải
  avatar: { k: "m" }
};
let S = load();
function load() { try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { return Object.assign({}, DEFAULTS); } }
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
}

/* ---------- 3. Phát âm ---------- */
/* MON.L nói được ba thứ tiếng. Người học KHÔNG chọn trước — cứ nói, MON.L
   nghe ra rồi đáp lại đúng thứ tiếng đó, và bộ nghe cũng đổi theo. */
const CALL_LANGS = {
  en: { name: "English", tts: "en-US", sr: "en-US" },
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
/** MON.L nói được thứ tiếng nào cũng được, nên gặp mã lạ thì cứ dựng tạm một mục
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
/* Nâng cao độ giọng lên cho ra chất con trai nhỏ, hợp với MON.L. */
const KID_PITCH = 1.65;

let voices = [];
function pickVoice() {
  if (!window.speechSynthesis) return;
  voices = speechSynthesis.getVoices() || [];
}
const chuanTag = t => String(t || "").toLowerCase().replace("_", "-");

/** Tìm giọng khớp thứ tiếng. Khớp ĐÚNG mã trước, rồi mới tới cùng gốc ngôn ngữ. */
function voiceFor(tag) {
  const muon = chuanTag(tag);
  const goc = muon.split("-")[0];
  const pool = voices.filter(v => chuanTag(v.lang).split("-")[0] === goc);
  if (!pool.length) return null;
  // Giọng con trai để nâng cao độ nghe mới ra trẻ con. Chỉ dò trong pool đã lọc
  // đúng thứ tiếng rồi — nếu không, "Nam" của tiếng Việt lọt vào giọng tiếng Anh.
  const contrai = /david|guy|mark|daniel|alex|fred|male|james|george|ryan|yunxi|kangkang/i;
  return pool.find(v => chuanTag(v.lang) === muon && contrai.test(v.name))
      || pool.find(v => chuanTag(v.lang) === muon)
      || pool.find(v => contrai.test(v.name))
      || pool[0];
}

if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
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
  return "en-US";
}

// Đánh số lượt đọc nối, để lượt mới cắt được lượt cũ.
let lanLuotId = 0;

function dungGiong(u, tag) {
  u.lang = tag;
  const v = voiceFor(tag);
  if (v) u.voice = v;
}

function speak(text, slow, lang) {
  if (!S.sound || !window.speechSynthesis || !text) return;
  lanLuotId += 1;   // cắt lượt đọc nối đang chạy, không thì hai bên chồng tiếng
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    dungGiong(u, lang || tiengCua(text));
    u.rate = slow ? 0.55 : 0.92;
    speechSynthesis.speak(u);
  } catch { /* bỏ qua */ }
}

/* Đọc lần lượt nhiều đoạn, mỗi đoạn một thứ tiếng.
   PHẢI đọc xong câu trước rồi mới bắt đầu câu sau. Xếp cả loạt vào hàng đợi một
   lúc thì máy hay lấy giọng của câu này áp cho câu kia — câu tiếng Anh bị đọc
   bằng giọng Việt, nghe sai hoàn toàn. */
function docLanLuot(khuc) {
  if (!S.sound || !window.speechSynthesis) return;
  const ds = (khuc || []).filter(k => k && k.text);
  if (!ds.length) return;
  const phien = ++lanLuotId;
  try { speechSynthesis.cancel(); } catch { /* bỏ qua */ }

  const doc = i => {
    // Lượt đọc mới đè lên thì lượt cũ dừng hẳn, không chen ngang nhau.
    if (phien !== lanLuotId || i >= ds.length) return;
    const k = ds[i];
    try {
      const u = new SpeechSynthesisUtterance(k.text);
      dungGiong(u, k.lang || tiengCua(k.text));
      u.rate = k.slow ? 0.55 : 0.92;
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

const stopSpeak = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };

/* iPhone/iPad chỉ cho phát tiếng lần đầu ngay trong lúc ngón tay còn chạm màn hình.
   Câu nói đầu của MON.L lại đến sau một lượt chờ mạng, nên phải "mồi" sẵn lúc bấm nút,
   không thì cả cuộc gọi im lặng mà chẳng báo lỗi gì. */
let speechPrimed = false;
function primeSpeech() {
  if (!window.speechSynthesis) return;
  pickVoice();
  if (speechPrimed) return;
  speechPrimed = true;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0; u.lang = "en-US";
    speechSynthesis.speak(u);
  } catch { /* bỏ qua */ }
}

/** MON.L giải thích vì sao bài này chưa bấm vào được. */
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
    .map(s => ({ en: s.en, vi: s.vi, pos: s.pos, ipa: s.ipa, pic: s.pic, note: s.note, ex: s.ex }));
}
const unitWords = u => u.lessons.flatMap(lessonWords);
const unitSentences = u => u.lessons.flatMap(l => l.sentences || []);
const ALL_WORDS = COURSE.levels.flatMap(lv => lv.units.flatMap(unitWords));
const SINGLE = ALL_WORDS.filter(w => !w.en.includes(" "));
const PICS = ALL_WORDS.filter(w => w.pic);

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
const VIEWS = ["learn", "words", "review", "call", "league", "profile"];
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
  ({ learn: renderLearn, words: renderWords, review: renderReview, call: renderCall, league: renderLeague, profile: renderProfile })[name]();
  window.scrollTo({ top: 0 });
  if (location.hash.slice(1) !== name) history.replaceState(null, "", "#" + name);
}
$$("[data-nav]").forEach(b => b.addEventListener("click", () => go(b.dataset.nav)));

/* ---------- 6. Màn Học ---------- */
function renderLearn() {
  const lv = level();
  const list = lessonsOf(lv);
  const doneN = list.filter(l => S.done[l.id]).length;
  const cur = list.find(l => l.id === currentLessonId());

  // MON.L nói một câu hợp với tình hình học của người dùng
  const left = clamp(S.goal - S.todayXp, 0, S.goal);
  $("#heroLine").textContent =
    !doneN                       ? "Chào bạn! Mình là MON.L. Bắt đầu bài đầu tiên nhé?" :
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
  lv.units.forEach(u => {
    const box = el("section", "unit");
    box.append(el("h2", null, u.title));
    const words = unitWords(u).length;
    const nBai = u.lessons.filter(x => !x.checkpoint).length;
    box.append(el("p", "unit-meta", `${nBai} bài + ôn tập • ${words} từ vựng`));

    const grid = el("div", "nodes");
    u.lessons.forEach(l => {
      const st = lessonState(l.id);
      const cell = el("div", "node " + st + (l.checkpoint ? " check" : ""));
      const b = el("button", "node-btn"); b.type = "button";
      // Trước đây nút khoá bị disabled nên bấm vào không có gì xảy ra, người học
      // tưởng app hỏng. Nay vẫn bấm được, bấm thì MON.L nói cho biết vì sao.
      b.setAttribute("aria-disabled", st === "locked" ? "true" : "false");
      const noiTrangThai = { done: "đã hoàn thành", current: "bài hiện tại", open: "mở sẵn", locked: "chưa mở khoá" };
      b.setAttribute("aria-label", `${l.title} — ${noiTrangThai[st]}`);
      b.append(icon(st === "locked" ? "i-lock" : l.checkpoint ? "i-cap" : st === "done" ? "i-check" : "i-play"));
      if (st === "current") b.append(ring(doneN / list.length));
      b.addEventListener("click", () => (st === "locked" ? baoKhoa() : startLesson(l.id)));
      cell.append(b, el("span", "node-label", l.title));
      grid.append(cell);
    });
    box.append(grid);
    root.append(box);
  });
  paintRail();
}
/** Vòng tiến độ quanh nút bài hiện tại. */
function ring(frac) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("class", "node-ring"); s.setAttribute("aria-hidden", "true");
  const C = 2 * Math.PI * 46;
  for (const cls of ["bgc", "fgc"]) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", 50); c.setAttribute("cy", 50); c.setAttribute("r", 46); c.setAttribute("class", cls);
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
    if (w.pic && PICS.length >= 4 && picTurn++ % 2 === 0) {
      q.push({ type: "picture", word: w, opts: shuffle([w, ...sample(PICS.filter(x => x.en !== w.en), 3)]) });
      return;
    }
    if (tfTurn++ % 3 === 2) {                        // cứ ba từ lại một câu đúng/sai
      const lie = Math.random() < .5;
      const other = sample(ALL_WORDS.filter(x => x.en !== w.en), 1)[0];
      q.push({ type: "truefalse", word: w, shown: lie ? other.en : w.en, answer: !lie });
      return;
    }
    const kinds = w.en.includes(" ") ? ["choice", "reverse", "listen"] : ["choice", "listen", "reverse", "type"];
    const type = kinds[i % kinds.length];
    if (type === "type") { q.push({ type: "type", word: w }); return; }
    q.push({ type, word: w, opts: shuffle([w, ...sample(ALL_WORDS.filter(x => x.en !== w.en), 3)]) });
  });

  (sentences || []).forEach(s => {
    const parts = s.en.split(" ");
    if (parts.length >= 3) {
      const n = parts.length >= 5 ? 2 : 1;
      const idx = sample(parts.map((_, i) => i), n).sort((a, b) => a - b);
      const answers = idx.map(i => parts[i]);
      const extra = sample(SINGLE.filter(w => !parts.includes(w.en)), 2).map(w => w.en);
      q.push({ type: "blanks", sent: s, idx, answers, bank: shuffle(answers.concat(extra)) });
    }
  });

  // Xen một lượt tô chữ cho đỡ ngán: chọn chữ cái đầu của một từ vừa học, ưu
  // tiên từ một tiếng cho khớp giữa chữ được tô và từ đọc lên sau đó.
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
  const conLai = shuffle(q.filter(x => x.type !== "viet"));
  const ds = head.concat(conLai).slice(0, Math.max(1, max - (bTo ? 1 : 0)));
  // Chèn vào giữa chứ không để đầu — mở bài nào cũng tô chữ thì lại thành nhàm.
  if (bTo) ds.splice(Math.min(2, ds.length), 0, bTo);
  return ds;
}

/* ---------- 8. Trình chiếu ---------- */
const P = { slides: [], i: 0, cur: null, teachN: 0, answered: false, correct: false,
            wrong: 0, attempts: 0, startedAt: 0, lessonId: null, mode: "lesson", picked: null, hintUsed: false };

function startLesson(id, opts = {}) {
  regenHearts();
  P.slides = [];
  if (S.hearts <= 0) return sheetNoHearts();

  const lesson = id ? findLesson(id) : null;
  let words, sentences, teach = [];
  if (opts.words) { words = opts.words; sentences = []; }
  else if (lesson.checkpoint) { words = unitWords(lesson.unit); sentences = sample(unitSentences(lesson.unit), 4); }
  else { teach = lesson.teach || []; words = lessonWords(lesson); sentences = lesson.sentences || []; }

  const drills = buildPractice(words, sentences, opts.max || 12);
  if (!drills.length) { toast("Chưa có nội dung để luyện."); return; }

  P.slides = teach.map(s => ({ phase: "learn", d: s })).concat(drills.map(d => ({ phase: "drill", d })));
  P.teachN = teach.length;
  P.i = 0; P.wrong = 0; P.attempts = 0;
  P.startedAt = Date.now(); P.lessonId = id || null; P.mode = opts.mode || "lesson";

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
  paintProgress();
  P.answered = false; P.correct = false; P.picked = null; P.hintUsed = false;
  $("#feedback").hidden = true;
  $(".p-foot").className = "p-foot";
  const stage = $("#stage"); stage.textContent = "";
  $(".p-body").scrollTo?.({ top: 0 });

  const s = P.slides[P.i]; P.cur = s;
  // Bài tô chữ không có gì để gợi ý — nét đã hiện sẵn rồi.
  $("#btnHint").hidden = s.phase !== "drill" || s.d.type === "viet";
  if (s.phase === "learn") { TEACH[s.d.t](s.d, stage); setBtn("Tiếp theo", "btn-primary", true); }
  else { DRILL[s.d.type](s.d, stage); setBtn("Kiểm tra", "btn-primary", false); }
}

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
const CANH = [
  ["hello|hi|goodbye|bye|welcome|greet|nice to meet|name|introduce|excuse me", "hello"],
  ["thank|thanks|please|help|helping|kind|sure|of course", "friend"],
  ["vietnam|vietnamese|country|nation|flag|culture|tradition", "village"],
  ["teacher|student|school|class|classroom|lesson|homework|exam|test", "school"],
  ["book|read|reading|library|pen|pencil|write|writing|note|study|studies|learn|english|language|word", "work"],
  ["family|mother|father|mum|mom|dad|parents|sister|brother|son|daughter|baby|child|children|wife|husband", "family"],
  ["friend|friends|classmate|neighbour|neighbor|together|everyone|people", "friend"],
  ["coffee|tea|cafe|café|milk|juice|cup", "coffee"],
  ["bread|rice|noodle|pho|food|eat|eating|ate|hungry|breakfast|lunch|dinner|meal|restaurant|cook|cooking", "bread"],
  ["water|drink|drinking|thirsty|bottle", "water"],
  ["apple|banana|orange|mango|fruit|vegetable", "apple"],
  ["fish|sea|beach|river|lake|swim|swimming|boat", "fish"],
  ["dog|puppy|pet", "dog"],
  ["cat|kitten", "cat"],
  ["happy|glad|great|fun|funny|love|like|good|beautiful|smile|laugh|enjoy", "happy"],
  ["tired|sad|sick|ill|sorry|bad|angry|worried|difficult|hard", "tired"],
  ["doctor|hospital|nurse|medicine|health|headache|fever|hand|leg|arm|head|eye|tooth|hair|face|body|hurt|wash", "doctor"],
  ["left|right|turn|corner|way|direction|map|near|far|straight|address|here|there", "car"],
  ["number|count|one|two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|age|old", "clock"],
  ["morning|afternoon|today|tomorrow|yesterday|day|week|weekend|month|year|season|spring|autumn", "sun"],
  ["money|price|cost|buy|bought|pay|cheap|expensive|dong|dollar", "money"],
  ["market|shop|store|supermarket|sell|shopping|menu|order|waiter|bill|table", "market"],
  ["tomato|salt|sugar|onion|meat|chicken|egg|soup|salad|dish|taste|sweet|spicy", "bread"],
  ["police|officer|factory|farmer|driver|cook|seller|staff|uniform", "work"],
  ["work|working|job|office|company|business|meeting|boss|engineer|worker", "work"],
  ["city|hanoi|saigon|town|street|building|traffic|downtown", "city"],
  ["village|countryside|farm|field|quiet|small town", "village"],
  ["house|home|room|live|living|lived|apartment|kitchen|door|window", "house"],
  ["car|drive|driving|bus|taxi|motorbike|bike|road|ride", "car"],
  ["plane|airport|fly|flight|travel|trip|holiday|vacation|visit|tourist|country", "plane"],
  ["sun|sunny|hot|summer|warm|weather|sky|morning|afternoon", "sun"],
  ["rain|rainy|wet|cold|winter|storm|cloud", "rain"],
  ["tree|park|garden|flower|green|nature|mountain", "tree"],
  ["bed|sleep|sleeping|slept|night|evening|tired at night|bedroom|dream", "bed"],
  ["shirt|clothes|dress|wear|wearing|shoes|hat|jacket", "shirt"],
  ["ball|football|soccer|sport|play|playing|game|team|run|running", "ball"],
  ["music|song|sing|singing|listen to music|guitar|dance|dancing", "music"],
  ["birthday|cake|party|celebrate|gift|present", "cake"],
  ["phone|call|calling|text|message|internet|computer|email", "phone"],
  ["clock|time|hour|minute|late|early|oclock|schedule|wait", "clock"],
  ["what|where|when|who|why|how|question|ask|asking|please help", "question"],
  ["man|boy|he|his|sir|mr", "man"],
  ["woman|girl|she|her|lady|ms|mrs", "woman"],
];
// Ranh gioi tu phai la HAI dau gach cheo trong nguon: mot cai thi JS doc thanh
// ky tu backspace va regex khong bao gio khop.
const CANH_RX = CANH.map(([tu, hinh]) => [new RegExp("\\b(" + tu + ")(s|es|ing|ed)?\\b", "i"), hinh]);

/** Tìm hình hợp với một câu tiếng Anh. Không có gì hợp thì trả null. */
function hinhChoChu(cau) {
  if (!cau) return null;
  for (const [rx, hinh] of CANH_RX) if (rx.test(cau)) return hinh;
  return null;
}

/** Câu điền từ: ưu tiên ảnh riêng của từ phải điền, không có thì lấy cảnh theo cả câu. */
function anhChoCau(d) {
  const canDien = (d.answers || []).map(a => String(a).toLowerCase().replace(/[.,!?]/g, ""));
  const w = ALL_WORDS.find(x => canDien.includes(x.en.toLowerCase()) && (x.img || x.pic));
  if (w) return khungAnh(w);
  const hinh = hinhChoChu(d.sent && d.sent.en);
  return hinh ? khungAnh({ pic: hinh }) : null;
}

/** Rung nhẹ để tay biết máy đã nhận cử chỉ. Máy nào không có thì bỏ qua. */
function rung(kieu) {
  try { navigator.vibrate?.(kieu); } catch { /* trình duyệt chặn thì thôi */ }
}

/** Một mục từ vựng: ảnh riêng nếu có, không thì dò cảnh theo chính chữ tiếng Anh. */
function anhChoTu(w) {
  if (w && (w.img || w.pic)) return khungAnh(w);
  const hinh = hinhChoChu(w && w.en);
  return hinh ? khungAnh({ pic: hinh }) : null;
}

/* ---------- 9. Slide dạy ---------- */
const TEACH = {
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
      { text: d.title, lang: tiengCua(d.title) },
      { text: boDanhDau(d.body), lang: "vi-VN" },
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
      row.addEventListener("click", () => docLanLuot([
        { text: g.en, lang: "en-US" },
        g.vi ? { text: g.vi, lang: "vi-VN" } : null,
      ].filter(Boolean)));
      t.append(row);
    });
    st.append(t);
    if (d.tip) {
      const tip = el("button", "tip"); tip.type = "button";
      tip.setAttribute("aria-label", "Nghe mẹo: " + boDanhDau(d.tip));
      tip.append(icon("i-bulb", "ic ic-sm"), el("span", null, d.tip));
      tip.addEventListener("click", () => speak(boDanhDau(d.tip), false, "vi-VN"));
      st.append(tip);
    }
    // Vào slide là giảng luôn bằng tiếng, khỏi phải bấm.
    docLanLuot([
      { text: d.title, lang: tiengCua(d.title) },
      { text: boDanhDau(d.body), lang: "vi-VN" },
    ]);
  },

  culture(d, st) {
    showMascot(false); setKicker("Góc văn hoá");
    st.append(signpost(d.title, d.body, "i-globe"));
    docLanLuot([
      { text: d.title, lang: tiengCua(d.title) },
      { text: boDanhDau(d.body), lang: "vi-VN" },
    ]);
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
      line.append(el("span", "dwho", l.who), bb);
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
  // Phần giải thích phải nghe được, không bắt người ta chỉ đọc chữ. Đọc bằng
  // giọng Việt vì đây là lời giảng, không phải mẫu câu tiếng Anh.
  const ngheLai = el("button", "sign-nghe");
  ngheLai.type = "button";
  ngheLai.append(icon("i-sound", "ic ic-sm"), el("span", null, "Nghe lại"));
  ngheLai.addEventListener("click", () => docLanLuot([
    { text: title, lang: tiengCua(title) },
    { text: boDanhDau(body), lang: "vi-VN" },
  ]));
  card.append(ngheLai);
  const legs = el("div", "sign-legs"); legs.append(el("i"), el("i"));
  wrap.append(card, legs);
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

function vocabSlide(d, st, label) {
  showMascot(true); setKicker(label);
  const card = el("div", "vcard");
  if (d.pic) { const p = el("div", "vcard-pic"); p.append(pic(d.pic)); card.append(p); }
  card.append(el("div", "vcard-en", d.en));
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
  if (d.note) { const n = el("div", "note"); n.append(icon("i-bulb", "ic ic-sm"), markup(el("span"), d.note)); st.append(n); }
  if (d.ex) {
    const ex = el("div", "example");
    const s = el("button", "say"); s.type = "button";
    s.setAttribute("aria-label", "Nghe ví dụ: " + d.ex.en);
    s.append(icon("i-sound", "ic ic-sm"));
    s.addEventListener("click", () => docLanLuot([
      { text: d.ex.en, lang: "en-US" },
      { text: d.ex.vi, lang: "vi-VN" },
    ]));
    const txt = el("div"); txt.append(el("b", null, d.ex.en), el("small", null, d.ex.vi));
    ex.append(s, txt); st.append(ex);
  }
  // Vừa mở thẻ là dạy luôn bằng tiếng, không bắt người ta tự bấm: đọc từ tiếng
  // Anh trước, rồi nghĩa tiếng Việt, mỗi bên bằng giọng bản ngữ của nó.
  docLanLuot([
    { text: d.en, lang: "en-US" },
    { text: d.vi, lang: "vi-VN" },
  ]);
}

/* ---------- 10. Dạng bài luyện tập ---------- */
const DRILL = {
  choice(d, st) {
    showMascot(true); setKicker("Chọn nghĩa đúng");
    const row = el("div", "say-row");
    const say = el("button", "say-btn"); say.type = "button";
    say.setAttribute("aria-label", "Nghe lại: " + d.word.en);
    say.append(icon("i-sound"));
    say.addEventListener("click", () => speak(d.word.en));
    row.append(say);
    st.append(el("p", "ask", d.word.en), row);
    const anh = anhChoTu(d.word);
    if (anh) st.append(anh);
    st.append(optList(d.opts, w => w.vi, d.word.en));
    speak(d.word.en);
  },

  reverse(d, st) {
    showMascot(true); setKicker("Dịch sang tiếng Anh");
    st.append(el("p", "ask", "“" + d.word.vi + "”"));
    const anh = anhChoTu(d.word);
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
    st.append(el("p", "ask", d.word.en));
    const grid = el("div", "pics");
    d.opts.forEach(w => {
      const b = el("button", "pic"); b.type = "button"; b.dataset.en = w.en;
      b.append(pic(w.pic), el("span", null, w.en));
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
    st.append(el("p", "ask", d.sent.vi));
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
          { text: d.cau.en, lang: "en-US" },
          d.cau.vi ? { text: d.cau.vi, lang: "vi-VN" } : null,
        ].filter(Boolean)));
        box.append(b, chu2);
        st.append(box);
      }

      docLanLuot([
        { text: chu, lang: "en-US" },
        d.tu ? { text: d.tu, lang: "en-US" } : null,
        d.cau ? { text: d.cau.en, lang: "en-US" } : null,
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
        { text: chu, lang: "en-US" },
        { text: d.tu, lang: "en-US" },
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

  match(d, st) {
    showMascot(false); setKicker("Nối từ với nghĩa");
    const grid = el("div", "match");
    const colA = el("div", "opts"), colB = el("div", "opts");
    let sel = null, left = d.pairs.length, missed = 0;
    const clear = () => $$(".opt", grid).forEach(n => n.classList.remove("sel"));
    const cell = (w, label, side) => {
      const b = el("button", "opt"); b.type = "button";
      b.append(el("span", null, label));
      b.addEventListener("click", () => {
        if (P.answered || b.classList.contains("done")) return;
        if (side === "a") speak(w.en);
        if (!sel) { clear(); b.classList.add("sel"); sel = { w, side, node: b }; return; }
        if (sel.node === b) { b.classList.remove("sel"); sel = null; return; }
        if (sel.side === side) { clear(); b.classList.add("sel"); sel = { w, side, node: b }; return; }
        if (sel.w.en === w.en) {
          [sel.node, b].forEach(n => { n.classList.remove("sel"); n.classList.add("ok", "done"); });
          srsUpdate(w.en, true);
          if (!--left) { P.picked = { ok: missed === 0 }; setBtn("Tiếp theo", "btn-ok", true); }
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
    grid.append(colA, colB);
    st.append(grid);
  },

  type(d, st) {
    showMascot(true); setKicker("Viết bằng tiếng Anh");
    st.append(el("p", "ask", d.word.vi));
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
function nextPressed() {
  const s = P.cur;
  if (s.phase === "learn" || P.answered) return advance();
  if (!P.picked) return;
  const d = s.d;
  if (d.type === "match") { P.answered = true; return advance(); }

  P.answered = true; P.attempts++;
  P.correct = !!P.picked.ok;
  const st = $("#stage");

  if (d.type === "blanks") {
    P.picked.slots.forEach((sl, k) => sl.classList.add(norm(sl.dataset.word || "") === norm(d.answers[k]) ? "ok" : "bad"));
  } else if (P.picked.node) {
    P.picked.node.classList.add(P.correct ? "ok" : "bad");
  }
  if (!P.correct) {
    if (d.type === "choice" || d.type === "reverse" || d.type === "listen")
      $$(".opt", st).forEach(n => { if (n.dataset.en === d.word.en) n.classList.add("ok"); });
    if (d.type === "picture")
      $$(".pic", st).forEach(n => { if (n.dataset.en === d.word.en) n.classList.add("ok"); });
    if (d.type === "truefalse")
      $$(".tf button", st).forEach(n => { if ((n.dataset.val === "true") === d.answer) n.classList.add("ok"); });
  }
  if (d.word) srsUpdate(d.word.en, P.correct);

  if (P.correct) {
    speak(d.word ? d.word.en : (d.sent ? d.sent.en : ""));
    feedback(true, praise(), d.word ? `${d.word.en} — ${d.word.vi}` : (d.sent ? d.sent.en : ""));
  } else {
    P.wrong++;
    S.hearts = clamp(S.hearts - 1, 0, TIM_TOI_DA);
    // Vừa sứt quả đầu từ lúc đầy thì mới bắt đầu tính giờ hồi.
    if (S.hearts === TIM_TOI_DA - 1) S.heartAt = Date.now();
    save(); paintHearts();
    const h = $("#pHearts"); h.classList.add("hit"); setTimeout(() => h.classList.remove("hit"), 400);
    feedback(false, "Chưa đúng", "Đáp án: " + answerOf(d));
    P.slides.push(s);
  }
  setBtn("Tiếp theo", P.correct ? "btn-ok" : "btn-danger", true);
}
const PRAISE = ["Chính xác", "Tuyệt vời", "Giỏi lắm", "Đúng rồi", "Xuất sắc"];
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
function answerOf(d) {
  if (d.type === "blanks") return d.sent.en;
  if (d.type === "choice") return d.word.vi;
  if (d.type === "truefalse") return d.answer ? "Đúng" : `Sai — “${d.word.vi}” là “${d.word.en}”`;
  return d.word.en;
}
function feedback(ok, title, detail) {
  const fb = $("#feedback");
  fb.hidden = false;
  $(".p-foot").className = "p-foot " + (ok ? "ok" : "bad");
  $("#fbTitle").textContent = title;
  $("#fbDetail").textContent = detail;
  $("#fbIcon").firstElementChild.firstElementChild.setAttribute("href", ok ? "#i-check" : "#i-close");
}
function advance() {
  if (S.hearts <= 0 && P.i >= P.teachN) return sheetNoHearts();
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
  const secs = Math.round((Date.now() - P.startedAt) / 1000);
  const tries = Math.max(1, P.attempts);
  const acc = clamp(Math.round(((tries - P.wrong) / tries) * 100), 0, 100);
  let xp = P.mode === "review" ? 8 : 12;
  if (P.wrong === 0) xp += 5;
  const firstToday = S.lastDay !== today();

  markStudied(); addXp(xp);
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
  $("#resTitle").textContent = P.wrong === 0 ? "Chậm mà chắc, rất tuyệt!" : acc >= 80 ? "Làm tốt lắm, giữ nhịp nhé!" : "Xong rồi, cứ từ từ mà chắc!";
  $("#resNote").textContent = P.wrong === 0 ? "Không sai câu nào — thưởng thêm 5 XP." : "Ôn lại chương này sẽ chắc hơn.";
  $("#result").dataset.streak = firstToday ? "1" : "";
  $("#btnResDone").focus();
}
$("#btnResDone").addEventListener("click", () => {
  const showStreak = $("#result").dataset.streak === "1";
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
  renderCal();
  $("#streakView").hidden = false;
  document.body.style.overflow = "hidden";
  $("#btnStreakClose").focus();
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

/* ---------- 18b. Gọi video với MON.L ----------
   Hai chế độ:
   • "free"   — nói chuyện tự do. Máy chủ /api/english-air/chat gọi Claude,
                MON.L trả lời theo trình độ và vốn từ của người học.
   • "teach" — luyện nói với MON.L trong vai giáo viên: nó nói tiếng Anh chuẩn,
     ra câu cho mình nói theo, chấm phát âm rồi sửa. Cũng cần mạng. Cũ là
                không có mạng.
   Cả hai đều dùng micro (Web Speech API); gõ chữ là đường lui khi không nói được. */
/* ---------- Sổ tay cách nói ----------
   Mỗi câu người học nói trong lúc tán gẫu đều được ghi lại ngay trên máy họ.
   Từ đó rút ra cách xưng hô và những chữ họ hay dùng, gửi kèm mỗi lượt để
   MON.L bắt đúng giọng — kể cả ở những lần gọi sau, khỏi phải làm quen lại.
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

/** Rút gọn sổ thành vài dòng đủ để MON.L bắt giọng, không gửi cả cuốn lên. */
function styleBrief() {
  const says = (S.style && S.style.says) || [];
  if (says.length < 2) return null;
  const all = says.join(" ").toLowerCase();
  const co = w => new RegExp("(^|\\P{L})" + w + "(\\P{L}|$)", "iu").test(all);
  // Ghi rõ MON.L phải tự xưng gì và gọi họ là gì. Có cặp đối xứng (tao–mày:
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

/* Khung cảnh: tính lại cỡ căn phòng để MON.L đứng lọt giữa thanh trên và bóng nói.
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
  // Cửa sổ cao bất thường (màn desktop dựng đứng) thì thôi, đừng để MON.L phình ra.
  if (h > 1500) {
    h = 1500;
    t = head + Math.max(0, (limit - head - (SCENE.bot - SCENE.top) * h) / 2) - SCENE.top * h;
  }
  call.style.setProperty("--scene-h", h + "px");
  call.style.setProperty("--scene-t", t + "px");
}
if (window.ResizeObserver) {
  // Bóng nói cao thấp tuỳ câu, cứ đổi là phải tính lại chỗ đứng cho MON.L.
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

function renderCall() {
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

/** MON.L nói: hiện câu, chạy hoạt ảnh, nhảy một nhịp mỗi từ cho khớp miệng. */
function monSays(en, vi, after, py) {
  const L = langInfo(C.lang);
  $("#callSaidLang").textContent = L.name;
  $("#callSaidLang").hidden = C.mode !== "free";
  $("#callSaid").textContent = en;
  $("#callSaidPy").textContent = py || "";
  $("#callSaidPy").hidden = !py;
  $("#callSaidVi").textContent = S.showVi ? (vi || "") : "";
  const m = $("#callMascot");
  m.classList.add("talking");
  setState("Đang nói…");

  let ended = false;
  const done = () => {
    if (ended) return;
    ended = true;
    C.speaking = false; C.sayDone = null;
    m.classList.remove("talking", "pulse");
    if (after) after();
  };
  C.speaking = true; C.sayDone = done;
  if (!S.sound || !window.speechSynthesis) {
    setTimeout(done, 700 + en.length * 45);
    return;
  }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(en);
    u.lang = L.tts;
    const v = voiceFor(L.tts); if (v) u.voice = v;
    u.rate = 0.94; u.pitch = S.kidVoice ? KID_PITCH : 1;
    u.onboundary = () => { m.classList.remove("pulse"); void m.offsetWidth; m.classList.add("pulse"); };
    u.onend = done;
    u.onerror = done;
    speechSynthesis.speak(u);
    // Máy không có giọng cho thứ tiếng này thì speak() im lặng không làm gì.
    // Đợi mãi thì người học ngồi nhìn nút micro khoá — kiểm tra rồi thoát sớm.
    setTimeout(() => { if (!speechSynthesis.speaking && !speechSynthesis.pending) done(); }, 700);
    // Dự phòng cuối: vài trình duyệt không bắn onend. Chặn trên 12 giây.
    setTimeout(done, Math.min(2200 + en.length * 90, 12000));
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
  // Nói chuyện tự do thì LUÔN để sẵn ô gõ chữ: micro trên iPhone hay hỏng,
  // không có đường nào khác thì người học ngồi im không đáp lại được.
  $("#callType").hidden = mode === "free" ? false : !!SR;
  $("#btnMic").disabled = !SR;
  $("#callYou").hidden = true;
  $("#call").classList.remove("show-log");
  $("#btnCallLog").setAttribute("aria-pressed", "false");
  $("#call").hidden = false;
  document.body.style.overflow = "hidden";
  fitScene();

  C.t0 = Date.now();
  clearInterval(C.timer);
  C.timer = setInterval(() => {
    const s = Math.floor((Date.now() - C.t0) / 1000);
    $("#callTimer").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }, 1000);
  $("#callTimer").textContent = "00:00";

  setState("Đang kết nối…");
  askTutor(true);
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
        // __START__ là dấu hiệu mở màn: MON.L chào bằng tiếng Việt và mời
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
      openSheet({
        title: "Nâng cấp Mon.L Pro",
        body: "Học 60 bài thì miễn phí mãi. Riêng phần gọi nói chuyện tự do với MON.L cần gói Pro.",
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
    // MON.L đáp bằng thứ tiếng nào thì từ đây nói và nghe bằng thứ tiếng đó.
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
    // Mở micro ngay khi MON.L bắt đầu nói, đừng đợi nó nói xong. Người học
    // phải cắt lời được, không thì ngồi chờ cả chục giây mới tới lượt mình.
    C.busy = false;
    $("#btnMic").disabled = !SR;
    monSays(data.reply, data.vi, () => {
      if (!C.listening) setState("Tới lượt bạn");
    }, data.py);
  } catch (err) {
    C.busy = false;
    setState("Mất kết nối");
    $("#callSaid").textContent = "MON.L chưa nói chuyện tự do được lúc này.";
    $("#callSaidVi").textContent = String(err.message || "").slice(0, 120);
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
  askTutor(false);
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
  try {
    r.start();
  } catch (err) {
    xong = true; clearTimeout(C.watch); stopListening();
    micFailed("Không mở được micro. Bạn gõ chữ bên dưới nhé.");
  }
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

/* Thẻ Gọi Air: bấm vào là MON.L chào ngay — để thấy nó cử động và nói được thật. */
const PREVIEW_LINES = [
  { en: "Hi! I am MON.L. Let us speak English!", vi: "Chào! Tớ là MON.L. Mình nói tiếng Anh nhé!" },
  { en: "Tap the green button and talk to me.", vi: "Bấm nút xanh rồi nói chuyện với tớ nhé." },
  { en: "Do not worry. Just try your best!", vi: "Đừng lo. Cứ thử hết sức nhé!" },
];
let previewTurn = 0;
$("#callPreview").addEventListener("click", () => {
  primeSpeech();
  const line = PREVIEW_LINES[previewTurn++ % PREVIEW_LINES.length];
  const box = $("#previewMon");
  toast(line.vi);
  box.classList.add("talking");
  let ended = false;
  const stop = () => { if (ended) return; ended = true; box.classList.remove("talking", "pulse"); };
  if (!S.sound || !window.speechSynthesis) { setTimeout(stop, 600 + line.en.length * 45); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line.en);
    dungGiong(u, tiengCua(line.en)); u.rate = 0.94;
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

/* ---------- 18c. Gói Mon.L Pro ----------
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
  h.append(document.createTextNode("Gọi video với MON.L, "));
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
  const nut = el("button", "pro-cta", "Bắt đầu nói chuyện với MON.L");
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
  // Mặc định: linh vật MON.L, dùng lại đúng cơ chế thay ảnh sẵn có
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
  oMon.setAttribute("aria-label", "Dùng linh vật MON.L");
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
  $("#congTitle").textContent = dangKy ? "Chào bạn, tớ là MON.L" : "Chào bạn quay lại";
  $("#congSub").textContent = dangKy
    ? "Đăng ký để giữ tiến độ học của bạn trên mọi máy."
    : "Nhập số điện thoại và mật khẩu để học tiếp.";
  $("#oTen").hidden = !dangKy;
  $("#fTen").required = dangKy;
  $("#fMk").autocomplete = dangKy ? "new-password" : "current-password";
  $("#fMk").placeholder = dangKy ? "Ít nhất 6 ký tự" : "Mật khẩu của bạn";
  $("#congGui").textContent = dangKy ? "Đăng ký" : "Đăng nhập";
  $("#congDoi").textContent = dangKy ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký";
  loiCong("");
}

function loiCong(msg) {
  const o = $("#congLoi");
  o.textContent = msg || "";
  o.hidden = !msg;
}

function moCong() {
  $("#cong").hidden = false;
  document.body.style.overflow = "hidden";
  veCong();
  setTimeout(() => $(dangKyDangMo() ? "#fTen" : "#fSdt").focus(), 80);
}
const dangKyDangMo = () => TK.kieu === "dangKy";

function dongCong() {
  $("#cong").hidden = true;
  document.body.style.overflow = "";
}

$("#congDoi").addEventListener("click", () => {
  TK.kieu = TK.kieu === "dangKy" ? "dangNhap" : "dangKy";
  veCong();
  $(dangKyDangMo() ? "#fTen" : "#fSdt").focus();
});

$("#congForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nut = $("#congGui");
  if (nut.disabled) return;

  const dangKy = dangKyDangMo();
  const ten = $("#fTen").value.trim();
  const sdt = $("#fSdt").value.trim();
  const mk = $("#fMk").value;

  // Bắt lỗi ngay tại chỗ trước khi phiền tới máy chủ.
  if (dangKy && !ten) return neuThieu("#fTen", "Bạn tên là gì nhỉ?");
  if (!sdt) return neuThieu("#fSdt", "Bạn nhập số điện thoại nhé.");
  if (!mk) return neuThieu("#fMk", "Bạn nhập mật khẩu nhé.");
  if (dangKy && mk.length < 6) return neuThieu("#fMk", "Mật khẩu cần ít nhất 6 ký tự.");

  $$(".cong-o").forEach(o => o.classList.remove("sai"));
  nut.disabled = true;
  nut.textContent = dangKy ? "Đang tạo tài khoản…" : "Đang vào…";
  loiCong("");

  try {
    const r = await fetch(TK_URL + (dangKy ? "/dang-ky" : "/dang-nhap"), {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ten, sdt, matKhau: mk }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { loiCong(j.error || "Chưa xong được, bạn thử lại nhé."); return; }

    TK.toi = j;
    $("#fMk").value = "";
    // Lần đầu đăng ký thì lấy luôn tên đó làm tên hiển thị trong app.
    if (j.ten && !S.ten) { S.ten = j.ten; save(); veTen(); }
    dongCong();
    toast(dangKy ? `Chào ${j.ten}, bắt đầu thôi!` : `Chào bạn quay lại, ${j.ten}!`);
    veTheTaiKhoan();
    veThePro();
    keoVe();
  } catch {
    loiCong("Không nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé.");
  } finally {
    nut.disabled = false;
    veCongNut();
  }
});

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

/** Thẻ tài khoản dưới phần Cài đặt. */
function veTheTaiKhoan() {
  const the = $("#tkThe");
  if (!the) return;
  const t = TK.toi;
  if (!t || !t.dangNhap) { the.hidden = true; return; }
  the.hidden = false;
  $("#tkTen").textContent = t.ten || "Tài khoản của bạn";
  $("#tkSdt").textContent = t.sdt || t.email || "";
}

$("#btnThoat").addEventListener("click", () => openSheet({
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
}));

/** Chưa đăng nhập thì chặn ở cửa; mất mạng thì cho vào để không kẹt người học. */
async function gacCua() {
  const t = await hoiTaiKhoan();
  veTheTaiKhoan();
  if (t.dangNhap || t.ngoaiTuyen) {
    if (t.dangNhap && t.ten && !S.ten) { S.ten = t.ten; save(); veTen(); }
    if (t.dangNhap) keoVe();
    return;
  }
  moCong();
}
gacCua();

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
$("#optMotion").addEventListener("change", e => { S.motion = e.target.checked; save(); applyTheme(); });
$("#optVi").addEventListener("change", e => { S.showVi = e.target.checked; save(); });
$("#optKid").addEventListener("change", e => { S.kidVoice = e.target.checked; save(); });
/* Máy nào thiếu giọng của một thứ tiếng thì hệ thống đọc bằng giọng khác, nghe
   sai hẳn. Nút này cho biết máy đang có giọng nào và đọc thử để tự nghe. */
$("#btnThuGiong").addEventListener("click", () => {
  pickVoice();
  const co = t => { const v = voiceFor(t); return v ? v.name : null; };
  const anh = co("en-US"), viet = co("vi-VN");
  const o = $("#giongInfo");
  o.textContent = "Tiếng Anh: " + (anh || "MÁY CHƯA CÓ GIỌNG TIẾNG ANH")
                + " · Tiếng Việt: " + (viet || "máy chưa có giọng tiếng Việt");
  if (!anh) {
    toast("Máy chưa cài giọng tiếng Anh — vào Cài đặt máy để tải thêm.");
  }
  docLanLuot([
    { text: "Good morning. This is the English voice.", lang: "en-US" },
    { text: "Đây là giọng tiếng Việt.", lang: "vi-VN" },
  ]);
});

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
  openSheet({
    title: "Bạn đã hết tim",
    body: `Tim tự hồi 1 quả mỗi 30 phút — quả tiếp theo sau khoảng ${mins} phút. Ôn tập bằng thẻ ghi nhớ vẫn học được ngay.`,
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
  openSheet({ title: "Chọn trình độ", body: "Chuyển bất cứ lúc nào, tiến độ mỗi trình độ giữ riêng.", no: "Đóng", slot: box });
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
    } catch { /* không có service worker thì app vẫn chạy bình thường */ }
  });
}

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
