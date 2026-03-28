import express from 'express';

import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createBooking, getBookingsByShop, updateBookingStatus } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['customer']), asyncHandler(createBooking));
router.get('/:shopId', authMiddleware, roleMiddleware(['barber']), asyncHandler(getBookingsByShop));
router.patch('/:id/status', authMiddleware, asyncHandler(updateBookingStatus));

export default router;
