import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import Receipt from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

const router = express.Router();

router.get('/:bookingId', asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const receipt = await Receipt.findOne({ bookingId });
  return apiResponse(res, true, 'Receipt fetched', receipt);
}));

export default router;
