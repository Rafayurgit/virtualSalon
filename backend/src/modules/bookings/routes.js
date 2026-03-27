import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createBooking, getBookingsByShop } from './controller.js';

const router = express.Router();

router.post('/', asyncHandler(createBooking));
router.get('/:shopId', asyncHandler(getBookingsByShop));

export default router;
