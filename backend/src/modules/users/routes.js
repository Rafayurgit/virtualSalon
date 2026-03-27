import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createUser } from './controller.js';

const router = express.Router();

router.post('/', asyncHandler(createUser));

export default router;
