import User from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const createUser = async (req, res) => {
  const { name, phone, role } = req.body;
  if (!name) return apiResponse(res, false, 'Name is required', null, 400);

  const user = await User.create({ name, phone, role });
  return apiResponse(res, true, 'User created', user, 201);
};
