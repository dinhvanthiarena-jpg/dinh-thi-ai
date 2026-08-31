// Địa Lý Vui — bộ máy ứng dụng: màn Học (bài học + câu hỏi), Bản đồ, Hồ sơ.
// HTML/CSS/JS thuần, không build. Dựng theo khung của English Air (dạy trước, luyện sau)
// nhưng nội dung và các dạng câu hỏi được viết lại cho môn địa lý.

import { VN_LEVELS, VN_COURSE } from "./data/course-vn.js";
import { WORLD_LEVELS, WORLD_COURSE } from "./data/course-world.js";
import { VN_MAP_VIEWBOX, VN_PROVINCES } from "./data/vn-map.js";
import { WORLD_MAP_VIEWBOX, WORLD_COUNTRIES } from "./data/world-map.js";

/* ---------- 1. DỮ LIỆU & TIỆN ÍCH ---------- */

const SUBJECTS = {
  vn:    { label: "Địa Lý Việt Nam", short: "Việt Nam", levels: VN_LEVELS, course: VN_COURSE,
           map: VN_PROVINCES, viewBox: VN_MAP_VIEWBOX, entityKey: "province" },
  world: { label: "Địa Lý Thế Giới", short: "Thế giới", levels: WORLD_LEVELS, course: WORLD_COURSE,
           map: WORLD_COUNTRIES, viewBox: WORLD_MAP_VIEWBOX, entityKey: "country" },
};

const REGION_LABEL = { bac: "Miền Bắc", trung: "Miền Trung", nam: "Miền Nam" };
const CONTINENT_LABEL = {
  "chau-a": "Châu Á", "chau-au": "Châu Âu", "chau-phi": "Châu Phi",
  "chau-my": "Châu Mỹ", "chau-dai-duong": "Châu Đại Dương",
};

const START_HEARTS = 5;
const HEART_REGEN_MS = 2 * 60 * 60 * 1000; // 1 tim / 2 giờ

const todayStr = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD theo giờ máy

function stripDiacritics(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, (m) => (m === "đ" ? "d" : "D"));
}
function norm(s) {
  return stripDiacritics(String(s).trim().toLowerCase()).replace(/\s+/g, " ");
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 2. TRẠNG THÁI & LƯU TRỮ ---------- */

const STORE_KEY = "dialyvui.v1";
const defaultState = () => ({
  theme: "dark",
  subject: "vn",
  level: "l45",
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  hearts: START_HEARTS,
  heartsUpdatedAt: Date.now(),
  progress: {},     // lessonKey -> { done: bool, stars: 0-3 }
  openChapter: {},  // "subject:level" -> chapterId đang mở
  moHet: true,      // mở hết bài học để duyệt nội dung, không bắt học tuần tự
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch {
    return defaultState();
  }
}
let S = loadState();
function save() {
  refillHearts();
  localStorage.setItem(STORE_KEY, JSON.stringify(S));
}
function refillHearts() {
  if (S.hearts >= START_HEARTS) { S.heartsUpdatedAt = Date.now(); return; }
  const elapsed = Date.now() - S.heartsUpdatedAt;
  const gained = Math.floor(elapsed / HEART_REGEN_MS);
  if (gained > 0) {
    S.hearts = Math.min(START_HEARTS, S.hearts + gained);
    S.heartsUpdatedAt = Date.now();
  }
}
function loseHeart() {
  refillHearts();
  S.hearts = Math.max(0, S.hearts - 1);
  save();
}
function addXp(n) { S.xp += n; save(); }
function markLessonDone(key, stars) {
  const prev = S.progress[key];
  S.progress[key] = { done: true, stars: Math.max(stars, prev?.stars || 0) };
  const t = todayStr();
  if (S.lastActiveDate !== t) {
    const y = new Date(Date.now() - 86400000).toLocaleDateString("sv-SE");
    S.streak = S.lastActiveDate === y ? S.streak + 1 : 1;
    S.lastActiveDate = t;
  }
  save();
}

/* ---------- 3. TIỆN ÍCH KHOÁ HỌC ---------- */

function levels(subject) { return SUBJECTS[subject].levels; }
function chapters(subject, level) {
  return SUBJECTS[subject].course.levels[level]?.chapters || [];
}
function lessonKey(subject, level, lessonId) { return `${subject}:${level}:${lessonId}`; }
function isLessonDone(subject, level, lessonId) { return !!S.progress[lessonKey(subject, level, lessonId)]?.done; }

function findLesson(subject, level, lessonId) {
  for (const ch of chapters(subject, level)) {
    const l = ch.lessons.find((x) => x.id === lessonId);
    if (l) return { chapter: ch, lesson: l };
  }
  return null;
}
// bài kế tiếp mở khoá nếu bài liền trước đã xong (bài đầu chương mở nếu chương trước xong hết).
// "open" = bài chưa tới lượt nhưng đang bật "Mở hết bài học" (thầy duyệt nội dung) — vẫn vào
// học được, chỉ nhìn nhạt hơn bài hiện tại để không phải nút nào cũng sáng rực.
function lessonState(subject, level, chapterIdx, lessonIdx) {
  const chs = chapters(subject, level);
  const ch = chs[chapterIdx];
  const lesson = ch.lessons[lessonIdx];
  const done = isLessonDone(subject, level, lesson.id);
  if (done) return "done";
  const openFallback = S.moHet ? "open" : "locked";
  if (lessonIdx > 0) {
    const prevDone = isLessonDone(subject, level, ch.lessons[lessonIdx - 1].id);
    return prevDone ? "current" : openFallback;
  }
  if (chapterIdx === 0) return "current";
  const prevCh = chs[chapterIdx - 1];
  const prevChDone = prevCh.lessons.every((l) => isLessonDone(subject, level, l.id));
  return prevChDone ? "current" : openFallback;
}
function findEntity(subject, id) {
  return SUBJECTS[subject].map.find((e) => e.id === id);
}
function entityLabel(subject, e) {
  if (subject === "vn") return e.name;
  return e.name || e.id.toUpperCase();
}

/* ---------- 4. GIỌNG ĐỌC ---------- */
function speak(text) {
  try {
    if (!("speechSynthesis" in window) || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const vi = voices.find((v) => /vi[-_]?VN/i.test(v.lang)) || voices.find((v) => /^vi/i.test(v.lang));
    if (vi) u.voice = vi;
    u.lang = vi ? vi.lang : "vi-VN";
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch { /* im lặng nếu trình duyệt không hỗ trợ */ }
}

/* ---------- 5. ROUTER ---------- */
let ROUTE = "home";
let LESSON = null; // trạng thái chơi bài học hiện tại

function nav(route) {
  ROUTE = route;
  LESSON = null;
  render();
  document.getElementById("content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}
window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  document.body.addEventListener("click", onClick);
  document.body.addEventListener("submit", onSubmit);
  document.body.addEventListener("input", onInput);
  initDragHandlers();
  render();
  registerSW();
});

/* ---------- 14b. KÉO THẢ (dạng câu hỏi drag) ---------- */
let dragState = null;
function initDragHandlers() {
  document.body.addEventListener("pointerdown", (e) => {
    const chip = e.target.closest(".drag-chip");
    if (!chip || chip.classList.contains("locked")) return;
    const rect = chip.getBoundingClientRect();
    dragState = { chip, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    chip.setPointerCapture(e.pointerId);
    chip.classList.add("dragging");
    chip.style.width = rect.width + "px";
    document.body.appendChild(chip);
    chip.style.position = "fixed";
    chip.style.left = rect.left + "px";
    chip.style.top = rect.top + "px";
  });
  document.body.addEventListener("pointermove", (e) => {
    if (!dragState) return;
    dragState.chip.style.left = e.clientX - dragState.offsetX + "px";
    dragState.chip.style.top = e.clientY - dragState.offsetY + "px";
    document.querySelectorAll(".drag-bucket").forEach((b) => b.classList.remove("hover"));
    document.elementFromPoint(e.clientX, e.clientY)?.closest(".drag-bucket")?.classList.add("hover");
  });
  document.body.addEventListener("pointerup", (e) => {
    if (!dragState) return;
    const { chip } = dragState;
    dragState = null;
    chip.classList.remove("dragging");
    chip.style.position = ""; chip.style.left = ""; chip.style.top = ""; chip.style.width = "";
    document.querySelectorAll(".drag-bucket").forEach((b) => b.classList.remove("hover"));
    const bucketEl = document.elementFromPoint(e.clientX, e.clientY)?.closest(".drag-bucket");
    if (bucketEl) handleDragDrop(chip, bucketEl);
    else document.getElementById("drag-pool")?.appendChild(chip);
  });
}
function handleDragDrop(chip, bucketEl) {
  const step = LESSON?.queue[LESSON.pos];
  if (!step || step.item.t !== "drag" || LESSON.answered) { document.getElementById("drag-pool")?.appendChild(chip); return; }
  const item = step.item;
  const itemIdx = Number(chip.dataset.item);
  const bucketIdx = Number(bucketEl.dataset.bucket);
  const correct = item.items[itemIdx].bucket === bucketIdx;
  if (correct) {
    bucketEl.querySelector("[data-bucket-items]").appendChild(chip);
    chip.classList.add("locked", "ok");
    LESSON.dragPlaced = (LESSON.dragPlaced || 0) + 1;
    if (LESSON.dragPlaced === item.items.length) afterAnswer(true, null);
  } else {
    chip.classList.add("bad");
    setTimeout(() => chip.classList.remove("bad"), 400);
    document.getElementById("drag-pool")?.appendChild(chip);
    loseHeart();
    if (S.hearts <= 0) render();
  }
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", S.theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", S.theme === "dark" ? "#100C1E" : "#4C1D6B");
}

/* ---------- 6. RENDER GỐC ---------- */
function render() {
  renderTopbar();
  renderNav();
  const content = document.getElementById("content");
  if (ROUTE === "home") content.innerHTML = "";
  if (ROUTE === "home") content.appendChild(viewHome());
  else if (ROUTE === "map") { content.innerHTML = ""; content.appendChild(viewMap()); }
  else if (ROUTE === "profile") { content.innerHTML = ""; content.appendChild(viewProfile()); }
  else if (ROUTE === "lesson") { content.innerHTML = ""; content.appendChild(viewLesson()); }
}
function renderNav() {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    const on = btn.dataset.nav === (ROUTE === "lesson" ? "home" : ROUTE);
    if (on) btn.setAttribute("aria-current", "page"); else btn.removeAttribute("aria-current");
  });
  document.querySelector(".tabbar").style.display = ROUTE === "lesson" ? "none" : "";
  const rail = document.querySelector(".rail");
  if (rail) rail.style.display = ROUTE === "lesson" ? "none" : "";
}
function renderTopbar() {
  refillHearts();
  const top = document.getElementById("topbar");
  if (ROUTE === "lesson") { top.innerHTML = ""; top.style.display = "none"; return; }
  top.style.display = "";
  const subj = SUBJECTS[S.subject];
  const lv = subj.levels.find((l) => l.id === S.level);
  top.innerHTML = `
    <button class="subjectchip" data-action="open-subject" data-subject="${S.subject}">
      <span class="dot"><svg class="ic" viewBox="0 0 24 24">${S.subject === "vn" ? ICON_PIN : ICON_GLOBE}</svg></span>
      ${esc(subj.short)} <span class="lv">· ${esc(lv?.label || "")}</span>
    </button>
    <div class="pills">
      <span class="pill p-flame"><svg class="ic-sm"><use href="#i-flame"/></svg><b>${S.streak}</b></span>
      <span class="pill p-xp"><svg class="ic-sm"><use href="#i-sparkle"/></svg><b>${S.xp}</b></span>
      <span class="pill p-heart"><svg class="ic-sm"><use href="#i-heart"/></svg><b>${S.hearts}</b></span>
    </div>`;
}

const ICON_PIN = `<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>`;
const ICON_GLOBE = `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.6 4.2 5.6 4.2 9s-1.4 6.4-4.2 9c-2.8-2.6-4.2-5.6-4.2-9s1.4-6.4 4.2-9z"/>`;

/* ---------- 7. MÀN HỌC (HOME) ---------- */
function viewHome() {
  const wrap = el(`<section class="view"></section>`);
  const subj = SUBJECTS[S.subject];
  const chs = chapters(S.subject, S.level);
  const totalLessons = chs.reduce((n, c) => n + c.lessons.length, 0);
  const doneLessons = chs.reduce((n, c) => n + c.lessons.filter((l) => isLessonDone(S.subject, S.level, l.id)).length, 0);

  wrap.innerHTML = `
    <div class="hero">
      <div class="hero-glow"></div>
      <div class="hero-globe"><img src="assets/mascot.png" alt="Boom — linh vật Boom Geog"></div>
      <div class="hero-bubble"><p>Chào bạn nhỏ! Mình là Boom. Hôm nay mình khám phá ${S.subject === "vn" ? "Việt Nam" : "thế giới"} nhé.</p></div>
      <div class="home-stats">
        <div class="hs"><b>${S.streak}</b><small>ngày liên tiếp</small></div>
        <div class="hs"><b>${S.xp}</b><small>điểm XP</small></div>
        <div class="hs"><b>${doneLessons}/${totalLessons || "–"}</b><small>bài đã học</small></div>
      </div>
    </div>

    <div class="subjecttabs">
      ${Object.entries(SUBJECTS).map(([id, s]) => `
        <button class="subjecttab ${S.subject === id ? "on" : ""}" data-subject="${id}" data-action="set-subject">
          <svg class="ic" viewBox="0 0 24 24">${id === "vn" ? ICON_PIN : ICON_GLOBE}</svg>
          <b>${esc(s.short)}</b><small>${id === "vn" ? "63 → 34 tỉnh, thành" : "6 châu lục"}</small>
        </button>`).join("")}
    </div>

    <div class="levelrow">
      ${subj.levels.map((lv) => `
        <button class="levelchip ${lv.id === S.level ? "on" : ""} ${lv.ready ? "" : "soon"}" data-level="${lv.id}" data-action="set-level">
          ${esc(lv.label)}${lv.ready ? "" : '<span class="tag">sắp có</span>'}
        </button>`).join("")}
    </div>

    <div id="chapters-slot"></div>
  `;
  const slot = wrap.querySelector("#chapters-slot");
  if (!chs.length) {
    slot.appendChild(el(`
      <div class="soon-card">
        <svg class="ic" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
        <b>Cấp độ này sắp ra mắt</b>
        <span>Thầy Đinh Thi Ai sẽ bổ sung bài học cho cấp này sau.</span>
      </div>`));
  } else {
    chs.forEach((ch, ci) => slot.appendChild(renderChapter(ch, ci, chs)));
  }
  return wrap;
}

function renderChapter(ch, ci, chs) {
  const key = `${S.subject}:${S.level}`;
  const lessonsDone = ch.lessons.filter((l) => isLessonDone(S.subject, S.level, l.id)).length;
  const isOpen = (S.openChapter[key] ?? findCurrentChapterIdx(chs)) === ci;
  const wrap = el(`<div class="unit ${isOpen ? "mo" : ""}"></div>`);
  wrap.innerHTML = `
    <button class="unit-head" data-action="toggle-chapter" data-ci="${ci}">
      <span class="unit-ico"><svg class="ic" viewBox="0 0 24 24">${ch.icon === "book" ? '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z"/>' : ICON_PIN}</svg></span>
      <span class="unit-tt"><b>${esc(ch.title)}</b><small>${lessonsDone}/${ch.lessons.length} bài</small></span>
      <span class="unit-caret"><svg class="ic" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></span>
    </button>
    <div class="nodes"></div>
  `;
  const nodes = wrap.querySelector(".nodes");
  ch.lessons.forEach((lesson, li) => {
    const st = lessonState(S.subject, S.level, ci, li);
    const node = el(`<div class="node ${st}"></div>`);
    const icon = lesson.checkpoint
      ? '<svg class="ic" viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 14v3M9 20h6l-1-3H10z"/></svg>'
      : st === "locked"
        ? '<svg class="ic" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
        : st === "done"
          ? '<svg class="ic" viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6"/></svg>'
          : '<svg class="ic" viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';
    node.innerHTML = `
      <button class="node-btn" data-action="start-lesson" data-lesson="${lesson.id}" ${st === "locked" ? "disabled" : ""}>${icon}</button>
      <span class="node-label">${esc(lesson.title)}</span>`;
    nodes.appendChild(node);
  });
  return wrap;
}
function findCurrentChapterIdx(chs) {
  for (let i = 0; i < chs.length; i++) {
    if (!chs[i].lessons.every((l) => isLessonDone(S.subject, S.level, l.id))) return i;
  }
  return Math.max(0, chs.length - 1);
}

/* ---------- 8. MÀN BÀI HỌC ---------- */
function buildQueue(lesson) {
  const steps = [];
  (lesson.teach || []).forEach((slide) => steps.push({ kind: "teach", slide }));
  (lesson.quiz || []).forEach((item, i) => steps.push({ kind: "quiz", item, uid: `${lesson.id}-${i}` }));
  return steps;
}
function startLesson(lessonId) {
  const found = findLesson(S.subject, S.level, lessonId);
  if (!found) return;
  refillHearts();
  const queue = shuffleQuizKeepTeachOrder(buildQueue(found.lesson));
  LESSON = {
    subject: S.subject, level: S.level, lesson: found.lesson,
    queue, pos: 0, total: queue.length,
    correctFirstTry: 0, quizTotal: (found.lesson.quiz || []).length,
    startHearts: S.hearts, answered: null,
  };
  ROUTE = "lesson";
  render();
}
function shuffleQuizKeepTeachOrder(steps) {
  const teach = steps.filter((s) => s.kind === "teach");
  const quiz = shuffle(steps.filter((s) => s.kind === "quiz"));
  return [...teach, ...quiz];
}
function viewLesson() {
  if (!LESSON) { nav("home"); return el("<div></div>"); }
  if (S.hearts <= 0 && LESSON.pos < LESSON.queue.length) return viewOutOfHearts();
  if (LESSON.pos >= LESSON.queue.length) return viewLessonResult();
  const step = LESSON.queue[LESSON.pos];
  const wrap = el(`<section class="view"></section>`);
  const head = el(`
    <div class="lesson-head">
      <button class="icon-btn" data-action="quit-lesson"><svg class="ic" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
      <div class="lesson-progress"></div>
    </div>`);
  const bar = head.querySelector(".lesson-progress");
  LESSON.queue.forEach((s, i) => {
    const seg = el(`<i class="${s.kind === "teach" ? "teach" : ""} ${i < LESSON.pos ? "done" : ""}"><b></b></i>`);
    if (i === LESSON.pos) seg.querySelector("b").style.width = "45%";
    bar.appendChild(seg);
  });
  wrap.appendChild(head);
  wrap.appendChild(step.kind === "teach" ? renderTeach(step.slide) : renderQuiz(step));
  return wrap;
}
function viewOutOfHearts() {
  const wrap = el(`<section class="view result"></section>`);
  wrap.innerHTML = `
    <div class="result-badge"><svg class="ic" viewBox="0 0 24 24"><path d="M12 20.5S3.5 15 3.5 8.8C3.5 5.6 5.9 3.5 8.5 3.5c1.7 0 3 .8 3.5 2 .5-1.2 1.8-2 3.5-2 2.6 0 5 2.1 5 5.3 0 6.2-8.5 11.7-8.5 11.7z"/></svg></div>
    <h2 class="result-title">Hết tim rồi!</h2>
    <p class="sub">Tim sẽ hồi lại theo thời gian, hoặc bạn có thể xem lại phần dạy trong bài để học chắc hơn.</p>
    <button class="btn btn-primary btn-block mt" data-action="quit-lesson">Về màn Học</button>
  `;
  return wrap;
}
function renderTeach(slide) {
  const wrap = el(`<div class="slide"></div>`);
  if (slide.t === "intro") {
    wrap.innerHTML = `
      <div class="slide-kicker">Tìm hiểu</div>
      <h2>${esc(slide.title)}</h2>
      <p class="slide-body">${esc(slide.body)}</p>
      <ul class="slide-bullets">${(slide.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      ${qfoot("Tiếp tục")}`;
  } else if (slide.t === "region") {
    wrap.innerHTML = `
      <div class="slide-kicker">${slide.region ? "Vùng miền" : "Châu lục"}</div>
      <h2>${esc(slide.title)}</h2>
      <p class="slide-body">${esc(slide.body)}</p>
      <div class="place-map">${miniMap(S.subject, { region: slide.region, continents: slide.continentPair })}</div>
      ${qfoot("Tiếp tục")}`;
  } else if (slide.t === "culture") {
    wrap.innerHTML = `
      <div class="slide-kicker">Góc khám phá</div>
      <h2>${esc(slide.title)}</h2>
      <p class="slide-body">${esc(slide.body)}</p>
      ${qfoot("Tiếp tục")}`;
  } else if (slide.t === "topic") {
    const facts = (slide.facts || []).map((f) => `<div class="fact"><b>${esc(f.value)}</b><small>${esc(f.label)}</small></div>`).join("");
    wrap.innerHTML = `
      <div class="slide-kicker">${esc(slide.kicker || "Tìm hiểu thêm")}</div>
      <h2>${esc(slide.title)}</h2>
      <p class="slide-body">${esc(slide.body)}</p>
      ${facts ? `<div class="fact-grid">${facts}</div>` : ""}
      ${qfoot("Tiếp tục")}`;
  } else if (slide.t === "place") {
    const facts = (slide.facts || []).map((f) => `<div class="fact"><b>${esc(f.value)}</b><small>${esc(f.label)}</small></div>`).join("");
    wrap.innerHTML = `
      <div class="slide-kicker">Địa điểm</div>
      <div class="place-card">
        <div class="place-hero">
          <span class="thumb"><svg class="ic" viewBox="0 0 24 24">${ICON_PIN}</svg></span>
          <div><h2>${esc(slide.title)}</h2><small>${esc(slide.subtitle || "")}</small></div>
        </div>
        <p class="slide-body">${esc(slide.body)}</p>
        <div class="fact-grid">${facts}</div>
        <div class="place-map">${miniMap(S.subject, { entityId: slide.id })}</div>
      </div>
      ${qfoot("Tiếp tục")}`;
  }
  wrap.dataset.stepKind = "teach";
  return wrap;
}
function qfoot(label) {
  return `<div class="qfoot"><button class="btn btn-primary btn-block" data-action="teach-next">${esc(label)}</button></div>`;
}
function miniMap(subject, opts) {
  const subj = SUBJECTS[subject];
  const paths = subj.map.map((e) => {
    let cls = "locked";
    if (opts.entityId && e.id === opts.entityId) cls = "hi";
    else if (opts.region && e.region === opts.region) cls = "hi";
    else if (opts.continents && opts.continents.includes(e.continent)) cls = "hi";
    return `<path d="${e.path}" class="${cls}"/>`;
  }).join("");
  return `<svg viewBox="${subj.viewBox}" aria-hidden="true">${paths}</svg>`;
}

/* ---------- 9. CÂU HỎI ---------- */
function renderQuiz(step) {
  const item = step.item;
  const wrap = el(`<div class="quiz"></div>`);
  wrap.dataset.stepKind = "quiz";
  const speakTarget = quizSpeakText(item);
  const header = `
    <div class="quiz-q">${esc(item.q)}
      ${speakTarget ? `<button class="icon-btn" data-action="speak" data-text="${esc(speakTarget)}" style="vertical-align:-6px"><svg class="ic" viewBox="0 0 24 24"><use href="#i-volume"/></svg></button>` : ""}
    </div>
    ${item.hint ? `<div class="quiz-hint">${esc(item.hint)}</div>` : ""}`;

  if (item.t === "choice") wrap.innerHTML = header + renderChoice(item);
  else if (item.t === "blank") wrap.innerHTML = header + renderBlank(item);
  else if (item.t === "type") wrap.innerHTML = header + renderType(item);
  else if (item.t === "match") wrap.innerHTML = header + renderMatch(item);
  else if (item.t === "mapclick") wrap.innerHTML = header + renderMapClick(item);
  else if (item.t === "order") wrap.innerHTML = header + renderOrder(item);
  else if (item.t === "truefalse") wrap.innerHTML = header + renderTrueFalse(item);
  else if (item.t === "drag") { LESSON.dragPlaced = 0; wrap.innerHTML = header + renderDrag(item); }
  wrap.appendChild(el(`<div class="qfoot" id="qfoot"></div>`));
  return wrap;
}
function quizSpeakText(item) {
  if (item.t === "mapclick") {
    if (item.targetType === "province" || item.targetType === "country") {
      const e = findEntity(S.subject, item.targetId);
      return e ? entityLabel(S.subject, e) : null;
    }
    if (item.targetType === "region") return REGION_LABEL[item.targetId];
    if (item.targetType === "continent") return CONTINENT_LABEL[item.targetId];
  }
  return null;
}
function renderChoice(item) {
  return `<div class="opt-list">${item.options.map((opt, i) => `
    <button class="opt" data-action="answer-choice" data-i="${i}">
      <span class="num">${String.fromCharCode(65 + i)}</span>${esc(opt)}
    </button>`).join("")}</div>`;
}
function renderBlank(item) {
  const bank = shuffle(item.options);
  return `
    <p class="blank-sentence">${esc(item.q).replace("___", '<span class="blank-slot" id="blank-slot">?</span>')}</p>
    <div class="word-bank">${bank.map((w) => `<button class="chip" data-action="answer-blank" data-word="${esc(w)}">${esc(w)}</button>`).join("")}</div>`;
}
function renderType(item) {
  return `<input class="type-input" id="type-input" placeholder="Gõ câu trả lời…" autocomplete="off" autocapitalize="words">
    <button class="btn btn-primary btn-block mt" data-action="answer-type">Kiểm tra</button>`;
}
function renderMatch(item) {
  const left = item.pairs.map((p, i) => ({ i, text: p[0] }));
  const right = shuffle(item.pairs.map((p, i) => ({ i, text: p[1] })));
  return `<div class="match-cols">
    <div class="match-col">${left.map((x) => `<button class="match-item" data-action="match-left" data-i="${x.i}">${esc(x.text)}</button>`).join("")}</div>
    <div class="match-col">${right.map((x) => `<button class="match-item" data-action="match-right" data-i="${x.i}">${esc(x.text)}</button>`).join("")}</div>
  </div>`;
}
function renderOrder(item) {
  const pool = shuffle(item.items.map((label, i) => ({ label, i })));
  return `
    <div class="order-seq" id="order-seq"></div>
    <div class="word-bank" id="order-pool">${pool.map((x) => `<button class="chip" data-action="answer-order-pick" data-i="${x.i}">${esc(x.label)}</button>`).join("")}</div>`;
}
function renderTrueFalse(item) {
  return `<div class="tf-row">
    <button class="btn tf-btn btn-block" data-action="answer-tf" data-v="true">Đúng</button>
    <button class="btn tf-btn btn-block" data-action="answer-tf" data-v="false">Sai</button>
  </div>`;
}
function renderDrag(item) {
  const buckets = item.buckets.map((b, i) => `
    <div class="drag-bucket" data-bucket="${i}">
      <b>${esc(b)}</b>
      <div class="drag-bucket-items" data-bucket-items="${i}"></div>
    </div>`).join("");
  const pool = shuffle(item.items.map((it, i) => ({ ...it, i })));
  const chips = pool.map((it) => `<div class="drag-chip" data-item="${it.i}">${esc(it.label)}</div>`).join("");
  return `
    <div class="drag-buckets">${buckets}</div>
    <div class="drag-pool" id="drag-pool">${chips}</div>`;
}
function renderMapClick(item) {
  const subj = SUBJECTS[S.subject];
  const paths = subj.map.map((e) => {
    const active = e.active || item.targetType === "region" || item.targetType === "continent";
    const cls = active ? "active-region" : "locked";
    return `<path d="${e.path}" class="${cls}" data-id="${e.id}"/>`;
  }).join("");
  return `<div class="map-quiz"><svg viewBox="${subj.viewBox}">${paths}</svg></div>`;
}

/* ---------- 10. CHẤM ĐIỂM ---------- */
function afterAnswer(correct, correctText) {
  if (LESSON.answered) return;
  LESSON.answered = true;
  if (correct) addXp(10); else loseHeart();
  const foot = document.getElementById("qfoot");
  if (foot) {
    foot.innerHTML = `
      <div class="feedback ${correct ? "ok" : "bad"}">
        <svg class="ic" viewBox="0 0 24 24"><use href="#${correct ? "i-check" : "i-x"}"/></svg>
        <span class="fb-text">${correct ? "Chính xác!" : "Chưa đúng."}${correctText ? `<small>${esc(correctText)}</small>` : ""}</span>
      </div>
      <button class="btn ${correct ? "btn-ok" : "btn-danger"} btn-block" data-action="quiz-next">Tiếp tục</button>`;
  }
  if (!correct) {
    const step = LESSON.queue[LESSON.pos];
    LESSON.queue.push({ ...step, uid: step.uid + "-r" + Math.random() });
    LESSON.total = LESSON.queue.length;
  } else {
    LESSON.correctFirstTry++;
  }
}
function quizNext() {
  LESSON.pos++;
  LESSON.answered = null;
  if (S.hearts <= 0 && LESSON.pos < LESSON.queue.length) { render(); return; }
  if (LESSON.pos >= LESSON.queue.length) finishLesson();
  else render();
}
function finishLesson() {
  const l = LESSON.lesson;
  const heartsLost = LESSON.startHearts - S.hearts;
  const stars = heartsLost === 0 ? 3 : heartsLost <= 2 ? 2 : 1;
  markLessonDone(lessonKey(LESSON.subject, LESSON.level, l.id), stars);
  addXp(l.checkpoint ? 40 : 20);
  render();
}
function viewLessonResult() {
  const wrap = el(`<section class="view result"></section>`);
  const key = lessonKey(LESSON.subject, LESSON.level, LESSON.lesson.id);
  const stars = S.progress[key]?.stars || 0;
  wrap.innerHTML = `
    <div class="result-badge"><svg class="ic" viewBox="0 0 24 24"><use href="#i-trophy"/></svg></div>
    <h2 class="result-title">Học xong rồi!</h2>
    <p class="sub">${esc(LESSON.lesson.title)}</p>
    <div class="result-stats">
      <div class="hs"><b>${"★".repeat(stars)}${"☆".repeat(3 - stars)}</b><small>đánh giá</small></div>
      <div class="hs"><b>+${LESSON.lesson.checkpoint ? 40 : 20}</b><small>XP nhận</small></div>
      <div class="hs"><b>${S.hearts}</b><small>tim còn lại</small></div>
    </div>
    <button class="btn btn-primary btn-block mt" data-action="quit-lesson">Tuyệt vời!</button>
  `;
  return wrap;
}

/* ---------- 11. MÀN BẢN ĐỒ ---------- */
function viewMap() {
  const wrap = el(`<section class="view"></section>`);
  const subj = SUBJECTS[S.subject];
  const paths = subj.map.map((e) => {
    const cls = e.active ? "active-region" : "locked";
    return `<path d="${e.path}" class="${cls}" data-id="${e.id}"/>`;
  }).join("");
  wrap.innerHTML = `
    <h1 class="view-title">Bản đồ ${esc(subj.short)}</h1>
    <p class="sub mb">Bấm vào vùng có màu để xem thông tin. Vùng xám là bài học sắp ra mắt.</p>
    <div class="map-toolbar">
      <button class="chip on" data-subject="vn" data-action="set-subject-map">Việt Nam</button>
      <button class="chip" data-subject="world" data-action="set-subject-map">Thế giới</button>
    </div>
    <div class="map-wrap"><svg viewBox="${subj.viewBox}">${paths}</svg></div>
    <div class="map-legend">
      <span><i style="background:var(--brand)"></i>Đã có bài học</span>
      <span><i style="background:var(--line-hi)"></i>Sắp ra mắt</span>
    </div>
  `;
  wrap.querySelector(`[data-subject="${S.subject}"][data-action="set-subject-map"]`).classList.add("on");
  wrap.querySelector(`[data-subject="${S.subject === "vn" ? "world" : "vn"}"][data-action="set-subject-map"]`).classList.remove("on");
  return wrap;
}
function openEntitySheet(id) {
  const subj = SUBJECTS[S.subject];
  const e = findEntity(S.subject, id);
  if (!e) return;
  if (!e.active) { toast("Bài học cho khu vực này sắp ra mắt."); return; }
  const label = entityLabel(S.subject, e);
  let rows = "";
  if (S.subject === "vn") {
    rows = `
      <div class="fact-grid">
        <div class="fact"><b>${REGION_LABEL[e.region] || "—"}</b><small>Miền</small></div>
        <div class="fact"><b>${e.loai}</b><small>Loại</small></div>
        <div class="fact"><b>${Math.round(e.dienTich).toLocaleString("vi-VN")} km²</b><small>Diện tích</small></div>
        <div class="fact"><b>${Math.round(e.danSo / 1000).toLocaleString("vi-VN")} nghìn</b><small>Dân số</small></div>
      </div>
      <p class="sub mt">Sáp nhập từ: ${esc(e.sapNhap)} (2025)</p>`;
  } else {
    rows = `
      <div class="fact-grid">
        <div class="fact"><b>${esc(e.capital)}</b><small>Thủ đô</small></div>
        <div class="fact"><b>${CONTINENT_LABEL[e.continent]}</b><small>Châu lục</small></div>
      </div>`;
  }
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="place-hero mb">
      <span class="thumb"><svg class="ic" viewBox="0 0 24 24">${ICON_PIN}</svg></span>
      <div><h2>${esc(label)}</h2></div>
      <button class="icon-btn" style="margin-left:auto" data-action="speak" data-text="${esc(label)}"><svg class="ic" viewBox="0 0 24 24"><use href="#i-volume"/></svg></button>
    </div>
    ${rows}
  `);
}

/* ---------- 12. MÀN HỒ SƠ ---------- */
function viewProfile() {
  const wrap = el(`<section class="view"></section>`);
  wrap.innerHTML = `
    <div class="profile-head">
      <div class="profile-avatar"><img src="assets/mascot.png" alt="Boom — linh vật Boom Geog"></div>
      <h2>Nhà thám hiểm nhỏ</h2>
      <p class="sub">${S.streak} ngày liên tiếp · ${S.xp} XP</p>
    </div>
    <div class="card">
      <div class="settings-row">
        <svg class="ic" viewBox="0 0 24 24"><use href="#i-sun"/></svg>
        <b>Giao diện tối</b>
        <button class="switch ${S.theme === "dark" ? "on" : ""}" data-action="toggle-theme"><i></i></button>
      </div>
      <div class="settings-row">
        <svg class="ic" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
        <b>Mở hết bài học</b>
        <button class="switch ${S.moHet ? "on" : ""}" data-action="toggle-mohet"><i></i></button>
      </div>
      <p class="sub" style="padding:0 var(--s2) var(--s3)">Bật để vuốt xem trước mọi bài, không cần học tuần tự — hợp lúc thầy duyệt nội dung.</p>
      <div class="settings-row">
        <svg class="ic" viewBox="0 0 24 24"><use href="#i-share"/></svg>
        <b>Cài vào màn hình chính</b>
      </div>
      <p class="sub" style="padding:0 var(--s2) var(--s3)">iPhone/iPad: mở bằng Safari → Chia sẻ → Thêm vào MH chính. Android: Chrome sẽ tự mời cài.</p>
      <div class="settings-row">
        <svg class="ic" viewBox="0 0 24 24"><use href="#i-refresh"/></svg>
        <b>Làm lại tiến độ học</b>
        <button class="btn btn-sm btn-soft" data-action="reset-progress">Đặt lại</button>
      </div>
    </div>
    <div class="credits card mt">
      <b>Nguồn dữ liệu bản đồ</b><br>
      Bản đồ 34 tỉnh, thành Việt Nam (sau sáp nhập 2025): tổng hợp từ Free-GIS-Data (nguyenduy1133), dùng cho mục đích học tập.<br>
      Bản đồ thế giới: simple-world-map — Al MacDonald / Fritz Lekschas, giấy phép CC BY-SA 3.0.
    </div>
  `;
  return wrap;
}

/* ---------- 13. LỚP PHỦ (SHEET / TOAST) ---------- */
function showSheet(innerHtml) {
  closeSheet();
  const root = document.getElementById("overlay-root");
  const back = el(`<div class="sheet-backdrop" data-action="close-sheet"><div class="sheet"></div></div>`);
  back.querySelector(".sheet").innerHTML = innerHtml;
  root.appendChild(back);
}
function closeSheet() {
  document.querySelectorAll(".sheet-backdrop").forEach((n) => n.remove());
}
function toast(msg) {
  document.querySelectorAll(".toast").forEach((n) => n.remove());
  const t = el(`<div class="toast">${esc(msg)}</div>`);
  document.getElementById("overlay-root").appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

/* ---------- 14. XỬ LÝ SỰ KIỆN ---------- */
let matchState = null; // { leftSel, links:Set }

function onClick(e) {
  const t = e.target.closest("[data-action]");
  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) { nav(navBtn.dataset.nav); return; }
  const a = t?.dataset.action;

  if (a === "set-subject" || a === "set-subject-map") { S.subject = t.dataset.subject; S.level = "l45"; save(); render(); return; }
  if (a === "open-subject") { nav("map"); return; }
  if (a === "set-level") { const lv = levels(S.subject).find((l) => l.id === t.dataset.level); if (lv && !lv.ready) { toast("Cấp độ này sắp ra mắt."); return; } S.level = t.dataset.level; save(); render(); return; }
  if (a === "toggle-chapter") { const key = `${S.subject}:${S.level}`; const ci = Number(t.dataset.ci); S.openChapter[key] = S.openChapter[key] === ci ? -1 : ci; save(); render(); return; }
  if (a === "start-lesson") { startLesson(t.dataset.lesson); return; }
  if (a === "quit-lesson") { nav("home"); return; }
  if (a === "teach-next") { LESSON.pos++; LESSON.answered = null; render(); return; }
  if (a === "quiz-next") { quizNext(); return; }
  if (a === "speak") { speak(t.dataset.text); return; }
  if (a === "toggle-theme") { S.theme = S.theme === "dark" ? "light" : "dark"; applyTheme(); save(); render(); return; }
  if (a === "toggle-mohet") { S.moHet = !S.moHet; save(); render(); return; }
  if (a === "reset-progress") { if (confirm("Xoá hết tiến độ học? Không thể hoàn tác.")) { S.progress = {}; S.xp = 0; S.streak = 0; save(); render(); } return; }
  if (a === "close-sheet") { closeSheet(); return; }

  if (LESSON && LESSON.answered) return; // đã trả lời thì khoá thao tác cho tới khi bấm "Tiếp tục"
  const step = LESSON ? LESSON.queue[LESSON.pos] : null;

  if (a === "answer-choice" && step) {
    const item = step.item;
    const i = Number(t.dataset.i);
    const correct = i === item.answer;
    t.classList.add(correct ? "ok" : "bad");
    if (!correct) t.parentElement.children[item.answer].classList.add("ok");
    t.parentElement.querySelectorAll(".opt").forEach((o) => (o.disabled = true));
    afterAnswer(correct, correct ? null : `Đáp án đúng: ${item.options[item.answer]}`);
    return;
  }
  if (a === "answer-blank" && step) {
    const item = step.item;
    const word = t.dataset.word;
    const correct = norm(word) === norm(item.answer);
    const slot = document.getElementById("blank-slot");
    if (slot) { slot.textContent = word; slot.classList.add("filled"); }
    document.querySelectorAll('[data-action="answer-blank"]').forEach((b) => (b.disabled = true));
    t.classList.add(correct ? "on" : "bad");
    afterAnswer(correct, correct ? null : `Đáp án đúng: ${item.answer}`);
    return;
  }
  if (a === "match-left" && step) {
    document.querySelectorAll(".match-item[data-action=match-left]").forEach((b) => b.classList.remove("sel"));
    t.classList.add("sel");
    matchState = matchState || { links: new Set() };
    matchState.leftSel = t;
    return;
  }
  if (a === "match-right" && step) {
    if (!matchState?.leftSel) return;
    const item = step.item;
    const li = Number(matchState.leftSel.dataset.i);
    const ri = Number(t.dataset.i);
    if (li === ri) {
      matchState.leftSel.classList.remove("sel"); matchState.leftSel.classList.add("linked"); matchState.leftSel.disabled = true;
      t.classList.add("linked"); t.disabled = true;
      matchState.links.add(li);
      if (matchState.links.size === item.pairs.length) afterAnswer(true, null);
    } else {
      t.classList.add("bad");
      setTimeout(() => t.classList.remove("bad"), 380);
      matchState.leftSel.classList.remove("sel");
      afterAnswerMatchWrong();
    }
    return;
  }
  if (a === "answer-type" && step) {
    const item = step.item;
    const input = document.getElementById("type-input");
    const val = norm(input.value);
    const accept = (item.accept || [norm(item.answer)]).map(norm);
    const correct = val.length > 0 && accept.includes(val);
    input.disabled = true;
    afterAnswer(correct, correct ? null : `Đáp án đúng: ${item.answer}`);
    return;
  }
  if (a === "answer-order-pick" && step) {
    const item = step.item;
    const i = Number(t.dataset.i);
    LESSON.orderPicks = LESSON.orderPicks || [];
    if (LESSON.orderPicks.includes(i)) return;
    LESSON.orderPicks.push(i);
    t.disabled = true;
    t.classList.add("on");
    const seq = document.getElementById("order-seq");
    seq.insertAdjacentHTML("beforeend", `<span class="order-chip">${LESSON.orderPicks.length}. ${esc(item.items[i])}</span>`);
    if (LESSON.orderPicks.length === item.items.length) {
      const picks = LESSON.orderPicks;
      const correct = picks.every((v, idx) => v === idx);
      LESSON.orderPicks = null;
      afterAnswer(correct, correct ? null : `Thứ tự đúng: ${item.items.join(" → ")}`);
    }
    return;
  }
  if (a === "answer-tf" && step) {
    const item = step.item;
    const v = t.dataset.v === "true";
    const correct = v === item.answer;
    document.querySelectorAll('[data-action="answer-tf"]').forEach((b) => (b.disabled = true));
    t.classList.add(correct ? "ok" : "bad");
    afterAnswer(correct, correct ? null : `Đáp án đúng: ${item.answer ? "Đúng" : "Sai"}`);
    return;
  }
  if (a === "speak" ) { return; }

  const mapPath = e.target.closest("path[data-id]");
  if (mapPath && step && step.item.t === "mapclick") {
    const item = step.item;
    const id = mapPath.dataset.id;
    const ent = findEntity(S.subject, id);
    let correct = false;
    if (item.targetType === "province" || item.targetType === "country") correct = id === item.targetId;
    else if (item.targetType === "region") correct = ent?.region === item.targetId;
    else if (item.targetType === "continent") correct = ent?.continent === item.targetId;
    mapPath.classList.add(correct ? "ok" : "bad");
    if (!correct) {
      const svg = mapPath.closest("svg");
      svg?.querySelectorAll("path").forEach((p) => {
        const pe = findEntity(S.subject, p.dataset.id);
        const isTarget = item.targetType === "province" || item.targetType === "country"
          ? p.dataset.id === item.targetId
          : item.targetType === "region" ? pe?.region === item.targetId : pe?.continent === item.targetId;
        if (isTarget) p.classList.add("ok");
      });
    }
    afterAnswer(correct, correct ? null : "Vùng được tô xanh mới là đáp án đúng.");
    return;
  }
  if (mapPath && ROUTE === "map") { openEntitySheet(mapPath.dataset.id); return; }
}
function afterAnswerMatchWrong() {
  if (LESSON.answered) return;
  loseHeart();
}
function onSubmit(e) { e.preventDefault(); }
function onInput(e) {
  if (e.target.id === "type-input") {
    const btn = document.querySelector('[data-action="answer-type"]');
    if (btn) btn.disabled = !e.target.value.trim();
  }
}

/* ---------- 15. PWA ---------- */
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(() => {});
  // Bản mới (CACHE đổi số trong sw.js) tự kích hoạt và tự tải lại trang một lần —
  // máy đã cài PWA không cần thầy/học sinh phải xoá cài lại hay bấm gì cả.
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    location.reload();
  });
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
