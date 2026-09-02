// Thach Dau (Mon-Maths realtime battle) — Socket.IO event wiring.
// Unified match engine for BOTH modes: 1v1 (team size 1) and 2v2 (team
// size 2, room-code based). A "match" is always team-vs-team internally;
// 1v1 is just the team-size-1 special case, so winner/scoring logic is
// shared instead of duplicated.
//
// State is kept in plain in-memory Maps (single Node process, no horizontal
// scaling yet — see plan doc for when that becomes necessary). Restarting
// the server drops any in-progress matches/queue/rooms, an acceptable
// trade-off for a casual kids' game, not a payments system.
const crypto = require('crypto');
const { generateBattleSet } = require('./battleProblemService');
const { BattlePlayer, BattleMatch } = require('../models');

const MATCH_DURATION_MS = 90 * 1000;
const PROBLEMS_PER_MATCH = 30; // generous — time runs out before this does
const GRADE_WAIT_EXPAND_MS = 8000; // widen to ±1 grade if 1v1 queue is thin
const ROOM_CAPACITY = { '1v1': 2, '2v2': 4 }; // theo mã: 1v1 = 2 người, 2v2 = 4 người
const ROOM_STALE_MS = 20 * 60 * 1000; // abandoned rooms cleaned up after 20 min

const TIER_NAMES = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương'];
const POINTS_PER_TIER = 100;

function tierFromPoints(points) {
  return Math.max(0, Math.min(TIER_NAMES.length - 1, Math.floor(points / POINTS_PER_TIER)));
}

async function getOrCreatePlayer(installId, displayName, grade) {
  const [player] = await BattlePlayer.findOrCreate({
    where: { installId },
    defaults: { displayName: displayName || 'Bạn chơi', grade },
  });
  const updates = {};
  if (displayName && displayName !== player.displayName) updates.displayName = displayName;
  if (grade && grade !== player.grade) updates.grade = grade;
  updates.lastPlayedAt = new Date();
  if (Object.keys(updates).length) await player.update(updates);
  return player;
}

function makeRoomCode(existing) {
  let code;
  do { code = String(Math.floor(1000 + Math.random() * 9000)); } while (existing.has(code));
  return code;
}

module.exports = function attachBattleSocket(io) {
  // 1v1 FIFO queue, per grade: { socketId, installId, displayName, grade, queuedAt }
  const queue1v1 = [];
  // 2v2 rooms waiting to fill: code -> { grade, hostInstallId, members: [...], createdAt }
  const rooms = new Map();
  // Active matches: matchId -> match state
  const matches = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms) {
      if (now - room.createdAt > ROOM_STALE_MS) rooms.delete(code);
    }
  }, 5 * 60 * 1000).unref?.();

  function findOpponentIndex(grade, now, installId) {
    // Same grade first; after GRADE_WAIT_EXPAND_MS, also accept ±1. Never
    // match a waiter against their own installId — cùng 1 máy/trình duyệt
    // mở 2 tab test (hoặc lỡ bấm tìm 2 lần) sẽ ghép với chính mình, khiến
    // state.players chỉ còn 1 khoá (2 lần gán cùng installId đè lên nhau)
    // và endMatch() crash lúc so sánh điểm — thấy lỗi này thật khi test.
    for (let i = 0; i < queue1v1.length; i++) {
      if (queue1v1[i].grade === grade && queue1v1[i].installId !== installId) return i;
    }
    for (let i = 0; i < queue1v1.length; i++) {
      const w = queue1v1[i];
      const waited = now - w.queuedAt;
      if (Math.abs(w.grade - grade) === 1 && waited > GRADE_WAIT_EXPAND_MS && w.installId !== installId) return i;
    }
    return -1;
  }

  /** entries: [{socketId, installId, displayName, team}], team is 0 or 1.
   * Works for both 1v1 (2 entries, team 0 and 1, one each) and 2v2 (4
   * entries, two per team). */
  async function startMatch(mode, grade, entries) {
    const matchId = crypto.randomUUID();
    const problems = generateBattleSet(grade, PROBLEMS_PER_MATCH);
    const startedAt = new Date();
    const players = {};
    entries.forEach((e) => { players[e.installId] = { ...e, index: 0, score: 0 }; });
    const state = { matchId, mode, grade, problems, startedAt, players, timer: null, ended: false };
    matches.set(matchId, state);

    const publicProblems = problems.map((p) => ({ text: p.text, choices: p.choices }));
    entries.forEach((e) => {
      const socket = io.sockets.sockets.get(e.socketId);
      if (!socket) return;
      socket.join(matchId);
      socket.data.matchId = matchId;
      const teammates = entries.filter((x) => x.team === e.team && x.installId !== e.installId).map((x) => x.displayName);
      const opponents = entries.filter((x) => x.team !== e.team).map((x) => x.displayName);
      socket.emit('match:found', {
        matchId,
        mode,
        grade,
        problems: publicProblems,
        durationMs: MATCH_DURATION_MS,
        me: { displayName: e.displayName, team: e.team },
        teammates,
        opponents,
      });
    });

    state.timer = setTimeout(() => endMatch(matchId, 'timeout'), MATCH_DURATION_MS + 500);
  }

  function teamTotals(state) {
    const totals = { 0: 0, 1: 0 };
    Object.values(state.players).forEach((p) => { totals[p.team] = (totals[p.team] || 0) + p.score; });
    return totals;
  }

  async function endMatch(matchId, reason) {
    const state = matches.get(matchId);
    if (!state || state.ended) return;
    state.ended = true;
    if (state.timer) clearTimeout(state.timer);

    const entries = Object.values(state.players);
    // Phòng thủ: trận hợp lệ luôn có đúng 2 đội, mỗi đội ít nhất 1 người —
    // nếu vì lý do gì đó không đủ (dữ liệu hỏng, ghép trùng installId lọt
    // qua được...) thì dừng sạch, không crash lúc tính đội thắng.
    const teamIds = [...new Set(entries.map((p) => p.team))];
    if (entries.length < 2 || teamIds.length < 2) {
      matches.delete(matchId);
      entries.forEach((p) => {
        const socket = io.sockets.sockets.get(p.socketId);
        if (socket) socket.emit('match:end', { reason: 'invalid', myScore: p.score, opponentScore: 0, outcome: 'draw', rankDelta: 0, coinsDelta: 0, newTier: null, tierName: null });
      });
      return;
    }
    const totals = teamTotals(state);
    let winnerTeam = null;
    if (totals[0] !== totals[1]) winnerTeam = totals[0] > totals[1] ? 0 : 1;

    const results = {};
    for (const p of entries) {
      const isWinner = winnerTeam === p.team;
      const isDraw = winnerTeam === null;
      const rankDelta = isDraw ? 10 : isWinner ? 20 : 5;
      const coinsDelta = isDraw ? 5 : isWinner ? 10 : 2;
      try {
        const record = await BattlePlayer.findOne({ where: { installId: p.installId } });
        if (record) {
          const newPoints = Math.max(0, record.rankPoints + rankDelta);
          await record.update({
            rankPoints: newPoints,
            tier: tierFromPoints(newPoints),
            coins: record.coins + coinsDelta,
            wins: record.wins + (isWinner ? 1 : 0),
            losses: record.losses + (!isWinner && !isDraw ? 1 : 0),
          });
          results[p.installId] = { rankDelta, coinsDelta, newTier: record.tier, newRankPoints: record.rankPoints };
        }
      } catch (e) {
        console.error('[battle] cap nhat BattlePlayer that bai', e.message);
        results[p.installId] = { rankDelta, coinsDelta, newTier: null, newRankPoints: null };
      }
    }

    try {
      await BattleMatch.create({
        mode: state.mode,
        grade: state.grade,
        players: entries.map((p) => ({ installId: p.installId, displayName: p.displayName, team: p.team, score: p.score })),
        winnerTeam,
        startedAt: state.startedAt,
        endedAt: new Date(),
      });
    } catch (e) {
      console.error('[battle] luu BattleMatch that bai', e.message);
    }

    for (const p of entries) {
      const socket = io.sockets.sockets.get(p.socketId);
      if (!socket) continue;
      const r = results[p.installId] || {};
      socket.emit('match:end', {
        reason,
        myScore: totals[p.team],
        opponentScore: totals[p.team === 0 ? 1 : 0],
        outcome: winnerTeam === null ? 'draw' : (winnerTeam === p.team ? 'win' : 'lose'),
        rankDelta: r.rankDelta,
        coinsDelta: r.coinsDelta,
        newTier: r.newTier,
        tierName: r.newTier != null ? TIER_NAMES[r.newTier] : null,
      });
      socket.leave(matchId);
    }
    matches.delete(matchId);
  }

  io.on('connection', (socket) => {
    socket.on('ping:echo', (payload, ack) => {
      const reply = { ok: true, echo: payload, transport: socket.conn.transport.name, serverTime: Date.now() };
      if (typeof ack === 'function') ack(reply); else socket.emit('pong:echo', reply);
    });

    // ---- 1v1 ghép ngẫu nhiên (hàng đợi) ----
    socket.on('queue:join', async (payload, ack) => {
      try {
        const installId = typeof payload?.installId === 'string' ? payload.installId.slice(0, 100) : null;
        const displayName = typeof payload?.displayName === 'string' ? payload.displayName.trim().slice(0, 24) || 'Bạn chơi' : 'Bạn chơi';
        const grade = Number.isInteger(payload?.grade) && payload.grade >= 1 && payload.grade <= 9 ? payload.grade : null;
        if (!installId || !grade) {
          if (typeof ack === 'function') ack({ ok: false, message: 'Thiếu thông tin người chơi.' });
          return;
        }
        const already = queue1v1.some((w) => w.socketId === socket.id);
        if (already) { if (typeof ack === 'function') ack({ ok: true }); return; }

        const player = await getOrCreatePlayer(installId, displayName, grade);
        // Phải gán TRƯỚC khi rẽ nhánh chờ/ghép ngay — người bấm "Tìm đối thủ"
        // khi đã có sẵn người chờ sẽ đi thẳng vào startMatch() bên dưới, nếu
        // chỉ gán ở nhánh chờ thì socket này thiếu installId, mọi lần nộp
        // đáp án answer:submit sau đó bị âm thầm từ chối (đã xảy ra thật khi
        // test 2 trình duyệt thật — điểm số đứng yên dù bấm đúng đáp án).
        socket.data.installId = installId;
        const now = Date.now();
        const oppIdx = findOpponentIndex(grade, now, installId);
        if (oppIdx === -1) {
          queue1v1.push({ socketId: socket.id, installId, displayName: player.displayName, grade, queuedAt: now });
          if (typeof ack === 'function') ack({ ok: true, waiting: true });
          return;
        }
        const opponentWaiter = queue1v1.splice(oppIdx, 1)[0];
        if (typeof ack === 'function') ack({ ok: true, waiting: false });
        await startMatch('1v1', grade, [
          { socketId: opponentWaiter.socketId, installId: opponentWaiter.installId, displayName: opponentWaiter.displayName, team: 0 },
          { socketId: socket.id, installId, displayName: player.displayName, team: 1 },
        ]);
      } catch (e) {
        console.error('[battle] queue:join loi', e.message);
        if (typeof ack === 'function') ack({ ok: false, message: 'Có lỗi khi ghép cặp, thử lại nhé.' });
      }
    });

    socket.on('queue:leave', () => {
      const idx = queue1v1.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) queue1v1.splice(idx, 1);
    });

    // ---- Theo mã phòng (1v1 = 2 người, 2v2 = 4 người) ----
    function broadcastRoom(code) {
      const room = rooms.get(code);
      if (!room) return;
      io.to('room:' + code).emit('room:update', {
        code,
        grade: room.grade,
        members: room.members.map((m) => ({ displayName: m.displayName, team: m.team })),
        capacity: room.capacity,
      });
    }

    socket.on('room:create', async (payload, ack) => {
      try {
        const installId = typeof payload?.installId === 'string' ? payload.installId.slice(0, 100) : null;
        const displayName = typeof payload?.displayName === 'string' ? payload.displayName.trim().slice(0, 24) || 'Bạn chơi' : 'Bạn chơi';
        const grade = Number.isInteger(payload?.grade) && payload.grade >= 1 && payload.grade <= 9 ? payload.grade : null;
        const mode = payload?.mode === '1v1' ? '1v1' : '2v2';
        if (!installId || !grade) { if (typeof ack === 'function') ack({ ok: false, message: 'Thiếu thông tin người chơi.' }); return; }
        const player = await getOrCreatePlayer(installId, displayName, grade);
        const code = makeRoomCode(rooms);
        rooms.set(code, {
          grade,
          mode,
          capacity: ROOM_CAPACITY[mode],
          hostInstallId: installId,
          members: [{ socketId: socket.id, installId, displayName: player.displayName, team: 0 }],
          createdAt: Date.now(),
        });
        socket.data.installId = installId;
        socket.data.roomCode = code;
        socket.join('room:' + code);
        if (typeof ack === 'function') ack({ ok: true, code, grade });
        broadcastRoom(code);
      } catch (e) {
        console.error('[battle] room:create loi', e.message);
        if (typeof ack === 'function') ack({ ok: false, message: 'Không tạo được phòng, thử lại nhé.' });
      }
    });

    socket.on('room:join', async (payload, ack) => {
      try {
        const installId = typeof payload?.installId === 'string' ? payload.installId.slice(0, 100) : null;
        const displayName = typeof payload?.displayName === 'string' ? payload.displayName.trim().slice(0, 24) || 'Bạn chơi' : 'Bạn chơi';
        const code = typeof payload?.code === 'string' ? payload.code.trim().slice(0, 8) : null;
        if (!installId || !code) { if (typeof ack === 'function') ack({ ok: false, message: 'Thiếu mã phòng.' }); return; }
        const room = rooms.get(code);
        if (!room) { if (typeof ack === 'function') ack({ ok: false, message: 'Không tìm thấy phòng này.' }); return; }
        if (room.members.some((m) => m.installId === installId)) { if (typeof ack === 'function') ack({ ok: false, message: 'Bạn đã ở trong phòng này rồi.' }); return; }
        if (room.members.length >= room.capacity) { if (typeof ack === 'function') ack({ ok: false, message: 'Phòng đã đủ người.' }); return; }

        const player = await getOrCreatePlayer(installId, displayName, room.grade);
        const team = room.members.length % 2; // 0,1,0,1 theo thứ tự vào — xem giải thích ở đầu file
        room.members.push({ socketId: socket.id, installId, displayName: player.displayName, team });
        socket.data.installId = installId;
        socket.data.roomCode = code;
        socket.join('room:' + code);
        if (typeof ack === 'function') ack({ ok: true, code, grade: room.grade, team });
        broadcastRoom(code);

        if (room.members.length >= room.capacity) {
          const entries = room.members.map((m) => ({ socketId: m.socketId, installId: m.installId, displayName: m.displayName, team: m.team }));
          rooms.delete(code);
          await startMatch(room.mode, room.grade, entries);
        }
      } catch (e) {
        console.error('[battle] room:join loi', e.message);
        if (typeof ack === 'function') ack({ ok: false, message: 'Không vào được phòng, thử lại nhé.' });
      }
    });

    socket.on('room:leave', () => {
      const code = socket.data.roomCode;
      if (!code) return;
      const room = rooms.get(code);
      if (room) {
        room.members = room.members.filter((m) => m.socketId !== socket.id);
        if (!room.members.length) rooms.delete(code);
        else broadcastRoom(code);
      }
      socket.leave('room:' + code);
      socket.data.roomCode = null;
    });

    // ---- Trong trận (chung cho 1v1 và 2v2) ----
    socket.on('answer:submit', (payload, ack) => {
      const matchId = socket.data.matchId;
      const state = matchId && matches.get(matchId);
      if (!state || state.ended) { if (typeof ack === 'function') ack({ ok: false }); return; }
      const installId = socket.data.installId;
      const player = state.players[installId];
      if (!player) { if (typeof ack === 'function') ack({ ok: false }); return; }

      const submittedIndex = Number(payload?.index);
      // Chỉ nhận đúng câu hiện tại của người đó — chặn gửi lại/gửi vượt.
      if (submittedIndex !== player.index || player.index >= state.problems.length) {
        if (typeof ack === 'function') ack({ ok: false });
        return;
      }
      const currentProblem = state.problems[player.index];
      if (!currentProblem) { if (typeof ack === 'function') ack({ ok: false }); return; }
      const isCorrect = Number(payload?.value) === currentProblem.answer;
      if (isCorrect) player.score += 1;
      player.index += 1;

      if (typeof ack === 'function') ack({ ok: true, correct: isCorrect, nextIndex: player.index, myScore: player.score, myTeam: player.team });

      // Bắn TỔNG ĐIỂM 2 ĐỘI qua room thay vì socketId cache từ lúc bắt đầu
      // trận — nếu kết nối long-polling của ai đó phải tái lập giữa chừng,
      // socketId cũ không còn map tới ai cả và gửi thẳng theo id sẽ IM LẶNG
      // THẤT BẠI (không lỗi, không cập nhật điểm bên kia) — đã thấy đúng lỗi
      // này khi test 2 trình duyệt thật. Room thì Socket.IO tự theo dõi
      // thành viên hiện tại. Bắn tổng đội (không phải điểm riêng người vừa
      // trả lời) để 2v2 luôn hiển thị đúng, và dùng chung code cho cả 1v1.
      const totals = teamTotals(state);
      io.to(matchId).emit('match:teamsProgress', { totals, byTeam: player.team, doneIndex: player.index });

      if (player.index >= state.problems.length) {
        const allDone = Object.values(state.players).every((p) => p.index >= state.problems.length);
        if (allDone) endMatch(state.matchId, 'completed');
      }
    });

    socket.on('disconnect', () => {
      const idx = queue1v1.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) queue1v1.splice(idx, 1);

      const roomCode = socket.data.roomCode;
      if (roomCode) {
        const room = rooms.get(roomCode);
        if (room) {
          room.members = room.members.filter((m) => m.socketId !== socket.id);
          if (!room.members.length) rooms.delete(roomCode);
          else broadcastRoom(roomCode);
        }
      }

      const matchId = socket.data.matchId;
      if (matchId && matches.has(matchId)) {
        // Có người mất kết nối giữa trận — kết thúc luôn theo điểm hiện có
        // (không giữ những người còn lại chờ mãi một người sẽ không quay
        // lại được — trận in-memory nên không có gì để "khôi phục" cả).
        endMatch(matchId, 'player_disconnected');
      }
    });
  });
};
