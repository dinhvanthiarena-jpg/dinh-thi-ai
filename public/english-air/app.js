/* ============================================================
   English Air — logic ứng dụng
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
  joined: today(), sound: true, motion: false, showVi: true, theme: ""
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
  const sys = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = S.theme || sys;
  document.documentElement.dataset.motion = S.motion ? "reduce" : "";
}
function paintStats() {
  regenHearts();
  $("#statStreak").textContent = S.streak;
  $("#statXp").textContent = S.xp >= 1000 ? (S.xp / 1000).toFixed(2) + "K" : S.xp;
  $("#statHeart").textContent = S.hearts;
  $("#levelCode").textContent = level().code;
}

/* ---------- 3. Phát âm ---------- */
let voice = null;
function pickVoice() {
  if (!window.speechSynthesis) return;
  const v = speechSynthesis.getVoices();
  voice = v.find(x => /^en[-_]US/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null;
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

/* ---------- 4. Truy vấn khoá học ---------- */
const level = () => COURSE.levels.find(l => l.id === S.level) || COURSE.levels[0];
const lessonsOf = lv => lv.units.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
function lessonWords(l) {
  if (!l.teach) return [];
  return l.teach.filter(s => s.t === "vocab" || s.t === "phrase")
    .map(s => ({ en: s.en, vi: s.vi, ipa: s.ipa, pic: s.pic, note: s.note, ex: s.ex }));
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

/* ---------- 5. Điều hướng ---------- */
const VIEWS = ["learn", "words", "review", "league", "profile"];
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
  ({ learn: renderLearn, words: renderWords, review: renderReview, league: renderLeague, profile: renderProfile })[name]();
  window.scrollTo({ top: 0 });
  if (location.hash.slice(1) !== name) history.replaceState(null, "", "#" + name);
}
$$("[data-nav]").forEach(b => b.addEventListener("click", () => go(b.dataset.nav)));

/* ---------- 6. Màn Học ---------- */
function renderLearn() {
  const lv = level();
  const list = lessonsOf(lv);
  const doneN = list.filter(l => S.done[l.id]).length;
  $("#helloSub").textContent = doneN
    ? `Bạn đã xong ${doneN}/${list.length} bài của trình độ ${lv.code}.`
    : "Hãy bắt đầu tiếng Anh của bạn.";

  const root = $("#unitList");
  root.textContent = "";
  lv.units.forEach(u => {
    const box = el("section", "unit");
    box.append(el("h2", null, u.title));
    const words = unitWords(u).length;
    box.append(el("p", "unit-meta", `${u.lessons.length} chủ đề • ${words} từ vựng`));

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
  const r = S.srs[en] || { box: 0, due: 0, right: 0, wrong: 0 };
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
const FILTERS = [
  { id: "all",   name: "Tất cả",   fn: () => true },
  { id: "due",   name: "Cần ôn",   fn: w => S.srs[w.en].due <= Date.now() },
  { id: "known", name: "Đã thuộc", fn: w => S.srs[w.en].box >= 4 },
  { id: "weak",  name: "Hay sai",  fn: w => S.srs[w.en].wrong > 0 },
  { id: "multi", name: "Cụm từ",   fn: w => w.en.includes(" ") },
  { id: "pic",   name: "Có hình",  fn: w => !!w.pic }
];
let wordFilter = "all", wordSortAZ = false;

function renderWords() {
  const seen = seenWords();
  const wk = weekKey();
  const thisWeek = seen.filter(w => S.srs[w.en].due - BOX_DAYS[S.srs[w.en].box] * DAY >= new Date(wk).getTime()).length;
  $("#wordCount").textContent = seen.length + " từ";
  $("#wordWeek").textContent = thisWeek + " trong tuần này.";

  const fbox = $("#wordFilters"); fbox.textContent = "";
  FILTERS.forEach(f => {
    const b = el("button", "chip" + (f.id === wordFilter ? " on" : ""), f.name);
    b.type = "button";
    b.setAttribute("aria-pressed", String(f.id === wordFilter));
    b.addEventListener("click", () => { wordFilter = f.id; renderWords(); });
    fbox.append(b);
  });

  const f = FILTERS.find(x => x.id === wordFilter);
  let list = seen.filter(f.fn);
  list = wordSortAZ ? list.slice().sort((a, b) => a.en.localeCompare(b.en)) : list.slice().reverse();

  const ul = $("#wordList"); ul.textContent = "";
  if (!list.length) {
    const box = el("div", "empty");
    const m = mascotBox("head", "empty-mascot");
    box.append(m, el("b", null, seen.length ? `Không có từ nào ở mục “${f.name}”` : "Chưa có từ nào"),
      el("p", "sub", seen.length ? "Thử chọn mục khác xem sao." : "Hoàn thành một bài học để bắt đầu tích từ."));
    ul.append(box);
    return;
  }
  list.slice(0, 80).forEach(w => {
    const li = el("li");
    const say = el("button", "w-say"); say.type = "button";
    say.setAttribute("aria-label", "Nghe: " + w.en);
    say.append(icon("i-sound", "ic ic-sm"));
    say.addEventListener("click", () => speak(w.en));
    const box = el("div");
    box.append(el("div", "w-en", w.en), el("div", "w-vi", w.vi));
    const pips = el("div", "w-pips");
    pips.setAttribute("aria-label", `Độ nhớ ${S.srs[w.en].box} trên 5`);
    for (let i = 0; i < 5; i++) pips.append(el("i", "pip" + (i < S.srs[w.en].box ? " on" : "")));
    li.append(say, box, pips);
    ul.append(li);
  });
}
$("#btnWordSort").addEventListener("click", () => {
  wordSortAZ = !wordSortAZ; renderWords();
  toast(wordSortAZ ? "Sắp xếp A → Z" : "Sắp xếp theo từ mới học");
});

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
  paintRail();
}
$$("[data-goal]").forEach(b => b.addEventListener("click", () => {
  S.goal = +b.dataset.goal; save(); renderProfile(); toast("Mục tiêu: " + S.goal + " XP mỗi ngày");
}));
$("#optSound").addEventListener("change", e => { S.sound = e.target.checked; save(); });
$("#optMotion").addEventListener("change", e => { S.motion = e.target.checked; save(); applyTheme(); });
$("#optVi").addEventListener("change", e => { S.showVi = e.target.checked; save(); });
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
