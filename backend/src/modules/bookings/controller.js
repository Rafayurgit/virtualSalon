import Booking from './model.js';
import Queue from '../queue/model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { getIo } from '../../utils/socket.js';
import { isValidSlotId } from '../slots/service.js';

export const createBooking = async (req, res) => {
  const { shopId, service, slotId, date } = req.body;
  const userId = req.user && req.user._id;
  if (!shopId || !service || !slotId || !date) return apiResponse(res, false, 'Missing required fields', null, 400);

  // validate slotId format
  if (!isValidSlotId(slotId)) return apiResponse(res, false, 'Invalid slotId format', null, 400);

  try {
    // Prevent double booking for same shop/date/slot (unless cancelled)
    const existing = await Booking.findOne({ shopId, date, slotId, status: { $ne: 'cancelled' } });
    if (existing) return apiResponse(res, false, 'Slot already booked', null, 409);

    // prevent same user from creating duplicate booking on same slot
    if (userId) {
      const dup = await Booking.findOne({ shopId, date, slotId, userId, status: { $ne: 'cancelled' } });
      if (dup) return apiResponse(res, false, 'You already have a booking for this slot', null, 409);
    }

    const booking = await Booking.create({ userId, shopId, service, slotId, date, status: 'confirmed' });

    // Auto-increment queue for the shop
    const queue = await Queue.findOneAndUpdate(
      { shopId },
      { $inc: { currentCount: 1 } },
      { upsert: true, new: true }
    );

    const io = getIo();
    if (io) {
      io.to(String(shopId)).emit('newBooking', booking);
      io.to(String(shopId)).emit('queueUpdated', { shopId, currentCount: queue.currentCount });
    }

    return apiResponse(res, true, 'Booking created', booking, 201);
  } catch (err) {
    console.error('createBooking error', err);
    return apiResponse(res, false, 'Failed to create booking', null, 500);
  }
};

export const getBookingsByShop = async (req, res) => {
  const { shopId } = req.params;
  if (!shopId) return apiResponse(res, false, 'shopId is required', null, 400);

  const bookings = await Booking.find({ shopId }).sort({ createdAt: -1 });
  return apiResponse(res, true, 'Bookings fetched', bookings);
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) return apiResponse(res, false, 'id and status are required', null, 400);
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return apiResponse(res, false, 'Invalid status', null, 400);

  const booking = await Booking.findById(id);
  if (!booking) return apiResponse(res, false, 'Booking not found', null, 404);

  const prevStatus = booking.status;
  booking.status = status;
  await booking.save();

  const io = getIo();
  if (io) io.to(String(booking.shopId)).emit('bookingStatusChanged', booking);

  // adjust queue when booking completed or cancelled
  if (prevStatus !== 'completed' && status === 'completed') {
    const queue = await Queue.findOneAndUpdate(
      { shopId: booking.shopId },
      { $inc: { currentCount: -1 } },
      { new: true }
    );
    if (queue && queue.currentCount < 0) {
      queue.currentCount = 0;
      await queue.save();
    }
    if (io) io.to(String(booking.shopId)).emit('queueUpdated', { shopId: booking.shopId, currentCount: queue ? queue.currentCount : 0 });
  }

  if (prevStatus !== 'cancelled' && status === 'cancelled') {
    // if cancelling, decrement queue if it was counted
    const queue = await Queue.findOneAndUpdate(
      { shopId: booking.shopId },
      { $inc: { currentCount: -1 } },
      { new: true }
    );
    if (queue && queue.currentCount < 0) {
      queue.currentCount = 0;
      await queue.save();
    }
    if (io) io.to(String(booking.shopId)).emit('queueUpdated', { shopId: booking.shopId, currentCount: queue ? queue.currentCount : 0 });
  }

  return apiResponse(res, true, 'Booking status updated', booking);
};
