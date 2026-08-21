const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    videoUrl: { type: String, default: '' },
    contentText: { type: String, default: '' },
    durationMinutes: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
