import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { getSlots } from './controller.js';

const router = express.Router();

router.get('/', asyncHandler(getSlots));

export default router;
