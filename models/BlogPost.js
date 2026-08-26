const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const BlogPost = sequelize.define(
  'BlogPost',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    excerpt: { type: DataTypes.STRING, defaultValue: '' },
    content: { type: DataTypes.TEXT, allowNull: false },
    // JPG, not SVG: Facebook's link-scraper can't read SVG dimensions and
    // silently substitutes a wrong/generic image on auto-shared posts.
    coverImageUrl: { type: DataTypes.STRING, defaultValue: '/images/blog/blog-placeholder-photo.jpg' },
    tags: { type: DataTypes.JSON, defaultValue: [] },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'blog_posts',
    hooks: {
      beforeValidate: (post) => {
        if (post.title && !post.slug) {
          post.slug = `${slugify(post.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
        }
      },
    },
  }
);

module.exports = BlogPost;
