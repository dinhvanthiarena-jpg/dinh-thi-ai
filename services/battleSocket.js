// Thach Dau (Mon-Maths 1v1 realtime battle) — Socket.IO event wiring.
//
// Scope note: this implements 1v1 only (Phase 1 of the approved plan).
// 2v2 room-code play is Phase 2, not built yet — deliberately, to ship a
// solid working 1v1 loop first rather than two half-finished modes.
//
// State is kept in plain in-memory Maps (single Node process, no horizontal
// scaling yet — see plan doc for when that becomes necessary). Restarting
// the server drops any in-progress matches/queue, which is an acceptable
// trade-off for a casual kids' game, not a payments system.
const crypto = require('crypto');
const { generateBattleSet } = require('./battleProblemService');
const { BattlePlayer, BattleMatch } = require('../models');

const MATCH_DURATION_MS = 90 * 1000;
const PROBLEMS_PER_MATCH = 30; // generous — time runs out before this does
const GRADE_WAIT_EXPAND_MS = 8000; // widen to ±1 grade if queue is thin this long

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

module.exports = function attachBattleSocket(io) {
  // 1v1 FIFO queue, per grade: { socketId, installId, displayName, grade, queuedAt }
  const queue1v1 = [];
  // Active matches: matchId -> match state
  const matches = new Map();

  function findOpponentIndex(grade, now) {
    // Same grade first; after GRADE_WAIT_EXPAND_MS, also accept ±1.
    for (let i = 0; i < queue1v1.length; i++) {
      if (queue1v1[i].grade === grade) return i;
    }
    for (let i = 0; i < queue1v1.length; i++) {
      const w = queue1v1[i];
      const waited = now - w.queuedAt;
      if (Math.abs(w.grade - grade) === 1 && waited > GRADE_WAIT_EXPAND_MS) return i;
    }
    return -1;
  }

  async function startMatch(playerA, playerB) {
    const matchId = crypto.randomUUID();
    const grade = playerA.grade; // queue only pairs same/adjacent grade; use the earlier waiter's grade
    const problems = generateBattleSet(grade, PROBLEMS_PER_MATCH);
    const startedAt = new Date();
    const state = {
      matchId,
      grade,
      problems, // full set WITH answers, server-only
      startedAt,
      endsAt: Date.now() + MATCH_DURATION_MS,
      players: {
        [playerA.installId]: { ...playerA, index: 0, score: 0 },
        [playerB.installId]: { ...playerB, index: 0, score: 0 },
      },
      timer: null,
    };
    matches.set(matchId, state);

    const publicProblems = problems.map((p) => ({ text: p.text, choices: p.choices }));
    [playerA, playerB].forEach((p, i) => {
      const opponent = i === 0 ? playerB : playerA;
      const socket = io.sockets.sockets.get(p.socketId);
      if (!socket) return;
      socket.join(matchId);
      socket.data.matchId = matchId;
      socket.emit('match:found', {
        matchId,
        grade,
        problems: publicProblems,
        durationMs: MATCH_DURATION_MS,
        me: { displayName: p.displayName },
        opponent: { displayName: opponent.displayName },
      });
    });

    state.timer = setTimeout(() => endMatch(matchId, 'timeout'), MATCH_DURATION_MS + 500);
  }

  async function endMatch(matchId, reason) {
    const state = matches.get(matchId);
    if (!state || state.ended) return;
    state.ended = true;
    if (state.timer) clearTimeout(state.timer);

    const entries = Object.values(state.players);
    const [p1, p2] = entries;
    let winnerInstallId = null;
    if (p1.score !== p2.score) winnerInstallId = p1.score > p2.score ? p1.installId : p2.installId;

    const results = {};
    for (const p of entries) {
      const isWinner = winnerInstallId === p.installId;
      const isDraw = winnerInstallId === null;
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
        mode: '1v1',
        grade: state.grade,
        players: entries.map((p) => ({ installId: p.installId, displayName: p.displayName, team: 0, score: p.score })),
        winnerTeam: winnerInstallId === null ? null : (winnerInstallId === p1.installId ? 0 : 1),
        startedAt: state.startedAt,
        endedAt: new Date(),
      });
    } catch (e) {
      console.error('[battle] luu BattleMatch that bai', e.message);
    }

    for (const p of entries) {
      const opponent = entries.find((x) => x.installId !== p.installId);
      const socket = io.sockets.sockets.get(p.socketId);
      if (!socket) continue;
      const r = results[p.installId] || {};
      socket.emit('match:end', {
        reason,
        myScore: p.score,
        opponentScore: opponent.score,
        outcome: winnerInstallId === null ? 'draw' : (winnerInstallId === p.installId ? 'win' : 'lose'),
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

    socket.on('queue:join', async (payload, ack) => {
      try {
        const installId = typeof payload?.installId === 'string' ? payload.installId.slice(0, 100) : null;
        const displayName = typeof payload?.displayName === 'string' ? payload.displayName.trim().slice(0, 24) || 'Bạn chơi' : 'Bạn chơi';
        const grade = Number.isInteger(payload?.grade) && payload.grade >= 1 && payload.grade <= 9 ? payload.grade : null;
        if (!installId || !grade) {
          if (typeof ack === 'function') ack({ ok: false, message: 'Thiếu thông tin người chơi.' });
          return;
        }
        // Không cho 1 socket vào hàng đợi 2 lần.
        const already = queue1v1.some((w) => w.socketId === socket.id);
        if (already) { if (typeof ack === 'function') ack({ ok: true }); return; }

        const player = await getOrCreatePlayer(installId, displayName, grade);
        const now = Date.now();
        const oppIdx = findOpponentIndex(grade, now);
        if (oppIdx === -1) {
          queue1v1.push({ socketId: socket.id, installId, displayName: player.displayName, grade, queuedAt: now });
          socket.data.installId = installId;
          if (typeof ack === 'function') ack({ ok: true, waiting: true });
          return;
        }
        const opponentWaiter = queue1v1.splice(oppIdx, 1)[0];
        if (typeof ack === 'function') ack({ ok: true, waiting: false });
        await startMatch(
          { socketId: opponentWaiter.socketId, installId: opponentWaiter.installId, displayName: opponentWaiter.displayName, grade: opponentWaiter.grade },
          { socketId: socket.id, installId, displayName: player.displayName, grade }
        );
      } catch (e) {
        console.error('[battle] queue:join loi', e.message);
        if (typeof ack === 'function') ack({ ok: false, message: 'Có lỗi khi ghép cặp, thử lại nhé.' });
      }
    });

    socket.on('queue:leave', () => {
      const idx = queue1v1.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) queue1v1.splice(idx, 1);
    });

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
      const correctAnswer = state.problems[player.index].answer;
      const isCorrect = Number(payload?.value) === correctAnswer;
      if (isCorrect) player.score += 1;
      player.index += 1;

      if (typeof ack === 'function') ack({ ok: true, correct: isCorrect, nextIndex: player.index, myScore: player.score });

      const opponent = Object.values(state.players).find((p) => p.installId !== installId);
      if (opponent) {
        const oppSocket = io.sockets.sockets.get(opponent.socketId);
        if (oppSocket) oppSocket.emit('match:opponentProgress', { score: player.score, index: player.index });
      }

      if (player.index >= state.problems.length) {
        const allDone = Object.values(state.players).every((p) => p.index >= state.problems.length);
        if (allDone) endMatch(state.matchId, 'completed');
      }
    });

    socket.on('disconnect', () => {
      const idx = queue1v1.findIndex((w) => w.socketId === socket.id);
      if (idx !== -1) queue1v1.splice(idx, 1);
      const matchId = socket.data.matchId;
      if (matchId && matches.has(matchId)) {
        // Đối thủ mất kết nối giữa trận — kết thúc luôn, người còn lại
        // (nếu còn) vẫn được xử lý thắng theo điểm hiện có.
        endMatch(matchId, 'opponent_disconnected');
      }
    });
  });
};
