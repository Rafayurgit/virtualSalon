import Queue from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { getIo } from '../../utils/socket.js';


export const updateQueue = async (req, res) => {
  const { shopId, currentCount } = req.body;
  if (!shopId) return apiResponse(res, false, 'shopId is required', null, 400);
  if (currentCount === undefined)
    return apiResponse(res, false, 'currentCount is required', null, 400);
  const num = Number(currentCount);
  if (Number.isNaN(num) || num < 0)
    return apiResponse(res, false, 'currentCount must be a non-negative number', null, 400);

  const queue = await Queue.findOneAndUpdate(
    { shopId },
    { currentCount: num },
    { upsert: true, new: true }
  );

  // Emit socket event
  const io = getIo();
  if (io) io.to(String(shopId)).emit('queueUpdated', { shopId, currentCount: queue.currentCount });

  return apiResponse(res, true, 'Queue updated', queue);
};

export const getQueueByShop = async (req, res) => {
  const { shopId } = req.params;
  const queue = await Queue.findOne({ shopId });
  if (!queue) return apiResponse(res, true, 'Queue not set', { shopId, currentCount: 0 });
  return apiResponse(res, true, 'Queue fetched', queue);
};
