(() => {
  'use strict';

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

  /* ================= BACKGROUND MUSIC ================= */
  function padTone(freq, start, dur, peak) {
    if (muted) return;
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t0 = c.currentTime + start;
    const attack = Math.min(0.35, dur * 0.3);
    const release = Math.min(0.4, dur * 0.3);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + attack);
    gain.gain.setValueAtTime(peak, t0 + dur - release);
    gain.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Gentle pop ballad: soft melody over a sustained I-V-vi-IV chord pad (in C major)
  const MUSIC_STEP_DUR = 0.5;
  const MUSIC_MELODY = [
    783.99, 659.25, 523.25, 659.25, // over C
    493.88, 587.33, 783.99, 587.33, // over G
    440.00, 523.25, 659.25, 523.25, // over Am
    523.25, 440.00, 698.46, 440.00, // over F
  ];
  const MUSIC_CHORDS = [
    [130.81, 164.81, 196.00], // C
    [196.00, 246.94, 293.66], // G
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
  ];
  const MUSIC_CHORD_DUR = MUSIC_STEP_DUR * 4;
  let musicTimerId = null;
  let musicNextTime = 0;
  let musicStep = 0;

  function scheduleMusicStep() {
    if (muted) return;
    const c = ctx();
    while (musicNextTime < c.currentTime + 0.2) {
      const stepInLoop = musicStep % MUSIC_MELODY.length;
      const offset = musicNextTime - c.currentTime;
      tone(MUSIC_MELODY[stepInLoop], offset, MUSIC_STEP_DUR * 0.85, 'triangle', 0.05);
      if (stepInLoop % 4 === 0) {
        const chord = MUSIC_CHORDS[(stepInLoop / 4) % MUSIC_CHORDS.length];
        chord.forEach((f) => padTone(f, offset, MUSIC_CHORD_DUR, 0.028));
      }
      musicNextTime += MUSIC_STEP_DUR;
      musicStep++;
    }
  }

  function startMusic() {
    if (musicTimerId || muted) return;
    const c = ctx();
    musicNextTime = c.currentTime + 0.05;
    musicStep = 0;
    musicTimerId = setInterval(scheduleMusicStep, 100);
  }

  function stopMusic() {
    clearInterval(musicTimerId);
    musicTimerId = null;
  }

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
        if (op === 'add') { a = randInt(0, 20); b = randInt(0, 20 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(0, 20); b = randInt(0, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(1, 5); b = randInt(1, 5); ans = a * b; }
        else { const d = randInt(1, 5), q = randInt(1, 5); a = d * q; b = d; ans = q; }
        break;
      case 2:
        if (op === 'add') { a = randInt(0, 100); b = randInt(0, 100 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(0, 100); b = randInt(0, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(2, 5); b = randInt(1, 10); ans = a * b; }
        else { const d = randInt(2, 5), q = randInt(1, 10); a = d * q; b = d; ans = q; }
        break;
      case 3:
        if (op === 'add') { a = randInt(0, 1000); b = randInt(0, 1000 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(0, 1000); b = randInt(0, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(2, 9); b = randInt(2, 9); ans = a * b; }
        else { const d = randInt(2, 9), q = randInt(2, 9); a = d * q; b = d; ans = q; }
        break;
      case 4:
        if (op === 'add') { a = randInt(0, 10000); b = randInt(0, 10000 - a); ans = a + b; }
        else if (op === 'sub') { a = randInt(0, 10000); b = randInt(0, a); ans = a - b; }
        else if (op === 'mul') { a = randInt(11, 99); b = randInt(2, 12); ans = a * b; }
        else { const d = randInt(2, 12), q = randInt(5, 50); a = d * q; b = d; ans = q; }
        break;
      default: // grade 5
        if (op === 'add') {
          if (Math.random() < 0.5) {
            a = randInt(1, 999) / 10; b = randInt(1, 999) / 10;
            a = Math.round(a * 10) / 10; b = Math.round(b * 10) / 10;
            ans = Math.round((a + b) * 10) / 10; decimal = true;
          } else { a = randInt(1000, 90000); b = randInt(0, 100000 - a); ans = a + b; }
        } else if (op === 'sub') {
          if (Math.random() < 0.5) {
            a = randInt(10, 999) / 10; b = randInt(1, a * 10) / 10;
            a = Math.round(a * 10) / 10; b = Math.round(b * 10) / 10;
            if (b > a) [a, b] = [b, a];
            ans = Math.round((a - b) * 10) / 10; decimal = true;
          } else { a = randInt(1000, 100000); b = randInt(0, a); ans = a - b; }
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
      { text: 'Lan có 5 cái kẹo. Mẹ cho thêm 3 cái kẹo nữa. Hỏi Lan có tất cả bao nhiêu cái kẹo?', answer: 8, solution: 'Số kẹo Lan có tất cả là: 5 + 3 = 8 (cái kẹo).' },
      { text: 'Trong chuồng có 9 con gà. Mẹ bán đi 4 con gà. Hỏi trong chuồng còn lại bao nhiêu con gà?', answer: 5, solution: 'Số gà còn lại là: 9 − 4 = 5 (con gà).' },
      { text: 'An có 6 quyển vở, Bình có 7 quyển vở. Hỏi cả hai bạn có bao nhiêu quyển vở?', answer: 13, solution: 'Số vở cả hai bạn có là: 6 + 7 = 13 (quyển vở).' },
      { text: 'Trên cây có 10 quả táo. Gió thổi rụng mất 3 quả. Hỏi trên cây còn lại bao nhiêu quả táo?', answer: 7, solution: 'Số táo còn lại là: 10 − 3 = 7 (quả táo).' },
      { text: 'Hoa có 4 bông hoa đỏ và 5 bông hoa vàng. Hỏi Hoa có tất cả bao nhiêu bông hoa?', answer: 9, solution: 'Số hoa Hoa có tất cả là: 4 + 5 = 9 (bông hoa).' },
      { text: 'Lớp có 15 bạn, trong đó có 8 bạn nam. Hỏi lớp có bao nhiêu bạn nữ?', answer: 7, solution: 'Số bạn nữ là: 15 − 8 = 7 (bạn nữ).' },
      { text: 'Mai có 8 cái bút chì. Mai cho bạn 3 cái. Hỏi Mai còn lại bao nhiêu cái bút chì?', answer: 5, solution: 'Số bút chì còn lại là: 8 − 3 = 5 (cái bút chì).' },
      { text: 'Trong bể có 6 con cá vàng và 6 con cá chép. Hỏi trong bể có tất cả bao nhiêu con cá?', answer: 12, solution: 'Số cá có tất cả là: 6 + 6 = 12 (con cá).' },
      { text: 'Bình có 7 viên bi. Bạn cho Bình thêm 6 viên bi nữa. Hỏi Bình có tất cả bao nhiêu viên bi?', answer: 13, solution: 'Số bi Bình có tất cả là: 7 + 6 = 13 (viên bi).' },
      { text: 'Có 14 con chim đậu trên cành. 5 con bay đi. Hỏi trên cành còn lại bao nhiêu con chim?', answer: 9, solution: 'Số chim còn lại là: 14 − 5 = 9 (con chim).' },
      { text: 'Nam có 9 cái kẹo, Hùng có 8 cái kẹo. Hỏi cả hai bạn có bao nhiêu cái kẹo?', answer: 17, solution: 'Số kẹo cả hai bạn có là: 9 + 8 = 17 (cái kẹo).' },
      { text: 'Có 16 quả bóng bay, bị vỡ mất 7 quả. Hỏi còn lại bao nhiêu quả bóng bay?', answer: 9, solution: 'Số bóng bay còn lại là: 16 − 7 = 9 (quả bóng bay).' },
      { text: 'Lớp có 8 bạn nam và 9 bạn nữ. Hỏi lớp có tất cả bao nhiêu bạn?', answer: 17, solution: 'Số bạn có tất cả là: 8 + 9 = 17 (bạn).' },
      { text: 'Mẹ mua 12 quả trứng, đã dùng hết 4 quả. Hỏi còn lại bao nhiêu quả trứng?', answer: 8, solution: 'Số trứng còn lại là: 12 − 4 = 8 (quả trứng).' },
      { text: 'Có 5 con thỏ trắng và 9 con thỏ nâu. Hỏi có tất cả bao nhiêu con thỏ?', answer: 14, solution: 'Số thỏ có tất cả là: 5 + 9 = 14 (con thỏ).' },
      { text: 'Bé có 18 cái kẹo, bé ăn hết 9 cái. Hỏi bé còn lại bao nhiêu cái kẹo?', answer: 9, solution: 'Số kẹo còn lại là: 18 − 9 = 9 (cái kẹo).' },
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
    license: $('screen-license'), home: $('screen-home'), setup: $('screen-setup'), game: $('screen-game'), result: $('screen-result'),
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
  }
  refreshSoundIcon();
  soundBtn.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem('mathgame_muted', muted ? '1' : '0');
    refreshSoundIcon();
    if (muted) {
      stopMusic();
    } else {
      sfx.click();
      startMusic();
    }
  });

  document.addEventListener('pointerdown', function firstInteraction() {
    document.removeEventListener('pointerdown', firstInteraction);
    if (!muted) startMusic();
  }, { once: true });

  /* ================= HOME ================= */
  $('btnPlay').addEventListener('click', () => { sfx.click(); showScreen('setup'); });
  $('btnHowTo').addEventListener('click', () => { sfx.click(); $('howToModal').hidden = false; });
  $('btnCloseHowTo').addEventListener('click', () => { $('howToModal').hidden = true; });
  $('btnHowToGotIt').addEventListener('click', () => { sfx.click(); $('howToModal').hidden = true; });
  $('howToModal').addEventListener('click', (e) => { if (e.target.id === 'howToModal') $('howToModal').hidden = true; });
  setMascot($('mascotHome'), 'happy');

  $('btnContactFB').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('facebook');
  });
  $('btnContactWeb').addEventListener('click', () => {
    sfx.click();
    if (window.electronAPI) window.electronAPI.openExternalLink('website');
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
  const breakOverlay = $('breakOverlay');

  function showBreak() {
    clearInterval(state.timerId);
    const idx = nextFromShuffledBag('mathgame_joke_bag', JOKES.length);
    const joke = JOKES[idx];
    $('breakJokeQ').textContent = joke.q;
    $('breakJokeA').textContent = joke.a;
    $('breakJokeA').hidden = true;
    $('btnRevealJoke').hidden = false;
    $('btnContinueGame').hidden = true;
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
    // Web: no native screenshot capture available without extra permissions,
    // so share a text summary instead via the platform share sheet.
    const total = state.mode === 'practice' ? state.totalQuestions : state.answered;
    const shareText = `Con vừa đạt ${state.score} điểm (${state.correct}/${total} câu đúng) trong game Toán Vui Cấp 1! Cùng chơi thử nhé!`;
    const shareUrl = window.location.origin + window.location.pathname;
    if (navigator.share) {
      try { await navigator.share({ title: 'Toán Vui Cấp 1', text: shareText, url: shareUrl }); } catch (e) { /* user cancelled */ }
      return;
    }
    try { await navigator.clipboard.writeText(`${shareText} ${shareUrl}`); } catch (e) {}
    window.open('https://www.facebook.com/', '_blank');
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
