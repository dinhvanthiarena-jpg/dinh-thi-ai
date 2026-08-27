const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const Tool = sequelize.define(
  'Tool',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    category: { type: DataTypes.ENUM('Ứng dụng', 'Game', 'Công cụ'), defaultValue: 'Ứng dụng' },
    shortDescription: { type: DataTypes.STRING, defaultValue: '' },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    coverImageUrl: { type: DataTypes.STRING, defaultValue: '/images/course-placeholder.svg' },
    galleryImages: { type: DataTypes.JSON, defaultValue: [] },
    // The raw link an admin pastes (any Google Drive share URL format).
    // driveFileId is parsed from it so the public page can build a
    // skip-the-preview direct-download link instead of sending visitors to
    // Drive's "view" page first.
    driveUrl: { type: DataTypes.STRING, allowNull: false },
    driveFileId: { type: DataTypes.STRING, allowNull: true },
    // Optional link to a mobile/browser-playable version (e.g. a PWA) of the
    // same tool, shown as a second, parallel download option for phone users
    // who don't need/can't run the desktop installer.
    webAppUrl: { type: DataTypes.STRING, allowNull: true },
    downloadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'tools',
    hooks: {
      beforeValidate: (tool) => {
        if (tool.title && !tool.slug) {
          tool.slug = `${slugify(tool.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
        }
        if (tool.driveUrl) {
          const match = tool.driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || tool.driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          tool.driveFileId = match ? match[1] : null;
        }
      },
    },
  }
);

module.exports = Tool;
