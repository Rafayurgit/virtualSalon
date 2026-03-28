import Shop from '../shops/model.js';
import Booking from '../bookings/model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const getAllShops = async (req, res) => {
  const shops = await Shop.find().sort({ createdAt: -1 });
  return apiResponse(res, true, 'All shops', shops);
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  return apiResponse(res, true, 'All bookings', bookings);
};

export const getStats = async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const activeShops = await Shop.countDocuments();
  return apiResponse(res, true, 'Stats', { totalBookings, activeShops });
};
