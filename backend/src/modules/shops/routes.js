import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createShop, getAllShops, getShopById } from './controller.js';

const router = express.Router();

router.post('/', asyncHandler(createShop));
router.get('/', asyncHandler(getAllShops));
router.get('/:id', asyncHandler(getShopById));

export default router;
