import Shop from './model.js';
import { apiResponse } from '../../utils/apiResponse.js';
import Joi from 'joi';

const createSchema = Joi.object({
  name: Joi.string().required(),
  locationName: Joi.string().optional(),
  // either provide coordinates as [lng, lat] or as lat & lng
  coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
  ownerId: Joi.string().optional(),
  services: Joi.array().items(Joi.string()).optional(),
});

export const createShop = async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return apiResponse(res, false, error.details[0].message, null, 400);

  const { name, locationName, coordinates, lat, lng, ownerId, services } = value;

  let point = undefined;
  if (coordinates) {
    point = { type: 'Point', coordinates: coordinates };
  } else if (lat !== undefined && lng !== undefined) {
    point = { type: 'Point', coordinates: [lng, lat] };
  }

  const shop = await Shop.create({ name, locationName, coordinates: point, ownerId, services });
  return apiResponse(res, true, 'Shop created', shop, 201);
};

export const getAllShops = async (req, res) => {
  // simple pagination
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const shops = await Shop.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  return apiResponse(res, true, 'Shops fetched', { page, limit, data: shops });
};

export const getShopById = async (req, res) => {
  const { id } = req.params;
  const shop = await Shop.findById(id);
  if (!shop) return apiResponse(res, false, 'Shop not found', null, 404);
  return apiResponse(res, true, 'Shop fetched', shop);
};

export const getNearbyShops = async (req, res) => {
  const { lat, lng, radius = 5000, service, page = 1, limit = 20 } = req.query;
  if (!lat || !lng) return apiResponse(res, false, 'lat and lng are required', null, 400);

  const latitude = Number(lat);
  const longitude = Number(lng);
  const maxDistance = Number(radius); // in meters
  const p = Math.max(Number(page) || 1, 1);
  const l = Math.min(Number(limit) || 20, 100);

  // Build geoNear pipeline
  const near = { type: 'Point', coordinates: [longitude, latitude] };

  const pipeline = [
    {
      $geoNear: {
        near,
        distanceField: 'distance',
        spherical: true,
        maxDistance,
      },
    },
  ];

  if (service) pipeline.push({ $match: { services: service } });

  pipeline.push({ $sort: { distance: 1 } });
  pipeline.push({ $skip: (p - 1) * l });
  pipeline.push({ $limit: l });

  const results = await Shop.aggregate(pipeline);
  return apiResponse(res, true, 'Nearby shops fetched', { page: p, limit: l, data: results });
};
