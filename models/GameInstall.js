const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One row per unique installation of a desktop game (e.g. Toan Vui Cap 1).
// The game pings /api/game/ping on every launch; we upsert by installId so
// repeated launches from the same machine update the same row instead of
// piling up duplicates.
const GameInstall = sequelize.define(
  'GameInstall',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    appId: { type: DataTypes.STRING, allowNull: false, defaultValue: 'toan-vui-cap1' },
    installId: { type: DataTypes.STRING, allowNull: false, unique: true },
    licenseKey: { type: DataTypes.STRING, defaultValue: null },
    teacherName: { type: DataTypes.STRING, defaultValue: null },
    appVersion: { type: DataTypes.STRING, defaultValue: null },
    pingCount: { type: DataTypes.INTEGER, defaultValue: 1 },
    lastSeenAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'game_installs' }
);

module.exports = GameInstall;
