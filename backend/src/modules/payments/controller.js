import Razorpay from 'razorpay';
import Booking from '../bookings/model.js';
import Payment from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import dotenv from 'dotenv';

dotenv.config();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createOrder = async (req, res) => {
  const { bookingId, amount } = req.body;
  if (!bookingId || !amount) return apiResponse(res, false, 'bookingId and amount required', null, 400);

  const booking = await Booking.findById(bookingId);
  if (!booking) return apiResponse(res, false, 'Booking not found', null, 404);

  const options = {
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `rcpt_${bookingId}_${Date.now()}`,
    payment_capture: 1,
  };

  const order = await razor.orders.create(options);
  const payment = await Payment.create({ bookingId, razorpayOrderId: order.id, amount, currency: 'INR', status: 'created', receiptData: { receipt: options.receipt } });

  return apiResponse(res, true, 'Order created', { order, payment });
};

export const verifyPayment = async (req, res) => {
  // Expects {razorpay_order_id, razorpay_payment_id, razorpay_signature}
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return apiResponse(res, false, 'Missing payment verification fields', null, 400);

  // For simplicity, we'll trust Razorpay webhook or client-side verification.
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return apiResponse(res, false, 'Payment record not found', null, 404);

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.status = 'paid';
  await payment.save();

  // link payment to booking
  const booking = await Booking.findById(payment.bookingId);
  if (booking) {
    booking.payment = payment._id;
    booking.status = 'confirmed';
    await booking.save();
  }

  return apiResponse(res, true, 'Payment verified and booking updated', { payment, booking });
};
