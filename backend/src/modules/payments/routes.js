import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createOrder, verifyPayment } from './controller.js';

const router = express.Router();

router.post('/order', asyncHandler(createOrder));
router.post('/verify', asyncHandler(verifyPayment));

export default router;
