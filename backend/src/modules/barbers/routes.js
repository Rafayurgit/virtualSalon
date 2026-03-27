import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createBarber, getBarbers } from './controller.js';

const router = express.Router();

router.post('/', asyncHandler(createBarber));
router.get('/', asyncHandler(getBarbers));

export default router;
