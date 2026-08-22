const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GalleryPhoto = sequelize.define(
  'GalleryPhoto',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    eventDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'gallery_photos' }
);

module.exports = GalleryPhoto;
