(function(){
"use strict";

/* ============================== ICONS ============================== */
const ICON = {
  book: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5.5C6 4 9 4 12 6c3-2 6-2 9-.5v13c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 6v13"/></svg>',
  cards: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="2"/><rect x="7" y="9" width="14" height="10" rx="2" fill="var(--card)"/></svg>',
  refresh: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 20v-4h4"/></svg>',
  chat: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4z"/></svg>',
  trophy: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4a4 4 0 0 0 4 5"/><path d="M17 5h3a4 4 0 0 1-4 5"/><path d="M12 14v3"/><path d="M9 21h6"/><path d="M9 21c0-1.7.7-3 3-3s3 1.3 3 3"/></svg>',
  user: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.3-4 4.2-6 7.5-6s6.2 2 7.5 6"/></svg>',
  flame: '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2c1 3.5-1 5-2.5 6.7C7.8 10.6 6.5 12.4 6.5 15a5.5 5.5 0 0 0 11 0c0-2-1-3.4-2-4.7.6 2 .1 3.4-.9 4.2-.3-2-1.2-3-2.6-4.3-1.7 1.5-2.6 2.7-2.6 4.3 0 .8.2 1.4.6 2A3.3 3.3 0 0 1 8.2 15c0-3.4 2.4-5 3.8-6.7C13 6.8 13.2 4.6 12 2z"/></svg>',
  gem: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3l-2 5 5 13 5-13-2-5M7 8l5 13 5-13"/></svg>',
  sun: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>',
  moon: '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z"/></svg>',
  x: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.5 2.4C20.5 15 12 20.5 12 20.5z"/></svg>',
  check: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  lock: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-7-6 16-3-6-7-3z"/></svg>',
  ok: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M8 12.5l2.6 2.6L16 9.5"/></svg>',
  bad: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  compass: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6z"/></svg>',
  artifact: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="7" rx="8.5" ry="3.2"/><path d="M3.5 7v5c0 1.77 3.8 3.2 8.5 3.2s8.5-1.43 8.5-3.2V7"/><path d="M3.5 12v5c0 1.77 3.8 3.2 8.5 3.2s8.5-1.43 8.5-3.2v-5"/></svg>',
  scroll: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a2 2 0 0 1 2 2v1H8"/><path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V10H8"/><path d="M6 4a2 2 0 0 1 2 2v14"/></svg>',
  globe: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.4" ry="8.5"/><path d="M3.5 12h17"/></svg>',
  drum: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="8.5" ry="8.5"/><ellipse cx="12" cy="12" rx="5" ry="5"/><ellipse cx="12" cy="12" rx="1.6" ry="1.6" fill="currentColor" stroke="none"/></svg>',
  axe: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3l6 6-3 3-6-6z"/><path d="M11 8L4 15v4h4l7-7"/></svg>',
  group: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3.4"/><circle cx="16.5" cy="10" r="2.6"/><path d="M3.3 19c.8-3.4 3-5 5.7-5s4.9 1.6 5.7 5"/><path d="M15 19c.5-2 1.7-3.4 3.5-3.6"/></svg>',
  coins: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="9" cy="8" rx="6" ry="3"/><path d="M3 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8"/><path d="M9 15v.5c0 1.66 2.69 3 6 3s6-1.34 6-3V12c0-1.13-1.2-2.12-3-2.65"/></svg>',
  pyramid: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 17H3z"/><path d="M8 13h8M6.5 16.5h11"/></svg>',
  crown: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16M4 18l-1.5-9L8 12l4-7 4 7 5.5-3L20 18"/></svg>',
  temple: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-5 9 5"/><path d="M4 9v10M8 9v10M12 9v10M16 9v10M20 9v10"/><path d="M2 19h20"/></svg>',
  wave: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M3 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M12 4v7"/><path d="M9 7l3-3 3 3"/></svg>',
  sword: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3.5L20.5 9.5 10 20l-4-1.5L4.5 15z"/><path d="M14.5 3.5L4.5 13.5M17.5 6.5l-11 11"/></svg>',
};

/* ============================== MASCOT ============================== */
let MASCOT_IMG_OK = null;
function checkMascotImage(cb){
  if(MASCOT_IMG_OK !== null){ cb(MASCOT_IMG_OK); return; }
  const img = new Image();
  img.onload = ()=>{ MASCOT_IMG_OK = true; cb(true); };
  img.onerror = ()=>{ MASCOT_IMG_OK = false; cb(false); };
  img.src = "assets/mascot.png";
}
function mascotHTML(cls){
  cls = cls || "mascot";
  // Placeholder vẽ tay — tự thay bằng assets/mascot.png (ảnh BiBi thật) khi có file.
  return `<div class="${cls}" data-mascot-slot>${mascotFallbackSVG()}</div>`;
}
function mascotFallbackSVG(){
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="biBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E8419B"/><stop offset="1" stop-color="#9B3FE0"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="112" rx="52" ry="48" fill="url(#biBody)"/>
    <circle cx="80" cy="102" r="9" fill="#2B0A2E"/><circle cx="120" cy="102" r="9" fill="#2B0A2E"/>
    <circle cx="77" cy="99" r="2.6" fill="#fff"/><circle cx="117" cy="99" r="2.6" fill="#fff"/>
    <path d="M72 128c8 12 48 12 56 0" fill="none" stroke="#2B0A2E" stroke-width="4" stroke-linecap="round"/>
    <path d="M55 90c-8-14 2-26 14-22M145 90c8-14-2-26-14-22" fill="none" stroke="#E8419B" stroke-width="6" stroke-linecap="round"/>
    <rect x="86" y="150" width="30" height="9" rx="4.5" fill="#E8B44C" transform="rotate(-6 86 150)"/>
  </svg>`;
}
function applyMascotImages(){
  checkMascotImage(function(ok){
    if(!ok) return;
    document.querySelectorAll('[data-mascot-slot]').forEach(function(el){
      el.innerHTML = '<img src="assets/mascot.png" alt="BiBi">';
    });
  });
}

/* ============================== STATE ============================== */
const S = {
  gradeIdx: 2, // mặc định Lớp 6 (index 2 trong GRADES)
  theme: "dark", tab: "home",
  streak: 4, xp: 60,
  done: {}, // lessonId -> true
};

function currentGrade(){ return window.GRADES[S.gradeIdx]; }

/* ============================== HELPERS ============================== */
function $(sel, root){ return (root||document).querySelector(sel); }
function el(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
let toastTimer=null;
function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"), 2000);
}

function flatNodes(g){
  const flat = [];
  g.chapters.forEach(ch=>ch.nodes.forEach(n=>flat.push(n)));
  return flat;
}
// Giai đoạn rà soát nội dung: KHÔNG khoá theo thứ tự — bài nào đã biên
// soạn xong thì bấm được ngay để thầy vuốt xem toàn bộ, bài nào chưa có
// nội dung thì vẫn hiện khoá (bấm vào báo "đang biên soạn") để thầy biết
// còn thiếu gì cần làm tiếp.
function nodeState(node){
  if(S.done[node.id]) return "done";
  return node.authored ? "current" : "locked";
}

/* ============================== RENDER: HOME ============================== */
function renderHome(){
  const g = currentGrade();
  const flat = flatNodes(g);
  let firstPlayable = null;
  flat.forEach(n=>{ if(!firstPlayable && !S.done[n.id] && n.authored) firstPlayable=n; });

  const doneCount = Object.keys(S.done).length;
  const heroLine = doneCount>0 ? "Bạn học rất đều đấy, tiếp tục nào!" : "Sẵn sàng cùng BiBi khám phá lịch sử chưa?";

  let html = `
  <div class="hero">
    ${mascotHTML()}
    <div class="speech">${heroLine}</div>
    <h2 class="hero-name">BiBi</h2>
    <p class="hero-sub">Người bạn dẫn đường xuyên thời gian</p>
  </div>
  <div class="stats-row">
    <div class="stat-card"><span style="color:var(--flame)">${ICON.flame}</span><b>${S.streak}</b><span>ngày liên tiếp</span></div>
    <div class="stat-card"><span style="color:var(--magenta)">${ICON.gem}</span><b>${S.xp}</b><span>điểm XP</span></div>
    <div class="stat-card"><span style="color:var(--heart)">${ICON.heart}</span><b>5</b><span>tim</span></div>
  </div>`;

  if(firstPlayable){
    html += `
    <button class="continue-card" data-open-lesson="${firstPlayable.id}">
      <div class="txt"><b>Tiếp tục học</b><span>${firstPlayable.title}</span></div>
      <span class="go">${ICON.arrow}</span>
    </button>`;
  }

  html += `<p class="grade-context">Đang học: <b>${g.title}</b> (${window.CAP[g.cap].label}). ${g.note}</p>`;

  g.chapters.forEach((ch, ci)=>{
    const scopeLabel = ch.scope==="vn" ? "Việt Nam" : ch.scope==="tg" ? "Thế giới" : "VN & Thế giới";
    html += `<div class="chapter">
      <div class="chapter-head"><span class="num">Chương ${ci+1}</span><h2>${ch.title}</h2><span class="chapter-scope ${ch.scope}">${scopeLabel}</span></div>
      <div class="node-grid">`;
    ch.nodes.forEach((n,i)=>{
      const state = nodeState(n);
      const face = n.review ? ICON.trophy : (state==="done" ? ICON.check : (state==="locked" ? ICON.lock : (i+1)));
      html += `<div class="node-wrap" data-state="${state}">
        <button class="node-btn" data-node="${n.id}" data-state2="${state}">
          <svg class="ring" viewBox="0 0 76 76"><circle cx="38" cy="38" r="33" fill="none" stroke="var(--line)" stroke-width="5"/>${state==="current"?'<circle cx="38" cy="38" r="33" fill="none" stroke="var(--purple)" stroke-width="5" stroke-linecap="round" stroke-dasharray="207" stroke-dashoffset="155"/>':''}</svg>
          <span class="node-face">${face}</span>
        </button>
        <span class="node-label">${n.title}</span>
      </div>`;
    });
    html += `</div></div>`;
  });

  $("#content").innerHTML = html;
  applyMascotImages();

  $("#content").querySelectorAll("[data-node]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-node");
      const state = btn.getAttribute("data-state2");
      if(state==="locked"){
        const isReview = btn.closest(".node-wrap").querySelector(".node-label").textContent.includes("Ôn tập");
        showToast(isReview ? "Hoàn thành các bài trước để mở khoá ôn tập" : "Bài này đang được BiBi biên soạn, sắp có nhé");
        return;
      }
      openLesson(id);
    });
  });
  $("#content").querySelectorAll("[data-open-lesson]").forEach(btn=>{
    btn.addEventListener("click", ()=>openLesson(btn.getAttribute("data-open-lesson")));
  });
}

/* ============================== RENDER: DICTIONARY (theo lớp đang chọn) ============================== */
function renderDict(){
  const g = currentGrade();
  const authoredLessons = [];
  g.chapters.forEach(ch=>ch.nodes.forEach(n=>{ if(n.authored) authoredLessons.push(n); }));
  let html = `<h2 class="section-title">Từ điển — ${g.title}</h2>`;
  if(!authoredLessons.length){
    html += `<p style="color:var(--muted-fg); font-size:.88rem;">Chưa có bài nào của ${g.title} được biên soạn xong, Từ điển sẽ đầy dần khi BiBi học xong từng bài.</p>`;
  } else {
    html += `<p style="color:var(--muted-fg); font-size:.84rem; margin-bottom:14px;">Các khái niệm chính đã học ở ${g.title}:</p>`;
    authoredLessons.forEach(n=>{
      html += `<div class="card dict-item"><div class="dict-badge">${ICON.book}</div><div><span class="era">${g.title}</span><b>${n.title}</b><p>Bấm vào bài "${n.title}" trong tab Học để ôn lại nội dung đầy đủ.</p></div></div>`;
    });
  }
  $("#content").innerHTML = html;
}

/* ============================== RENDER: REVIEW ============================== */
function renderReview(){
  const g = currentGrade();
  const cards = [];
  g.chapters.forEach(ch=>ch.nodes.forEach(n=>{
    if(n.authored && window.LESSONS[n.id]){
      const quiz = window.LESSONS[n.id].slides.find(s=>s.type==="quiz-mc");
      if(quiz) cards.push({ q: quiz.q, a: quiz.options[quiz.correct] });
    }
  }));
  let html = `<h2 class="section-title">Ôn tập — ${g.title}</h2>`;
  if(!cards.length){
    html += `<p style="color:var(--muted-fg); font-size:.88rem;">Học xong vài bài rồi quay lại đây ôn tập nhé!</p>`;
  } else {
    html += `<p style="color:var(--muted-fg); font-size:.84rem; margin-bottom:16px;">Bấm vào thẻ để lật xem đáp án.</p>`;
    cards.forEach((c,i)=>{
      html += `<div class="flash" data-flash="${i}"><div class="flash-inner">
        <div class="flash-face front"><span class="flash-tag">Câu hỏi</span>${c.q}</div>
        <div class="flash-face back"><span class="flash-tag">Đáp án</span>${c.a}</div>
      </div></div>`;
    });
  }
  $("#content").innerHTML = html;
  $("#content").querySelectorAll(".flash").forEach(f=>f.addEventListener("click", ()=>f.classList.toggle("flip")));
}

/* ============================== RENDER: CHAT (Hỏi BiBi) ============================== */
function renderChat(){
  const g = currentGrade();
  let html = `<h2 class="section-title">Hỏi BiBi</h2><div class="chat-scroll">
    <div class="bubble bibi"><b>BIBI</b>Chào bạn! Mình là BiBi. Đang học ${g.title} à? Có gì thắc mắc về lịch sử cứ hỏi mình nhé!</div>
  </div>
  <div class="chat-input">
    <input type="text" placeholder="Hỏi BiBi bất cứ điều gì về lịch sử…" id="chatInput"/>
    <button id="chatSend">${ICON.send}</button>
  </div>
  <p class="chat-note">Bản dựng đầu — BiBi sẽ trả lời bằng AI thật ở bản kế tiếp, giống Gọi Mon.L.</p>`;
  $("#content").innerHTML = html;
  const input = $("#chatInput");
  $("#chatSend").addEventListener("click", ()=>{
    if(!input.value.trim()) return;
    const scroll = $(".chat-scroll");
    scroll.appendChild(el(`<div class="bubble me">${input.value.trim()}</div>`));
    input.value="";
    setTimeout(()=>{
      scroll.appendChild(el(`<div class="bubble bibi"><b>BIBI</b>Mình đang được huấn luyện thêm để trả lời chính xác mọi câu hỏi lịch sử — chờ bản cập nhật tiếp theo nhé!</div>`));
      scroll.scrollTop = scroll.scrollHeight;
    }, 500);
  });
}

/* ============================== RENDER: RANK ============================== */
function renderRank(){
  const rows = [
    {name:"Minh Thư", xp:520}, {name:"Gia Bảo", xp:410}, {name:"Bạn", xp:S.xp, me:true},
    {name:"Hoài An", xp:180}, {name:"Đức Anh", xp:90},
  ].sort((a,b)=>b.xp-a.xp);
  let html = `<h2 class="section-title">Bảng xếp hạng tuần</h2><div class="card">`;
  rows.forEach((r,i)=>{
    html += `<div class="rank-row ${r.me?"me":""}">
      <span class="rank-num">${i+1}</span>
      <span class="rank-av">${r.name.split(" ").slice(-1)[0][0]}</span>
      <span class="rank-name">${r.name}</span>
      <span class="rank-xp">${r.xp} XP</span>
    </div>`;
  });
  html += `</div>`;
  $("#content").innerHTML = html;
}

/* ============================== RENDER: PROFILE ============================== */
function renderProfile(){
  const dows = ["T2","T3","T4","T5","T6","T7","CN"];
  const doneDays = [1,2,3,4];
  let cal = dows.map(d=>`<div class="cal-dow">${d}</div>`).join("");
  const today = new Date(); const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
  for(let d=1; d<=daysInMonth; d++){ cal += `<div class="cal-cell ${doneDays.includes(d)?"done":""}">${doneDays.includes(d)?ICON.flame.replace('viewBox','style="width:14px;height:14px" viewBox'):d}</div>`; }
  const html = `
  <div class="profile-head">
    <div class="profile-av">${mascotHTML("")}</div>
    <div><h2 style="font-size:1.2rem">Người học BiBi History</h2><p style="color:var(--muted-fg); font-size:.82rem; font-weight:600;">Đang học ${currentGrade().title}</p></div>
  </div>
  <div class="stats-row">
    <div class="stat-card"><span style="color:var(--flame)">${ICON.flame}</span><b>${S.streak}</b><span>ngày liên tiếp</span></div>
    <div class="stat-card"><span style="color:var(--magenta)">${ICON.gem}</span><b>${S.xp}</b><span>điểm XP</span></div>
    <div class="stat-card"><span style="color:var(--purple)">${ICON.book}</span><b>${Object.keys(S.done).length}</b><span>bài đã học</span></div>
  </div>
  <h3 style="font-size:1rem; margin:6px 0 4px;">Tháng này</h3>
  <div class="cal-grid">${cal}</div>`;
  $("#content").innerHTML = html;
  const av = $(".profile-av"); if(av.querySelector("svg")){ av.querySelector("svg").style.width="34px"; av.querySelector("svg").style.height="34px"; }
}

/* ============================== TABS ============================== */
const TABS = [
  {id:"home", label:"Học", icon:ICON.book, render:renderHome},
  {id:"dict", label:"Từ điển", icon:ICON.cards, render:renderDict},
  {id:"review", label:"Ôn tập", icon:ICON.refresh, render:renderReview},
  {id:"chat", label:"Hỏi BiBi", icon:ICON.chat, render:renderChat},
  {id:"rank", label:"Xếp hạng", icon:ICON.trophy, render:renderRank},
  {id:"profile", label:"Hồ sơ", icon:ICON.user, render:renderProfile},
];

function renderTabbar(){
  $("#tabbar").innerHTML = TABS.map(t=>`
    <button class="tab ${S.tab===t.id?"active":""}" data-tab="${t.id}">${t.icon}<span>${t.label}</span></button>
  `).join("");
  $("#tabbar").querySelectorAll("[data-tab]").forEach(b=>{
    b.addEventListener("click", ()=>{ S.tab=b.getAttribute("data-tab"); renderTabbar(); TABS.find(t=>t.id===S.tab).render(); $("#content").scrollTop=0; });
  });
}

function renderTopStats(){
  $("#streakPill").innerHTML = `${ICON.flame}${S.streak}`;
  $("#xpPill").innerHTML = `${ICON.gem}${S.xp}`;
  $("#themeBtn").innerHTML = S.theme==="dark" ? ICON.sun : ICON.moon;
  const g = currentGrade();
  const gradeBtn = $("#gradeBtn");
  gradeBtn.textContent = g.title;
  gradeBtn.style.background = window.CAP[g.cap].color;
}

/* ============================== THEME ============================== */
function applyTheme(){
  document.documentElement.setAttribute("data-theme", S.theme);
}
$("#themeBtn").addEventListener("click", ()=>{
  S.theme = S.theme==="dark" ? "light" : "dark";
  applyTheme();
  renderTopStats();
});

/* ============================== GRADE PICKER (màn riêng) ============================== */
function openGradePicker(){
  const groups = { th:[], thcs:[], thpt:[] };
  window.GRADES.forEach((g,i)=>{ groups[g.cap].push({g,i}); });
  let html = `<div class="gp-top"><h2>Chọn lớp học</h2><button class="gp-close" id="gpClose">${ICON.x}</button></div><div class="gp-list">`;
  ["th","thcs","thpt"].forEach(capKey=>{
    if(!groups[capKey].length) return;
    html += `<div class="gp-cap">${window.CAP[capKey].label}</div>`;
    groups[capKey].forEach(({g,i})=>{
      const lessonCount = g.chapters.reduce((n,ch)=>n+ch.nodes.filter(x=>x.authored).length,0);
      html += `<button class="gp-item ${i===S.gradeIdx?"active":""}" data-grade-idx="${i}">
        <span class="gp-badge" style="background:${window.CAP[g.cap].color}">${g.title.replace("Lớp ","")}</span>
        <span class="gp-txt"><b>${g.title}</b><span>${lessonCount>0 ? lessonCount+" bài đã có nội dung" : "Sắp có nội dung"}</span></span>
      </button>`;
    });
  });
  html += `</div>`;
  $("#gradePicker").innerHTML = html;
  $("#gradePicker").hidden = false;
  $("#gpClose").addEventListener("click", closeGradePicker);
  $("#gradePicker").querySelectorAll("[data-grade-idx]").forEach(b=>{
    b.addEventListener("click", ()=>{
      S.gradeIdx = +b.getAttribute("data-grade-idx");
      closeGradePicker();
      renderTopStats();
      TABS.find(t=>t.id===S.tab).render();
    });
  });
}
function closeGradePicker(){ $("#gradePicker").hidden = true; }
$("#gradeBtn").addEventListener("click", openGradePicker);

/* ============================== LESSON PLAYER ============================== */
let LP = null;

function openLesson(id){
  const data = window.LESSONS[id];
  if(!data){ showToast("Bài đang được BiBi biên soạn, sắp có nhé"); return; }
  LP = { id, i:0, hearts:5, xpGain:0 };
  $("#lessonOverlay").hidden = false;
  renderSlide();
}
function closeLesson(){ $("#lessonOverlay").hidden = true; LP=null; TABS.find(t=>t.id===S.tab).render(); }

function kindLabel(slide){
  return {intro:"Mở đầu", fact:"Kiến thức", marker:"Biển sử liệu", heritage:"Góc di sản", "quiz-mc":"Câu hỏi", "quiz-fill":"Điền vào chỗ trống"}[slide.type] || "";
}
function renderHearts(){
  let h="";
  for(let i=0;i<5;i++) h += i<LP.hearts ? ICON.heart : ICON.heart.replace('<svg ','<svg class="lost" ');
  return h;
}

function renderSlide(){
  const data = window.LESSONS[LP.id];
  const slide = data.slides[LP.i];
  const pct = Math.round((LP.i)/data.slides.length*100);
  let body = "";
  let footer = `<button class="btn-primary" id="nextBtn">Tiếp theo</button>`;

  if(slide.type==="intro"){
    body = `<div class="lesson-sky">${mascotHTML()}</div>
      <h2 class="lesson-title">${data.title}</h2>
      <div class="lesson-txt">${slide.text}</div>`;
  } else if(slide.type==="fact"){
    body = `<div class="fact-card">
      <div class="fact-icon">${ICON[slide.icon] || ICON.book}</div>
      <div><span class="meta">${slide.meta}</span><h3>${slide.title}</h3><p>${slide.text}</p></div>
    </div>`;
  } else if(slide.type==="marker"){
    body = `<div class="marker"><span class="marker-tag">${slide.tag}</span>${slide.text.map(p=>`<p>${p}</p>`).join("")}</div>`;
  } else if(slide.type==="heritage"){
    body = `<div class="heritage">
      <div class="heritage-top">${ICON[slide.icon] || ICON.drum}<b>${slide.title}</b></div>
      <div class="heritage-bottom">${slide.text}</div>
    </div>`;
  } else if(slide.type==="quiz-mc"){
    body = `<h3 style="font-size:1.05rem; margin-bottom:16px; text-align:center;">${slide.q}</h3>
      <div class="opt-list">${slide.options.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join("")}</div>`;
    footer = `<button class="btn-primary" id="checkBtn" disabled>Kiểm tra</button>`;
  } else if(slide.type==="quiz-fill"){
    const parts = slide.sentence;
    let sentenceHtml = parts[0];
    for(let i=0;i<slide.blanks.length;i++){
      sentenceHtml += `<span class="blank-slot" data-slot="${i}">?</span>` + (parts[i+1]||"");
    }
    body = `<h3 style="font-size:1.05rem; margin-bottom:6px; text-align:center;">Điền vào chỗ trống</h3>
      <div class="blank-sentence">${sentenceHtml}</div>
      <div class="wordbank">${slide.bank.map((w,i)=>`<button class="chip" data-w="${i}">${w}</button>`).join("")}</div>`;
    footer = `<button class="btn-primary" id="checkBtn" disabled>Kiểm tra</button>`;
  }

  $("#lessonOverlay").innerHTML = `
    <div class="lesson-top">
      <div class="lesson-top-row">
        <button class="lesson-close" id="lcClose">${ICON.x}</button>
        <div class="hearts">${renderHearts()}</div>
      </div>
      <span class="lesson-kind">${kindLabel(slide)}</span>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="lesson-body" id="lessonBody">${body}</div>
    <div class="lesson-foot" id="lessonFoot">${footer}</div>
  `;
  $("#lcClose").addEventListener("click", closeLesson);
  applyMascotImages();

  if(slide.type==="quiz-mc") wireQuizMC(slide);
  else if(slide.type==="quiz-fill") wireQuizFill(slide);
  else $("#nextBtn").addEventListener("click", advance);
}

function advance(){
  const data = window.LESSONS[LP.id];
  LP.i++;
  if(LP.i >= data.slides.length){ finishLesson(); return; }
  renderSlide();
}

function wireQuizMC(slide){
  let selected = null, checked=false;
  const opts = [...document.querySelectorAll(".opt")];
  const checkBtn = $("#checkBtn");
  opts.forEach(o=>o.addEventListener("click", ()=>{
    if(checked) return;
    selected = +o.getAttribute("data-i");
    opts.forEach(x=>x.classList.remove("sel"));
    o.classList.add("sel");
    checkBtn.disabled = false;
  }));
  checkBtn.addEventListener("click", ()=>{
    if(checked){ advance(); return; }
    checked = true;
    const ok = selected === slide.correct;
    opts.forEach((o,i)=>{
      o.disabled = true;
      if(i===slide.correct) o.classList.add("ok");
      else if(i===selected) o.classList.add("bad");
    });
    if(ok){ LP.xpGain += 10; } else { LP.hearts = Math.max(0, LP.hearts-1); }
    document.querySelector(".hearts").innerHTML = renderHearts();
    checkBtn.textContent = "Tiếp theo";
    showFeedbackNote(ok, ok ? "Chính xác!" : "Đáp án đúng là: " + slide.options[slide.correct]);
  });
}

function wireQuizFill(slide){
  const slots = slide.blanks.map(()=>null);
  let checked=false;
  const chips = [...document.querySelectorAll(".chip")];
  const checkBtn = $("#checkBtn");
  function refresh(){
    slide.blanks.forEach((_,i)=>{
      const s = document.querySelector(`.blank-slot[data-slot="${i}"]`);
      if(s) s.textContent = slots[i]===null ? "?" : slide.bank[slots[i]];
    });
    checkBtn.disabled = slots.some(v=>v===null);
  }
  chips.forEach(c=>c.addEventListener("click", ()=>{
    if(checked || c.disabled) return;
    const emptyIdx = slots.findIndex(v=>v===null);
    if(emptyIdx===-1) return;
    slots[emptyIdx] = +c.getAttribute("data-w");
    c.disabled = true;
    refresh();
  }));
  checkBtn.addEventListener("click", ()=>{
    if(checked){ advance(); return; }
    checked = true;
    const ok = slots.every((v,i)=> slide.bank[v]===slide.blanks[i]);
    if(ok){ LP.xpGain += 10; } else { LP.hearts = Math.max(0, LP.hearts-1); }
    document.querySelector(".hearts").innerHTML = renderHearts();
    checkBtn.textContent = "Tiếp theo";
    showFeedbackNote(ok, ok ? "Chính xác!" : "Đáp án đúng: " + slide.blanks.join(", "));
  });
}

function showFeedbackNote(ok, text){
  const foot = $("#lessonFoot");
  const note = el(`<div class="feedback-row ${ok?"ok":"bad"}">${ok?ICON.ok:ICON.bad}<span>${text}</span></div>`);
  foot.insertBefore(note, foot.firstChild);
}

function finishLesson(){
  const data = window.LESSONS[LP.id];
  S.done[LP.id] = true;
  S.xp += LP.xpGain;
  $("#lessonOverlay").innerHTML = `
    <div class="lesson-body" style="justify-content:center;">
      <div class="finish-wrap">
        ${mascotHTML()}
        <h2>Hoàn thành bài học!</h2>
        <p style="color:var(--muted-fg); margin-top:6px;">${data.title}</p>
        <div class="finish-stats">
          <div class="finish-stat"><b style="color:var(--magenta)">+${LP.xpGain}</b><span>XP</span></div>
          <div class="finish-stat"><b style="color:var(--heart)">${LP.hearts}/5</b><span>Tim còn lại</span></div>
        </div>
      </div>
    </div>
    <div class="lesson-foot"><button class="btn-primary" id="doneBtn">Tuyệt vời!</button></div>
  `;
  applyMascotImages();
  $("#doneBtn").addEventListener("click", closeLesson);
}

/* ============================== INIT ============================== */
applyTheme();
renderTabbar();
renderTopStats();
renderHome();
applyMascotImages();

})();
