import Joi from 'joi';
import User from '../users/model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { hashPassword, comparePassword, generateToken } from './service.js';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'barber').required(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // phone or email
  password: Joi.string().required(),
});

export const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return apiResponse(res, false, error.details[0].message, null, 400);

  const { name, phone, email, password, role } = value;

  const existing = await User.findOne({ $or: [{ phone }, { email }] });
  if (existing) return apiResponse(res, false, 'User already exists', null, 409);

  const hashed = await hashPassword(password);
  const user = await User.create({ name, phone, email, password: hashed, role });

  const token = generateToken({ id: user._id, role: user.role });
  return apiResponse(res, true, 'Registration successful', { user, token }, 201);
};

export const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return apiResponse(res, false, error.details[0].message, null, 400);

  const { identifier, password } = value;
  const user = await User.findOne({ $or: [{ phone: identifier }, { email: identifier }] });
  if (!user || !user.password) return apiResponse(res, false, 'Invalid credentials', null, 401);

  const match = await comparePassword(password, user.password);
  if (!match) return apiResponse(res, false, 'Invalid credentials', null, 401);

  const token = generateToken({ id: user._id, role: user.role });
  return apiResponse(res, true, 'Login successful', { user, token });
};
// Placeholder for future auth controller (JWT etc.)
export const placeholder = async (req, res) => {
  res.status(200).json({ message: 'Auth placeholder' });
};
