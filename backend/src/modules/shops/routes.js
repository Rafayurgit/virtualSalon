import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createShop, getAllShops, getShopById } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['barber']), asyncHandler(createShop));
router.get('/', asyncHandler(getAllShops));
router.get('/:id', asyncHandler(getShopById));

export default router;
