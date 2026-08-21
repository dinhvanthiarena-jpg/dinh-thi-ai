const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: '/images/blog-placeholder.svg' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function generateSlug(next) {
  if (this.title && !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
