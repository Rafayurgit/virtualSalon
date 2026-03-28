import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createOrder, verifyPayment, webhookHandler } from './controller.js';

const router = express.Router();

router.post('/order', asyncHandler(createOrder));
router.post('/verify', asyncHandler(verifyPayment));

// webhook: webhook handler will use `req.rawBody` captured by global json verify
router.post('/webhook', asyncHandler(webhookHandler));

export default router;
