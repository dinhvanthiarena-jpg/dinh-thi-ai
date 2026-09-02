const { BattlePlayer } = require('../models');

const TIER_NAMES = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương'];

exports.profile = async (req, res) => {
  try {
    const installId = typeof req.query.installId === 'string' ? req.query.installId.slice(0, 100) : '';
    if (!installId) return res.status(400).json({ ok: false, message: 'Thiếu installId.' });
    const player = await BattlePlayer.findOne({ where: { installId } });
    if (!player) {
      return res.json({ ok: true, exists: false, tier: 0, tierName: TIER_NAMES[0], rankPoints: 0, wins: 0, losses: 0, coins: 0 });
    }
    res.json({
      ok: true,
      exists: true,
      displayName: player.displayName,
      tier: player.tier,
      tierName: TIER_NAMES[player.tier] || TIER_NAMES[0],
      rankPoints: player.rankPoints,
      wins: player.wins,
      losses: player.losses,
      coins: player.coins,
    });
  } catch (err) {
    console.error('[battle-profile]', err.message);
    res.status(500).json({ ok: false, message: 'Không tải được hồ sơ đấu trường.' });
  }
};
