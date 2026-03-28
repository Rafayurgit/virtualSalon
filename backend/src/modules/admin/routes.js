import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { getAllShops, getAllBookings, getStats } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// allow authenticated barbers or admins
router.get('/shops', authMiddleware, roleMiddleware(['barber', 'admin']), asyncHandler(getAllShops));
router.get('/bookings', authMiddleware, roleMiddleware(['barber', 'admin']), asyncHandler(getAllBookings));
router.get('/stats', authMiddleware, roleMiddleware(['barber', 'admin']), asyncHandler(getStats));

export default router;
