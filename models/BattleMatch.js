// One completed/abandoned Thach Dau match. `players` holds the full
// per-player result snapshot (installId, team, score) so this table alone
// is enough to rebuild a match history / leaderboard later without joining
// back to BattlePlayer for anything except current live rank.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BattleMatch = sequelize.define(
  'BattleMatch',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mode: { type: DataTypes.ENUM('1v1', '2v2'), allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false },
    roomCode: { type: DataTypes.STRING, defaultValue: null }, // 2v2 only
    players: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // [{installId, displayName, team, score}]
    winnerTeam: { type: DataTypes.INTEGER, defaultValue: null }, // 1v1: winner's own team=0/1; null=draw
    startedAt: { type: DataTypes.DATE, allowNull: false },
    endedAt: { type: DataTypes.DATE, defaultValue: null },
  },
  { tableName: 'battle_matches' }
);
module.exports = BattleMatch;
