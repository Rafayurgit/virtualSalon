import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { updateQueue, getQueueByShop } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/update', authMiddleware, roleMiddleware(['barber']), asyncHandler(updateQueue));
router.get('/:shopId', asyncHandler(getQueueByShop));

export default router;
