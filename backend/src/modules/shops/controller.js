import Shop from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const createShop = async (req, res) => {
  const { name, location, ownerId, services } = req.body;
  if (!name) return apiResponse(res, false, 'Shop name is required', null, 400);

  const shop = await Shop.create({ name, location, ownerId, services });
  return apiResponse(res, true, 'Shop created', shop, 201);
};

export const getAllShops = async (req, res) => {
  const shops = await Shop.find().sort({ createdAt: -1 });
  return apiResponse(res, true, 'Shops fetched', shops);
};

export const getShopById = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) return apiResponse(res, false, 'Shop not found', null, 404);
  return apiResponse(res, true, 'Shop fetched', shop);
};
