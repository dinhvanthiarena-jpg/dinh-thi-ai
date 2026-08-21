const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercent: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
