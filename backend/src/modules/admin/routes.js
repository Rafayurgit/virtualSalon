import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { getAllShops, getAllBookings, getStats } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// only allow authenticated barbers or admins in future
router.get('/shops', authMiddleware, roleMiddleware(['barber']), asyncHandler(getAllShops));
router.get('/bookings', authMiddleware, roleMiddleware(['barber']), asyncHandler(getAllBookings));
router.get('/stats', authMiddleware, roleMiddleware(['barber']), asyncHandler(getStats));

export default router;
