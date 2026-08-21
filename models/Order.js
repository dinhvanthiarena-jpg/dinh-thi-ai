const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'VND' },
    couponCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
    provider: { type: String, enum: ['mock', 'vnpay', 'stripe'], default: 'mock' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending', index: true },
    transactionRef: { type: String, default: '' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
