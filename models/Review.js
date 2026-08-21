const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
