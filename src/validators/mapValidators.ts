import Joi from "joi";

export const searchNearbySchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  radius: Joi.number().min(1).max(50000).required(),
  keyword: Joi.string().required(),
});
