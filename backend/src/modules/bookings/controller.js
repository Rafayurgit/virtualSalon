import Booking from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const createBooking = async (req, res) => {
  const { userId, shopId, barberName, service, timeSlot } = req.body;
  if (!shopId || !userId || !service || !timeSlot)
    return apiResponse(res, false, 'Missing required fields', null, 400);

  const booking = await Booking.create({ userId, shopId, barberName, service, timeSlot });
  return apiResponse(res, true, 'Booking created', booking, 201);
};

export const getBookingsByShop = async (req, res) => {
  const { shopId } = req.params;
  if (!shopId) return apiResponse(res, false, 'shopId is required', null, 400);

  const bookings = await Booking.find({ shopId }).sort({ createdAt: -1 });
  return apiResponse(res, true, 'Bookings fetched', bookings);
};
