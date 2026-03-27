import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { updateQueue, getQueueByShop } from './controller.js';

const router = express.Router();

router.post('/update', asyncHandler(updateQueue));
router.get('/:shopId', asyncHandler(getQueueByShop));

export default router;
