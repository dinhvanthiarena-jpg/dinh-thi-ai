const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const Course = sequelize.define(
  'Course',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    subtitle: { type: DataTypes.STRING, defaultValue: '' },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: {
      type: DataTypes.ENUM(
        'AI cơ bản',
        'Machine Learning',
        'Deep Learning',
        'Generative AI',
        'AI cho doanh nghiệp',
        'Prompt Engineering',
        'Đồ họa & Dựng hình',
        'Làm phim hoạt hình',
        'Sáng tạo nội dung & Kênh video'
      ),
      allowNull: false,
    },
    level: { type: DataTypes.ENUM('Cơ bản', 'Trung cấp', 'Nâng cao'), defaultValue: 'Cơ bản' },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    salePrice: { type: DataTypes.INTEGER, allowNull: true },
    thumbnailUrl: { type: DataTypes.STRING, defaultValue: '/images/course-placeholder.svg' },
    instructorName: { type: DataTypes.STRING, defaultValue: 'Đinh Thi Ai' },
    durationHours: { type: DataTypes.INTEGER, defaultValue: 0 },
    outcomes: { type: DataTypes.JSON, defaultValue: [] },
    requirements: { type: DataTypes.JSON, defaultValue: [] },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    ratingAverage: { type: DataTypes.FLOAT, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    enrollmentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'courses',
    hooks: {
      beforeValidate: (course) => {
        if (course.title && !course.slug) {
          course.slug = `${slugify(course.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
        }
      },
    },
    getterMethods: {
      effectivePrice() {
        return this.salePrice != null ? this.salePrice : this.price;
      },
    },
  }
);

module.exports = Course;
