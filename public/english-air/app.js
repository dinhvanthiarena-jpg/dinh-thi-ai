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
  xp: 0, hearts: 5, heartAt: Date.now(),
  streak: 0, best: 0, lastDay: "", days: [],
  done: {}, srs: {},
  goal: 30, goalDay: "", todayXp: 0,
  weekXp: 0, weekStart: "", tier: 0,
  joined: today(), sound: true, motion: false, showVi: true, theme: "",
  kidVoice: true
};
let S = load();
function load() { try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { return Object.assign({}, DEFAULTS); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* chế độ riêng tư */ } }

const HEART_MS = 30 * 60 * 1000;
function regenHearts() {
  if (S.hearts >= 5) { S.heartAt = Date.now(); return; }
  const got = Math.floor((Date.now() - S.heartAt) / HEART_MS);
  if (got > 0) { S.hearts = clamp(S.hearts + got, 0, 5); S.heartAt = S.hearts >= 5 ? Date.now() : S.heartAt + got * HEART_MS; save(); }
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
};
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
let voice = null;
function pickVoice() {
  if (!window.speechSynthesis) return;
  voices = speechSynthesis.getVoices() || [];
  voice = voiceFor("en-US");
}
/** Tìm giọng khớp thứ tiếng; ưu tiên giọng nam vì nâng cao độ lên nghe mới ra con trai. */
function voiceFor(tag) {
  const base = String(tag).split("-")[0].toLowerCase();
  const pool = voices.filter(v => String(v.lang).toLowerCase().replace("_", "-").startsWith(base));
  if (!pool.length) return null;
  const boyish = /david|guy|mark|daniel|alex|fred|male|nam\b|minh|yunxi|kangkang|liang/i;
  return pool.find(v => boyish.test(v.name))
      || pool.find(v => String(v.lang).toLowerCase().replace("_", "-") === String(tag).toLowerCase())
      || pool[0];
}
if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(text, slow) {
  if (!S.sound || !window.speechSynthesis || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; if (voice) u.voice = voice;
    u.rate = slow ? 0.55 : 0.92;
    speechSynthesis.speak(u);
  } catch { /* bỏ qua */ }
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
const lessonState = id => S.done[id] ? "done" : (id === currentLessonId() ? "current" : "locked");
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
      b.disabled = st === "locked";
      b.setAttribute("aria-label", `${l.title} — ${st === "done" ? "đã hoàn thành" : st === "current" ? "bài hiện tại" : "chưa mở khoá"}`);
      b.append(icon(st === "locked" ? "i-lock" : l.checkpoint ? "i-cap" : st === "done" ? "i-check" : "i-play"));
      if (st === "current") b.append(ring(doneN / list.length));
      if (st !== "locked") b.addEventListener("click", () => startLesson(l.id));
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

  const head = q[0] && q[0].type === "match" ? [q.shift()] : [];
  return head.concat(shuffle(q)).slice(0, max);
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
  $("#btnHint").hidden = s.phase !== "drill";
  if (s.phase === "learn") { TEACH[s.d.t](s.d, stage); setBtn("Tiếp theo", "btn-primary", true); }
  else { DRILL[s.d.type](s.d, stage); setBtn("Kiểm tra", "btn-primary", false); }
}

/* ---------- 9. Slide dạy ---------- */
const TEACH = {
  intro(d, st) {
    showMascot(true); setKicker("Giới thiệu");
    st.append(el("p", "ask", d.title));
    st.append(markup(el("p", "sign-body"), d.body));
    if (d.bullets) {
      const ul = el("ul", "bullets");
      d.bullets.forEach(t => { const li = el("li"); li.append(icon("i-check", "ic ic-sm"), el("span", null, t)); ul.append(li); });
      st.append(ul);
    }
  },
  vocab(d, st) { vocabSlide(d, st, "Từ mới"); },
  phrase(d, st) { vocabSlide(d, st, "Mẫu câu"); },

  grammar(d, st) {
    showMascot(false); setKicker("Ngữ pháp");
    st.append(signpost(d.title, d.body, "i-book"));
    const t = el("div", "gtable");
    d.rows.forEach(r => {
      const row = el("div", "grow"), ex = el("div", "gex");
      const g = grammarRow(r);
      ex.append(el("b", null, g.en));
      if (g.vi) ex.append(el("small", null, g.vi));
      row.append(el("div", "gform", g.label), ex);
      t.append(row);
    });
    st.append(t);
    if (d.tip) { const tip = el("div", "tip"); tip.append(icon("i-bulb", "ic ic-sm"), el("span", null, d.tip)); st.append(tip); }
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
      line.append(el("span", "dwho", l.who), bb);
      box.append(line);
    });
    st.append(box);
    speak(d.lines[0].en);
  }
};

/** Biển báo: thẻ viền đậm đứng trên hai chân cột, có đồi tuyết phía dưới. */
function signpost(title, body, ic) {
  const wrap = el("div", "sign");
  const card = el("div", "sign-card");
  const badge = el("div", "sign-badge"); badge.append(icon(ic, "ic"));
  card.append(badge, el("div", "sign-word", title));
  card.append(markup(el("div", "sign-body"), body));
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
  say.addEventListener("click", () => speak(d.en));
  card.append(say, el("div", "vcard-vi", d.vi));
  st.append(card);
  if (d.note) { const n = el("div", "note"); n.append(icon("i-bulb", "ic ic-sm"), markup(el("span"), d.note)); st.append(n); }
  if (d.ex) {
    const ex = el("div", "example");
    const s = el("button", "say"); s.type = "button";
    s.setAttribute("aria-label", "Nghe ví dụ: " + d.ex.en);
    s.append(icon("i-sound", "ic ic-sm"));
    s.addEventListener("click", () => speak(d.ex.en));
    const txt = el("div"); txt.append(el("b", null, d.ex.en), el("small", null, d.ex.vi));
    ex.append(s, txt); st.append(ex);
  }
  speak(d.en);
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
    st.append(el("p", "ask", d.word.en), row, optList(d.opts, w => w.vi, d.word.en));
    speak(d.word.en);
  },

  reverse(d, st) {
    showMascot(true); setKicker("Dịch sang tiếng Anh");
    st.append(el("p", "ask", "“" + d.word.vi + "”"), optList(d.opts, w => w.en, d.word.en));
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
    const parts = d.sent.en.split(" ");
    const line = el("div", "blanks");
    const slots = [];
    parts.forEach((w, i) => {
      if (d.idx.includes(i)) {
        const s = el("button", "slot"); s.type = "button";
        s.dataset.pos = String(i);
        s.setAttribute("aria-label", "Ô trống " + (slots.length + 1));
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
      t.addEventListener("click", () => {
        if (P.answered || t.classList.contains("used")) return;
        const free = slots.find(s => !s.dataset.word);
        if (!free) return;
        free.textContent = w; free.dataset.word = w; free.classList.add("filled");
        t.classList.add("used");
        sync();
      });
      bank.append(t);
    });
    function sync() {
      const filled = slots.every(s => s.dataset.word);
      P.picked = { slots, ok: slots.every((s, k) => norm(s.dataset.word || "") === norm(d.answers[k])) };
      setBtn("Kiểm tra", "btn-primary", filled);
    }
    st.append(line, el("div", "bank-line"), bank);
    P.picked = null;
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
    S.hearts = clamp(S.hearts - 1, 0, 5);
    if (S.hearts === 4) S.heartAt = Date.now();
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
$("#btnStreakClose").addEventListener("click", () => {
  $("#streakView").hidden = true; document.body.style.overflow = ""; go(view);
});
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
  $("#callMicNote").textContent = SR
    ? "Lần đầu bấm micro, trình duyệt sẽ hỏi quyền dùng micro — chọn Cho phép."
    : "Trình duyệt này chưa nghe được bằng micro, bạn gõ chữ để nói chuyện nhé.";
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
  const L = CALL_LANGS[C.lang] || CALL_LANGS.en;
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
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // __START__ là dấu hiệu mở màn: MON.L chào bằng tiếng Việt và mời
        // người học cứ nói tiếng gì cũng được.
        history: first ? [{ role: "user", content: "__START__" }] : C.msgs,
        mode: C.mode,
        level: level().code,
        words: seenWords().slice(-60).map(w => w.en),
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Không gọi được máy chủ");
    }
    const data = await res.json();
    // MON.L đáp bằng thứ tiếng nào thì từ đây nói và nghe bằng thứ tiếng đó.
    if (CALL_LANGS[data.lang]) C.lang = data.lang;
    C.msgs.push({ role: "assistant", content: data.reply });
    if (!first) pushLog("mon", data.reply);
    // Giờ học: mỗi lượt giáo viên ra một câu cho mình đọc theo.
    if (C.mode === "teach" && data.task) {
      C.target = { en: data.task, vi: data.taskVi || "" };
      C.asked++;
      $("#callTarget").textContent = data.task;
      $("#callTargetVi").textContent = S.showVi ? (data.taskVi || "") : "";
      $("#callTask").hidden = false;
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
    pushLog("you", text);
    C.msgs.push({ role: "user", content: text });
    $("#callHeard").hidden = true;
    askTutor(false);
    return;
  }
  // Giờ học: chấm câu vừa đọc so với câu mẫu, rồi kể lại cho giáo viên nghe
  // để thầy biết đường mà sửa phát âm.
  const pct = C.target
    ? Math.round((score != null ? score : similar(text, C.target.en)) * 100)
    : null;
  const ok = pct != null && pct >= 70;
  const h = $("#callHeard");
  h.hidden = false;
  h.className = "call-heard " + (ok ? "ok" : "bad");
  $("#callHeardText").textContent = ok
    ? `Chuẩn rồi: “${text}”`
    : `Nghe được: “${text}”` + (pct != null ? ` — mới khớp ${pct}% câu mẫu` : "");
  if (ok) C.right++;
  pushLog("you", text);
  C.msgs.push({
    role: "user",
    content: text + (C.target ? ` [Câu mẫu: "${C.target.en}" — máy nghe khớp ${pct}%]` : ""),
  });
  $("#callTask").hidden = true;
  askTutor(false);
}

/* ----- micro ----- */
/* Thứ tiếng nào máy này không nghe được thì nhớ lại, lần sau khỏi thử. */
const NO_LISTEN = {};
function startListening() {
  if (!SR || C.listening || C.busy) return;
  const r = new SR();
  C.rec = r; C.listening = true;
  const lg = NO_LISTEN[C.lang] ? "en" : C.lang;
  r.lang = (CALL_LANGS[lg] || CALL_LANGS.en).sr;
  r.interimResults = false; r.maxAlternatives = 3;
  $("#btnMic").classList.add("listening");
  $("#callMascot").classList.add("listening");
  $("#callYou").hidden = false;
  setState("Đang nghe bạn…", "listen");
  r.onresult = e => {
    const alts = [...e.results[0]].map(a => a.transcript);
    if (C.mode === "free") heardReply(alts[0]);
    else heardReply(alts[0], alts.reduce((b, t) => Math.max(b, similar(t, C.target.en)), 0));
  };
  r.onerror = ev => {
    stopListening();
    if (ev.error === "no-speech") { setState("Không nghe thấy gì, thử lại"); return; }
    // Máy không nghe được thứ tiếng này thì lùi về tiếng Anh rồi nghe lại,
    // đừng bắt người học tự xoay xở.
    if (ev.error === "language-not-supported" && C.lang !== "en") {
      NO_LISTEN[C.lang] = true;
      C.lang = "en";
      toast("Máy chưa nghe được tiếng đó, chuyển sang nghe tiếng Anh.");
      setTimeout(startListening, 250);
      return;
    }
    toast(ev.error === "not-allowed"
      ? "Chưa được cấp quyền micro. Bạn gõ chữ nhé."
      : "Không nghe được, bạn gõ chữ nhé.");
    // Nói chuyện tự do thì không có câu mẫu để chọn — mở ô gõ chữ ra.
    if (C.mode === "free") $("#callType").hidden = false; else showChoices();
  };
  r.onend = () => stopListening();
  try { r.start(); } catch { stopListening(); }
}
function stopListening() {
  C.listening = false;
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
  if (C.speaking) { stopSpeak(); if (C.sayDone) C.sayDone(); }
  C.listening ? stopListening() : startListening();
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
    u.lang = "en-US"; if (voice) u.voice = voice; u.rate = 0.94;
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
  paintRail();
}
$$("[data-goal]").forEach(b => b.addEventListener("click", () => {
  S.goal = +b.dataset.goal; save(); renderProfile(); toast("Mục tiêu: " + S.goal + " XP mỗi ngày");
}));
$("#optSound").addEventListener("change", e => { S.sound = e.target.checked; save(); });
$("#optMotion").addEventListener("change", e => { S.motion = e.target.checked; save(); applyTheme(); });
$("#optVi").addEventListener("change", e => { S.showVi = e.target.checked; save(); });
$("#optKid").addEventListener("change", e => { S.kidVoice = e.target.checked; save(); });
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
function openSheet({ title, body, yes, no, yesClass = "btn-primary", onYes, slot }) {
  $("#sheetTitle").textContent = title;
  $("#sheetBody").textContent = body || "";
  $("#sheetBody").hidden = !body;
  const s = $("#sheetSlot"); s.textContent = ""; if (slot) s.append(slot);
  const y = $("#sheetYes");
  y.textContent = yes || ""; y.hidden = !yes; y.className = "btn btn-block mt " + yesClass;
  $("#sheetNo").textContent = no || "Đóng";
  sheetYes = onYes || null;
  $("#sheetWrap").hidden = false;
  $("#sheetNo").focus();
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
  if (S.hearts >= 5) return toast("Tim đầy — học thoải mái.");
  toast(`${S.hearts}/5 tim. Quả tiếp theo sau khoảng ${clamp(Math.ceil((S.heartAt + HEART_MS - Date.now()) / 60000), 1, 30)} phút.`);
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
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
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
