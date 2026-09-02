// Thach Dau (Mon-Maths battle) player record — keyed by the SAME per-device
// installId already used by GameInstall.js, not the site's User/JWT login
// (the math game has no login concept, see GameInstall.js for precedent).
// Rank/coins/items live here server-side because a client can't be trusted
// to self-report its own rank.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BattlePlayer = sequelize.define(
  'BattlePlayer',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    installId: { type: DataTypes.STRING, allowNull: false, unique: true },
    displayName: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Bạn chơi' },
    grade: { type: DataTypes.INTEGER, defaultValue: null },
    tier: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0=Đồng .. 4=Kim Cương
    rankPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
    wins: { type: DataTypes.INTEGER, defaultValue: 0 },
    losses: { type: DataTypes.INTEGER, defaultValue: 0 },
    coins: { type: DataTypes.INTEGER, defaultValue: 0 },
    ownedItems: { type: DataTypes.JSON, defaultValue: [] },
    equippedItem: { type: DataTypes.STRING, defaultValue: null },
    lastPlayedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'battle_players' }
);
module.exports = BattlePlayer;
