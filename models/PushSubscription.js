const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One row per browser/device that opted into update notifications for a
// game (e.g. Toan Vui Cap 1). `endpoint` can run past typical VARCHAR index
// limits on some browsers/push services, so it's TEXT with no unique index —
// subscribe/unsubscribe look it up with a plain WHERE match instead, which
// is fine at this app's scale (at most a few hundred rows).
const PushSubscription = sequelize.define(
  'PushSubscription',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    appId: { type: DataTypes.STRING, allowNull: false, defaultValue: 'toan-vui-cap1' },
    endpoint: { type: DataTypes.TEXT, allowNull: false },
    p256dh: { type: DataTypes.STRING, allowNull: false },
    auth: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'push_subscriptions' }
);

module.exports = PushSubscription;
