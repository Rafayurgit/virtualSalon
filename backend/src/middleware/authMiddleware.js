import { apiResponse } from '../utils/apiResponse.js';
import { verifyToken } from '../modules/auth/service.js';
import User from '../modules/users/model.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return apiResponse(res, false, 'Authorization token missing', null, 401);

  const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return apiResponse(res, false, 'User not found', null, 401);
      req.user = user;
      return next();
    } catch (err) {
      return apiResponse(res, false, 'Invalid or expired token', null, 401);
    }
};
