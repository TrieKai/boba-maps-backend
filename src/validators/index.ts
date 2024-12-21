import Joi from "joi";

export const searchNearbySchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90),
  longitude: Joi.number().required().min(-180).max(180),
  radius: Joi.number().required().min(1).max(50000),
  keyword: Joi.string().required().min(1).max(100),
});

export const placeDetailsSchema = Joi.object({
  placeId: Joi.string().required(),
  language: Joi.string().length(2),
});

export const ratingSchema = Joi.object({
  placeId: Joi.string().required(),
  score: Joi.number().required().min(0).max(5),
  comment: Joi.string().max(1000),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);
