(() => {
  'use strict';

  /* ================= ESCAPE IN-APP BROWSERS (Zalo/Facebook/Instagram...) =====
   * Chat-app in-app webviews can't show the "Add to Home Screen" install
   * prompt at all — thầy shares this link straight into Zalo/FB/Messenger
   * groups, so most students/parents arrive from inside one of these. Jump
   * straight to the real browser automatically, no manual tap required:
   * Android's intent:// scheme reliably re-launches the URL in Chrome;
   * iOS's x-safari-https:// scheme does the same for Safari and also works
   * in most in-app webviews (Zalo, Messenger, Line, ...). A handful of apps
   * (notably Facebook/Instagram's own) block that scheme outright — for
   * those, and only those, fall back to a manual "open in Safari" banner
   * since no script can force an escape there. */
  (function escapeInAppBrowser() {
    if (window.electronAPI) return; // desktop app, not a mobile in-app webview
    const ua = navigator.userAgent || '';
    const isInApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Zalo|MicroMessenger|TikTok/i.test(ua);
    if (!isInApp) return;
    const { protocol, host, pathname, search } = window.location;
    if (/android/i.test(ua)) {
      const intentUrl = `intent://${host}${pathname}${search}#Intent;scheme=${protocol.slice(0, -1)};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;
      window.location.href = intentUrl;
      return;
    }
    window.location.href = `x-safari-${protocol}//${host}${pathname}${search}`;
    // If the scheme above actually launched Safari, this tab backgrounds
    // immediately and the page below never becomes visible to the user —
    // this timer only matters for the apps that silently blocked it.
    setTimeout(() => {
      if (document.hidden) return;
      const banner = document.createElement('div');
      banner.className = 'inapp-escape-banner';
      banner.innerHTML = `
        <span>Đang mở trong ứng dụng chat nên chưa cài vào màn hình chính được — bấm <strong>⋯</strong> ở góc màn hình rồi chọn <strong>"Mở bằng trình duyệt"</strong> (Safari) nhé!</span>
        <button type="button" id="btnCopyGameLink">Sao chép link</button>
      `;
      document.body.prepend(banner);
      const btn = document.getElementById('btnCopyGameLink');
      btn.addEventListener('click', () => {
        (navigator.clipboard && navigator.clipboard.writeText(window.location.href).then(() => {
          btn.textContent = 'Đã sao chép!';
          setTimeout(() => { btn.textContent = 'Sao chép link'; }, 2000);
        })) || Promise.resolve();
      });
    }, 800);
  })();

  /* ================= MASCOT & TEACHER SETTINGS ================= */
  let teacherName = 'Thầy Đinh Thi Ai';
  let avatarDataUrl = null;

  // Web build (no Electron main process): persist settings in localStorage
  // and send the same install ping the desktop app sends, via fetch.
  const IS_WEB = !window.electronAPI;
  const WEB_APP_VERSION = 'web-1.0.0';

  function webGetInstallId() {
    let id = localStorage.getItem('tvc_installId');
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
      localStorage.setItem('tvc_installId', id);
    }
    return id;
  }

  function webSendPing() {
    try {
      fetch('/api/game/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: 'toan-vui-cap1',
          installId: webGetInstallId(),
          licenseKey: null,
          teacherName,
          appVersion: WEB_APP_VERSION,
        }),
      }).catch(() => {});
    } catch (e) { /* offline or blocked — never affect the game */ }
  }

  function webDownscaleImageFile(file, maxSize) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function setMascot(el, mood) {
    if (!el) return;
    const src = avatarDataUrl || 'assets/thay-avatar.png';
    el.innerHTML = `<img class="mascot-photo mood-${mood}" src="${src}" alt="${teacherName}" />`;
  }

  function applyTeacherName() {
    document.querySelectorAll('.js-teacher-name').forEach((el) => { el.textContent = teacherName; });
    const breakHeading = document.getElementById('breakHeading');
    if (breakHeading) breakHeading.textContent = `Đố vui cùng ${teacherName}`;
  }

  /* ================= AUDIO ================= */
  let audioCtx = null;
  let muted = localStorage.getItem('mathgame_muted') === '1';

  function ctx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function tone(freq, start, dur, type = 'sine', peak = 0.16) {
    if (muted) return;
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = c.currentTime + start;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noiseBurst(start, dur, peak, filterFreq) {
    if (muted) return;
    const c = ctx();
    const size = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, size, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;
    const gain = c.createGain();
    const t0 = c.currentTime + start;
    gain.gain.setValueAtTime(peak, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  function applause() {
    const clapCount = 12;
    for (let i = 0; i < clapCount; i++) {
      const t = i * 0.045 + Math.random() * 0.02;
      const freq = 1800 + Math.random() * 1500;
      noiseBurst(t, 0.09 + Math.random() * 0.03, 0.22 + Math.random() * 0.1, freq);
    }
  }

  function bellDing(freq, start, peak) {
    tone(freq, start, 0.3, 'sine', peak);
    tone(freq * 2.4, start, 0.14, 'sine', peak * 0.35);
  }

  const sfx = {
    click() { tone(700, 0, 0.1, 'triangle', 0.22); },
    correct() {
      bellDing(1567.98, 0, 0.3);
      bellDing(1975.53, 0.12, 0.3);
      applause();
    },
    wrong() { tone(220, 0, 0.12, 'sawtooth', 0.22); tone(140, 0.09, 0.24, 'sawtooth', 0.2); },
    win() { tone(523, 0, 0.15, 'sine', 0.24); tone(659, 0.14, 0.15, 'sine', 0.24); tone(784, 0.28, 0.15, 'sine', 0.24); tone(1046, 0.42, 0.3, 'sine', 0.26); },
  };

  /* ================= QUESTION GENERATION ================= */
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

  const OP_SYMBOL = { add: '+', sub: '−', mul: '×', div: '÷' };

  function fmtNum(n) {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(1).replace('.', ',');
  }

  function genByGradeOp(grade, op) {
    let a, b, ans, decimal = false;
    switch (grade) {
      case 1:
        // Neither operand is ever 0 for +/− (randInt starts at 1, not 0) —
        // "5 + 0" or "5 − 0" is trivial and not worth a practice slot.
        if (op === 'add') { a = randInt(1, 19); b = randInt(1, 20 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(1, 20); b = randInt(1, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(1, 5); b = randInt(1, 5); ans = a * b; }
        else { const d = randInt(1, 5), q = randInt(1, 5); a = d * q; b = d; ans = q; }
        break;
      case 2:
        if (op === 'add') { a = randInt(1, 99); b = randInt(1, 100 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(1, 100); b = randInt(1, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(2, 5); b = randInt(1, 10); ans = a * b; }
        else { const d = randInt(2, 5), q = randInt(1, 10); a = d * q; b = d; ans = q; }
        break;
      case 3:
        if (op === 'add') { a = randInt(1, 999); b = randInt(1, 1000 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(1, 1000); b = randInt(1, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(2, 9); b = randInt(2, 9); ans = a * b; }
        else { const d = randInt(2, 9), q = randInt(2, 9); a = d * q; b = d; ans = q; }
        break;
      case 4:
        if (op === 'add') { a = randInt(1, 9999); b = randInt(1, 10000 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(1, 10000); b = randInt(1, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(11, 99); b = randInt(2, 12); ans = a * b; }
        else { const d = randInt(2, 12), q = randInt(5, 50); a = d * q; b = d; ans = q; }
        break;
      default: // grade 5
        if (op === 'add') {
          if (Math.random() < 0.5) {
            a = randInt(1, 999) / 10; b = randInt(1, 999) / 10;
            a = Math.round(a * 10) / 10; b = Math.round(b * 10) / 10;
            ans = Math.round((a + b) * 10) / 10; decimal = true;
          } else { a = randInt(1000, 90000); b = randInt(1, 100000 - a); ans = a + b; }
        } else if (op === 'sub') {
          if (Math.random() < 0.5) {
            a = randInt(10, 999) / 10; b = randInt(1, a * 10) / 10;
            a = Math.round(a * 10) / 10; b = Math.round(b * 10) / 10;
            if (b > a) [a, b] = [b, a];
            ans = Math.round((a - b) * 10) / 10; decimal = true;
          } else { a = randInt(1000, 100000); b = randInt(1, a); ans = a - b; }
        } else if (op === 'mul') { a = randInt(12, 99); b = randInt(2, 12); ans = a * b; }
        else { const d = randInt(2, 12), q = randInt(10, 99); a = d * q; b = d; ans = q; }
        break;
    }
    return { a, b, ans, op, decimal };
  }

  function makeDistractors(correct, decimal) {
    const used = new Set([correct]);
    const out = [];
    let guard = 0;
    while (out.length < 3 && guard < 50) {
      guard++;
      let val;
      if (decimal) {
        const delta = Math.round((Math.random() * 2 + 0.1) * 10) / 10 * (Math.random() < 0.5 ? -1 : 1);
        val = Math.round((correct + delta) * 10) / 10;
        if (val < 0) val = Math.round((Math.abs(correct) + Math.random() * 3 + 0.1) * 10) / 10;
      } else {
        const magnitude = Math.max(2, Math.abs(correct));
        const maxDelta = Math.max(2, Math.round(magnitude * 0.3));
        const delta = randInt(1, maxDelta) * (Math.random() < 0.5 ? -1 : 1);
        val = correct + delta;
        if (val < 0) val = correct + Math.abs(delta) + 1;
      }
      if (!used.has(val)) { used.add(val); out.push(val); }
    }
    return out;
  }

  function generateQuestion(grade, opChoice) {
    const op = opChoice === 'mix' ? pick(['add', 'sub', 'mul', 'div']) : opChoice;
    const { a, b, ans, decimal } = genByGradeOp(grade, op);
    const distractors = makeDistractors(ans, decimal);
    const choices = [ans, ...distractors].sort(() => Math.random() - 0.5);
    return {
      text: `${fmtNum(a)} ${OP_SYMBOL[op]} ${fmtNum(b)}`,
      answer: ans,
      choices,
    };
  }

  /* ================= WORD PROBLEMS (toán đố) ================= */
  const WORD_PROBLEMS = {
    1: [
      { text: 'Lan có 5 cái kẹo. Mẹ cho thêm 3 cái kẹo nữa. Hỏi Lan có tất cả bao nhiêu cái kẹo?', answer: 8, solution: 'Số kẹo Lan có tất cả là: 5 + 3 = 8 (cái kẹo).', tip: 'Mẹo: đếm thêm 3 từ số 5 → 6, 7, 8. Không cần đếm lại từ đầu!' },
      { text: 'Trong chuồng có 9 con gà. Mẹ bán đi 4 con gà. Hỏi trong chuồng còn lại bao nhiêu con gà?', answer: 5, solution: 'Số gà còn lại là: 9 − 4 = 5 (con gà).', tip: 'Mẹo: nhớ 4 + 5 = 9 nên suy ra ngay 9 − 4 = 5 — cộng và trừ luôn là "cặp đôi" của nhau.' },
      { text: 'An có 6 quyển vở, Bình có 7 quyển vở. Hỏi cả hai bạn có bao nhiêu quyển vở?', answer: 13, solution: 'Số vở cả hai bạn có là: 6 + 7 = 13 (quyển vở).', tip: 'Mẹo: tách 7 = 4 + 3, lấy 6 + 4 = 10 (tròn chục) rồi + 3 = 13.' },
      { text: 'Trên cây có 10 quả táo. Gió thổi rụng mất 3 quả. Hỏi trên cây còn lại bao nhiêu quả táo?', answer: 7, solution: 'Số táo còn lại là: 10 − 3 = 7 (quả táo).', tip: 'Mẹo: 10 là số tròn chục nên trừ rất dễ — chỉ cần nhớ bảng trừ trong 10: 10 − 3 = 7.' },
      { text: 'Hoa có 4 bông hoa đỏ và 5 bông hoa vàng. Hỏi Hoa có tất cả bao nhiêu bông hoa?', answer: 9, solution: 'Số hoa Hoa có tất cả là: 4 + 5 = 9 (bông hoa).', tip: 'Mẹo: đổi chỗ hai số, cộng số lớn trước (5 + 4) cho dễ nhẩm — kết quả vẫn là 9.' },
      { text: 'Lớp có 15 bạn, trong đó có 8 bạn nam. Hỏi lớp có bao nhiêu bạn nữ?', answer: 7, solution: 'Số bạn nữ là: 15 − 8 = 7 (bạn nữ).', tip: 'Mẹo: tách 15 = 8 + 7, nên 15 − 8 chính là phần còn lại = 7.' },
      { text: 'Mai có 8 cái bút chì. Mai cho bạn 3 cái. Hỏi Mai còn lại bao nhiêu cái bút chì?', answer: 5, solution: 'Số bút chì còn lại là: 8 − 3 = 5 (cái bút chì).', tip: 'Mẹo: đếm lùi 3 bước từ 8: 7, 6, 5.' },
      { text: 'Trong bể có 6 con cá vàng và 6 con cá chép. Hỏi trong bể có tất cả bao nhiêu con cá?', answer: 12, solution: 'Số cá có tất cả là: 6 + 6 = 12 (con cá).', tip: 'Mẹo: hai số giống nhau cộng với nhau là "gấp đôi" — gấp đôi 6 là 12.' },
      { text: 'Bình có 7 viên bi. Bạn cho Bình thêm 6 viên bi nữa. Hỏi Bình có tất cả bao nhiêu viên bi?', answer: 13, solution: 'Số bi Bình có tất cả là: 7 + 6 = 13 (viên bi).', tip: 'Mẹo: tách 6 = 3 + 3, lấy 7 + 3 = 10 (tròn chục) rồi + 3 = 13.' },
      { text: 'Có 14 con chim đậu trên cành. 5 con bay đi. Hỏi trên cành còn lại bao nhiêu con chim?', answer: 9, solution: 'Số chim còn lại là: 14 − 5 = 9 (con chim).', tip: 'Mẹo: tách 5 = 4 + 1, lấy 14 − 4 = 10 (tròn chục) rồi − 1 = 9.' },
      { text: 'Nam có 9 cái kẹo, Hùng có 8 cái kẹo. Hỏi cả hai bạn có bao nhiêu cái kẹo?', answer: 17, solution: 'Số kẹo cả hai bạn có là: 9 + 8 = 17 (cái kẹo).', tip: 'Mẹo: tách 8 = 1 + 7, lấy 9 + 1 = 10 (tròn chục) rồi + 7 = 17.' },
      { text: 'Có 16 quả bóng bay, bị vỡ mất 7 quả. Hỏi còn lại bao nhiêu quả bóng bay?', answer: 9, solution: 'Số bóng bay còn lại là: 16 − 7 = 9 (quả bóng bay).', tip: 'Mẹo: tách 7 = 6 + 1, lấy 16 − 6 = 10 (tròn chục) rồi − 1 = 9.' },
      { text: 'Lớp có 8 bạn nam và 9 bạn nữ. Hỏi lớp có tất cả bao nhiêu bạn?', answer: 17, solution: 'Số bạn có tất cả là: 8 + 9 = 17 (bạn).', tip: 'Mẹo: tách 9 = 2 + 7, lấy 8 + 2 = 10 (tròn chục) rồi + 7 = 17.' },
      { text: 'Mẹ mua 12 quả trứng, đã dùng hết 4 quả. Hỏi còn lại bao nhiêu quả trứng?', answer: 8, solution: 'Số trứng còn lại là: 12 − 4 = 8 (quả trứng).', tip: 'Mẹo: tách 4 = 2 + 2, lấy 12 − 2 = 10 (tròn chục) rồi − 2 = 8.' },
      { text: 'Có 5 con thỏ trắng và 9 con thỏ nâu. Hỏi có tất cả bao nhiêu con thỏ?', answer: 14, solution: 'Số thỏ có tất cả là: 5 + 9 = 14 (con thỏ).', tip: 'Mẹo: tách 9 = 5 + 4, lấy 5 + 5 = 10 (tròn chục) rồi + 4 = 14.' },
      { text: 'Bé có 18 cái kẹo, bé ăn hết 9 cái. Hỏi bé còn lại bao nhiêu cái kẹo?', answer: 9, solution: 'Số kẹo còn lại là: 18 − 9 = 9 (cái kẹo).', tip: 'Mẹo: 9 + 9 = 18 nên 18 − 9 chính là 9 — hai số bằng nhau!' },
    ],
    2: [
      { text: 'Một cửa hàng có 45 quyển sách. Cửa hàng nhập thêm 27 quyển sách nữa. Hỏi cửa hàng có tất cả bao nhiêu quyển sách?', answer: 72, solution: 'Số sách có tất cả là: 45 + 27 = 72 (quyển sách).' },
      { text: 'Lớp 2A có 38 học sinh, lớp 2B có 34 học sinh. Hỏi cả hai lớp có bao nhiêu học sinh?', answer: 72, solution: 'Số học sinh cả hai lớp là: 38 + 34 = 72 (học sinh).' },
      { text: 'Một trại có 62 con vịt. Người ta bán đi 25 con vịt. Hỏi trại còn lại bao nhiêu con vịt?', answer: 37, solution: 'Số vịt còn lại là: 62 − 25 = 37 (con vịt).' },
      { text: 'Mỗi hộp có 5 cái bánh. Hỏi 4 hộp như vậy có bao nhiêu cái bánh?', answer: 20, solution: 'Số bánh có tất cả là: 5 × 4 = 20 (cái bánh).' },
      { text: 'Có 18 quả cam chia đều vào 3 túi. Hỏi mỗi túi có bao nhiêu quả cam?', answer: 6, solution: 'Số cam mỗi túi có là: 18 : 3 = 6 (quả cam).' },
      { text: 'An gấp được 24 chiếc thuyền giấy, Bình gấp được 19 chiếc. Hỏi cả hai bạn gấp được bao nhiêu chiếc thuyền giấy?', answer: 43, solution: 'Số thuyền cả hai bạn gấp được là: 24 + 19 = 43 (chiếc thuyền).' },
      { text: 'Một đàn ong có 56 con, bay đi mất 18 con. Hỏi đàn ong còn lại bao nhiêu con?', answer: 38, solution: 'Số ong còn lại là: 56 − 18 = 38 (con ong).' },
      { text: 'Mỗi bàn có 4 bạn ngồi. Hỏi 6 bàn như vậy có bao nhiêu bạn?', answer: 24, solution: 'Số bạn có tất cả là: 4 × 6 = 24 (bạn).' },
      { text: 'Một rổ có 34 quả chanh, thêm vào 28 quả nữa. Hỏi rổ có tất cả bao nhiêu quả chanh?', answer: 62, solution: 'Số chanh có tất cả là: 34 + 28 = 62 (quả chanh).' },
      { text: 'Cửa hàng có 80 cái bánh, đã bán 35 cái. Hỏi còn lại bao nhiêu cái bánh?', answer: 45, solution: 'Số bánh còn lại là: 80 − 35 = 45 (cái bánh).' },
      { text: 'Mỗi túi có 3 quả xoài. Hỏi 7 túi như vậy có bao nhiêu quả xoài?', answer: 21, solution: 'Số xoài có tất cả là: 3 × 7 = 21 (quả xoài).' },
      { text: 'Có 24 cái cốc chia đều vào 4 khay. Hỏi mỗi khay có bao nhiêu cái cốc?', answer: 6, solution: 'Số cốc mỗi khay có là: 24 : 4 = 6 (cái cốc).' },
      { text: 'Một trại nuôi 46 con gà, mua thêm 27 con. Hỏi trại có tất cả bao nhiêu con gà?', answer: 73, solution: 'Số gà có tất cả là: 46 + 27 = 73 (con gà).' },
      { text: 'Kho có 90 bao gạo, đã chuyển đi 48 bao. Hỏi kho còn lại bao nhiêu bao gạo?', answer: 42, solution: 'Số bao gạo còn lại là: 90 − 48 = 42 (bao gạo).' },
      { text: 'Mỗi đĩa có 4 cái bánh quy. Hỏi 8 đĩa như vậy có bao nhiêu cái bánh quy?', answer: 32, solution: 'Số bánh quy có tất cả là: 4 × 8 = 32 (cái bánh quy).' },
      { text: 'Có 40 cây bút chia đều cho 5 bạn. Hỏi mỗi bạn được bao nhiêu cây bút?', answer: 8, solution: 'Số bút mỗi bạn được là: 40 : 5 = 8 (cây bút).' },
    ],
    3: [
      { text: 'Một thùng có 8 hộp bút, mỗi hộp có 9 cái bút. Hỏi thùng đó có tất cả bao nhiêu cái bút?', answer: 72, solution: 'Số bút có tất cả là: 9 × 8 = 72 (cái bút).' },
      { text: 'Có 63 quyển vở chia đều cho 7 bạn. Hỏi mỗi bạn được bao nhiêu quyển vở?', answer: 9, solution: 'Số vở mỗi bạn được là: 63 : 7 = 9 (quyển vở).' },
      { text: 'Một trường học có 456 học sinh nam và 389 học sinh nữ. Hỏi trường đó có tất cả bao nhiêu học sinh?', answer: 845, solution: 'Số học sinh có tất cả là: 456 + 389 = 845 (học sinh).' },
      { text: 'Kho có 720 kg gạo, đã bán đi 285 kg. Hỏi kho còn lại bao nhiêu ki-lô-gam gạo?', answer: 435, solution: 'Số gạo còn lại là: 720 − 285 = 435 (kg gạo).' },
      { text: 'Mỗi xe chở được 6 thùng hàng. Hỏi 7 xe như vậy chở được bao nhiêu thùng hàng?', answer: 42, solution: 'Số thùng hàng chở được là: 6 × 7 = 42 (thùng hàng).' },
      { text: 'Có 54 học sinh xếp đều thành 6 hàng. Hỏi mỗi hàng có bao nhiêu học sinh?', answer: 9, solution: 'Số học sinh mỗi hàng là: 54 : 6 = 9 (học sinh).' },
      { text: 'Một cửa hàng bán được 235 cái áo vào buổi sáng và 168 cái áo vào buổi chiều. Hỏi cả ngày cửa hàng bán được bao nhiêu cái áo?', answer: 403, solution: 'Số áo bán được cả ngày là: 235 + 168 = 403 (cái áo).' },
      { text: 'Đội văn nghệ có 9 tổ, mỗi tổ có 7 bạn. Hỏi đội văn nghệ có tất cả bao nhiêu bạn?', answer: 63, solution: 'Số bạn có tất cả là: 7 × 9 = 63 (bạn).' },
      { text: 'Một kệ sách có 6 hàng, mỗi hàng 8 quyển sách. Hỏi kệ có tất cả bao nhiêu quyển sách?', answer: 48, solution: 'Số sách có tất cả là: 6 × 8 = 48 (quyển sách).' },
      { text: 'Có 72 cái ghế xếp đều thành 8 hàng. Hỏi mỗi hàng có bao nhiêu cái ghế?', answer: 9, solution: 'Số ghế mỗi hàng là: 72 : 8 = 9 (cái ghế).' },
      { text: 'Một cửa hàng có 385 cái áo, nhập thêm 246 cái. Hỏi cửa hàng có tất cả bao nhiêu cái áo?', answer: 631, solution: 'Số áo có tất cả là: 385 + 246 = 631 (cái áo).' },
      { text: 'Kho có 650 lít dầu, đã bán 275 lít. Hỏi kho còn lại bao nhiêu lít dầu?', answer: 375, solution: 'Số dầu còn lại là: 650 − 275 = 375 (lít dầu).' },
      { text: 'Mỗi thùng chứa 7 chai nước. Hỏi 9 thùng như vậy chứa bao nhiêu chai nước?', answer: 63, solution: 'Số chai nước có tất cả là: 7 × 9 = 63 (chai nước).' },
      { text: 'Có 48 cái bánh chia đều cho 6 bạn. Hỏi mỗi bạn được bao nhiêu cái bánh?', answer: 8, solution: 'Số bánh mỗi bạn được là: 48 : 6 = 8 (cái bánh).' },
      { text: 'Một đội bóng bán được 275 vé buổi sáng và 198 vé buổi chiều. Hỏi cả ngày bán được bao nhiêu vé?', answer: 473, solution: 'Số vé bán được cả ngày là: 275 + 198 = 473 (vé).' },
      { text: 'Xưởng may có 9 tổ, mỗi tổ 8 người. Hỏi xưởng có tất cả bao nhiêu người?', answer: 72, solution: 'Số người có tất cả là: 9 × 8 = 72 (người).' },
    ],
    4: [
      { text: 'Một trường có 24 lớp học, mỗi lớp có 35 học sinh. Hỏi trường đó có tất cả bao nhiêu học sinh?', answer: 840, solution: 'Số học sinh có tất cả là: 35 × 24 = 840 (học sinh).' },
      { text: 'Có 936 quyển sách xếp đều vào 8 giá sách. Hỏi mỗi giá sách có bao nhiêu quyển sách?', answer: 117, solution: 'Số sách mỗi giá có là: 936 : 8 = 117 (quyển sách).' },
      { text: 'Một kho hàng có 4500 kg gạo, đã xuất đi 1850 kg. Hỏi kho hàng còn lại bao nhiêu ki-lô-gam gạo?', answer: 2650, solution: 'Số gạo còn lại là: 4500 − 1850 = 2650 (kg gạo).' },
      { text: 'Một nhà máy sản xuất được 3250 sản phẩm trong tháng 1 và 2780 sản phẩm trong tháng 2. Hỏi cả hai tháng nhà máy sản xuất được bao nhiêu sản phẩm?', answer: 6030, solution: 'Số sản phẩm cả hai tháng là: 3250 + 2780 = 6030 (sản phẩm).' },
      { text: 'Mỗi xe tải chở được 45 bao xi măng. Hỏi 12 xe tải như vậy chở được bao nhiêu bao xi măng?', answer: 540, solution: 'Số bao xi măng chở được là: 45 × 12 = 540 (bao xi măng).' },
      { text: 'Có 728 cái kẹo chia đều cho 7 bạn. Hỏi mỗi bạn được bao nhiêu cái kẹo?', answer: 104, solution: 'Số kẹo mỗi bạn được là: 728 : 7 = 104 (cái kẹo).' },
      { text: 'Một sân vận động có 32 hàng ghế, mỗi hàng có 48 ghế. Hỏi sân vận động đó có tất cả bao nhiêu ghế?', answer: 1536, solution: 'Số ghế có tất cả là: 48 × 32 = 1536 (ghế).' },
      { text: 'Có 963 cây giống chia đều thành 9 lô đất. Hỏi mỗi lô đất có bao nhiêu cây giống?', answer: 107, solution: 'Số cây giống mỗi lô có là: 963 : 9 = 107 (cây giống).' },
      { text: 'Một nông trại có 18 chuồng, mỗi chuồng nuôi 42 con lợn. Hỏi nông trại có tất cả bao nhiêu con lợn?', answer: 756, solution: 'Số lợn có tất cả là: 42 × 18 = 756 (con lợn).' },
      { text: 'Có 864 quyển vở xếp đều vào 6 thùng. Hỏi mỗi thùng có bao nhiêu quyển vở?', answer: 144, solution: 'Số vở mỗi thùng có là: 864 : 6 = 144 (quyển vở).' },
      { text: 'Một công ty có 3800 sản phẩm tồn kho, xuất bán 1650 sản phẩm. Hỏi còn lại bao nhiêu sản phẩm?', answer: 2150, solution: 'Số sản phẩm còn lại là: 3800 − 1650 = 2150 (sản phẩm).' },
      { text: 'Trường A có 2450 học sinh, trường B có 1980 học sinh. Hỏi cả hai trường có bao nhiêu học sinh?', answer: 4430, solution: 'Số học sinh cả hai trường là: 2450 + 1980 = 4430 (học sinh).' },
      { text: 'Mỗi thùng chứa 36 chai dầu ăn. Hỏi 15 thùng như vậy chứa bao nhiêu chai dầu ăn?', answer: 540, solution: 'Số chai dầu ăn có tất cả là: 36 × 15 = 540 (chai dầu ăn).' },
      { text: 'Có 810 cái bánh chia đều cho 9 lớp. Hỏi mỗi lớp được bao nhiêu cái bánh?', answer: 90, solution: 'Số bánh mỗi lớp được là: 810 : 9 = 90 (cái bánh).' },
      { text: 'Một rạp chiếu phim có 26 hàng ghế, mỗi hàng 32 ghế. Hỏi rạp có tất cả bao nhiêu ghế?', answer: 832, solution: 'Số ghế có tất cả là: 32 × 26 = 832 (ghế).' },
      { text: 'Có 968 cây giống chia đều vào 8 vườn. Hỏi mỗi vườn có bao nhiêu cây giống?', answer: 121, solution: 'Số cây giống mỗi vườn có là: 968 : 8 = 121 (cây giống).' },
    ],
    5: [
      { text: 'Một mảnh vải dài 12,5 mét, người ta cắt đi 4,2 mét. Hỏi mảnh vải còn lại bao nhiêu mét?', answer: 8.3, decimal: true, solution: 'Số mét vải còn lại là: 12,5 − 4,2 = 8,3 (mét).' },
      { text: 'Lan mua 3 quyển vở, mỗi quyển giá 8,5 nghìn đồng. Hỏi Lan phải trả bao nhiêu nghìn đồng?', answer: 25.5, decimal: true, solution: 'Số tiền phải trả là: 8,5 × 3 = 25,5 (nghìn đồng).' },
      { text: 'Một đội công nhân sửa được 1250 mét đường trong 25 ngày, mỗi ngày sửa được số mét đường bằng nhau. Hỏi mỗi ngày đội sửa được bao nhiêu mét đường?', answer: 50, solution: 'Số mét đường sửa mỗi ngày là: 1250 : 25 = 50 (mét).' },
      { text: 'Thùng thứ nhất có 45,6 lít nước, thùng thứ hai có 32,4 lít nước. Hỏi cả hai thùng có bao nhiêu lít nước?', answer: 78, solution: 'Số lít nước cả hai thùng là: 45,6 + 32,4 = 78 (lít nước).' },
      { text: 'Một mảnh đất hình chữ nhật có chiều dài 15 mét, chiều rộng 8 mét. Hỏi diện tích mảnh đất đó là bao nhiêu mét vuông?', answer: 120, solution: 'Diện tích mảnh đất là: 15 × 8 = 120 (m²).' },
      { text: 'Một kho có 2,5 tấn gạo, đã xuất bán 1,2 tấn. Hỏi kho còn lại bao nhiêu tấn gạo?', answer: 1.3, decimal: true, solution: 'Số tấn gạo còn lại là: 2,5 − 1,2 = 1,3 (tấn gạo).' },
      { text: 'Trung bình mỗi ngày một cửa hàng bán được 24 cái bánh. Hỏi trong 15 ngày cửa hàng đó bán được bao nhiêu cái bánh?', answer: 360, solution: 'Số bánh bán được trong 15 ngày là: 24 × 15 = 360 (cái bánh).' },
      { text: 'Có 108 lít dầu chia đều vào 9 can. Hỏi mỗi can chứa bao nhiêu lít dầu?', answer: 12, solution: 'Số lít dầu mỗi can chứa là: 108 : 9 = 12 (lít dầu).' },
      { text: 'Một cuộn dây dài 25,8 mét, đã cắt dùng hết 9,6 mét. Hỏi cuộn dây còn lại bao nhiêu mét?', answer: 16.2, decimal: true, solution: 'Số mét dây còn lại là: 25,8 − 9,6 = 16,2 (mét).' },
      { text: 'Một hộp sữa nặng 0,4 kg. Hỏi 6 hộp sữa như vậy nặng bao nhiêu ki-lô-gam?', answer: 2.4, decimal: true, solution: 'Số cân nặng của 6 hộp là: 0,4 × 6 = 2,4 (kg).' },
      { text: 'Một xưởng dệt được 1620 mét vải trong 27 ngày, mỗi ngày dệt như nhau. Hỏi mỗi ngày dệt được bao nhiêu mét vải?', answer: 60, solution: 'Số mét vải dệt mỗi ngày là: 1620 : 27 = 60 (mét).' },
      { text: 'Bể thứ nhất chứa 68,5 lít nước, bể thứ hai chứa 41,3 lít nước. Hỏi cả hai bể chứa bao nhiêu lít nước?', answer: 109.8, decimal: true, solution: 'Số lít nước cả hai bể là: 68,5 + 41,3 = 109,8 (lít nước).' },
      { text: 'Một khu vườn hình chữ nhật có chiều dài 24 mét, chiều rộng 12 mét. Hỏi diện tích khu vườn là bao nhiêu mét vuông?', answer: 288, solution: 'Diện tích khu vườn là: 24 × 12 = 288 (m²).' },
      { text: 'Một kho có 4,8 tấn muối, đã xuất bán 2,3 tấn. Hỏi kho còn lại bao nhiêu tấn muối?', answer: 2.5, decimal: true, solution: 'Số tấn muối còn lại là: 4,8 − 2,3 = 2,5 (tấn muối).' },
      { text: 'Trung bình mỗi giờ một máy đóng gói được 45 hộp hàng. Hỏi trong 12 giờ máy đóng gói được bao nhiêu hộp hàng?', answer: 540, solution: 'Số hộp hàng đóng gói được là: 45 × 12 = 540 (hộp hàng).' },
      { text: 'Có 156 lít nước mắm chia đều vào 12 can. Hỏi mỗi can chứa bao nhiêu lít nước mắm?', answer: 13, solution: 'Số lít nước mắm mỗi can chứa là: 156 : 12 = 13 (lít nước mắm).' },
    ],
  };
  /**
   * Persistent shuffled-bag picker: serves every index in a pool exactly once
   * (in a random order) before repeating, and remembers progress in
   * localStorage so closing/reopening the app continues with fresh content
   * instead of restarting from the same spot.
   */
  function nextFromShuffledBag(key, poolSize) {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(key)); } catch (e) { data = null; }
    if (!data || !Array.isArray(data.order) || data.order.length !== poolSize || data.cursor >= data.order.length) {
      const order = Array.from({ length: poolSize }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [order[i], order[j]] = [order[j], order[i]];
      }
      data = { order, cursor: 0 };
    }
    const idx = data.order[data.cursor];
    data.cursor++;
    localStorage.setItem(key, JSON.stringify(data));
    return idx;
  }

  function generateWordProblem(grade) {
    const list = WORD_PROBLEMS[grade];
    const idx = nextFromShuffledBag(`mathgame_word_bag_${grade}`, list.length);
    const p = list[idx];
    const distractors = makeDistractors(p.answer, !!p.decimal);
    const choices = [p.answer, ...distractors].sort(() => Math.random() - 0.5);
    return { text: p.text, answer: p.answer, choices, solution: p.solution, isWord: true };
  }

  /* ================= STATE ================= */
  const state = {
    grade: null, op: null, mode: null,
    score: 0, lives: 3, streak: 0, bestStreak: 0,
    correct: 0, answered: 0, totalQuestions: 20,
    timeLeft: 60, timerId: null, current: null,
    locked: false,
  };

  /* ================= DOM refs ================= */
  const $ = (id) => document.getElementById(id);
  const screens = {
    license: $('screen-license'), home: $('screen-home'), setup: $('screen-setup'), game: $('screen-game'), result: $('screen-result'), homework: $('screen-homework'), gifted: $('screen-gifted'), call: $('screen-call'),
  };
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  /* ================= SOUND TOGGLE ================= */
  const soundBtn = $('soundToggle');
  const iconOn = $('soundIconOn');
  const iconOff = $('soundIconOff');
  function refreshSoundIcon() {
    iconOn.hidden = muted;
    iconOff.hidden = !muted;
    soundBtn.classList.toggle('is-muted', muted);
  }
  refreshSoundIcon();
  soundBtn.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem('mathgame_muted', muted ? '1' : '0');
    refreshSoundIcon();
    if (!muted) sfx.click();
  });

  function unlockAudio() {
    ctx();
  }
  ['pointerdown', 'touchstart', 'click'].forEach((evt) => {
    document.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });
  // iOS Safari can re-suspend the AudioContext after the tab is backgrounded
  // (e.g. switching apps, the install-to-home-screen share sheet) — resume
  // it as soon as the page is visible/focused again.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });
  window.addEventListener('focus', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  });

  /* ================= HOME ================= */
  $('btnPlay').addEventListener('click', () => { sfx.click(); showScreen('setup'); });
  $('btnGifted').addEventListener('click', () => { sfx.click(); showScreen('gifted'); giftedShowGradePicker(); });
  setMascot($('mascotHome'), 'happy');

  $('btnContactFB').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('facebook');
  });
  $('btnContactWeb').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('website');
  });

  /* ================= ÔN HỌC SINH GIỎI ================= */
  // Curated advanced/enrichment problems per grade, ordered easy → hard —
  // this is a review/reading list (tap to reveal each solution), not a
  // timed quiz, so it reuses the setup screen's grade-card styling but
  // renders a plain scrollable list instead of the game flow.
  // Mỗi bài gồm 3 bước dạy (teach) học sinh phải xem hết rồi mới mở được lời giải:
  //   1. Đọc kỹ đề  — tách ra đề cho gì, đề hỏi gì
  //   2. Kiến thức  — quy tắc/công thức cần dùng, kèm ví dụ nhỏ dễ hơn
  //   3. Hướng làm  — các bước sẽ làm, cố ý KHÔNG nêu đáp số để phần lời giải còn giá trị
  const GIFTED_PROBLEMS = {
    1: [
      {
        level: 'Cơ bản',
        text: 'Tìm số thích hợp điền vào dãy số sau: 5, 7, 9, 11, ...',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho một <strong>dãy số</strong>: 5, 7, 9, 11 và dấu ba chấm ở cuối. Dấu ba chấm nghĩa là dãy còn tiếp tục.<br><br>Đề hỏi: <strong>số tiếp theo</strong> sau số 11 là số nào?' },
          { t: 'Kiến thức cần dùng', b: 'Đây là <strong>dãy số cách đều</strong>: cứ mỗi số sau lại hơn số liền trước đúng một khoảng bằng nhau.<br><br>Muốn tìm khoảng cách đó, con lấy <strong>số sau trừ số trước</strong>.<br><br>Ví dụ dễ hơn: dãy 2, 4, 6, ... có 4 − 2 = 2 và 6 − 4 = 2, khoảng cách là 2, nên số tiếp theo là 6 + 2 = 8.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính hiệu của từng cặp số liền nhau: 7 − 5, rồi 9 − 7, rồi 11 − 9.<br><br>Bước 2: Xem ba hiệu đó có bằng nhau không. Nếu bằng nhau thì đó chính là khoảng cách của dãy.<br><br>Bước 3: Lấy số cuối cùng đang có (là 11) <strong>cộng</strong> khoảng cách vừa tìm được.' },
        ],
        solution: 'Mỗi số sau hơn số liền trước 2 đơn vị (5→7, 7→9, 9→11 đều cách nhau 2). Vậy số tiếp theo là 11 + 2 = <strong>13</strong>.',
      },
      {
        level: 'Cơ bản',
        text: 'Hộp thứ nhất có nhiều hơn hộp thứ hai 3 cái bút. Hộp thứ hai có 6 cái bút. Hỏi hộp thứ nhất có bao nhiêu cái bút?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho hai điều:<br>• Hộp thứ hai có <strong>6</strong> cái bút.<br>• Hộp thứ nhất <strong>nhiều hơn</strong> hộp thứ hai <strong>3</strong> cái.<br><br>Đề hỏi: hộp thứ nhất có bao nhiêu cái bút?' },
          { t: 'Kiến thức cần dùng', b: 'Từ khoá quan trọng nhất trong bài là <strong>“nhiều hơn”</strong>. Khi một bên nhiều hơn bên kia, muốn tìm bên nhiều thì con lấy bên ít <strong>cộng</strong> phần nhiều hơn.<br><br>Ví dụ dễ hơn: Nam có 4 viên bi, Bình nhiều hơn Nam 2 viên. Vậy Bình có 4 + 2 = 6 viên.<br><br>Chú ý: nếu đề nói “ít hơn” thì làm ngược lại, phải <strong>trừ</strong>.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Xác định bên nào ít hơn — ở đây là hộp thứ hai (6 cái).<br><br>Bước 2: Lấy số bút của hộp thứ hai <strong>cộng</strong> với 3 cái nhiều hơn.<br><br>Bước 3: Nhớ viết kèm đơn vị “cái bút” vào đáp số.' },
        ],
        solution: 'Hộp thứ nhất nhiều hơn 3 cái nên có: 6 + 3 = <strong>9 cái bút</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'An cho em 2 quả táo thì An còn lại nhiều hơn em 1 quả. Biết sau khi được cho, em có 4 quả táo. Hỏi lúc đầu An có bao nhiêu quả táo?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Bài này có <strong>hai thời điểm</strong>, phải phân biệt thật rõ:<br>• <strong>Lúc sau</strong> (đã cho xong): em có 4 quả, An còn nhiều hơn em 1 quả.<br>• <strong>Lúc đầu</strong>: chưa cho, An có bao nhiêu?<br><br>Đề hỏi số táo của An <strong>lúc đầu</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Đây là <strong>bài toán ngược</strong>: đề cho biết tình hình lúc sau, bắt tìm lúc đầu.<br><br>Quy tắc: đi ngược thời gian thì làm <strong>phép tính ngược lại</strong>. Lúc xuôi An <em>cho đi</em> (bớt) 2 quả, nên khi đi ngược về lúc đầu con phải <em>cộng lại</em> 2 quả.<br><br>Ví dụ dễ hơn: Lan tiêu 5 000 đồng, còn 10 000 đồng. Lúc đầu Lan có 10 000 + 5 000 = 15 000 đồng.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tìm số táo An còn <strong>lúc sau</strong>. Đề nói An còn nhiều hơn em 1 quả, mà em có 4 quả — dùng phép cộng.<br><br>Bước 2: Từ số táo lúc sau, <strong>cộng thêm 2 quả An đã cho đi</strong> để quay về lúc đầu.<br><br>Bẫy hay mắc: nhiều bạn vội lấy 4 + 2 ngay. Không được — phải tìm số táo của <strong>An</strong> trước, chứ 4 là số táo của <strong>em</strong>.' },
        ],
        solution: 'Sau khi cho, An còn nhiều hơn em 1 quả nên An còn: 4 + 1 = 5 (quả). Vì An đã cho đi 2 quả nên lúc đầu An có: 5 + 2 = <strong>7 quả táo</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Điền số thích hợp vào ô trống để phép tính đúng: 8 + ☐ = 15 − 3',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Dấu “=” chia phép tính làm hai vế:<br>• Vế trái: 8 + ☐ (còn thiếu một số).<br>• Vế phải: 15 − 3 (tính được ngay).<br><br>Đề hỏi: điền số nào vào ô trống để hai vế <strong>bằng nhau</strong>?' },
          { t: 'Kiến thức cần dùng', b: 'Hai bước then chốt:<br><br>1. Vế nào <strong>tính được thì tính trước</strong> để phép tính gọn lại.<br><br>2. Tìm <strong>số hạng chưa biết</strong>: lấy <strong>tổng trừ đi số hạng đã biết</strong>.<br><br>Ví dụ dễ hơn: 3 + ☐ = 10 thì ☐ = 10 − 3 = 7.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính vế phải 15 − 3 trước, được một số cụ thể.<br><br>Bước 2: Viết lại thành dạng 8 + ☐ = (số vừa tính).<br><br>Bước 3: Lấy số vừa tính <strong>trừ</strong> 8 để ra ô trống.<br><br>Bước 4: Thử lại — thay số tìm được vào ô trống rồi tính cả hai vế xem có bằng nhau không.' },
        ],
        solution: '15 − 3 = 12. Vậy 8 + ☐ = 12, nên ☐ = 12 − 8 = <strong>4</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Ba bạn xếp hàng: Lan đứng trước Hoa, Hoa đứng trước Mai. Hỏi ai đứng cuối hàng?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho hai thông tin về vị trí:<br>• Lan đứng <strong>trước</strong> Hoa.<br>• Hoa đứng <strong>trước</strong> Mai.<br><br>Đề hỏi: ai đứng <strong>cuối hàng</strong>?' },
          { t: 'Kiến thức cần dùng', b: 'Dạng bài này gọi là <strong>suy luận thứ tự</strong>. Cách làm chắc nhất là <strong>vẽ dãy ra giấy</strong> rồi nối các thông tin lại với nhau.<br><br>Quy ước: viết người đứng trước ở bên trái, dùng mũi tên →.<br><br>Ví dụ dễ hơn: “A trước B” viết là A → B. Thêm “B trước C” thì nối thành A → B → C. Người ở tận cùng bên phải là người cuối hàng.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Viết thông tin thứ nhất: Lan → Hoa.<br><br>Bước 2: Thông tin thứ hai cũng bắt đầu bằng Hoa, nên nối tiếp vào sau Hoa.<br><br>Bước 3: Nhìn dãy vừa nối, bạn nào nằm ở <strong>cuối cùng bên phải</strong> chính là người đứng cuối hàng.' },
        ],
        solution: 'Thứ tự xếp hàng là Lan → Hoa → Mai, nên bạn đứng cuối hàng là <strong>Mai</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tìm một số biết số đó cộng với 5 thì bằng số lớn nhất có 1 chữ số.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề không cho sẵn con số ở vế phải mà <strong>mô tả</strong> nó: “số lớn nhất có 1 chữ số”.<br><br>Đề hỏi: số nào cộng với 5 thì được số đó?' },
          { t: 'Kiến thức cần dùng', b: 'Hai kiến thức ghép lại:<br><br>1. Các số <strong>có 1 chữ số</strong> là: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Số <strong>lớn nhất</strong> trong đó là 9 (số bé nhất là 0).<br><br>2. Tìm số hạng chưa biết: lấy <strong>tổng trừ số hạng đã biết</strong>.<br><br>Ví dụ dễ hơn: “Số đó cộng 3 bằng số lớn nhất có 1 chữ số” → 9 − 3 = 6.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Dịch phần mô tả thành con số cụ thể — “số lớn nhất có 1 chữ số” là số nào?<br><br>Bước 2: Viết lại đề thành phép tính: số cần tìm + 5 = (số vừa xác định).<br><br>Bước 3: Lấy số đó <strong>trừ</strong> 5.<br><br>Chú ý phân biệt: “1 chữ số” khác “1 số”. Nếu đề hỏi số lớn nhất có <strong>2</strong> chữ số thì là 99.' },
        ],
        solution: 'Số lớn nhất có 1 chữ số là 9. Số cần tìm là: 9 − 5 = <strong>4</strong>.',
      },
    ],
    2: [
      {
        level: 'Cơ bản',
        text: 'Tìm x, biết: x + 24 = 57',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Trong phép cộng <strong>x + 24 = 57</strong>:<br>• x và 24 là hai <strong>số hạng</strong>.<br>• 57 là <strong>tổng</strong>.<br><br>Đề hỏi: số hạng x bằng bao nhiêu?' },
          { t: 'Kiến thức cần dùng', b: 'Quy tắc phải thuộc lòng: <strong>số hạng chưa biết = tổng − số hạng đã biết</strong>.<br><br>Vì sao? Vì phép trừ là phép tính ngược của phép cộng.<br><br>Ví dụ dễ hơn: x + 4 = 10 thì x = 10 − 4 = 6. Thử lại: 6 + 4 = 10, đúng.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Xác định tổng là 57, số hạng đã biết là 24.<br><br>Bước 2: Lấy 57 <strong>trừ</strong> 24. Đặt tính dọc cho chắc, nhớ viết thẳng hàng đơn vị dưới đơn vị, chục dưới chục.<br><br>Bước 3: <strong>Thử lại</strong> — lấy kết quả cộng 24 xem có ra 57 không.' },
        ],
        solution: 'x = 57 − 24 = <strong>33</strong>.',
      },
      {
        level: 'Cơ bản',
        text: 'Một lớp có 35 học sinh, trong đó có 19 bạn nam. Hỏi lớp đó có bao nhiêu bạn nữ?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Cả lớp có <strong>35</strong> học sinh — đây là <strong>tổng</strong>.<br>• Trong đó có <strong>19</strong> bạn nam — đây là <strong>một phần</strong>.<br><br>Đề hỏi: số bạn nữ, tức là <strong>phần còn lại</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Cả lớp chỉ gồm hai nhóm: nam và nữ. Nên:<br><br><strong>nam + nữ = cả lớp</strong><br><br>Muốn tìm một phần khi biết tổng và phần kia, con lấy <strong>tổng trừ phần đã biết</strong>.<br><br>Ví dụ dễ hơn: rổ có 10 quả, trong đó 4 quả táo, vậy quả còn lại là 10 − 4 = 6 quả.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Xác định đâu là tổng (35) và đâu là phần đã biết (19).<br><br>Bước 2: Lấy 35 <strong>trừ</strong> 19. Đặt tính dọc, chú ý phải <strong>mượn</strong> vì 5 nhỏ hơn 9.<br><br>Bước 3: Kiểm tra kết quả có hợp lý không — số nữ phải nhỏ hơn 35.' },
        ],
        solution: 'Số bạn nữ là: 35 − 19 = <strong>16 bạn</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tìm 3 số tự nhiên liên tiếp có tổng bằng 24.',
        teach: [
          { t: 'Đọc kỹ đề', b: '“Ba số tự nhiên <strong>liên tiếp</strong>” nghĩa là ba số đứng sát nhau, số sau hơn số trước 1 đơn vị — ví dụ 4, 5, 6.<br><br>Đề cho: tổng của ba số ấy bằng <strong>24</strong>.<br>Đề hỏi: ba số đó là những số nào?' },
          { t: 'Kiến thức cần dùng', b: 'Mẹo rất nhanh cho <strong>ba</strong> số liên tiếp: số ở giữa luôn bằng <strong>tổng chia cho 3</strong>.<br><br>Vì sao? Số đầu kém số giữa 1 đơn vị, số cuối hơn số giữa 1 đơn vị — phần thiếu và phần thừa bù trừ hết cho nhau, nên ba số cộng lại đúng bằng ba lần số giữa.<br><br>Ví dụ dễ hơn: 4 + 5 + 6 = 15, mà 15 : 3 = 5 — đúng là số ở giữa.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Lấy tổng 24 <strong>chia cho 3</strong> để ra số ở giữa.<br><br>Bước 2: Số đầu = số giữa <strong>trừ 1</strong>; số cuối = số giữa <strong>cộng 1</strong>.<br><br>Bước 3: Thử lại — cộng cả ba số xem có đúng bằng 24 không.' },
        ],
        solution: 'Số ở giữa bằng tổng chia cho 3: 24 : 3 = 8. Vậy 3 số liên tiếp cần tìm là <strong>7, 8, 9</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Có một số sách xếp đều vào 6 ngăn, mỗi ngăn 8 quyển thì vừa hết. Nếu xếp mỗi ngăn 6 quyển thì cần bao nhiêu ngăn?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Bài có <strong>hai cách xếp</strong> cùng một số sách:<br>• Cách 1: 6 ngăn, mỗi ngăn 8 quyển → vừa hết.<br>• Cách 2: mỗi ngăn 6 quyển → cần bao nhiêu ngăn?<br><br>Điều quan trọng: <strong>số sách không đổi</strong>, chỉ cách xếp thay đổi.' },
          { t: 'Kiến thức cần dùng', b: 'Dạng này gọi là <strong>rút về đơn vị</strong> hoặc “tìm đại lượng trung gian”. Không thể đi thẳng từ câu hỏi tới đáp số — phải tìm <strong>tổng số sách</strong> trước.<br><br>• Tổng = số ngăn × số quyển mỗi ngăn.<br>• Số ngăn = tổng : số quyển mỗi ngăn.<br><br>Ví dụ dễ hơn: 2 rổ, mỗi rổ 5 quả → tổng 10 quả. Nếu mỗi rổ 2 quả thì cần 10 : 2 = 5 rổ.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tìm <strong>tổng số sách</strong> bằng cách nhân 8 × 6.<br><br>Bước 2: Lấy tổng số sách vừa tìm <strong>chia cho 6</strong> (số quyển mỗi ngăn ở cách xếp mới).<br><br>Bước 3: Nghĩ xem kết quả có hợp lý không — xếp ít quyển mỗi ngăn hơn thì phải cần <strong>nhiều ngăn hơn</strong>.' },
        ],
        solution: 'Tổng số sách là: 8 × 6 = 48 (quyển). Nếu mỗi ngăn 6 quyển thì cần: 48 : 6 = <strong>8 ngăn</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tìm một số, biết nếu thêm 15 vào số đó rồi bớt đi 7 thì được kết quả là 42.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Số cần tìm bị làm <strong>hai việc liên tiếp</strong>:<br>1. Thêm 15.<br>2. Rồi bớt 7.<br>Kết quả cuối cùng là <strong>42</strong>.<br><br>Đề hỏi: số ban đầu là số nào?' },
          { t: 'Kiến thức cần dùng', b: 'Có hai cách, cách nào cũng được:<br><br><strong>Cách 1 — rút gọn:</strong> thêm 15 rồi bớt 7 thì thực chất chỉ thêm 15 − 7 = 8. Bài trở thành x + 8 = 42.<br><br><strong>Cách 2 — làm ngược:</strong> đi ngược từ 42 về đầu, đổi mọi phép tính: bớt 7 thành cộng 7, thêm 15 thành trừ 15.<br><br>Ví dụ dễ hơn: x + 3 − 1 = 10 → x + 2 = 10 → x = 8.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Rút gọn hai việc thành một — tính 15 − 7.<br><br>Bước 2: Viết lại thành x + (số vừa rút gọn) = 42.<br><br>Bước 3: Tìm x bằng cách lấy 42 trừ đi số đó.<br><br>Bước 4: Thử lại theo đúng thứ tự đề bài: lấy x cộng 15, rồi trừ 7, xem có ra 42 không.' },
        ],
        solution: 'Gọi số cần tìm là x, ta có x + 15 − 7 = 42, nghĩa là x + 8 = 42. Vậy x = 42 − 8 = <strong>34</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Mẹ có 50 000 đồng, mua bút hết 23 000 đồng, mua vở hết 15 000 đồng. Hỏi mẹ còn lại bao nhiêu tiền?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Số tiền ban đầu: <strong>50 000</strong> đồng.<br>• Tiêu lần 1 (mua bút): <strong>23 000</strong> đồng.<br>• Tiêu lần 2 (mua vở): <strong>15 000</strong> đồng.<br><br>Đề hỏi: còn lại bao nhiêu tiền?' },
          { t: 'Kiến thức cần dùng', b: 'Tiêu tiền là <strong>bớt đi</strong>, nên mỗi lần mua là một phép <strong>trừ</strong>.<br><br>Hai cách làm, cùng ra một kết quả:<br>• Trừ lần lượt: 50 000 − 23 000 rồi trừ tiếp 15 000.<br>• Cộng gộp trước: tính tổng tiền đã tiêu (23 000 + 15 000) rồi lấy 50 000 trừ đi một lần.<br><br>Ví dụ dễ hơn: có 10, tiêu 3 rồi tiêu 2 → còn 10 − 3 − 2 = 5, hoặc 10 − (3 + 2) = 5.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Chọn một trong hai cách ở trên.<br><br>Bước 2: Khi đặt tính, viết các số <strong>thẳng cột</strong> theo hàng nghìn — số tiền nhiều chữ số rất dễ lệch cột.<br><br>Bước 3: Kiểm tra tính hợp lý — tiền còn lại phải <strong>nhỏ hơn</strong> 50 000 đồng.' },
        ],
        solution: 'Số tiền còn lại là: 50 000 − 23 000 − 15 000 = <strong>12 000 đồng</strong>.',
      },
    ],
    3: [
      {
        level: 'Cơ bản',
        text: 'Tìm x, biết: x × 6 = 42',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Trong phép nhân <strong>x × 6 = 42</strong>:<br>• x và 6 là hai <strong>thừa số</strong>.<br>• 42 là <strong>tích</strong>.<br><br>Đề hỏi: thừa số x bằng bao nhiêu?' },
          { t: 'Kiến thức cần dùng', b: 'Quy tắc: <strong>thừa số chưa biết = tích : thừa số đã biết</strong>.<br><br>Phép chia là phép tính ngược của phép nhân, giống như trừ là ngược của cộng.<br><br>Ví dụ dễ hơn: x × 3 = 12 thì x = 12 : 3 = 4. Thử lại: 4 × 3 = 12, đúng.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Xác định tích là 42, thừa số đã biết là 6.<br><br>Bước 2: Lấy 42 <strong>chia</strong> cho 6. Nhớ lại bảng nhân 6: 6 × 7 = 42.<br><br>Bước 3: Thử lại bằng phép nhân.' },
        ],
        solution: 'x = 42 : 6 = <strong>7</strong>.',
      },
      {
        level: 'Cơ bản',
        text: 'Một cửa hàng có 84 quả cam, đã bán 1/4 số cam đó. Hỏi cửa hàng còn lại bao nhiêu quả cam?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Tổng số cam: <strong>84</strong> quả.<br>• Đã bán: <strong>1/4</strong> số cam đó.<br><br>Đề hỏi số cam <strong>còn lại</strong>, chứ không hỏi số cam đã bán — đọc kỹ chỗ này.' },
          { t: 'Kiến thức cần dùng', b: 'Muốn tìm <strong>một phần mấy của một số</strong>, con lấy số đó <strong>chia cho mẫu số</strong>.<br><br>Ví dụ: 1/4 của 20 là 20 : 4 = 5. 1/3 của 9 là 9 : 3 = 3.<br><br>Sau khi có phần đã bán rồi, muốn tìm phần còn lại thì lấy <strong>tổng trừ phần đã bán</strong>.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính số cam <strong>đã bán</strong>: lấy 84 chia cho 4.<br><br>Bước 2: Lấy 84 <strong>trừ</strong> số cam vừa bán để ra số còn lại.<br><br>Mẹo kiểm tra: bán 1/4 thì còn 3/4, nên có thể thử cách khác: 84 : 4 × 3 — hai cách phải ra cùng một kết quả.' },
        ],
        solution: 'Số cam đã bán là: 84 : 4 = 21 (quả). Số cam còn lại là: 84 − 21 = <strong>63 quả</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tìm số tự nhiên bé nhất có 2 chữ số, biết số đó chia cho 4 thì dư 3.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Số cần tìm phải thoả <strong>hai điều kiện cùng lúc</strong>:<br>1. Là số có <strong>2 chữ số</strong> (tức từ 10 đến 99).<br>2. Chia cho 4 thì <strong>dư 3</strong>.<br><br>Và trong tất cả các số thoả cả hai, phải chọn số <strong>bé nhất</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Nhắc lại phép chia có dư: <strong>số bị chia = thương × số chia + số dư</strong>, và <strong>số dư luôn nhỏ hơn số chia</strong>.<br><br>Cách kiểm tra một số chia 4 dư mấy: tìm số lớn nhất chia hết cho 4 mà không vượt quá nó, rồi lấy hiệu.<br><br>Ví dụ: 11 chia 4 — số chia hết cho 4 gần nhất mà không vượt 11 là 8, hiệu 11 − 8 = 3, vậy 11 chia 4 dư 3.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Số có 2 chữ số bé nhất là 10 — bắt đầu thử từ đó.<br><br>Bước 2: Thử lần lượt 10, 11, 12... mỗi số xem chia 4 dư mấy.<br><br>Bước 3: <strong>Dừng ngay</strong> ở số đầu tiên cho số dư bằng 3 — vì đang tìm số bé nhất.<br><br>Bẫy hay mắc: đáp án <strong>không phải</strong> 3, vì 3 chỉ có 1 chữ số.' },
        ],
        solution: 'Thử các số có 2 chữ số từ nhỏ: 10 chia 4 dư 2; 11 chia 4 dư 3 (vì 4 × 2 = 8, 11 − 8 = 3). Vậy số cần tìm là <strong>11</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một phép chia có số bị chia là 47, số chia là 6. Tìm thương và số dư.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho tên gọi rõ ràng:<br>• <strong>Số bị chia</strong>: 47 (số đem đi chia).<br>• <strong>Số chia</strong>: 6 (chia cho mấy).<br><br>Đề hỏi <strong>hai thứ</strong>: thương và số dư — phải trả lời đủ cả hai.' },
          { t: 'Kiến thức cần dùng', b: 'Công thức: <strong>số bị chia = thương × số chia + số dư</strong>.<br><br>Quy tắc vàng: <strong>số dư luôn nhỏ hơn số chia</strong>. Nếu con tính ra số dư bằng hoặc lớn hơn 6 thì chắc chắn sai, phải tăng thương lên.<br><br>Ví dụ: 14 : 4 → 4 × 3 = 12, dư 2. Số dư 2 < 4, hợp lệ.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Đọc bảng nhân 6 tìm tích <strong>lớn nhất mà không vượt quá 47</strong>: 6 × 6 = 36, 6 × 7 = 42, 6 × 8 = 48 (đã vượt).<br><br>Bước 2: Thương chính là số nhân vừa chọn được.<br><br>Bước 3: Số dư = 47 <strong>trừ</strong> tích đó.<br><br>Bước 4: Kiểm tra số dư có nhỏ hơn 6 không.' },
        ],
        solution: '6 × 7 = 42, mà 47 − 42 = 5 (< 6) nên: 47 : 6 = <strong>7, dư 5</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tổng của hai số là 96. Số thứ nhất hơn số thứ hai 12 đơn vị. Tìm hai số đó.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• <strong>Tổng</strong> hai số = 96.<br>• <strong>Hiệu</strong> hai số = 12 (số thứ nhất hơn số thứ hai 12).<br><br>Đề hỏi: cả hai số là bao nhiêu?' },
          { t: 'Kiến thức cần dùng', b: 'Đây là dạng kinh điển <strong>“tìm hai số khi biết tổng và hiệu”</strong>. Có hai công thức, thuộc một cái là đủ:<br><br>• <strong>Số lớn = (tổng + hiệu) : 2</strong><br>• <strong>Số bé = (tổng − hiệu) : 2</strong><br><br>Hình dung bằng sơ đồ đoạn thẳng: nếu bỏ đi phần hiệu thì hai đoạn bằng nhau, nên chia đôi được số bé.<br><br>Ví dụ dễ hơn: tổng 10, hiệu 2 → số lớn (10 + 2) : 2 = 6, số bé 6 − 2 = 4.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tìm số lớn bằng công thức (96 + 12) : 2.<br><br>Bước 2: Tìm số bé — lấy số lớn <strong>trừ</strong> hiệu 12, hoặc lấy tổng 96 trừ số lớn.<br><br>Bước 3: <strong>Thử lại cả hai điều kiện</strong>: cộng hai số có ra 96 không, và trừ hai số có ra 12 không.' },
        ],
        solution: 'Số lớn là: (96 + 12) : 2 = 54. Số bé là: 54 − 12 = <strong>42</strong>. Vậy hai số cần tìm là <strong>54 và 42</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Có 27 cái kẹo chia đều cho 4 bạn. Hỏi mỗi bạn được nhiều nhất bao nhiêu cái kẹo và còn dư mấy cái?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho: <strong>27</strong> cái kẹo, chia đều cho <strong>4</strong> bạn.<br><br>Chữ “<strong>nhiều nhất</strong>” và “<strong>còn dư</strong>” là dấu hiệu cho biết đây là <strong>phép chia có dư</strong> — kẹo không chia hết được, phần lẻ để lại.' },
          { t: 'Kiến thức cần dùng', b: 'Trong bài toán thực tế, số kẹo mỗi bạn phải là <strong>số nguyên</strong> — không ai chia nửa cái kẹo cho công bằng được.<br><br>Vậy: <strong>27 : 4 = thương (dư số dư)</strong>, trong đó thương là số kẹo mỗi bạn, số dư là số kẹo còn thừa.<br><br>Nhớ: <strong>số dư phải nhỏ hơn 4</strong>. Nếu dư từ 4 trở lên thì vẫn còn chia thêm được cho mỗi bạn 1 cái nữa.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Đọc bảng nhân 4, tìm tích lớn nhất không vượt quá 27.<br><br>Bước 2: Thương là số kẹo <strong>mỗi bạn</strong> được.<br><br>Bước 3: Lấy 27 trừ tích đó ra <strong>số kẹo còn dư</strong>.<br><br>Bước 4: Trả lời <strong>đủ cả hai ý</strong> mà đề hỏi, kèm đơn vị “cái kẹo”.' },
        ],
        solution: '27 : 4 = 6, dư 3 (vì 4 × 6 = 24, 27 − 24 = 3). Vậy mỗi bạn được nhiều nhất <strong>6 cái kẹo</strong>, còn dư <strong>3 cái</strong>.',
      },
    ],
    4: [
      {
        level: 'Cơ bản',
        text: 'Một hình chữ nhật có chiều dài 15cm, chiều rộng 9cm. Tính chu vi hình đó.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho một hình chữ nhật với:<br>• Chiều dài: <strong>15cm</strong><br>• Chiều rộng: <strong>9cm</strong><br><br>Đề hỏi <strong>chu vi</strong> — tức là độ dài đường bao quanh hình, đi hết một vòng.' },
          { t: 'Kiến thức cần dùng', b: 'Hình chữ nhật có 4 cạnh: hai cạnh dài bằng nhau và hai cạnh rộng bằng nhau. Đi một vòng là đi qua đủ 4 cạnh.<br><br><strong>Chu vi = (chiều dài + chiều rộng) × 2</strong><br><br>Đừng nhầm với <strong>diện tích = chiều dài × chiều rộng</strong>. Chu vi có đơn vị cm, diện tích có đơn vị cm².<br><br>Ví dụ dễ hơn: hình dài 3cm rộng 2cm có chu vi (3 + 2) × 2 = 10cm.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Cộng chiều dài với chiều rộng trước — <strong>trong ngoặc làm trước</strong>.<br><br>Bước 2: Lấy kết quả đó nhân với 2.<br><br>Bước 3: Ghi đơn vị <strong>cm</strong> (không phải cm²) vào đáp số.' },
        ],
        solution: 'Chu vi hình chữ nhật là: (15 + 9) × 2 = <strong>48cm</strong>.',
      },
      {
        level: 'Cơ bản',
        text: 'Tìm x, biết: x : 7 = 128',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Trong phép chia <strong>x : 7 = 128</strong>:<br>• x là <strong>số bị chia</strong> (số đem đi chia) — đây là cái phải tìm.<br>• 7 là <strong>số chia</strong>.<br>• 128 là <strong>thương</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Quy tắc: <strong>số bị chia = thương × số chia</strong>.<br><br>Rất nhiều bạn nhầm thành chia. Cách nhớ chắc: phép chia và phép nhân ngược nhau, muốn “gỡ” phép chia thì phải <strong>nhân</strong>.<br><br>Ví dụ dễ hơn: x : 3 = 4 thì x = 4 × 3 = 12. Thử lại: 12 : 3 = 4, đúng.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Nhận ra x đứng ở vị trí số bị chia.<br><br>Bước 2: Lấy thương 128 <strong>nhân</strong> với số chia 7. Đặt tính dọc vì là nhân số có 3 chữ số.<br><br>Bước 3: Thử lại — lấy kết quả chia cho 7 xem có ra 128 không.' },
        ],
        solution: 'x = 128 × 7 = <strong>896</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tổng hai số là 158, hiệu hai số là 24. Tìm hai số đó.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Lần này đề nói thẳng luôn:<br>• <strong>Tổng</strong> = 158<br>• <strong>Hiệu</strong> = 24<br><br>Đề hỏi hai số đó là bao nhiêu.' },
          { t: 'Kiến thức cần dùng', b: 'Vẫn là dạng <strong>tổng – hiệu</strong>:<br><br>• <strong>Số lớn = (tổng + hiệu) : 2</strong><br>• <strong>Số bé = (tổng − hiệu) : 2</strong><br><br>Cách nhớ: cộng hiệu vào thì ra <em>lớn</em>, trừ hiệu đi thì ra <em>bé</em>.<br><br>Mẹo kiểm tra nhanh: tổng và hiệu phải <strong>cùng chẵn hoặc cùng lẻ</strong>, nếu không thì không có đáp án là số tự nhiên. Ở đây 158 và 24 đều chẵn — hợp lệ.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính (158 + 24) trước, rồi chia 2 để ra số lớn.<br><br>Bước 2: Tìm số bé bằng một trong hai cách: số lớn − 24, hoặc 158 − số lớn.<br><br>Bước 3: Thử lại cả hai điều kiện — tổng phải bằng 158 và hiệu phải bằng 24.' },
        ],
        solution: 'Số lớn là: (158 + 24) : 2 = 91. Số bé là: 91 − 24 = <strong>67</strong>. Vậy hai số cần tìm là <strong>91 và 67</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một mảnh vườn hình chữ nhật có chu vi 60m, chiều dài hơn chiều rộng 6m. Tính diện tích mảnh vườn.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Chu vi = <strong>60m</strong><br>• Chiều dài hơn chiều rộng <strong>6m</strong> (đây là <strong>hiệu</strong>)<br><br>Đề hỏi <strong>diện tích</strong> — mà muốn tính diện tích thì phải biết cả chiều dài lẫn chiều rộng. Vậy bài này có <strong>ba chặng</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Ghép ba kiến thức:<br><br>1. Chu vi = (dài + rộng) × 2, nên <strong>nửa chu vi = dài + rộng</strong> — đây chính là <strong>tổng</strong> hai cạnh.<br><br>2. Có tổng và hiệu rồi thì dùng công thức <strong>tổng – hiệu</strong> để tìm từng cạnh.<br><br>3. <strong>Diện tích = dài × rộng</strong>, đơn vị là m².<br><br>Bẫy lớn nhất: lấy thẳng 60 làm tổng hai cạnh. Sai — 60 là chu vi, tổng hai cạnh chỉ bằng <strong>một nửa</strong>.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính <strong>nửa chu vi</strong> = 60 : 2. Đây là tổng của chiều dài và chiều rộng.<br><br>Bước 2: Dùng tổng vừa tìm và hiệu 6m để tính chiều dài = (tổng + 6) : 2.<br><br>Bước 3: Tính chiều rộng = tổng − chiều dài.<br><br>Bước 4: Nhân hai cạnh để ra diện tích, ghi đơn vị <strong>m²</strong>.' },
        ],
        solution: 'Nửa chu vi là: 60 : 2 = 30 (m). Chiều dài là: (30 + 6) : 2 = 18 (m); chiều rộng là: 30 − 18 = 12 (m). Diện tích là: 18 × 12 = <strong>216m²</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tìm một số, biết nếu lấy số đó nhân với 3 rồi cộng thêm 25 thì được 100.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Số cần tìm bị làm hai việc theo thứ tự:<br>1. <strong>Nhân</strong> với 3.<br>2. Rồi <strong>cộng</strong> thêm 25.<br>Kết quả là <strong>100</strong>.<br><br>Viết thành phép tính: 3 × x + 25 = 100.' },
          { t: 'Kiến thức cần dùng', b: 'Quy tắc gỡ ngược: <strong>việc nào làm sau cùng thì gỡ trước tiên</strong>.<br><br>Ở đây phép cộng 25 làm sau cùng, nên phải gỡ nó trước bằng cách <strong>trừ</strong> 25. Sau đó mới gỡ phép nhân bằng cách <strong>chia</strong>.<br><br>Ví dụ dễ hơn: 2 × x + 1 = 9 → 2 × x = 9 − 1 = 8 → x = 8 : 2 = 4.<br><br>Sai lầm hay gặp: chia 100 cho 3 ngay từ đầu.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Lấy 100 <strong>trừ</strong> 25 để biết 3 × x bằng bao nhiêu.<br><br>Bước 2: Lấy kết quả đó <strong>chia</strong> cho 3 để ra x.<br><br>Bước 3: Thử lại đúng thứ tự đề bài — nhân x với 3 trước, rồi cộng 25, xem có ra 100 không.' },
        ],
        solution: 'Gọi số cần tìm là x: 3 × x + 25 = 100, nên 3 × x = 75. Vậy x = 75 : 3 = <strong>25</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một đội công nhân sửa xong một quãng đường trong 6 ngày, mỗi ngày sửa 250m. Nếu muốn xong trong 5 ngày thì mỗi ngày phải sửa bao nhiêu mét?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Hai phương án cho <strong>cùng một quãng đường</strong>:<br>• Phương án cũ: 6 ngày, mỗi ngày 250m.<br>• Phương án mới: 5 ngày, mỗi ngày ? mét.<br><br>Điều không đổi là <strong>tổng quãng đường</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Đây là bài <strong>rút về đơn vị</strong>, phải đi vòng qua tổng quãng đường:<br><br>• Tổng = số ngày × số mét mỗi ngày.<br>• Số mét mỗi ngày = tổng : số ngày.<br><br>Nhận xét quan trọng: làm <strong>ít ngày hơn</strong> thì mỗi ngày phải làm <strong>nhiều hơn</strong>. Đây gọi là hai đại lượng <strong>tỉ lệ nghịch</strong> — dùng nó để kiểm tra đáp án có hợp lý không.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Tính <strong>tổng quãng đường</strong> theo phương án cũ: 250 × 6.<br><br>Bước 2: Lấy tổng đó <strong>chia cho 5</strong> ngày.<br><br>Bước 3: Kiểm tra — kết quả phải <strong>lớn hơn 250m</strong>. Nếu nhỏ hơn thì chắc chắn làm nhầm phép tính.' },
        ],
        solution: 'Tổng quãng đường là: 250 × 6 = 1500 (m). Muốn xong trong 5 ngày thì mỗi ngày phải sửa: 1500 : 5 = <strong>300m</strong>.',
      },
    ],
    5: [
      {
        level: 'Cơ bản',
        text: 'Tính: 24,5 + 13,75',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đây là phép cộng <strong>hai số thập phân</strong>:<br>• 24,5 — có 1 chữ số ở phần thập phân.<br>• 13,75 — có 2 chữ số ở phần thập phân.<br><br>Hai số có số chữ số thập phân <strong>khác nhau</strong> — đây chính là chỗ dễ sai.' },
          { t: 'Kiến thức cần dùng', b: 'Quy tắc cộng số thập phân:<br><br>1. Đặt tính dọc sao cho <strong>dấu phẩy thẳng cột với dấu phẩy</strong>.<br>2. Có thể <strong>thêm chữ số 0</strong> vào cuối phần thập phân cho hai số bằng nhau về số chữ số — giá trị không đổi (24,5 = 24,50).<br>3. Cộng như số tự nhiên, rồi <strong>hạ dấu phẩy thẳng xuống</strong>.<br><br>Ví dụ dễ hơn: 1,2 + 0,35 → viết 1,20 + 0,35 = 1,55.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Viết 24,5 thành <strong>24,50</strong> cho đều hai chữ số thập phân.<br><br>Bước 2: Đặt tính dọc, dấu phẩy thẳng hàng.<br><br>Bước 3: Cộng từ phải sang trái, nhớ sang cột bên trái khi tổng vượt 10.<br><br>Bước 4: Hạ dấu phẩy xuống kết quả.' },
        ],
        solution: '24,5 + 13,75 = <strong>38,25</strong>.',
      },
      {
        level: 'Cơ bản',
        text: 'Một lớp có 40 học sinh, số học sinh nam chiếm 60% số học sinh cả lớp. Hỏi lớp đó có bao nhiêu học sinh nam?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Cả lớp: <strong>40</strong> học sinh — đây là “toàn bộ”, ứng với <strong>100%</strong>.<br>• Nam chiếm <strong>60%</strong> của cả lớp.<br><br>Đề hỏi: bao nhiêu học sinh nam?' },
          { t: 'Kiến thức cần dùng', b: '<strong>Phần trăm</strong> nghĩa là “trên một trăm”: 60% chính là 60/100 của toàn bộ.<br><br>Quy tắc <strong>tìm a% của một số</strong>:<br><br><strong>kết quả = số đó × a : 100</strong><br><br>Ví dụ dễ hơn: 50% của 20 là 20 × 50 : 100 = 10 (đúng bằng một nửa).<br><br>Mẹo kiểm tra: 60% hơn một nửa một chút, nên đáp án phải lớn hơn 20 và nhỏ hơn 40.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Lấy tổng số học sinh 40 <strong>nhân</strong> 60.<br><br>Bước 2: Lấy kết quả <strong>chia</strong> cho 100.<br><br>Bước 3: Đối chiếu với mẹo kiểm tra ở trên — số nam phải nằm giữa 20 và 40.<br><br>Nếu muốn, tính thêm số nữ để hiểu rõ: 100% − 60% = 40% là nữ.' },
        ],
        solution: 'Số học sinh nam là: 40 × 60 : 100 = <strong>24 học sinh</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Tổng hai số là 84. Tỉ số của số bé và số lớn là 3/4. Tìm hai số đó.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• <strong>Tổng</strong> hai số = 84.<br>• <strong>Tỉ số</strong> số bé : số lớn = <strong>3/4</strong>.<br><br>Tỉ số 3/4 nghĩa là: nếu số bé gồm 3 phần bằng nhau thì số lớn gồm 4 phần <strong>cũng bằng đúng như thế</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Đây là dạng <strong>“tìm hai số khi biết tổng và tỉ số”</strong>. Cách làm bằng <strong>sơ đồ đoạn thẳng</strong>:<br><br>1. Vẽ số bé 3 phần, số lớn 4 phần.<br>2. <strong>Tổng số phần</strong> = 3 + 4 = 7 phần, ứng với 84.<br>3. <strong>Giá trị một phần</strong> = tổng : tổng số phần.<br>4. Mỗi số = giá trị một phần × số phần của nó.<br><br>Ví dụ dễ hơn: tổng 10, tỉ số 2/3 → 5 phần, một phần là 2 → hai số là 4 và 6.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Cộng hai chữ số của tỉ số để ra <strong>tổng số phần</strong>.<br><br>Bước 2: Lấy 84 chia cho tổng số phần để ra <strong>giá trị một phần</strong>.<br><br>Bước 3: Nhân giá trị một phần với 3 để ra <strong>số bé</strong>.<br><br>Bước 4: Số lớn = 84 − số bé (hoặc nhân với 4).<br><br>Bước 5: Thử lại cả hai điều kiện — tổng bằng 84 và tỉ số rút gọn được thành 3/4.' },
        ],
        solution: 'Tổng số phần bằng nhau là 3 + 4 = 7 phần. Số bé là: 84 : 7 × 3 = 36. Số lớn là: 84 − 36 = <strong>48</strong>. Vậy hai số cần tìm là <strong>36 và 48</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một hình thang có đáy lớn 18cm, đáy bé 12cm, chiều cao 8cm. Tính diện tích hình thang đó.',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho đủ ba số đo của hình thang:<br>• Đáy lớn: <strong>18cm</strong><br>• Đáy bé: <strong>12cm</strong><br>• Chiều cao: <strong>8cm</strong><br><br>Đề hỏi <strong>diện tích</strong>.' },
          { t: 'Kiến thức cần dùng', b: 'Công thức diện tích hình thang:<br><br><strong>S = (đáy lớn + đáy bé) × chiều cao : 2</strong><br><br>Cách nhớ: cộng hai đáy, nhân chiều cao, rồi chia đôi.<br><br>Lưu ý quan trọng: <strong>chiều cao</strong> là đoạn vuông góc nối hai đáy, không phải cạnh bên xiên.<br><br>Ví dụ dễ hơn: đáy 5 và 3, cao 2 → (5 + 3) × 2 : 2 = 8cm².' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Cộng hai đáy: 18 + 12.<br><br>Bước 2: Nhân kết quả với chiều cao 8.<br><br>Bước 3: <strong>Chia cho 2</strong> — rất nhiều bạn quên bước này.<br><br>Bước 4: Ghi đơn vị <strong>cm²</strong> vì là diện tích.' },
        ],
        solution: 'Diện tích hình thang là: (18 + 12) × 8 : 2 = <strong>120cm²</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một chiếc áo giá 250 000 đồng được giảm giá 20%. Hỏi giá chiếc áo sau khi giảm là bao nhiêu?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Giá gốc: <strong>250 000</strong> đồng (ứng với 100%).<br>• Giảm: <strong>20%</strong>.<br><br>Đề hỏi <strong>giá sau khi giảm</strong>, chứ không hỏi số tiền được giảm — đọc kỹ chỗ này.' },
          { t: 'Kiến thức cần dùng', b: 'Hai cách làm, cách nào cũng đúng:<br><br><strong>Cách 1 (hai bước):</strong> tính số tiền giảm = giá gốc × 20 : 100, rồi lấy giá gốc trừ đi.<br><br><strong>Cách 2 (một bước):</strong> giảm 20% thì còn lại 100% − 20% = <strong>80%</strong>, nên giá mới = giá gốc × 80 : 100.<br><br>Ví dụ dễ hơn: áo 100 000 giảm 20% → giảm 20 000, còn 80 000.<br><br>Mẹo kiểm tra: giá mới phải <strong>nhỏ hơn</strong> giá gốc.' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Chọn một trong hai cách trên.<br><br>Bước 2: Nếu làm cách 1 — tính số tiền được giảm trước, rồi mới trừ.<br><br>Bước 3: Làm xong nên thử lại bằng cách còn lại, hai cách phải ra <strong>cùng một kết quả</strong>.<br><br>Bước 4: Ghi đơn vị “đồng”.' },
        ],
        solution: 'Số tiền được giảm là: 250 000 × 20 : 100 = 50 000 (đồng). Giá sau khi giảm là: 250 000 − 50 000 = <strong>200 000 đồng</strong>.',
      },
      {
        level: 'Nâng cao',
        text: 'Một vòi nước chảy một mình thì đầy bể trong 6 giờ, vòi khác chảy một mình thì đầy bể đó trong 4 giờ. Nếu cả hai vòi cùng chảy thì sau bao lâu đầy bể?',
        teach: [
          { t: 'Đọc kỹ đề', b: 'Đề cho:<br>• Vòi 1 chảy một mình: đầy bể sau <strong>6 giờ</strong>.<br>• Vòi 2 chảy một mình: đầy bể sau <strong>4 giờ</strong>.<br><br>Đề hỏi: hai vòi cùng chảy thì bao lâu đầy?<br><br>Bẫy kinh điển: cộng 6 + 4 = 10 giờ. Sai hoàn toàn — hai vòi cùng chảy thì phải <strong>nhanh hơn</strong> cả khi chảy một mình.' },
          { t: 'Kiến thức cần dùng', b: 'Mẹo của dạng này: coi cả bể là <strong>1 đơn vị công việc</strong>, rồi tính <strong>mỗi giờ làm được bao nhiêu phần</strong>.<br><br>• Vòi 1 xong trong 6 giờ → mỗi giờ chảy được <strong>1/6</strong> bể.<br>• Vòi 2 xong trong 4 giờ → mỗi giờ chảy được <strong>1/4</strong> bể.<br>• Cùng chảy → mỗi giờ được <strong>1/6 + 1/4</strong> bể.<br><br>Có phần chảy mỗi giờ rồi thì: <strong>thời gian = 1 : (phần chảy mỗi giờ)</strong>.<br><br>Nhắc lại cộng phân số khác mẫu: quy đồng về mẫu chung (của 6 và 4 là 12).' },
          { t: 'Hướng làm bài này', b: 'Bước 1: Viết phần bể mỗi vòi chảy được trong 1 giờ.<br><br>Bước 2: Quy đồng mẫu số rồi cộng hai phân số lại.<br><br>Bước 3: Lấy <strong>1 chia cho</strong> phân số vừa tìm (chia phân số = nhân với phân số đảo ngược).<br><br>Bước 4: Đổi kết quả ra giờ và phút cho dễ hiểu (0,4 giờ = 0,4 × 60 phút).<br><br>Bước 5: Kiểm tra — đáp án phải <strong>nhỏ hơn 4 giờ</strong>.' },
        ],
        solution: 'Mỗi giờ vòi 1 chảy được 1/6 bể, vòi 2 chảy được 1/4 bể. Cả hai vòi mỗi giờ chảy được: 1/6 + 1/4 = 5/12 (bể). Thời gian chảy đầy bể là: 1 : 5/12 = 12/5 = 2,4 giờ = <strong>2 giờ 24 phút</strong>.',
      },
    ],
  };

  const giftedGradePicker = $('giftedGradePicker');
  const giftedGradeRow = $('giftedGradeRow');
  const giftedProblemList = $('giftedProblemList');
  let giftedCurrentGrade = null;

  function giftedShowGradePicker() {
    giftedCurrentGrade = null;
    giftedGradePicker.hidden = false;
    giftedProblemList.hidden = true;
  }

  function giftedRenderProblems(grade) {
    giftedCurrentGrade = grade;
    giftedGradePicker.hidden = true;
    giftedProblemList.hidden = false;
    giftedProblemList.innerHTML = '';
    (GIFTED_PROBLEMS[grade] || []).forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'gifted-card';
      const levelClass = p.level === 'Nâng cao' ? 'gifted-level-advanced' : 'gifted-level-basic';
      const steps = p.teach || [];
      card.innerHTML = `
        <div class="gifted-card-head">
          <span class="gifted-level ${levelClass}">${p.level}</span>
          <span class="gifted-num">Bài ${i + 1}</span>
        </div>
        <p class="gifted-question">${p.text}</p>
        <button type="button" class="gifted-learn-btn">Học cách làm</button>
        <div class="gifted-teach" hidden>
          <div class="gifted-teach-dots" aria-hidden="true"></div>
          <p class="gifted-step-count"></p>
          <h4 class="gifted-step-title"></h4>
          <div class="gifted-step-body"></div>
          <button type="button" class="gifted-step-next"></button>
        </div>
        <button type="button" class="gifted-reveal-btn" hidden>Xem lời giải</button>
        <p class="gifted-locked-note">Xem hết phần hướng dẫn thì nút lời giải mới hiện ra.</p>
        <p class="gifted-solution" hidden>${p.solution}</p>
      `;

      const learnBtn = card.querySelector('.gifted-learn-btn');
      const teachBox = card.querySelector('.gifted-teach');
      const dotsEl = card.querySelector('.gifted-teach-dots');
      const countEl = card.querySelector('.gifted-step-count');
      const titleEl = card.querySelector('.gifted-step-title');
      const bodyEl = card.querySelector('.gifted-step-body');
      const nextBtn = card.querySelector('.gifted-step-next');
      const revealBtn = card.querySelector('.gifted-reveal-btn');
      const noteEl = card.querySelector('.gifted-locked-note');
      const solutionEl = card.querySelector('.gifted-solution');

      // Chỉ mở nút lời giải sau khi học sinh đã xem hết các bước hướng dẫn.
      let stepIdx = 0;
      let unlocked = steps.length === 0;
      if (unlocked) { learnBtn.hidden = true; revealBtn.hidden = false; noteEl.hidden = true; }

      dotsEl.innerHTML = steps.map(() => '<i></i>').join('');
      const dots = Array.from(dotsEl.children);

      function paintStep() {
        const s = steps[stepIdx];
        countEl.textContent = `Bước ${stepIdx + 1}/${steps.length}`;
        titleEl.textContent = s.t;
        bodyEl.innerHTML = s.b;
        nextBtn.textContent = stepIdx < steps.length - 1 ? 'Đã hiểu, bước tiếp theo' : 'Đã hiểu hết, mở lời giải';
        dots.forEach((d, k) => d.classList.toggle('on', k <= stepIdx));
      }

      learnBtn.addEventListener('click', () => {
        sfx.click();
        learnBtn.hidden = true;
        teachBox.hidden = false;
        stepIdx = 0;
        paintStep();
      });

      nextBtn.addEventListener('click', () => {
        sfx.click();
        if (stepIdx < steps.length - 1) {
          stepIdx += 1;
          paintStep();
          teachBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          return;
        }
        unlocked = true;
        teachBox.hidden = true;
        noteEl.hidden = true;
        revealBtn.hidden = false;
        learnBtn.hidden = false;
        learnBtn.textContent = 'Xem lại hướng dẫn';
      });

      revealBtn.addEventListener('click', () => {
        if (!unlocked) return;
        sfx.click();
        const willShow = solutionEl.hidden;
        solutionEl.hidden = !willShow;
        revealBtn.textContent = willShow ? 'Ẩn lời giải' : 'Xem lời giải';
      });

      giftedProblemList.appendChild(card);
    });
  }

  giftedGradeRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.grade-card');
    if (!btn) return;
    sfx.click();
    giftedRenderProblems(parseInt(btn.dataset.grade, 10));
  });

  $('btnGiftedBack').addEventListener('click', () => {
    sfx.click();
    if (giftedCurrentGrade !== null) giftedShowGradePicker();
    else showScreen('home');
  });

  /* ================= SETUP ================= */
  const gradeRow = $('gradeRow');
  const opRow = $('opRow');
  const modeRow = $('modeRow');
  const bestBox = $('bestScoreBox');
  const btnStart = $('btnStartGame');

  function renderStars(container, count) {
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.className = 'star' + (i < count ? ' on' : '');
      s.textContent = '★';
      container.appendChild(s);
    }
  }

  function bestKey() { return `mathgame_best_${state.grade}_${state.op}_${state.mode}`; }

  function refreshBestBox() {
    if (state.grade && state.op && state.mode) {
      const raw = localStorage.getItem(bestKey());
      if (raw) {
        const best = JSON.parse(raw);
        $('bestScoreVal').textContent = best.score;
        renderStars($('bestStarsVal'), best.stars);
        bestBox.hidden = false;
      } else {
        $('bestScoreVal').textContent = '0';
        renderStars($('bestStarsVal'), 0);
        bestBox.hidden = false;
      }
      btnStart.disabled = false;
    } else {
      bestBox.hidden = true;
      btnStart.disabled = true;
    }
  }

  gradeRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.grade-card');
    if (!btn) return;
    sfx.click();
    [...gradeRow.children].forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    state.grade = parseInt(btn.dataset.grade, 10);
    refreshBestBox();
  });

  opRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.op-card');
    if (!btn) return;
    sfx.click();
    [...opRow.children].forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    state.op = btn.dataset.op;
    refreshBestBox();
  });

  modeRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-card');
    if (!btn) return;
    sfx.click();
    [...modeRow.children].forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    state.mode = btn.dataset.mode;
    refreshBestBox();
  });

  $('btnBackFromSetup').addEventListener('click', () => { sfx.click(); showScreen('home'); });

  $('btnStartGame').addEventListener('click', () => {
    sfx.click();
    startGame();
  });

  /* ================= GAME ================= */
  const hudLives = $('hudLives');
  const hudScore = $('hudScore');
  const hudProgress = $('hudProgress');
  const hudTimerWrap = $('hudTimerWrap');
  const hudTimerFill = $('hudTimerFill');
  const streakBadge = $('streakBadge');
  const streakVal = $('streakVal');
  const questionCard = $('questionCard');
  const questionText = $('questionText');
  const thinkingDots = $('thinkingDots');
  const activityStrip = $('activityStrip');
  const answersGrid = $('answersGrid');
  const mascotGame = $('mascotGame');
  const solutionBox = $('solutionBox');
  const solutionText = $('solutionText');
  const btnNextWord = $('btnNextWord');

  const HEART_SVG = `<svg class="heart" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-6.7-4.3-9.3-8.2C.6 9.6 1.6 6 4.7 4.8 7 3.9 9.4 4.8 12 7.6c2.6-2.8 5-3.7 7.3-2.8 3.1 1.2 4.1 4.8 2 8-2.6 3.9-9.3 8.2-9.3 8.2z"/></svg>`;

  function renderLives() {
    hudLives.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      span.innerHTML = HEART_SVG;
      if (i >= state.lives) span.firstElementChild.classList.add('lost');
      hudLives.appendChild(span.firstElementChild);
    }
  }

  function updateTimerBar() {
    const pct = Math.max(0, (state.timeLeft / 60) * 100);
    hudTimerFill.style.width = pct + '%';
    hudTimerFill.classList.toggle('warn', state.timeLeft <= 20 && state.timeLeft > 10);
    hudTimerFill.classList.toggle('danger', state.timeLeft <= 10);
  }

  const THEMES = [
    { g1: 'rgba(245, 158, 11, 0.28)', g2: 'rgba(236, 72, 153, 0.24)', g3: 'rgba(37, 99, 235, 0.26)' }, // Hoàng hôn
    { g1: 'rgba(6, 182, 212, 0.28)', g2: 'rgba(37, 99, 235, 0.24)', g3: 'rgba(16, 185, 129, 0.26)' }, // Đại dương
    { g1: 'rgba(236, 72, 153, 0.28)', g2: 'rgba(168, 85, 247, 0.24)', g3: 'rgba(245, 158, 11, 0.24)' }, // Kẹo ngọt
    { g1: 'rgba(34, 197, 94, 0.28)', g2: 'rgba(132, 204, 22, 0.22)', g3: 'rgba(37, 99, 235, 0.24)' }, // Rừng xanh
    { g1: 'rgba(139, 92, 246, 0.28)', g2: 'rgba(236, 72, 153, 0.24)', g3: 'rgba(79, 70, 229, 0.26)' }, // Ngân hà
    { g1: 'rgba(249, 115, 22, 0.28)', g2: 'rgba(239, 68, 68, 0.22)', g3: 'rgba(245, 158, 11, 0.24)' }, // Lửa hồng
  ];
  let lastThemeIdx = -1;
  function applyRandomTheme() {
    let idx;
    do { idx = randInt(0, THEMES.length - 1); } while (idx === lastThemeIdx && THEMES.length > 1);
    lastThemeIdx = idx;
    const t = THEMES[idx];
    const root = document.documentElement.style;
    root.setProperty('--glow-1', t.g1);
    root.setProperty('--glow-2', t.g2);
    root.setProperty('--glow-3', t.g3);
  }

  function startGame() {
    applyRandomTheme();
    state.score = 0; state.lives = 3; state.streak = 0; state.bestStreak = 0;
    state.correct = 0; state.answered = 0; state.locked = false;
    state.timeLeft = 60;
    clearInterval(state.timerId);

    hudScore.textContent = '0';
    renderLives();
    streakBadge.hidden = true;
    setMascot(mascotGame, 'idle');

    if (state.mode === 'timed') {
      hudTimerWrap.hidden = false;
      updateTimerBar();
      state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerBar();
        if (state.timeLeft <= 0) {
          clearInterval(state.timerId);
          endGame();
        }
      }, 1000);
    } else {
      hudTimerWrap.hidden = true;
    }

    showScreen('game');
    nextQuestion();
  }

  const QUESTION_ANIMS = ['anim-pop', 'anim-slide-up', 'anim-slide-side'];
  let thinkTimeoutId = null;

  function nextQuestion() {
    state.locked = true;
    questionCard.classList.remove('shake', 'correct-flash', ...QUESTION_ANIMS);
    answersGrid.innerHTML = '';
    solutionBox.hidden = true;
    questionText.hidden = true;
    thinkingDots.hidden = false;
    activityStrip.hidden = true;
    setMascot(mascotGame, 'think');

    clearTimeout(thinkTimeoutId);
    thinkTimeoutId = setTimeout(renderQuestion, 550 + randInt(0, 250));
  }

  function renderQuestion() {
    thinkingDots.hidden = true;
    questionText.hidden = false;
    setMascot(mascotGame, 'idle');
    state.locked = false;

    if (state.mode === 'practice') {
      hudProgress.textContent = `Câu ${state.answered + 1}/${state.totalQuestions}`;
    } else {
      hudProgress.textContent = `Câu số ${state.answered + 1}`;
    }
    const q = state.op === 'word' ? generateWordProblem(state.grade) : generateQuestion(state.grade, state.op);
    state.current = q;
    questionText.textContent = q.isWord ? q.text : `${q.text} = ?`;
    questionText.classList.toggle('word-text', !!q.isWord);
    questionCard.classList.add(pick(QUESTION_ANIMS));

    answersGrid.innerHTML = '';
    q.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn reveal';
      btn.style.animationDelay = (i * 70) + 'ms';
      btn.textContent = fmtNum(choice);
      btn.addEventListener('click', () => selectAnswer(choice, btn));
      answersGrid.appendChild(btn);
    });
    activityStrip.hidden = false;
  }

  function selectAnswer(choice, btn) {
    if (state.locked) return;
    state.locked = true;
    activityStrip.hidden = true;
    state.answered++;
    const isCorrect = choice === state.current.answer;
    const allBtns = [...answersGrid.children];
    allBtns.forEach(b => { b.disabled = true; if (b !== btn) b.classList.add('dim'); });

    if (isCorrect) {
      btn.classList.remove('dim');
      btn.classList.add('correct');
      questionCard.classList.add('correct-flash');
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const points = 10 * (1 + Math.floor(state.streak / 3));
      state.score += points;
      state.correct++;
      hudScore.textContent = state.score;
      sfx.correct();
      setMascot(mascotGame, 'happy');
      if (state.streak >= 3) {
        streakVal.textContent = state.streak;
        streakBadge.hidden = false;
      } else {
        streakBadge.hidden = true;
      }
    } else {
      btn.classList.remove('dim');
      btn.classList.add('wrong');
      allBtns.forEach(b => {
        if (Number(b.textContent.replace(',', '.')) === state.current.answer) b.classList.add('correct');
      });
      questionCard.classList.add('shake');
      state.streak = 0;
      state.lives--;
      renderLives();
      sfx.wrong();
      setMascot(mascotGame, 'sad');
      streakBadge.hidden = true;
    }

    if (state.current.isWord) {
      solutionText.textContent = state.current.solution;
      solutionBox.hidden = false;
      pendingAdvance = advanceAfterAnswer;
      return;
    }

    const delay = isCorrect ? 850 : 1200;
    setTimeout(advanceAfterAnswer, delay);
  }

  let pendingAdvance = null;
  btnNextWord.addEventListener('click', () => {
    sfx.click();
    solutionBox.hidden = true;
    if (pendingAdvance) {
      const fn = pendingAdvance;
      pendingAdvance = null;
      fn();
    }
  });

  function advanceAfterAnswer() {
    setMascot(mascotGame, 'idle');
    if (state.lives <= 0) { endGame(); return; }
    if (state.mode === 'practice' && state.answered >= state.totalQuestions) { endGame(); return; }
    if (state.answered % 5 === 0) { showBreak(); return; }
    nextQuestion();
  }

  /* ================= FUN BREAK ================= */
  const JOKES = [
    { q: 'Số nào luôn vui vẻ nhất?', a: 'Số 8, vì trông nó lúc nào cũng như đang cười tít mắt!' },
    { q: 'Vì sao cục tẩy hay buồn?', a: 'Vì suốt ngày phải xóa hết những gì bạn vừa viết!' },
    { q: 'Con số nào thích ăn bánh nhất?', a: 'Số 0, vì nó tròn xoe như một chiếc bánh!' },
    { q: 'Cây bút chì muốn nói gì với cục tẩy?', a: '"Cảm ơn cậu đã luôn xóa giúp mình những lỗi sai!"' },
    { q: 'Vì sao hình tròn chẳng bao giờ cãi nhau với ai?', a: 'Vì nó không có góc cạnh nào để mà gắt gỏng cả!' },
    { q: 'Con vật nào trong rừng học toán giỏi nhất?', a: 'Cú Thông Thái, vì cú lúc nào cũng thức khuya làm bài tập!' },
    { q: 'Vì sao quyển vở toán luôn dày cộp?', a: 'Vì nó chứa cả triệu con số đang chờ được tính ra!' },
    { q: 'Con vật nào tính nhẩm nhanh nhất rừng xanh?', a: 'Con Sóc, vì sóc lúc nào cũng nhanh nhẹn và lanh lợi!' },
    { q: 'Vì sao chiếc đồng hồ luôn thắng cuộc thi chạy?', a: 'Vì kim giây của nó chạy không ngừng nghỉ!' },
    { q: 'Hai với hai là mấy, mà đố ai nhìn thấy hoài không ra?', a: 'Là số 4, ẩn ngay trong phép cộng 2 + 2 đó!' },
    { q: 'Vì sao số 1 luôn đứng đầu?', a: 'Vì nó bé nhất trong các số có 1 chữ số nên được xếp hàng đầu tiên!' },
    { q: 'Con gì trong lớp học luôn "giơ tay" phát biểu?', a: 'Cây thước kẻ, vì nó lúc nào cũng thẳng và giơ lên bảng!' },
    { q: 'Vì sao phép nhân luôn được các bạn số yêu quý?', a: 'Vì nó giúp các số nhân lên thật nhanh, ai cũng muốn đông vui hơn!' },
    { q: 'Chiếc cặp sách nặng là vì sao?', a: 'Vì trong đó chứa cả một kho kiến thức của các bạn nhỏ!' },
    { q: 'Vì sao hình vuông không bao giờ bị lạc đường?', a: 'Vì nó có tới 4 góc để định vị phương hướng!' },
    { q: 'Bạn nào trong truyện cổ tích giỏi chia đều nhất?', a: 'Nàng Bạch Tuyết, vì có tới 7 chú lùn để chia đều mọi thứ!' },
    { q: 'Vì sao cái compa luôn vẽ được vòng tròn đẹp?', a: 'Vì nó biết giữ đúng khoảng cách với tâm, không đi lệch bước nào!' },
    { q: 'Số nào thích nằm phơi nắng nhất?', a: 'Số 8, vì nằm ngang là biểu tượng vô cực, mát cả ngày!' },
    { q: 'Vì sao các bạn số 2, 4, 6, 8 luôn chơi cùng nhau?', a: 'Vì chúng đều là số chẵn, hợp thành một hội rất thân thiết!' },
    { q: 'Vì sao quyển sổ tay của Rô-bốt Số không bao giờ hết trang?', a: 'Vì mỗi ngày Rô-bốt lại nghĩ ra một câu đố vui mới toanh!' },
  ];

  // Trắc nghiệm đố vui — mỗi câu: choices[0] LUÔN là đáp án đúng (được xáo
  // trộn vị trí lúc hiển thị). Gộp nhiều chủ đề (con vật, trái cây, nghề
  // nghiệp, xe cộ, thiên nhiên, đố mẹo gây cười) để kho câu hỏi lớn, ít lặp.
  const QUIZ_RIDDLES = [
    { q: 'Con gì kêu "meo meo", thích bắt chuột?', choices: ['Con mèo', 'Con chó', 'Con hổ', 'Con thỏ'] },
    { q: 'Con gì kêu "gâu gâu", giữ nhà rất giỏi?', choices: ['Con chó', 'Con mèo', 'Con gà', 'Con vịt'] },
    { q: 'Con gì có vòi dài, tai to, sống ở rừng?', choices: ['Con voi', 'Con hươu cao cổ', 'Con tê giác', 'Con gấu'] },
    { q: 'Con gì có sừng, giúp bác nông dân kéo cày?', choices: ['Con trâu', 'Con dê', 'Con cừu', 'Con ngựa'] },
    { q: 'Con gì đẻ trứng, sáng sớm gáy "ò ó o" gọi cả nhà dậy?', choices: ['Con gà trống', 'Con vịt', 'Con ngỗng', 'Con chim sẻ'] },
    { q: 'Con gì có mào đỏ, hay bới đất tìm thóc?', choices: ['Con gà mái', 'Con gà trống', 'Con vịt', 'Con ngan'] },
    { q: 'Con gì kêu "ụm bò", cho ta sữa uống mỗi ngày?', choices: ['Con bò sữa', 'Con trâu', 'Con dê', 'Con ngựa'] },
    { q: 'Con gì kêu "cạp cạp", thích bơi lội dưới ao?', choices: ['Con vịt', 'Con ngan', 'Con ngỗng', 'Con gà'] },
    { q: 'Con gì bé xíu mà rất chăm chỉ, cả đàn cùng tha mồi về tổ?', choices: ['Con kiến', 'Con ong', 'Con nhện', 'Con sâu'] },
    { q: 'Con gì nhả tơ làm kén, sau này hóa thành bướm?', choices: ['Con tằm', 'Con nhện', 'Con sâu', 'Con kiến'] },
    { q: 'Con gì có cánh, bay vo ve khắp vườn hoa, làm ra mật ngọt?', choices: ['Con ong', 'Con bướm', 'Con ruồi', 'Con muỗi'] },
    { q: 'Con gì có mai cứng trên lưng, bò rất chậm chạp?', choices: ['Con rùa', 'Con ốc', 'Con cua', 'Con cá sấu'] },
    { q: 'Con gì tai dài, mắt đỏ, thích gặm cà rốt?', choices: ['Con thỏ', 'Con chuột', 'Con sóc', 'Con nai'] },
    { q: 'Con gì kêu "ộp ộp", sống được cả trên cạn lẫn dưới nước?', choices: ['Con ếch', 'Con cóc', 'Con cá', 'Con rắn'] },
    { q: 'Con gì leo cây cực giỏi, rất thích ăn chuối?', choices: ['Con khỉ', 'Con sóc', 'Con gấu', 'Con mèo'] },
    { q: 'Con gì lông xù trắng như bông, kêu "be be"?', choices: ['Con cừu', 'Con dê', 'Con thỏ', 'Con chó'] },
    { q: 'Con gì được gọi là "chúa sơn lâm"?', choices: ['Con hổ', 'Con sư tử', 'Con gấu', 'Con báo'] },
    { q: 'Con gì có bờm oai vệ, được mệnh danh là "vua muông thú"?', choices: ['Con sư tử', 'Con hổ', 'Con báo', 'Con voi'] },
    { q: 'Con gì thức đêm, mắt tròn to, kêu "u u"?', choices: ['Con cú mèo', 'Con dơi', 'Con chim sẻ', 'Con quạ'] },
    { q: 'Con gì cổ dài, chân cao, là loài vật cao nhất trên cạn?', choices: ['Con hươu cao cổ', 'Con voi', 'Con ngựa', 'Con lạc đà'] },
    { q: 'Quả gì vỏ cam, chia nhiều múi, nhiều vitamin C?', choices: ['Quả cam', 'Quả quýt', 'Quả bưởi', 'Quả chanh'] },
    { q: 'Quả gì vỏ vàng, dài cong, khỉ rất thích ăn?', choices: ['Quả chuối', 'Quả xoài', 'Quả đu đủ', 'Quả dứa'] },
    { q: 'Quả gì vỏ xanh, ruột đỏ mọng nước, có nhiều hạt đen?', choices: ['Quả dưa hấu', 'Quả đu đủ', 'Quả táo', 'Quả lê'] },
    { q: 'Quả gì vỏ sần vàng, có mắt, ăn thơm và chua ngọt?', choices: ['Quả dứa', 'Quả mít', 'Quả sầu riêng', 'Quả na'] },
    { q: 'Quả gì gai đầy mình, mùi rất nồng, ai cũng biết tiếng?', choices: ['Quả sầu riêng', 'Quả mít', 'Quả chôm chôm', 'Quả dứa'] },
    { q: 'Quả gì tròn nhỏ mọc thành chùm, vỏ có gai mềm màu đỏ?', choices: ['Quả chôm chôm', 'Quả vải', 'Quả nhãn', 'Quả dâu'] },
    { q: 'Quả gì vỏ dày múi to, hay ăn kèm muối ớt cho đỡ chua?', choices: ['Quả bưởi', 'Quả cam', 'Quả quýt', 'Quả chanh'] },
    { q: 'Quả gì vỏ đỏ hình trái tim, hạt lấm tấm bên ngoài?', choices: ['Quả dâu tây', 'Quả táo', 'Quả nho', 'Quả cà chua'] },
    { q: 'Quả gì mọc thành chùm, khi chín có màu tím hoặc xanh?', choices: ['Quả nho', 'Quả dâu', 'Quả nhãn', 'Quả vải'] },
    { q: 'Quả gì vỏ xanh gai, bổ ra có múi vàng thơm lừng?', choices: ['Quả mít', 'Quả sầu riêng', 'Quả dứa', 'Quả na'] },
    { q: 'Quả gì tròn giòn, có nhiều màu đỏ, xanh, vàng?', choices: ['Quả táo', 'Quả lê', 'Quả ổi', 'Quả cam'] },
    { q: 'Quả gì vỏ xanh vàng, ruột cam, mùi rất thơm khi chín?', choices: ['Quả đu đủ', 'Quả xoài', 'Quả hồng', 'Quả cam'] },
    { q: 'Quả gì vỏ mỏng trơn, ruột vàng, có hạt dẹt to ở giữa?', choices: ['Quả xoài', 'Quả đu đủ', 'Quả mận', 'Quả hồng'] },
    { q: 'Quả gì vỏ đỏ sần sùi, bóc ra cùi trắng ngọt lịm?', choices: ['Quả vải', 'Quả nhãn', 'Quả chôm chôm', 'Quả dâu'] },
    { q: 'Quả gì tròn nhỏ vỏ nâu, cùi trắng trong, có hạt đen?', choices: ['Quả nhãn', 'Quả vải', 'Quả chôm chôm', 'Quả táo'] },
    { q: 'Ai mặc áo blouse trắng, khám chữa bệnh cho mọi người?', choices: ['Bác sĩ', 'Y tá', 'Dược sĩ', 'Giáo viên'] },
    { q: 'Ai đứng trên bục giảng, dạy các con học chữ mỗi ngày?', choices: ['Giáo viên', 'Bác sĩ', 'Kỹ sư', 'Nhà báo'] },
    { q: 'Ai xây nên những ngôi nhà, tòa cao tầng?', choices: ['Kỹ sư xây dựng', 'Bác sĩ', 'Nông dân', 'Đầu bếp'] },
    { q: 'Ai lái máy bay, đưa hành khách bay khắp nơi trên trời?', choices: ['Phi công', 'Tài xế', 'Thuyền trưởng', 'Lái tàu'] },
    { q: 'Ai giúp chúng ta chữa răng đau?', choices: ['Nha sĩ', 'Bác sĩ mắt', 'Y tá', 'Dược sĩ'] },
    { q: 'Ai nướng những ổ bánh mì thơm phức mỗi sáng?', choices: ['Thợ làm bánh', 'Đầu bếp', 'Nông dân', 'Thợ may'] },
    { q: 'Ai giữ trật tự đường phố, giúp đỡ người dân?', choices: ['Công an', 'Bộ đội', 'Lính cứu hỏa', 'Bảo vệ'] },
    { q: 'Ai xông vào đám cháy để cứu người và dập lửa?', choices: ['Lính cứu hỏa', 'Công an', 'Bác sĩ', 'Bộ đội'] },
    { q: 'Ai cấy lúa, trồng rau ngoài đồng cho ta có gạo ăn?', choices: ['Nông dân', 'Ngư dân', 'Công nhân', 'Thợ mộc'] },
    { q: 'Ai chăm sóc bệnh nhân, tiêm thuốc theo lệnh bác sĩ?', choices: ['Y tá', 'Bác sĩ', 'Dược sĩ', 'Hộ lý'] },
    { q: 'Ai ra khơi đánh bắt cá mỗi ngày?', choices: ['Ngư dân', 'Nông dân', 'Thủy thủ', 'Thợ lặn'] },
    { q: 'Ai vẽ ra bản thiết kế cho ngôi nhà trước khi xây?', choices: ['Kiến trúc sư', 'Kỹ sư điện', 'Họa sĩ', 'Thợ xây'] },
    { q: 'Ai may nên những bộ quần áo đẹp cho chúng ta mặc?', choices: ['Thợ may', 'Thợ giày', 'Thợ tóc', 'Họa sĩ'] },
    { q: 'Ai cắt tóc, tạo kiểu tóc đẹp cho mọi người?', choices: ['Thợ cắt tóc', 'Thợ may', 'Bác sĩ da liễu', 'Nha sĩ'] },
    { q: 'Ai lái tàu hỏa, chở hành khách đi xa?', choices: ['Lái tàu', 'Phi công', 'Tài xế', 'Thuyền trưởng'] },
    { q: 'Xe gì hai bánh, phải đạp bằng chân mới chạy được?', choices: ['Xe đạp', 'Xe máy', 'Xe ba bánh', 'Xe điện'] },
    { q: 'Xe gì hai bánh, có động cơ, không cần đạp vẫn chạy?', choices: ['Xe máy', 'Xe đạp', 'Xe buýt', 'Xe tải'] },
    { q: 'Xe gì to lớn, chở được rất nhiều hành khách cùng lúc?', choices: ['Xe buýt', 'Xe taxi', 'Xe máy', 'Xe tải'] },
    { q: 'Xe gì kêu "e e", sơn trắng đỏ, chở người đi cấp cứu?', choices: ['Xe cứu thương', 'Xe cứu hỏa', 'Xe công an', 'Xe taxi'] },
    { q: 'Xe gì màu đỏ, có thang dài, chuyên đi dập tắt đám cháy?', choices: ['Xe cứu hỏa', 'Xe cứu thương', 'Xe công an', 'Xe rác'] },
    { q: 'Xe gì chạy trên đường ray, kéo theo nhiều toa?', choices: ['Xe lửa', 'Xe buýt', 'Xe điện', 'Xe khách'] },
    { q: 'Xe gì bay trên trời, có cánh và động cơ phản lực?', choices: ['Máy bay', 'Trực thăng', 'Khinh khí cầu', 'Tên lửa'] },
    { q: 'Xe gì có cánh quạt trên nóc, có thể đứng yên giữa trời?', choices: ['Máy bay trực thăng', 'Máy bay', 'Diều', 'Khinh khí cầu'] },
    { q: 'Xe gì chạy trên mặt nước, chở người qua sông?', choices: ['Thuyền', 'Tàu hỏa', 'Ô tô', 'Xe máy'] },
    { q: 'Xe gì có thùng to phía sau, chuyên chở hàng hóa nặng?', choices: ['Xe tải', 'Xe con', 'Xe máy', 'Xe đạp'] },
    { q: 'Xe gì các bạn nhỏ hay ngồi đi học mỗi sáng, sơn màu vàng?', choices: ['Xe buýt trường học', 'Xe cứu thương', 'Xe tải', 'Xe rác'] },
    { q: 'Xe gì có đèn xanh đỏ nhấp nháy, chuyên đi bắt kẻ xấu?', choices: ['Xe công an', 'Xe cứu hỏa', 'Xe cứu thương', 'Xe khách'] },
    { q: 'Xe gì chạy bằng bốn bánh, có động cơ, chở được vài người?', choices: ['Ô tô', 'Xe máy', 'Xe đạp', 'Xe ba gác'] },
    { q: 'Xe gì to khổng lồ, có thể bay lên tận vũ trụ?', choices: ['Tàu vũ trụ', 'Máy bay', 'Khinh khí cầu', 'Tên lửa đồ chơi'] },
    { q: 'Cái gì sáng chói ban ngày, sưởi ấm cho muôn loài?', choices: ['Mặt trời', 'Mặt trăng', 'Ngôi sao', 'Đèn'] },
    { q: 'Cái gì tỏa sáng dịu dàng vào ban đêm?', choices: ['Mặt trăng', 'Mặt trời', 'Ngôi sao', 'Đèn pin'] },
    { q: 'Cái gì lất phất rơi xuống làm ướt áo, mà không phải đi tắm?', choices: ['Mưa', 'Sương', 'Tuyết', 'Sóng biển'] },
    { q: 'Cái gì thổi mát, làm cành cây đung đưa mà không nhìn thấy được?', choices: ['Gió', 'Mưa', 'Nắng', 'Mây'] },
    { q: 'Cái gì trắng bồng bềnh trên bầu trời, hay đổi hình dạng?', choices: ['Mây', 'Sương mù', 'Khói', 'Bụi'] },
    { q: 'Cái gì ầm ầm vang trời sau khi có tia chớp lóe sáng?', choices: ['Sấm', 'Sét', 'Mưa', 'Gió bão'] },
    { q: 'Cái gì có bảy sắc màu, thường xuất hiện sau cơn mưa?', choices: ['Cầu vồng', 'Mây', 'Sấm sét', 'Ánh trăng'] },
    { q: 'Mùa nào trời nóng bức nhất, các bạn được nghỉ hè?', choices: ['Mùa hè', 'Mùa xuân', 'Mùa thu', 'Mùa đông'] },
    { q: 'Mùa nào lạnh nhất trong năm, đôi khi có tuyết rơi?', choices: ['Mùa đông', 'Mùa hè', 'Mùa xuân', 'Mùa thu'] },
    { q: 'Mùa nào cây cối đâm chồi nảy lộc, trăm hoa đua nở?', choices: ['Mùa xuân', 'Mùa hè', 'Mùa thu', 'Mùa đông'] },
    { q: 'Mùa nào lá vàng rụng đầy sân, trời se se lạnh?', choices: ['Mùa thu', 'Mùa xuân', 'Mùa hè', 'Mùa đông'] },
    { q: 'Cái gì li ti đọng trên lá cỏ vào mỗi sáng sớm?', choices: ['Sương', 'Mưa', 'Tuyết', 'Nước mưa'] },
    { q: 'Cái gì gào thét dữ dội, cuốn theo mưa to gió lớn?', choices: ['Bão', 'Gió nhẹ', 'Sương mù', 'Mây đen'] },
    { q: 'Cái gì càng lấy ra càng to?', choices: ['Cái hố', 'Cái hộp', 'Quả bóng', 'Cục tẩy'] },
    { q: 'Cái gì mất đi rồi 5 giây sau lại có ngay, cứ thế suốt đời?', choices: ['Hơi thở', 'Giấc ngủ', 'Nụ cười', 'Cơn đói'] },
    { q: 'Con gì không có chân mà đi khắp muôn nơi?', choices: ['Con đường', 'Con sông', 'Con thuyền', 'Đám mây'] },
    { q: 'Cái gì đập liên tục suốt đời mà không bao giờ vỡ?', choices: ['Trái tim', 'Quả trứng', 'Cái trống', 'Ly thủy tinh'] },
    { q: 'Cái gì càng rửa lại càng bẩn?', choices: ['Nước rửa bát', 'Cái khăn lau', 'Đôi tay', 'Cái chén'] },
    { q: 'Cái gì cho đi rồi mà mình vẫn còn giữ nguyên?', choices: ['Lời hứa', 'Cái kẹo', 'Đồ chơi', 'Cây bút'] },
    { q: 'Con gì ngủ mà không bao giờ nhắm mắt?', choices: ['Con cá', 'Con mèo', 'Con chó', 'Con gà'] },
    { q: 'Cái gì luôn đi lên chứ không bao giờ đi xuống?', choices: ['Tuổi của con người', 'Thang máy', 'Diều', 'Bong bóng'] },
    { q: 'Bóng đèn nào sáng nhất trong nhà?', choices: ['Bóng đèn mới thay', 'Bóng đèn to nhất', 'Bóng đèn ngủ', 'Đèn pin'] },
    { q: 'Cái gì càng cao càng ngắn lại?', choices: ['Ngọn nến đang cháy', 'Cái thang', 'Cây viết chì', 'Sợi dây'] },
    { q: 'Con gì càng đánh càng kêu to, càng vui tai?', choices: ['Cái trống', 'Con chó', 'Cái chiêng', 'Quả bóng'] },
    { q: 'Cái gì một khi đã nói ra thì không thể "đóng" lại được nữa?', choices: ['Lời nói', 'Cửa sổ', 'Hộp quà', 'Quyển sách'] },
    { q: 'Tủ lạnh mở ra thì đèn sáng, đóng lại thì đèn tắt — ai đã tắt đèn?', choices: ['Cái công tắc cửa tủ', 'Ông trời', 'Con ma', 'Không ai cả'] },
    { q: 'Cái gì càng chia sẻ cho nhiều người thì lại càng nhiều thêm?', choices: ['Niềm vui', 'Cái bánh', 'Tiền bạc', 'Đồ chơi'] },
    { q: 'Cái gì có đầu có đuôi mà không hề có thân mình?', choices: ['Đồng xu', 'Con rắn', 'Con giun', 'Sợi dây'] },
    { q: 'Cái gì càng bị đập thì càng mỏng ra?', choices: ['Tờ giấy', 'Cái trống', 'Quả bóng', 'Cục đất sét'] },
    { q: 'Cái gì luôn chạy phía trước ta khi trời nắng mà không bao giờ đuổi kịp?', choices: ['Cái bóng của mình', 'Con chó', 'Chiếc xe', 'Đám mây'] },
    { q: 'Bàn nào không thể kê đồ vật lên trên được?', choices: ['Bàn chân', 'Bàn học', 'Bàn ăn', 'Bàn ghế'] },
    { q: 'Cái gì bạn phải cho đi thì mới giữ được nó mãi mãi trong lòng?', choices: ['Lòng tốt', 'Đồ chơi', 'Cái kẹo', 'Cây bút'] },
    { q: 'Cái gì rỗng ruột mà vẫn đựng đầy nước được?', choices: ['Cái ly', 'Hòn đá', 'Quả bóng đặc', 'Khối gỗ'] },
    { q: 'Cái gì không có mà ai cũng lo sợ bị mất đi?', choices: ['Thời gian', 'Đồ chơi', 'Tiền bạc', 'Chìa khóa'] },
  ];

  // Trộn 2 kiểu "giải lao": kiểu joke-kể-cười (bật mí đáp án) và kiểu
  // trắc nghiệm (chọn 1 trong 4) — kho lớn, xáo bài không lặp cho tới khi
  // hết vòng mới xáo lại, nên phần đố vui luôn cảm giác mới mẻ.
  const BREAK_ITEMS = [
    ...JOKES.map((j) => ({ type: 'joke', q: j.q, a: j.a })),
    ...QUIZ_RIDDLES.map((r) => ({ type: 'quiz', q: r.q, choices: r.choices })),
  ];

  const breakOverlay = $('breakOverlay');
  const breakQuizGrid = $('breakQuizGrid');

  function renderBreakQuiz(item) {
    breakQuizGrid.innerHTML = '';
    breakQuizGrid.hidden = false;
    const correctText = item.choices[0];
    const shuffled = [...item.choices].sort(() => Math.random() - 0.5);
    shuffled.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'break-quiz-btn reveal';
      btn.style.animationDelay = (i * 70) + 'ms';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        const allBtns = [...breakQuizGrid.children];
        allBtns.forEach((b) => { b.disabled = true; });
        const isCorrect = choice === correctText;
        if (isCorrect) {
          btn.classList.add('correct');
          sfx.correct();
          setMascot($('mascotBreak'), 'happy');
        } else {
          btn.classList.add('wrong');
          allBtns.forEach((b) => {
            if (b === btn) return;
            if (b.textContent === correctText) b.classList.add('correct'); else b.classList.add('dim');
          });
          sfx.wrong();
          setMascot($('mascotBreak'), 'sad');
        }
        $('btnContinueGame').hidden = false;
      });
      breakQuizGrid.appendChild(btn);
    });
  }

  function showBreak() {
    clearInterval(state.timerId);
    const idx = nextFromShuffledBag('mathgame_joke_bag', BREAK_ITEMS.length);
    const item = BREAK_ITEMS[idx];
    $('breakJokeQ').textContent = item.q;
    breakQuizGrid.hidden = true;
    breakQuizGrid.innerHTML = '';
    $('btnContinueGame').hidden = true;
    if (item.type === 'quiz') {
      $('breakJokeA').hidden = true;
      $('btnRevealJoke').hidden = true;
      renderBreakQuiz(item);
    } else {
      $('breakJokeA').textContent = item.a;
      $('breakJokeA').hidden = true;
      $('btnRevealJoke').hidden = false;
    }
    setMascot($('mascotBreak'), 'happy');
    breakOverlay.hidden = false;
    sfx.win();
    spawnConfetti(36);
  }

  $('btnRevealJoke').addEventListener('click', () => {
    sfx.click();
    $('breakJokeA').hidden = false;
    $('btnRevealJoke').hidden = true;
    $('btnContinueGame').hidden = false;
  });

  $('btnContinueGame').addEventListener('click', () => {
    sfx.click();
    breakOverlay.hidden = true;
    if (state.mode === 'timed') {
      state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerBar();
        if (state.timeLeft <= 0) {
          clearInterval(state.timerId);
          endGame();
        }
      }, 1000);
    }
    nextQuestion();
  });

  $('btnQuit').addEventListener('click', () => {
    sfx.click();
    clearInterval(state.timerId);
    clearTimeout(thinkTimeoutId);
    showScreen('setup');
  });

  /* ================= RESULT ================= */
  function computeStars() {
    const total = state.mode === 'practice' ? state.totalQuestions : Math.max(1, state.answered);
    const pct = state.correct / total;
    if (pct >= 0.9) return 3;
    if (pct >= 0.7) return 2;
    if (pct >= 0.4) return 1;
    return 0;
  }

  function spawnConfetti(count = 70) {
    const layer = $('confettiLayer');
    const colors = ['#2563EB', '#F59E0B', '#EC4899', '#16A34A', '#60A5FA'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = randInt(6, 12);
      el.style.width = size + 'px';
      el.style.height = (size * 0.5) + 'px';
      el.style.left = randInt(0, 100) + 'vw';
      el.style.background = pick(colors);
      const dur = (randInt(18, 34) / 10);
      const delay = randInt(0, 6) / 10;
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = delay + 's';
      layer.appendChild(el);
      setTimeout(() => el.remove(), (dur + delay) * 1000 + 100);
    }
  }

  function endGame() {
    clearInterval(state.timerId);
    clearTimeout(thinkTimeoutId);
    const stars = computeStars();
    const titles = ['Luyện thêm nhé!', 'Cố lên nào!', 'Giỏi quá!', 'Xuất sắc!'];
    $('resultTitle').textContent = titles[stars];
    $('statCorrect').textContent = `${state.correct}/${state.mode === 'practice' ? state.totalQuestions : state.answered}`;
    $('statScore').textContent = state.score;
    $('statBestStreak').textContent = state.bestStreak;

    [...document.querySelectorAll('.star')].forEach((s, i) => {
      s.classList.toggle('on', i < stars);
    });

    setMascot($('mascotResult'), stars >= 2 ? 'happy' : 'sad');

    const key = bestKey();
    const raw = localStorage.getItem(key);
    const prevBest = raw ? JSON.parse(raw) : null;
    const isRecord = !prevBest || state.score > prevBest.score;
    $('newRecordBadge').hidden = !isRecord || state.score === 0;
    if (isRecord) {
      localStorage.setItem(key, JSON.stringify({ score: state.score, stars }));
    }

    if (stars === 3 || isRecord) {
      sfx.win();
      spawnConfetti();
    }

    showScreen('result');
  }

  const OP_POOL = ['add', 'sub', 'mul', 'div', 'mix', 'word'];
  function randomizeOpSelection() {
    let next;
    do { next = pick(OP_POOL); } while (next === state.op && OP_POOL.length > 1);
    state.op = next;
    [...opRow.children].forEach(c => c.classList.toggle('selected', c.dataset.op === next));
  }

  /* ================= BROWSER PICKER ================= */
  const browserPickerModal = $('browserPickerModal');
  const browserPickerList = $('browserPickerList');
  const BROWSER_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm0 4v11h16V8H4zm1.5-2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>';
  let pendingShareOpts = null;
  let pendingCaptureRect = null;

  const browserPickerDesc = $('browserPickerDesc');

  async function openBrowserPicker(opts, desc, captureRect) {
    pendingShareOpts = opts;
    pendingCaptureRect = captureRect || null;
    if (desc) browserPickerDesc.textContent = desc;
    browserPickerList.innerHTML = '';
    let browsers = [];
    if (window.electronAPI && window.electronAPI.getInstalledBrowsers) {
      browsers = await window.electronAPI.getInstalledBrowsers();
    }
    const options = [{ key: 'default', name: 'Trình duyệt mặc định' }, ...browsers];
    options.forEach((b) => {
      const btn = document.createElement('button');
      btn.className = 'browser-pick-btn';
      btn.innerHTML = `${BROWSER_ICON}<span>${b.name}</span>`;
      btn.addEventListener('click', async () => {
        sfx.click();
        if (pendingCaptureRect && window.electronAPI && window.electronAPI.captureResultScreenshot) {
          await window.electronAPI.captureResultScreenshot(pendingCaptureRect);
        }
        if (window.electronAPI && pendingShareOpts) {
          window.electronAPI.openUrlInBrowser({ ...pendingShareOpts, browserKey: b.key });
        }
        browserPickerModal.hidden = true;
      });
      browserPickerList.appendChild(btn);
    });
    browserPickerModal.hidden = false;
  }

  $('btnCloseBrowserPicker').addEventListener('click', () => { sfx.click(); browserPickerModal.hidden = true; });
  browserPickerModal.addEventListener('click', (e) => { if (e.target.id === 'browserPickerModal') browserPickerModal.hidden = true; });

  // Draws an actual "achievement card" (score, stars, stats) instead of
  // sharing a bare text+link — this is the thing worth "khoe" (showing off)
  // on Facebook, and it's what makes the shared post visually represent the
  // real result instead of a generic message.
  const RESULT_TITLES = ['Luyện thêm nhé!', 'Cố lên nào!', 'Giỏi quá!', 'Xuất sắc!'];
  function buildResultShareImage(stars, total) {
    const width = 720, height = 720;
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0B1230');
    bgGrad.addColorStop(0.5, '#131B45');
    bgGrad.addColorStop(1, '#1B2A5E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.4 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.font = '900 34px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#FFD98F';
    ctx.fillText('TOÁN VUI CẤP 1', width / 2, 90);

    ctx.font = '900 46px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(RESULT_TITLES[stars], width / 2, 165);

    ctx.font = '64px "Segoe UI", system-ui, sans-serif';
    const starGap = 74;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < stars ? '#FFD200' : 'rgba(255,255,255,0.22)';
      ctx.fillText('★', width / 2 + (i - 1) * starGap, 260);
    }

    ctx.font = '900 130px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#4FC3F7';
    ctx.fillText(String(state.score), width / 2, 430);
    ctx.font = '700 24px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('ĐIỂM', width / 2, 462);

    ctx.font = '800 32px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${state.correct}/${total} câu đúng`, width / 2, 530);

    if (state.bestStreak >= 3) {
      ctx.font = '700 26px "Segoe UI", system-ui, sans-serif';
      ctx.fillStyle = '#F59E0B';
      ctx.fillText(`\u{1F525} Chuỗi ${state.bestStreak} câu liên tiếp!`, width / 2, 580);
    }

    ctx.font = '700 20px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('Chơi tại 3dvietpro.com/game', width / 2, height - 40);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }

  $('btnShareFacebook').addEventListener('click', async () => {
    sfx.click();
    if (window.electronAPI) {
      const el = document.querySelector('#screen-result .result-wrap');
      const r = el.getBoundingClientRect();
      openBrowserPicker(
        { urlKind: 'facebook-home' },
        'Chọn trình duyệt để mở Facebook. Ảnh kết quả sẽ tự copy sẵn — thầy chỉ cần bấm vào khung viết bài rồi nhấn Ctrl+V để dán ảnh vào nhé!',
        { x: r.x, y: r.y, width: r.width, height: r.height }
      );
      return;
    }
    const stars = computeStars();
    const total = state.mode === 'practice' ? state.totalQuestions : state.answered;
    const shareText = `Con vừa đạt ${state.score} điểm (${state.correct}/${total} câu đúng) trong game Toán Vui Cấp 1! Cùng chơi thử nhé!`;
    const shareUrl = window.location.origin + window.location.pathname;

    // Facebook's own sharer.php link is unreliable on phones: when the
    // Facebook app is installed it often intercepts the link and just opens
    // to the home feed instead of the share composer, ignoring whatever was
    // passed in — a Facebook-side quirk, not fixable from the web page.
    // navigator.share() hands off to the OS share sheet instead, where
    // Facebook registers as a real share target (an Android intent / iOS
    // share extension), and — critically — supports attaching the actual
    // achievement-card image built above, not just a link. No web page on
    // any platform can skip straight past this one tap to "already posted"
    // without it — that confirmation step is an OS-level permission
    // boundary (Apple/Google both require it so a site can't silently post
    // to someone's account), the same kind of hard platform wall as not
    // being able to force-launch Safari from inside Facebook's own in-app
    // browser earlier. This is the closest possible thing to it: one tap
    // opens the share sheet with the score card ready to post.
    let imageFile = null;
    try {
      const blob = await buildResultShareImage(stars, total);
      if (blob) imageFile = new File([blob], 'ket-qua-toan-vui.png', { type: 'image/png' });
    } catch (e) { /* canvas unavailable — fall back to text-only share */ }

    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try {
        await navigator.share({ files: [imageFile], title: 'Toán Vui Cấp 1', text: shareText });
      } catch (e) { /* user cancelled */ }
      return;
    }
    if (navigator.share) {
      try { await navigator.share({ title: 'Toán Vui Cấp 1', text: shareText, url: shareUrl }); } catch (e) { /* user cancelled */ }
      return;
    }
    // Desktop fallback (no Web Share API): Facebook's popup share dialog
    // works fine here since there's no native app to hijack the link.
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.location.href = fbShareUrl;
  });

  $('btnResultHome').addEventListener('click', () => { sfx.click(); showScreen('home'); });
  $('btnResultRetry').addEventListener('click', () => {
    sfx.click();
    randomizeOpSelection();
    startGame();
  });

  /* ================= LICENSE GATE ================= */
  const licenseKeyInput = $('licenseKeyInput');
  const licenseContactInput = $('licenseContactInput');
  const licenseError = $('licenseError');

  async function tryActivate() {
    const key = licenseKeyInput.value;
    const contact = licenseContactInput ? licenseContactInput.value.trim().slice(0, 120) : '';
    if (!window.electronAPI || !window.electronAPI.activateLicense) return;
    const res = await window.electronAPI.activateLicense(key, contact);
    if (res.success) {
      licenseError.hidden = true;
      sfx.correct();
      applyRandomTheme();
      showScreen('home');
    } else {
      licenseError.textContent = res.message || 'Mã key không hợp lệ, thầy kiểm tra lại giúp em nhé.';
      licenseError.hidden = false;
      sfx.wrong();
    }
  }

  $('btnActivateLicense').addEventListener('click', () => { sfx.click(); tryActivate(); });
  licenseKeyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryActivate(); });
  $('btnContactFBLicense').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('facebook');
  });
  $('btnContactWebLicense').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('website');
  });
  setMascot($('mascotLicense'), 'sad');

  /* ================= TEACHER SETTINGS ================= */
  const settingsModal = $('settingsModal');
  const settingsAvatarPreview = $('settingsAvatarPreview');
  const teacherNameInput = $('teacherNameInput');
  const settingsSavedMsg = $('settingsSavedMsg');
  let pendingAvatarDataUrl = undefined; // undefined = no change staged this session

  function refreshMascotsEverywhere() {
    applyTeacherName();
    setMascot($('mascotHome'), 'happy');
    setMascot($('mascotLicense'), 'sad');
  }

  function openSettingsModal() {
    pendingAvatarDataUrl = undefined;
    teacherNameInput.value = teacherName;
    settingsAvatarPreview.src = avatarDataUrl || 'assets/thay-avatar.png';
    settingsSavedMsg.hidden = true;
    settingsModal.hidden = false;
  }

  $('btnOpenSettings').addEventListener('click', () => { sfx.click(); openSettingsModal(); });
  $('btnCloseSettings').addEventListener('click', () => { sfx.click(); settingsModal.hidden = true; });
  settingsModal.addEventListener('click', (e) => { if (e.target.id === 'settingsModal') settingsModal.hidden = true; });

  const webAvatarFileInput = $('webAvatarFileInput');
  $('btnPickAvatar').addEventListener('click', async () => {
    sfx.click();
    if (window.electronAPI && window.electronAPI.pickAvatar) {
      const res = await window.electronAPI.pickAvatar();
      if (res.success) {
        pendingAvatarDataUrl = res.dataUrl;
        settingsAvatarPreview.src = res.dataUrl;
      }
      return;
    }
    if (webAvatarFileInput) webAvatarFileInput.click();
  });
  if (webAvatarFileInput) {
    webAvatarFileInput.addEventListener('change', async () => {
      const file = webAvatarFileInput.files && webAvatarFileInput.files[0];
      webAvatarFileInput.value = '';
      if (!file) return;
      try {
        const dataUrl = await webDownscaleImageFile(file, 320);
        pendingAvatarDataUrl = dataUrl;
        settingsAvatarPreview.src = dataUrl;
      } catch (e) { /* unreadable file, ignore */ }
    });
  }

  $('btnResetAvatar').addEventListener('click', () => {
    sfx.click();
    pendingAvatarDataUrl = null;
    settingsAvatarPreview.src = 'assets/thay-avatar.png';
  });

  $('btnSaveSettings').addEventListener('click', async () => {
    sfx.click();
    const newName = teacherNameInput.value.trim();

    if (window.electronAPI) {
      const nameResult = await window.electronAPI.saveTeacherName(newName);
      teacherName = nameResult.teacherName;
      if (pendingAvatarDataUrl !== undefined) {
        const avatarResult = pendingAvatarDataUrl === null
          ? await window.electronAPI.resetAvatar()
          : await window.electronAPI.saveAvatar(pendingAvatarDataUrl);
        avatarDataUrl = avatarResult.avatarDataUrl;
      }
    } else {
      teacherName = newName || 'Thầy Đinh Thi Ai';
      localStorage.setItem('tvc_teacherName', teacherName);
      if (pendingAvatarDataUrl !== undefined) {
        avatarDataUrl = pendingAvatarDataUrl;
        if (avatarDataUrl) localStorage.setItem('tvc_avatarDataUrl', avatarDataUrl);
        else localStorage.removeItem('tvc_avatarDataUrl');
      }
    }

    refreshMascotsEverywhere();
    settingsSavedMsg.hidden = false;
    sfx.correct();
    setTimeout(() => { settingsModal.hidden = true; }, 900);
  });

  /* ================= UPDATE NOTIFICATIONS (Web Push) ================= */
  // Lets a student/parent opt in to a push notification whenever thầy sends
  // an update announcement from /admin/push-broadcast. Tapping the
  // notification (handled in sw.js) reopens the game and force-reloads it,
  // which — combined with the no-store Cache-Control on the game's static
  // files — always lands on the latest deployed version.
  if (IS_WEB && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
    const settingsNotifRow = $('settingsNotifRow');
    const btnEnableNotif = $('btnEnableNotif');
    const notifStatusText = $('notifStatusText');
    settingsNotifRow.hidden = false;

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    }

    async function refreshNotifStatus() {
      if (Notification.permission === 'denied') {
        notifStatusText.textContent = 'Trình duyệt đang chặn thông báo — vào cài đặt trình duyệt để bật lại.';
        btnEnableNotif.textContent = '🔕 Đã chặn';
        btnEnableNotif.disabled = true;
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        notifStatusText.textContent = sub
          ? 'Đã bật — sẽ báo ngay khi có bản cập nhật mới.'
          : 'Bật để biết ngay khi game có bản mới.';
        btnEnableNotif.textContent = sub ? '🔔 Đã bật (bấm để tắt)' : '🔔 Bật thông báo';
      } catch (e) { /* service worker not ready yet — leave default label */ }
    }
    refreshNotifStatus();

    btnEnableNotif.addEventListener('click', async () => {
      sfx.click();
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          const endpoint = existing.endpoint;
          await existing.unsubscribe();
          fetch('/api/game/push-unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint }),
          }).catch(() => {});
          refreshNotifStatus();
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') { refreshNotifStatus(); return; }
        const keyRes = await fetch('/api/game/vapid-public-key').then((r) => r.json());
        if (!keyRes.ok) {
          notifStatusText.textContent = 'Thông báo chưa sẵn sàng, thầy/cô thử lại sau nhé.';
          return;
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyRes.publicKey),
        });
        const subJson = sub.toJSON();
        await fetch('/api/game/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subJson.endpoint, keys: subJson.keys }),
        });
        refreshNotifStatus();
      } catch (e) {
        notifStatusText.textContent = 'Không bật được thông báo, thầy/cô thử lại sau nhé.';
      }
    });
  }

  /* ================= INSTALL TO PHONE/MÁY TÍNH ================= */
  if (IS_WEB) {
    const btnInstallApp = $('btnInstallApp');
    const iosInstallModal = $('iosInstallModal');
    const macInstallModal = $('macInstallModal');
    const genericInstallModal = $('genericInstallModal');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    const ua = navigator.userAgent;
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isIOSWrappedBrowser = isIOSDevice && /crios|fxios|edgios|opios/i.test(ua);
    const isMacDesktopSafari = !isIOSDevice && /macintosh/i.test(ua) && /safari/i.test(ua) && !/chrome|chromium|edg|opr/i.test(ua);
    let deferredInstallPrompt = null;

    if (!isStandalone) {
      // Show the button immediately on every browser — Chromium browsers
      // (Chrome/Edge/Brave/Opera, desktop or Android) will later get a real
      // beforeinstallprompt and the button just works; everyone else gets a
      // browser-appropriate manual guide when they tap it.
      btnInstallApp.hidden = false;

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
      });

      btnInstallApp.addEventListener('click', async () => {
        sfx.click();
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          const choice = await deferredInstallPrompt.userChoice.catch(() => null);
          deferredInstallPrompt = null;
          if (choice && choice.outcome === 'accepted') btnInstallApp.hidden = true;
          return;
        }
        if (isIOSDevice) {
          if (isIOSWrappedBrowser) {
            $('genericInstallTitle').textContent = 'Thầy/cô đang dùng trình duyệt khác Safari';
            $('genericInstallDesc').innerHTML = 'Trên iPhone/iPad, chỉ <strong>Safari</strong> cài được vào màn hình chính. Thầy/cô copy link này rồi dán vào Safari để mở, sau đó bấm lại nút "Cài đặt ngay" nhé.';
            genericInstallModal.hidden = false;
          } else if (iosInstallModal) {
            iosInstallModal.hidden = false;
          }
          return;
        }
        if (isMacDesktopSafari && macInstallModal) {
          macInstallModal.hidden = false;
          return;
        }
        // Firefox and any other browser without an install API.
        $('genericInstallTitle').textContent = 'Trình duyệt này chưa hỗ trợ cài tự động';
        $('genericInstallDesc').innerHTML = 'Thầy/cô vẫn chơi được bình thường ngay trên trang web này — không bắt buộc phải cài. Để cài được icon vào máy/điện thoại, thầy/cô mở link này bằng <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong> rồi bấm lại nút "Cài đặt ngay" nhé.';
        genericInstallModal.hidden = false;
      });

      window.addEventListener('appinstalled', () => { btnInstallApp.hidden = true; });
    }

    [
      [iosInstallModal, 'btnCloseIosInstall'],
      [macInstallModal, 'btnCloseMacInstall'],
      [genericInstallModal, 'btnCloseGenericInstall'],
    ].forEach(([modal, closeBtnId]) => {
      if (!modal) return;
      $(closeBtnId).addEventListener('click', () => { sfx.click(); modal.hidden = true; });
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
    });
  }

  /* ================= HOMEWORK HELPER (AI đọc ảnh bài tập) ================= */
  if (IS_WEB) {
    const homeworkFileInput = $('homeworkFileInput');
    const homeworkPreviewImg = $('homeworkPreviewImg');
    const btnToggleStruggling = $('btnToggleStruggling');
    const homeworkAnswerBox = $('homeworkAnswerBox');
    const homeworkErrorText = $('homeworkErrorText');
    const homeworkLoadingText = $('homeworkLoadingText');
    const homeworkSlideProgress = $('homeworkSlideProgress');
    const homeworkDots = $('homeworkDots');
    const btnHomeworkPrev = $('btnHomeworkPrev');
    const btnHomeworkNext = $('btnHomeworkNext');
    const btnHomeworkSpeak = $('btnHomeworkSpeak');
    const btnHomeworkDownload = $('btnHomeworkDownload');
    const HOMEWORK_STEP_DELIMITER = '%%%STEP%%%';
    let homeworkSlides = [];
    let homeworkSlideIndex = 0;
    const homeworkSteps = {
      pick: $('homeworkStepPick'),
      preview: $('homeworkStepPreview'),
      loading: $('homeworkStepLoading'),
      result: $('homeworkStepResult'),
      error: $('homeworkStepError'),
    };
    let homeworkBlob = null;
    let homeworkPreviewUrl = null;
    let strugglingMode = false;
    const LOADING_MESSAGES = [
      'AI đang đọc bài và soạn lời giảng...',
      'Đang chấm từng nét chữ của con...',
      'Sắp xong rồi, cô AI đang nắn nót câu chữ...',
    ];
    let loadingMsgTimer = null;

    function homeworkShowStep(name) {
      Object.values(homeworkSteps).forEach((el) => { el.hidden = true; });
      homeworkSteps[name].hidden = false;
    }

    function homeworkResetToPick() {
      homeworkStopSpeak();
      homeworkBlob = null;
      if (homeworkPreviewUrl) { URL.revokeObjectURL(homeworkPreviewUrl); homeworkPreviewUrl = null; }
      homeworkFileInput.value = '';
      strugglingMode = false;
      btnToggleStruggling.setAttribute('aria-pressed', 'false');
      homeworkSlides = [];
      homeworkSlideIndex = 0;
      homeworkShowStep('pick');
    }

    // Downscale to a reasonable max dimension before upload — keeps the
    // request small/fast and well inside Gemini's free-tier limits.
    function homeworkDownscaleToBlob(file, maxDim) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          const img = new Image();
          img.onerror = reject;
          img.onload = () => {
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const w = Math.max(1, Math.round(img.width * scale));
            const h = Math.max(1, Math.round(img.height * scale));
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas toBlob failed'))), 'image/jpeg', 0.85);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    function homeworkFormatAnswer(text) {
      const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    // Reads each step aloud with the browser's free built-in TTS (no API
    // key, works everywhere, but the exact Vietnamese voice/accent is
    // whatever the device provides — can't force a specific regional voice
    // this way, only a paid TTS service like FPT.AI can guarantee that.
    function homeworkStripForSpeech(text) {
      return text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✅✨]/gu, '')
        .replace(/[#*_`]/g, '')
        .trim();
    }
    let homeworkSpeechVoice = null;
    function homeworkPickVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      const viVoices = voices.filter((v) => /^vi(-|_)?VN$/i.test(v.lang) || /vietnam/i.test(v.name));
      if (!viVoices.length) return null;
      // Not all "vi-VN" voices sound the same — legacy SAPI voices (old
      // Windows "Microsoft An") are robotic, while neural/online voices
      // (Edge "... Online (Natural)", Android "Google Tiếng Việt") sound
      // much more natural. Score and prefer those when the device has them.
      const scored = viVoices.map((v) => {
        let score = 0;
        if (/natural|online|neural/i.test(v.name)) score += 3;
        if (/google/i.test(v.name)) score += 2;
        if (/nữ|female|hoaimy|linh|mai|huong|hương|thu|hoa/i.test(v.name)) score += 1;
        return { v, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored[0].v;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => { homeworkSpeechVoice = homeworkPickVoice(); };
      homeworkSpeechVoice = homeworkPickVoice();
    }
    // Speaking one giant utterance tends to sound flat/rushed on long text.
    // Splitting on sentence boundaries and queueing them (speechSynthesis
    // plays queued utterances back-to-back) gives each sentence its own
    // natural rise/fall and a small breathing pause between them.
    function homeworkSpeak(text) {
      if (!('speechSynthesis' in window) || muted) return;
      window.speechSynthesis.cancel();
      const clean = homeworkStripForSpeech(text);
      const sentences = clean.split(/(?<=[.!?…:])\s+/).map((s) => s.trim()).filter(Boolean);
      const chunks = sentences.length ? sentences : [clean];
      chunks.forEach((chunk, i) => {
        const utter = new SpeechSynthesisUtterance(chunk);
        utter.lang = 'vi-VN';
        if (homeworkSpeechVoice) utter.voice = homeworkSpeechVoice;
        utter.rate = 0.98;
        utter.pitch = 1.0;
        if (i === 0) utter.onstart = () => btnHomeworkSpeak.classList.add('is-speaking');
        if (i === chunks.length - 1) {
          utter.onend = () => btnHomeworkSpeak.classList.remove('is-speaking');
          utter.onerror = () => btnHomeworkSpeak.classList.remove('is-speaking');
        }
        window.speechSynthesis.speak(utter);
      });
    }
    function homeworkStopSpeak() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      btnHomeworkSpeak.classList.remove('is-speaking');
    }

    // fromOffsetPx: where the new content visually starts before easing to
    // rest — 0 for the very first slide, a signed offset (matching swipe/
    // button direction) for every step after, so the motion reads as one
    // continuous glide rather than a hard cut.
    function homeworkRenderSlide(fromOffsetPx) {
      const total = homeworkSlides.length;
      homeworkAnswerBox.innerHTML = homeworkFormatAnswer(homeworkSlides[homeworkSlideIndex]);
      homeworkAnswerBox.scrollTop = 0;
      homeworkSpeak(homeworkSlides[homeworkSlideIndex]);

      if (fromOffsetPx) {
        homeworkAnswerBox.style.transition = 'none';
        homeworkAnswerBox.style.transform = `translateX(${fromOffsetPx}px)`;
        homeworkAnswerBox.style.opacity = '0.3';
        void homeworkAnswerBox.offsetWidth; // force reflow so the next line animates
      }
      homeworkAnswerBox.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out';
      homeworkAnswerBox.style.transform = 'translateX(0)';
      homeworkAnswerBox.style.opacity = '1';

      homeworkSlideProgress.textContent = total > 1 ? `Bước ${homeworkSlideIndex + 1}/${total}` : 'Lời giảng';
      homeworkSlideProgress.hidden = total <= 1;

      homeworkDots.innerHTML = '';
      homeworkDots.hidden = total <= 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === homeworkSlideIndex ? ' current' : '');
        homeworkDots.appendChild(dot);
      }

      btnHomeworkPrev.disabled = homeworkSlideIndex === 0;
      btnHomeworkPrev.hidden = total <= 1;
      const isLast = homeworkSlideIndex === total - 1;
      btnHomeworkNext.hidden = isLast || total <= 1;
    }

    function homeworkGoToSlide(index, fromOffsetPx) {
      if (index < 0 || index >= homeworkSlides.length) return;
      homeworkSlideIndex = index;
      sfx.click();
      homeworkRenderSlide(fromOffsetPx || 0);
    }

    // Lays out **bold**-aware, word-wrapped text into lines of styled runs
    // so the download image can render markdown-style bold from the AI
    // response without a full markdown/canvas library.
    function homeworkWrapStyledLines(measureCtx, text, maxWidth, normalFont, boldFont) {
      const lines = [];
      text.split(/\n+/).forEach((para) => {
        const tokens = para.split(/(\*\*[^*]+\*\*)/).filter(Boolean);
        const words = [];
        tokens.forEach((tok) => {
          const bold = /^\*\*[^*]+\*\*$/.test(tok);
          const clean = bold ? tok.slice(2, -2) : tok;
          clean.split(/(\s+)/).forEach((w) => { if (w) words.push({ text: w, bold }); });
        });
        let line = [];
        let lineWidth = 0;
        words.forEach((w) => {
          measureCtx.font = w.bold ? boldFont : normalFont;
          const wWidth = measureCtx.measureText(w.text).width;
          if (lineWidth + wWidth > maxWidth && line.length) {
            lines.push(line);
            line = [];
            lineWidth = 0;
            if (/^\s+$/.test(w.text)) return;
          }
          line.push(w);
          lineWidth += wWidth;
        });
        lines.push(line.length ? line : [{ text: '', bold: false }]);
      });
      return lines;
    }

    // Renders the whole explanation (photo + every step) as one shareable
    // PNG so the family can save/print it and review after the app closes.
    function homeworkDownloadImage() {
      if (!homeworkSlides.length) return;
      sfx.click();
      const width = 720;
      const pad = 40;
      const maxTextWidth = width - pad * 2;
      const normalFont = '20px "Baloo 2", system-ui, sans-serif';
      const boldFont = 'bold 20px "Baloo 2", system-ui, sans-serif';
      const lineHeight = 30;

      const measureCanvas = document.createElement('canvas');
      const mctx = measureCanvas.getContext('2d');
      const fullText = homeworkSlides
        .map((s, i) => (homeworkSlides.length > 1 ? `Bước ${i + 1}:\n` : '') + s.trim())
        .join('\n\n');
      const lines = homeworkWrapStyledLines(mctx, fullText, maxTextWidth, normalFont, boldFont);

      const headerHeight = 92;
      const hasPhoto = !!(homeworkPreviewUrl && homeworkPreviewImg.naturalWidth);
      const photoHeight = hasPhoto
        ? Math.min(280, maxTextWidth * (homeworkPreviewImg.naturalHeight / homeworkPreviewImg.naturalWidth))
        : 0;
      const photoBlockHeight = hasPhoto ? photoHeight + 24 : 0;
      const footerHeight = 50;
      const totalHeight = Math.round(headerHeight + photoBlockHeight + lines.length * lineHeight + pad * 2 + footerHeight);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#FDF6E8';
      ctx.fillRect(0, 0, width, totalHeight);

      ctx.fillStyle = '#7C4A1E';
      ctx.fillRect(0, 0, width, headerHeight);
      ctx.fillStyle = '#FFD76A';
      ctx.font = 'bold 24px "Baloo 2", system-ui, sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Toán Vui Cấp 1 — Lời giảng của Cô', pad, 40);
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = '#F5DEB3';
      ctx.fillText(`Lưu lại ngày ${new Date().toLocaleDateString('vi-VN')} để học lại sau này`, pad, 66);

      let y = headerHeight + pad;

      if (hasPhoto) {
        ctx.drawImage(homeworkPreviewImg, pad, y, maxTextWidth, photoHeight);
        ctx.strokeStyle = '#D9B775';
        ctx.lineWidth = 2;
        ctx.strokeRect(pad, y, maxTextWidth, photoHeight);
        y += photoHeight + 24;
      }

      y += lineHeight - 8;
      lines.forEach((line) => {
        let x = pad;
        line.forEach((w) => {
          ctx.font = w.bold ? boldFont : normalFont;
          ctx.fillStyle = w.bold ? '#7C4A1E' : '#3B2410';
          ctx.fillText(w.text, x, y);
          x += ctx.measureText(w.text).width;
        });
        y += lineHeight;
      });

      ctx.font = 'italic 13px system-ui, sans-serif';
      ctx.fillStyle = '#8A6A3F';
      ctx.fillText('Toán Vui Cấp 1 · 3dvietpro.com/game', pad, totalHeight - 18);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `loi-giang-toan-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      btnHomeworkDownload.classList.add('is-saved');
      setTimeout(() => btnHomeworkDownload.classList.remove('is-saved'), 1200);
    }

    $('btnOpenHomework').addEventListener('click', () => {
      sfx.click();
      homeworkResetToPick();
      setMascot($('mascotHomework'), 'idle');
      showScreen('homework');
    });
    $('btnHomeworkBack').addEventListener('click', () => { sfx.click(); homeworkStopSpeak(); showScreen('home'); });

    $('btnHomeworkPickPhoto').addEventListener('click', () => { sfx.click(); homeworkFileInput.click(); });
    homeworkFileInput.addEventListener('change', async () => {
      const file = homeworkFileInput.files && homeworkFileInput.files[0];
      if (!file) return;
      try {
        homeworkBlob = await homeworkDownscaleToBlob(file, 1280);
        if (homeworkPreviewUrl) URL.revokeObjectURL(homeworkPreviewUrl);
        homeworkPreviewUrl = URL.createObjectURL(homeworkBlob);
        homeworkPreviewImg.src = homeworkPreviewUrl;
        homeworkShowStep('preview');
      } catch (e) { /* unreadable file, ignore */ }
    });

    btnToggleStruggling.addEventListener('click', () => {
      sfx.click();
      strugglingMode = !strugglingMode;
      btnToggleStruggling.setAttribute('aria-pressed', String(strugglingMode));
    });

    $('btnHomeworkRetake').addEventListener('click', () => { sfx.click(); homeworkResetToPick(); });
    $('btnHomeworkAnother').addEventListener('click', () => { sfx.click(); homeworkResetToPick(); });
    $('btnHomeworkRetryError').addEventListener('click', () => { sfx.click(); homeworkShowStep(homeworkBlob ? 'preview' : 'pick'); });

    btnHomeworkPrev.addEventListener('click', () => homeworkGoToSlide(homeworkSlideIndex - 1, -36));
    btnHomeworkNext.addEventListener('click', () => homeworkGoToSlide(homeworkSlideIndex + 1, 36));
    btnHomeworkSpeak.addEventListener('click', () => { sfx.click(); homeworkSpeak(homeworkSlides[homeworkSlideIndex]); });
    btnHomeworkDownload.addEventListener('click', homeworkDownloadImage);

    // Swipe left/right on the answer box to move between steps. The box
    // tracks the finger 1:1 while dragging (soft, not a hard jump-cut),
    // resists slightly past the first/last step, then either glides the
    // rest of the way into the next step or eases back to rest.
    let homeworkDragStartX = null;
    let homeworkDragDeltaX = 0;
    homeworkAnswerBox.addEventListener('touchstart', (e) => {
      homeworkDragStartX = e.touches[0].clientX;
      homeworkDragDeltaX = 0;
      homeworkAnswerBox.style.transition = 'none';
    }, { passive: true });
    homeworkAnswerBox.addEventListener('touchmove', (e) => {
      if (homeworkDragStartX === null) return;
      let dx = e.touches[0].clientX - homeworkDragStartX;
      const atFirst = homeworkSlideIndex === 0;
      const atLast = homeworkSlideIndex === homeworkSlides.length - 1;
      if ((dx > 0 && atFirst) || (dx < 0 && atLast)) dx *= 0.3; // rubber-band at the ends
      homeworkDragDeltaX = dx;
      homeworkAnswerBox.style.transform = `translateX(${dx}px)`;
      homeworkAnswerBox.style.opacity = String(Math.max(0.5, 1 - Math.abs(dx) / 500));
    }, { passive: true });
    homeworkAnswerBox.addEventListener('touchend', () => {
      if (homeworkDragStartX === null) return;
      homeworkDragStartX = null;
      const dx = homeworkDragDeltaX;
      homeworkDragDeltaX = 0;
      const SWIPE_THRESHOLD = 55;
      const width = homeworkAnswerBox.clientWidth || 320;
      const canNext = dx <= -SWIPE_THRESHOLD && homeworkSlideIndex < homeworkSlides.length - 1;
      const canPrev = dx >= SWIPE_THRESHOLD && homeworkSlideIndex > 0;

      if (canNext || canPrev) {
        const exitX = canNext ? -width : width;
        homeworkAnswerBox.style.transition = 'transform 190ms ease-out, opacity 190ms ease-out';
        homeworkAnswerBox.style.transform = `translateX(${exitX}px)`;
        homeworkAnswerBox.style.opacity = '0';
        setTimeout(() => {
          homeworkGoToSlide(homeworkSlideIndex + (canNext ? 1 : -1), -exitX * 0.6);
        }, 180);
      } else {
        // Didn't cross the threshold (or no more steps that way) — glide back to rest.
        homeworkAnswerBox.style.transition = 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease-out';
        homeworkAnswerBox.style.transform = 'translateX(0)';
        homeworkAnswerBox.style.opacity = '1';
      }
    });

    async function homeworkSubmit() {
      if (!homeworkBlob) return;
      homeworkShowStep('loading');
      let msgIdx = 0;
      homeworkLoadingText.textContent = LOADING_MESSAGES[0];
      loadingMsgTimer = setInterval(() => {
        msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
        homeworkLoadingText.textContent = LOADING_MESSAGES[msgIdx];
      }, 3000);

      try {
        const formData = new FormData();
        formData.append('image', homeworkBlob, 'homework.jpg');
        formData.append('strugglingMode', strugglingMode ? 'true' : 'false');
        const res = await fetch('/api/game/homework-help', { method: 'POST', body: formData });
        const data = await res.json().catch(() => ({ ok: false }));
        clearInterval(loadingMsgTimer);
        if (!res.ok || !data.ok) {
          homeworkErrorText.textContent = (data && data.message) || 'Có lỗi xảy ra, thầy/cô thử lại giúp em nhé.';
          homeworkShowStep('error');
          sfx.wrong();
          return;
        }
        homeworkSlides = data.explanation
          .split(HOMEWORK_STEP_DELIMITER)
          .map((s) => s.trim())
          .filter(Boolean);
        if (!homeworkSlides.length) homeworkSlides = [data.explanation];
        homeworkSlideIndex = 0;
        homeworkRenderSlide();
        homeworkShowStep('result');
        sfx.correct();
      } catch (e) {
        clearInterval(loadingMsgTimer);
        homeworkErrorText.textContent = 'Không kết nối được, thầy/cô kiểm tra lại mạng giúp em nhé.';
        homeworkShowStep('error');
        sfx.wrong();
      }
    }
    $('btnHomeworkSubmit').addEventListener('click', () => { sfx.click(); homeworkSubmit(); });
  }

  /* ================= GỌI MON.L (video call quái vật, nói chuyện tự do) ================= */
  if (IS_WEB) {
    const callPreviewWrap = $('callPreviewWrap');
    const callLiveWrap = $('callLiveWrap');
    const btnCallPreview = $('btnCallPreview');
    const previewMon = $('previewMon');
    const btnStartCallReal = $('btnStartCallReal');
    const btnCallPreviewBack = $('btnCallPreviewBack');
    const callSceneEl = $('callScene');
    const sceneFitEl = $('sceneFit');
    const callMascotEl = $('callMascot');
    const callAvatar = $('callAvatar');
    const callAvatarImg = $('callAvatarImg');
    const callTimer = $('callTimer');
    const callStateEl = $('callState');
    const callTopEl = document.querySelector('#screen-call .call-top');
    const callStageEl = document.querySelector('#screen-call .call-stage');
    const callFootEl = document.querySelector('#screen-call .call-foot');
    const callLog = $('callLog');
    const callBubble = $('callBubble');
    const callSaid = $('callSaid');
    const callSaidLang = $('callSaidLang');
    const callSaidPy = $('callSaidPy');
    const callSaidVi = $('callSaidVi');
    const callYou = $('callYou');
    const callHeard = $('callHeard');
    const callHeardText = $('callHeardText');
    const callType = $('callType');
    const callInput = $('callInput');
    const btnCallSend = $('btnCallSend');
    const btnCallHear = $('btnCallHear');
    const btnMic = $('btnMic');
    const btnHangup = $('btnHangup');
    const btnCallSkip = $('btnCallSkip');

    // Toạ độ % của Mon.L trong assets/monl/mon-room.jpg — cùng con số với
    // english-air, vì dùng chung đúng file ảnh đó. scene-fit tính lại
    // height/top mỗi khi đổi cỡ màn hình để nhân vật luôn đứng đúng chỗ
    // giữa thanh trên và bong bóng thoại, không bị méo/lệch.
    const SCENE = { top: 0.12561, bot: 0.65922, ratio: 0.47551 };
    function fitCallScene() {
      const screenCall = $('screen-call');
      if (!screenCall.classList.contains('active') || callLiveWrap.hidden) return;
      const vh = screenCall.clientHeight;
      const head = callTopEl.offsetHeight + 8;
      const first = [...callStageEl.children].find((n) => !n.hidden && n.offsetHeight > 0);
      const limitEl = first || callFootEl;
      const limit = limitEl.getBoundingClientRect().top;
      let h = Math.max(240, limit - 10 - head) / (SCENE.bot - SCENE.top);
      let t = head - SCENE.top * h;
      if (t + h < vh) { h = (vh - head) / (1 - SCENE.top); t = head - SCENE.top * h; }
      if (h > 1500) {
        h = 1500;
        t = head + Math.max(0, (limit - head - (SCENE.bot - SCENE.top) * h) / 2) - SCENE.top * h;
      }
      callSceneEl.style.setProperty('--scene-h', `${h}px`);
      callSceneEl.style.setProperty('--scene-t', `${t}px`);
    }
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(fitCallScene);
      [callStageEl, callBubble, callFootEl].forEach((el) => { if (el) ro.observe(el); });
    }
    window.addEventListener('resize', fitCallScene);
    window.addEventListener('orientationchange', () => setTimeout(fitCallScene, 120));

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    let callRecognition = null;
    let callHistory = [];
    // Đáp án đúng (số, đã máy chủ tính ra) của bài toán Mon.L vừa ra, hoặc
    // null khi lượt trước không phải một bài toán có đáp án cụ thể.
    let callPendingAnswer = null;
    let callTimerId = null;
    let callSeconds = 0;
    let callBusy = false;
    let callEnded = true;
    let callTypedOnly = !SpeechRecognitionCtor;

    // Mon.L nói được ba thứ tiếng — bạn học không chọn trước, cứ nói, server
    // (boomChatService.js) tự nghe ra rồi trả lời đúng thứ tiếng đó, client
    // chỉ cần đổi giọng đọc/giọng nghe theo callLang mỗi lượt.
    const CALL_LANGS = {
      vi: { name: 'Tiếng Việt', tts: 'vi-VN', sr: 'vi-VN' },
      en: { name: 'English', tts: 'en-US', sr: 'en-US' },
      zh: { name: '中文', tts: 'zh-CN', sr: 'zh-CN' },
    };
    let callLang = 'vi';
    // Máy nào không nghe được thứ tiếng đang nói thì nhớ lại, lần sau nghe
    // thẳng bằng tiếng Việt luôn thay vì thử lại rồi lại báo lỗi.
    const CALL_NO_LISTEN = {};
    function callGuessLang(text) {
      if (/[一-鿿]/.test(text)) return 'zh';
      if (/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(text)) return 'vi';
      return null;
    }

    const callVoiceCache = {};
    function callPickVoice(tag) {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      const base = tag.split('-')[0].toLowerCase();
      const pool = voices.filter((v) => String(v.lang).toLowerCase().replace('_', '-').startsWith(base));
      if (!pool.length) return null;
      const scored = pool.map((v) => {
        let score = 0;
        if (/natural|online|neural/i.test(v.name)) score += 3;
        if (/google/i.test(v.name)) score += 2;
        return { v, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored[0].v;
    }
    function callRefreshVoices() {
      Object.keys(CALL_LANGS).forEach((lg) => { callVoiceCache[lg] = callPickVoice(CALL_LANGS[lg].tts); });
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = callRefreshVoices;
      callRefreshVoices();
    }

    // iPhone/iPad chỉ cho phát tiếng lần đầu ngay trong lúc ngón tay còn
    // chạm màn hình. Câu nói đầu của Mon.L lại đến sau một lượt chờ mạng
    // (fetch), nên phải "mồi" sẵn ngay lúc bấm nút — không thì cả cuộc gọi
    // im lặng mà chẳng báo lỗi gì. Cùng cách english-air đã làm.
    let callSpeechPrimed = false;
    function callPrimeSpeech() {
      if (!('speechSynthesis' in window)) return;
      callRefreshVoices();
      if (callSpeechPrimed) return;
      callSpeechPrimed = true;
      try {
        const utter = new SpeechSynthesisUtterance(' ');
        utter.volume = 0;
        utter.lang = 'vi-VN';
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }

    function callFormatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }
    function callStartTimer() {
      callSeconds = 0;
      callTimer.textContent = '00:00';
      clearInterval(callTimerId);
      callTimerId = setInterval(() => {
        callSeconds += 1;
        callTimer.textContent = callFormatTime(callSeconds);
      }, 1000);
    }
    function callStopTimer() {
      clearInterval(callTimerId);
      callTimerId = null;
    }

    function callSetState(text, mod) {
      callStateEl.textContent = text;
      callStateEl.classList.remove('think', 'err');
      if (mod) callStateEl.classList.add(mod);
    }

    function callAppendLog(role, text) {
      const li = document.createElement('li');
      li.className = role === 'user' ? 'you' : 'mon';
      li.textContent = text;
      callLog.appendChild(li);
      callLog.hidden = false;
      callLog.scrollTop = callLog.scrollHeight;
    }

    function callAutoListenIfPossible() {
      if (callEnded || callBusy || callTypedOnly) return;
      setTimeout(() => { if (!callEnded && !callBusy) callStartListening(); }, 400);
    }

    // Mon.L's reply always lands in the big bubble, and also gets appended to
    // the scrollback log — the bubble is "what's being said right now", the
    // log is the running transcript underneath it. lang/viGloss/py come from
    // the server (boomChatService.js), which detects which of Mon.L's three
    // languages the reply is actually in.
    function callSpeak(text, lang, viGloss, py) {
      if (CALL_LANGS[lang]) callLang = lang;
      const L = CALL_LANGS[callLang] || CALL_LANGS.vi;
      callSaidLang.textContent = L.name;
      callSaidLang.hidden = callLang === 'vi';
      callSaid.textContent = text;
      callSaidPy.textContent = py || '';
      callSaidPy.hidden = !py;
      callSaidVi.textContent = viGloss || '';
      callSaidVi.hidden = !viGloss;
      callAppendLog('assistant', text);
      if (!('speechSynthesis' in window) || muted) {
        callBusy = false;
        callSetState('Đến lượt cậu rồi đó!');
        callAutoListenIfPossible();
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = L.tts;
      const voice = callVoiceCache[callLang];
      if (voice) utter.voice = voice;
      utter.rate = 1.0;
      utter.pitch = 1.05;
      // Some browsers (no matching voice for the current language, some
      // automated/embedded WebViews) silently accept an utterance but never
      // fire onstart/onend — without a watchdog the mic/state machine would
      // lock up forever waiting for a callback that's never coming.
      // ~120ms/char at rate 1.0 is a generous upper bound for speech length.
      let callSpeakDone = false;
      const finishSpeak = () => {
        if (callSpeakDone) return;
        callSpeakDone = true;
        callAvatar.classList.remove('talking');
        callMascotEl.classList.remove('talking');
        callBusy = false;
        if (callEnded) return;
        callSetState('Đến lượt cậu rồi đó!');
        callAutoListenIfPossible();
      };
      utter.onstart = () => { callAvatar.classList.add('talking'); callMascotEl.classList.add('talking'); };
      // Mỗi từ nói ra thì "nhấn" thêm một nhịp cho khớp trọng âm — buộc
      // reflow (offsetWidth) để retrigger được animation dù class không đổi.
      utter.onboundary = () => {
        callMascotEl.classList.remove('pulse');
        void callMascotEl.offsetWidth;
        callMascotEl.classList.add('pulse');
      };
      utter.onend = finishSpeak;
      utter.onerror = finishSpeak;
      window.speechSynthesis.speak(utter);
      setTimeout(finishSpeak, Math.min(12000, 1500 + text.length * 120));
    }
    function callReplayLast() {
      if (!('speechSynthesis' in window) || !callSaid.textContent || callSaid.textContent === '…') return;
      window.speechSynthesis.cancel();
      const L = CALL_LANGS[callLang] || CALL_LANGS.vi;
      const utter = new SpeechSynthesisUtterance(callSaid.textContent);
      utter.lang = L.tts;
      const voice = callVoiceCache[callLang];
      if (voice) utter.voice = voice;
      let replayDone = false;
      const finishReplay = () => { if (!replayDone) { replayDone = true; callAvatar.classList.remove('talking'); callMascotEl.classList.remove('talking'); } };
      utter.onstart = () => { callAvatar.classList.add('talking'); callMascotEl.classList.add('talking'); };
      utter.onend = finishReplay;
      utter.onerror = finishReplay;
      window.speechSynthesis.speak(utter);
      setTimeout(finishReplay, Math.min(12000, 1500 + callSaid.textContent.length * 120));
    }

    async function callAsk(userText) {
      if (userText) {
        callHistory.push({ role: 'user', content: userText });
        callAppendLog('user', userText);
      }
      callBusy = true;
      callSetState('Mon.L đang nghĩ…', 'think');
      try {
        const res = await fetch('/api/game/boom-chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ history: callHistory, grade: state.grade || null, pendingAnswer: callPendingAnswer }),
        });
        const data = await res.json().catch(() => ({ ok: false }));
        if (callEnded) return;
        if (!res.ok || !data.ok) {
          callBusy = false;
          callSetState((data && data.message) || 'Mon.L đang bận, thử lại nhé.', 'err');
          return;
        }
        callHistory.push({ role: 'assistant', content: data.reply });
        // Đáp án đúng (đã máy tính ra) của bài toán Mon.L VỪA ra ở lượt này —
        // nhớ lại để gửi kèm lượt sau, cho server chấm điểm chính xác thay vì
        // để mô hình tự đoán lại phép tính (không đáng tin với model nhỏ).
        callPendingAnswer = typeof data.pendingAnswer === 'number' ? data.pendingAnswer : null;
        callSpeak(data.reply, data.lang, data.vi, data.py);
      } catch (e) {
        if (callEnded) return;
        callBusy = false;
        callSetState('Không kết nối được, kiểm tra mạng giúp Mon.L nhé.', 'err');
      }
    }

    function callStartListening() {
      if (!SpeechRecognitionCtor || callBusy || callEnded || callTypedOnly) return;
      try {
        callRecognition = new SpeechRecognitionCtor();
        const lg = CALL_NO_LISTEN[callLang] ? 'vi' : callLang;
        callRecognition.lang = (CALL_LANGS[lg] || CALL_LANGS.vi).sr;
        callRecognition.interimResults = false;
        callRecognition.maxAlternatives = 1;
        callRecognition.onstart = () => {
          callYou.hidden = false;
          btnMic.classList.add('on');
          callMascotEl.classList.add('listening');
          callSetState('Đang nghe cậu nói…');
        };
        callRecognition.onresult = (ev) => {
          const text = ev.results[0][0].transcript.trim();
          if (text) {
            callHeardText.textContent = `Cậu: "${text}"`;
            callHeard.hidden = false;
            callAsk(text);
          }
        };
        callRecognition.onerror = (ev) => {
          callYou.hidden = true;
          btnMic.classList.remove('on');
          callMascotEl.classList.remove('listening');
          // Máy không nghe được thứ tiếng đang chọn thì lùi về tiếng Việt rồi
          // nghe lại ngay, đừng bắt bạn học tự xoay xở với lỗi khó hiểu.
          if (ev.error === 'language-not-supported' && callLang !== 'vi') {
            CALL_NO_LISTEN[callLang] = true;
            callLang = 'vi';
            setTimeout(callStartListening, 250);
            return;
          }
          if (!callBusy) callSetState('Không nghe rõ, bấm mic để nói lại nhé.');
        };
        callRecognition.onend = () => {
          callYou.hidden = true;
          btnMic.classList.remove('on');
          callMascotEl.classList.remove('listening');
        };
        callRecognition.start();
      } catch (e) {}
    }
    function callStopListening() {
      if (callRecognition) { try { callRecognition.stop(); } catch (e) {} }
      callYou.hidden = true;
      btnMic.classList.remove('on');
      callMascotEl.classList.remove('listening');
    }
    function callSwitchToTyped() {
      callTypedOnly = true;
      callStopListening();
      btnMic.hidden = true;
      btnCallSkip.hidden = true;
      callType.hidden = false;
      callInput.focus();
    }
    function callSendTyped() {
      const text = callInput.value.trim();
      if (!text || callBusy) return;
      callInput.value = '';
      // Chữ gõ tay thì đọc được chắc chắn — bắt thứ tiếng ngay, khỏi đợi máy chủ.
      const g = callGuessLang(text);
      if (g) callLang = g;
      callHeardText.textContent = `Cậu: "${text}"`;
      callHeard.hidden = false;
      callAsk(text);
    }

    function callStart() {
      callEnded = false;
      callBusy = false;
      callHistory = [];
      callPendingAnswer = null;
      callLang = 'vi'; // Mon.L luôn mở màn bằng tiếng Việt, đây là app tiếng Việt
      callLog.innerHTML = '';
      callLog.hidden = true;
      callHeard.hidden = true;
      callAvatarImg.src = avatarDataUrl || 'assets/thay-avatar.png';
      callSaid.textContent = 'Mon.L đang kết nối…';
      callSaidLang.hidden = true;
      callSaidPy.hidden = true;
      callSaidVi.hidden = true;
      callMascotEl.classList.remove('talking', 'listening', 'pulse');
      callSetState('Đang kết nối…');
      callStartTimer();
      callTypedOnly = !SpeechRecognitionCtor;
      btnMic.hidden = callTypedOnly;
      btnCallSkip.hidden = callTypedOnly;
      callType.hidden = !callTypedOnly;
      // Cảnh phòng cần layout đã ổn định (chiều cao thật của .call-top/
      // .call-foot) mới tính đúng được — đợi một khung hình rồi mới fit.
      requestAnimationFrame(fitCallScene);
      callAsk(null); // history rỗng -> server tự chào mở màn (xem __START__ trong boomChatService)
    }
    function callEnd() {
      callEnded = true;
      callBusy = false;
      callStopListening();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      callAvatar.classList.remove('talking');
      callMascotEl.classList.remove('talking', 'listening', 'pulse');
      callStopTimer();
    }
    function callShowPreview() {
      callEnd();
      callPreviewWrap.hidden = false;
      callLiveWrap.hidden = true;
      previewMon.classList.remove('talking', 'pulse');
    }

    // Bấm thẻ xem trước phòng của Mon.L: chỉ là một câu chào demo phát cục
    // bộ (không gọi server) để nghe thử giọng trước khi bấm gọi thật —
    // giống hệt cách english-air làm ở đúng chỗ này.
    const CALL_PREVIEW_LINES = [
      'Chào cậu! Tớ là Mon.L, con quái vật siêu mê toán nè!',
      'Bấm nút "Gọi nói chuyện tự do" là tớ nghe cậu liền!',
      'Đừng lo, cứ nói chuyện thoải mái với tớ thôi, tớ hiền lắm!',
    ];
    let callPreviewTurn = 0;
    if (btnCallPreview) {
      btnCallPreview.addEventListener('click', () => {
        sfx.click();
        callPrimeSpeech();
        const line = CALL_PREVIEW_LINES[callPreviewTurn++ % CALL_PREVIEW_LINES.length];
        previewMon.classList.add('talking');
        let previewDone = false;
        const finishPreview = () => { if (!previewDone) { previewDone = true; previewMon.classList.remove('talking'); } };
        if (!('speechSynthesis' in window) || muted) { setTimeout(finishPreview, 600 + line.length * 45); return; }
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(line);
        utter.lang = 'vi-VN';
        if (callVoiceCache.vi) utter.voice = callVoiceCache.vi;
        utter.onend = finishPreview;
        utter.onerror = finishPreview;
        window.speechSynthesis.speak(utter);
        setTimeout(finishPreview, Math.min(12000, 1500 + line.length * 120));
      });
    }

    $('btnOpenCall').addEventListener('click', () => {
      sfx.click();
      showScreen('call');
      callShowPreview();
    });
    btnCallPreviewBack.addEventListener('click', () => { sfx.click(); showScreen('home'); });
    btnStartCallReal.addEventListener('click', () => {
      sfx.click();
      callPrimeSpeech();
      callPreviewWrap.hidden = true;
      callLiveWrap.hidden = false;
      callStart();
    });
    btnHangup.addEventListener('click', () => { sfx.click(); callShowPreview(); showScreen('home'); });
    btnMic.addEventListener('click', () => {
      sfx.click();
      callPrimeSpeech();
      if (btnMic.classList.contains('on')) callStopListening();
      else callStartListening();
    });
    btnCallHear.addEventListener('click', () => { sfx.click(); callPrimeSpeech(); callReplayLast(); });
    btnCallSkip.addEventListener('click', () => { sfx.click(); callSwitchToTyped(); });
    btnCallSend.addEventListener('click', () => { sfx.click(); callPrimeSpeech(); callSendTyped(); });
    callInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); callPrimeSpeech(); callSendTyped(); } });
  }

  /* ================= AUTO UPDATE ================= */
  const updateBadge = $('updateBadge');
  if (window.electronAPI && window.electronAPI.onUpdateStatus) {
    window.electronAPI.onUpdateStatus((data) => {
      if (data.status === 'available') {
        updateBadge.textContent = `Đang tải bản cập nhật mới (v${data.version})...`;
        updateBadge.hidden = false;
      } else if (data.status === 'downloading') {
        updateBadge.textContent = `Đang tải bản cập nhật... ${data.percent}%`;
        updateBadge.hidden = false;
      } else if (data.status === 'downloaded') {
        updateBadge.textContent = `Đã tải xong bản mới (v${data.version}) — sẽ tự cài khi thoát game!`;
        updateBadge.hidden = false;
      } else {
        updateBadge.hidden = true;
      }
    });
  }

  /* init */
  (async function boot() {
    if (window.electronAPI && window.electronAPI.getSettings) {
      const settings = await window.electronAPI.getSettings();
      teacherName = settings.teacherName;
      avatarDataUrl = settings.avatarDataUrl;
      refreshMascotsEverywhere();
    } else if (IS_WEB) {
      teacherName = localStorage.getItem('tvc_teacherName') || teacherName;
      avatarDataUrl = localStorage.getItem('tvc_avatarDataUrl') || null;
      refreshMascotsEverywhere();
    }
    if (window.electronAPI && window.electronAPI.getAppVersion) {
      const version = await window.electronAPI.getAppVersion();
      $('appVersion').textContent = `Phiên bản ${version}`;
    } else if (IS_WEB) {
      $('appVersion').textContent = 'Chơi trên trình duyệt';
    }
    if (window.electronAPI && window.electronAPI.getLicenseStatus) {
      const status = await window.electronAPI.getLicenseStatus();
      if (status.isExpired) {
        showScreen('license');
        return;
      }
    }
    if (IS_WEB) webSendPing();
    applyRandomTheme();
    showScreen('home');
    if (IS_WEB && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  })();
})();
