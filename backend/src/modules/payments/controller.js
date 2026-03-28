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
    import crypto from 'crypto';
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

    // Server-side verification using HMAC SHA256
    export const verifyPayment = async (req, res) => {
      // Expects {razorpay_order_id, razorpay_payment_id, razorpay_signature}
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        return apiResponse(res, false, 'Missing payment verification fields', null, 400);

      const secret = process.env.RAZORPAY_KEY_SECRET || '';
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      if (expectedSignature !== razorpay_signature)
        return apiResponse(res, false, 'Invalid signature', null, 400);

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

    // Razorpay webhook handler (expects raw body middleware)
    export const webhookHandler = async (req, res) => {
      const secret = process.env.RAZORPAY_KEY_SECRET || '';
      const signature = req.headers['x-razorpay-signature'];
      const body = req.rawBody || JSON.stringify(req.body || {});

      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (signature !== expected) {
        return res.status(400).send('invalid signature');
      }

      const event = req.body;
      try {
        if (event && event.event === 'payment.captured') {
          const payload = event.payload && event.payload.payment && event.payload.payment.entity;
          if (payload) {
            const razorpayOrderId = payload.order_id;
            const razorpayPaymentId = payload.id;
            const payment = await Payment.findOne({ razorpayOrderId });
            if (payment && payment.status !== 'paid') {
              payment.razorpayPaymentId = razorpayPaymentId;
              payment.status = 'paid';
              await payment.save();

              const booking = await Booking.findById(payment.bookingId);
              if (booking) {
                booking.payment = payment._id;
                booking.status = 'confirmed';
                await booking.save();
              }
            }
          }
        }
        // respond 200 to acknowledge
        return res.status(200).json({ ok: true });
      } catch (err) {
        console.error('webhook error', err);
        return res.status(500).json({ ok: false });
      }
    };
