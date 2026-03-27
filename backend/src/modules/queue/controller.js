import Queue from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const updateQueue = async (req, res) => {
  const { shopId, currentCount } = req.body;
  if (!shopId) return apiResponse(res, false, 'shopId is required', null, 400);
  if (currentCount === undefined)
    return apiResponse(res, false, 'currentCount is required', null, 400);

  const queue = await Queue.findOneAndUpdate(
    { shopId },
    { currentCount },
    { upsert: true, new: true }
  );

  return apiResponse(res, true, 'Queue updated', queue);
};

export const getQueueByShop = async (req, res) => {
  const { shopId } = req.params;
  const queue = await Queue.findOne({ shopId });
  if (!queue) return apiResponse(res, true, 'Queue not set', { shopId, currentCount: 0 });
  return apiResponse(res, true, 'Queue fetched', queue);
};
