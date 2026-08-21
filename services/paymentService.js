/**
 * Payment abstraction layer.
 *
 * Ships with a "mock" provider so checkout works end-to-end without real
 * merchant credentials. To go live:
 *  - VNPay: implement buildVnpayUrl()/verifyVnpayReturn() using VNPAY_TMN_CODE
 *    and VNPAY_HASH_SECRET from .env, and point routes/checkout at them.
 *  - Stripe: create a Checkout Session in createPayment() and verify the
 *    webhook signature in handleReturn().
 */

const provider = process.env.PAYMENT_PROVIDER || 'mock';

async function createPayment({ order, req }) {
  if (provider === 'mock') {
    return {
      redirectUrl: `/checkout/mock-pay/${order._id}`,
    };
  }

  throw new Error(`Payment provider "${provider}" chua duoc cau hinh. Xem services/paymentService.js`);
}

function generateTransactionRef() {
  return `DTA${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

module.exports = { createPayment, generateTransactionRef, provider };
