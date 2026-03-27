import Barber from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const createBarber = async (req, res) => {
  const { name, phone, shopId } = req.body;
  if (!name) return apiResponse(res, false, 'Name is required', null, 400);
  const barber = await Barber.create({ name, phone, shopId });
  return apiResponse(res, true, 'Barber created', barber, 201);
};

export const getBarbers = async (req, res) => {
  const barbers = await Barber.find().sort({ createdAt: -1 });
  return apiResponse(res, true, 'Barbers fetched', barbers);
};
