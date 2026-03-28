import User from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('customer', 'barber').optional(),
  password: Joi.forbidden(),
});

export const createUser = async (req, res) => {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) return apiResponse(res, false, error.details[0].message, null, 400);

  const { name, phone, email, role } = value;

  // Prevent creating users with raw passwords through this endpoint.
  // Use /api/auth/register to create users with passwords.
  const existing = await User.findOne({ $or: [{ phone }, { email }] });
  if (existing) return apiResponse(res, false, 'User with provided phone or email already exists', null, 409);

  const user = await User.create({ name, phone, email, role });
  return apiResponse(res, true, 'User created', user, 201);
};
