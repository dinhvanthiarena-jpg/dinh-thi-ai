const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['AI co ban', 'Machine Learning', 'Deep Learning', 'Generative AI', 'AI cho doanh nghiep', 'Prompt Engineering'],
    },
    level: { type: String, enum: ['Co ban', 'Trung cap', 'Nang cao'], default: 'Co ban' },
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, default: null },
    thumbnailUrl: { type: String, default: '/images/course-placeholder.svg' },
    instructorName: { type: String, default: 'Dinh Thi Ai' },
    durationHours: { type: Number, default: 0 },
    outcomes: [{ type: String }],
    requirements: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.pre('validate', function generateSlug(next) {
  if (this.title && !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

courseSchema.virtual('effectivePrice').get(function effectivePrice() {
  return this.salePrice != null ? this.salePrice : this.price;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
