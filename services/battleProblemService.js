// Server-authoritative math-problem generator for Thach Dau (Mon-Maths
// realtime battle). Grades 1-5 are a direct, faithful port of the client's
// own instant/offline generator (web/app.js genByGradeOp/makeDistractors,
// grades 1-5 branch) so battle problems feel identical in difficulty to
// normal solo play — untouched, not rewritten. Grades 6-9 (THCS) are new,
// added on top without changing anything in the 1-5 branch above them.
//
// Server-side (not client `Math.random()`) specifically so every player in
// a match gets the exact same problem set and no client can fabricate its
// own easier problems or claim a correct answer the server didn't verify.

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genByGradeOp(grade, op) {
  let a, b, ans, decimal = false;
  switch (grade) {
    // ---- Lớp 1-5: ported verbatim from web/app.js genByGradeOp ----
    // Chương trình GDPT 2018: lớp 1 chưa học nhân/chia — oneProblem() bên
    // dưới chỉ chọn op trong {add, sub} cho lớp 1 nên nhánh mul/div ở đây
    // không còn được gọi tới, nhưng vẫn bỏ hẳn cho khớp với client.
    case 1:
      if (op === 'add') { a = randInt(1, 19); b = randInt(1, 20 - a); ans = a + b; }
      else { a = randInt(1, 20); b = randInt(1, a); ans = a - b; }
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
    case 5:
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

    // ---- Lớp 6-9 (THCS): new, additive only ----
    case 6:
      // Số nguyên (âm/dương) — trọng tâm lớp 6 là làm quen số âm.
      if (op === 'add') { a = randInt(-50, 50); b = randInt(-50, 50); ans = a + b; }
      else if (op === 'sub') { a = randInt(-50, 50); b = randInt(-50, 50); ans = a - b; }
      else if (op === 'mul') { a = randInt(-12, 12); b = randInt(-12, 12); ans = a * b; }
      else { const d = randInt(2, 12) * (Math.random() < 0.5 ? -1 : 1), q = randInt(2, 12); a = d * q; b = d; ans = q; }
      break;
    case 7:
      // Số hữu tỉ: số thập phân 1 chữ số kèm số âm.
      if (op === 'add' || op === 'sub') {
        a = Math.round(randInt(-999, 999) / 10 * 10) / 10;
        b = Math.round(randInt(-999, 999) / 10 * 10) / 10;
        ans = Math.round((op === 'add' ? a + b : a - b) * 10) / 10;
        decimal = true;
      } else if (op === 'mul') { a = randInt(-15, 15); b = randInt(-15, 15); ans = a * b; }
      else { const d = randInt(2, 15) * (Math.random() < 0.5 ? -1 : 1), q = randInt(2, 15); a = d * q; b = d; ans = q; }
      break;
    case 8:
      // "Tìm x" phương trình bậc nhất đơn giản: a*x + b = c, hỏi x.
      if (op === 'add' || op === 'sub') {
        const x = randInt(-20, 20), coeff = randInt(2, 9) * (op === 'sub' ? -1 : 1);
        const cst = randInt(-30, 30);
        a = coeff; b = cst; ans = x; // hiển thị: coeff*x + cst = coeff*x_ans + cst
        decimal = false;
      } else if (op === 'mul') { a = randInt(-25, 25); b = randInt(-25, 25); ans = a * b; }
      else { const d = randInt(2, 20) * (Math.random() < 0.5 ? -1 : 1), q = randInt(2, 20); a = d * q; b = d; ans = q; }
      break;
    default: { // 9
      if (op === 'add' || op === 'sub') {
        a = Math.round(randInt(-9999, 9999) / 100 * 100) / 100;
        b = Math.round(randInt(-9999, 9999) / 100 * 100) / 100;
        ans = Math.round((op === 'add' ? a + b : a - b) * 100) / 100;
        decimal = true;
      } else if (op === 'mul') { a = randInt(-30, 30); b = randInt(-30, 30); ans = a * b; }
      else { const d = randInt(2, 25) * (Math.random() < 0.5 ? -1 : 1), q = randInt(2, 25); a = d * q; b = d; ans = q; }
      break;
    }
  }
  return { a, b, ans, op, decimal, grade };
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
    } else {
      const magnitude = Math.max(2, Math.abs(correct));
      const maxDelta = Math.max(2, Math.round(magnitude * 0.3));
      const delta = randInt(1, maxDelta) * (Math.random() < 0.5 ? -1 : 1);
      val = correct + delta;
    }
    if (!used.has(val)) { used.add(val); out.push(val); }
  }
  return out;
}

const OP_SYMBOL = { add: '+', sub: '−', mul: '×', div: '÷' };
const OPS = ['add', 'sub', 'mul', 'div'];

function fmtNum(n) {
  const s = Number.isInteger(n) ? n.toString() : n.toFixed(n < 10 && n > -10 ? 2 : 1).replace('.', ',');
  // Dấu trừ chuẩn kiểu chữ (U+2212) thay vì dấu gạch ngang ASCII, khớp
  // với OP_SYMBOL.sub đang dùng ở trên.
  return s.startsWith('-') ? '−' + s.slice(1) : s;
}

/** One battle problem: {text, choices, answer} — answer is the correct
 * numeric value (server keeps it, only sent back for grading, never to the
 * client ahead of a submission). */
function oneProblem(grade) {
  // Lớp 1 chưa học nhân/chia (GDPT 2018) — chỉ random giữa cộng/trừ.
  const opsPool = grade === 1 ? ['add', 'sub'] : OPS;
  const op = opsPool[randInt(0, opsPool.length - 1)];
  const q = genByGradeOp(grade, op);
  let text;
  if (grade === 8 && (op === 'add' || op === 'sub')) {
    // Chỉ lớp 8 sinh ra hệ số nguyên nhỏ phù hợp "tìm x" — lớp 9 dùng
    // nhánh số thập phân (số thực) nên KHÔNG dùng cách hiển thị này,
    // tránh ra phương trình xấu kiểu "-72.81x - 44.67 = 8509.05".
    const cst = q.b;
    const rhs = q.a * q.ans + cst;
    const coeffStr = q.a < 0 ? `(${fmtNum(q.a)})` : fmtNum(q.a);
    text = `Tìm x, biết: ${coeffStr}x ${cst >= 0 ? '+' : '−'} ${Math.abs(cst)} = ${fmtNum(rhs)}`;
  } else {
    // Số âm ở toán hạng thứ hai được ngoặc lại — "5 − -3" đọc rất rối,
    // "5 − (−3)" đúng chuẩn cách viết toán.
    const bStr = q.b < 0 ? `(${fmtNum(q.b)})` : fmtNum(q.b);
    text = `${fmtNum(q.a)} ${OP_SYMBOL[q.op]} ${bStr} = ?`;
  }
  const distractors = makeDistractors(q.ans, q.decimal);
  const choices = [q.ans, ...distractors].sort(() => Math.random() - 0.5);
  return { text, choices, answer: q.ans };
}

/** Generates the fixed problem set for one match — same set for every
 * player in the room, generated once at match start. */
function generateBattleSet(grade, count = 20) {
  const safeGrade = Number.isInteger(grade) && grade >= 1 && grade <= 9 ? grade : 3;
  const problems = [];
  for (let i = 0; i < count; i++) problems.push(oneProblem(safeGrade));
  return problems;
}

module.exports = { generateBattleSet, oneProblem, genByGradeOp, makeDistractors };
