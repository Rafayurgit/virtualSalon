import { apiResponse } from '../../utils/apiResponse.js';
import Booking from '../bookings/model.js';
import { generateSlots } from './service.js';

export const getSlots = async (req, res) => {
  const salonId = req.query.salonId || req.query.shopId;
  const date = req.query.date;
  if (!salonId) return apiResponse(res, false, 'salonId is required', null, 400);
  if (!date) return apiResponse(res, false, 'date is required (YYYY-MM-DD)', null, 400);

  try {
    // generate base slots
    const base = generateSlots();

    // fetch bookings for the salon on date
    const bookings = await Booking.find({ shopId: salonId, date, status: { $ne: 'cancelled' } }).lean();
    const bookedSlotIds = new Set(bookings.map((b) => String(b.slotId)));

    const slots = base.map((s) => ({ ...s, available: !bookedSlotIds.has(s.id) }));

    return apiResponse(res, true, 'Slots fetched', slots);
  } catch (err) {
    console.error('getSlots error', err);
    return apiResponse(res, false, 'Failed to fetch slots', null, 500);
  }
};
