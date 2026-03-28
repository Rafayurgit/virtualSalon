import { apiResponse } from '../utils/apiResponse.js';

export const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return apiResponse(res, false, 'Unauthorized', null, 401);
  if (!allowedRoles.includes(req.user.role))
    return apiResponse(res, false, 'Forbidden: insufficient role', null, 403);
  return next();
};
