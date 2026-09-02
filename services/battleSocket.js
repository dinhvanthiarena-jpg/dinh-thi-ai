// Thach Dau (Mon-Maths 1v1/2v2 realtime battle) — Socket.IO event wiring.
// PHASE 0: just prove a client can connect through the real cPanel/LiteSpeed
// hosting and round-trip a message (WebSocket upgrade, or Socket.IO's
// long-polling fallback if the upgrade doesn't work here). Matchmaking,
// rooms and match logic land in later phases once that's confirmed.
module.exports = function attachBattleSocket(io) {
  io.on('connection', (socket) => {
    socket.on('ping:echo', (payload, ack) => {
      const reply = { ok: true, echo: payload, transport: socket.conn.transport.name, serverTime: Date.now() };
      if (typeof ack === 'function') ack(reply);
      else socket.emit('pong:echo', reply);
    });
  });
};
