import Joi from "joi";

export const create = Joi.object({
  content: Joi.string().min(3).max(500).required(),
  photos: Joi.array().items(Joi.string()),
  creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const update = Joi.object({
  content: Joi.string().min(3).max(500),
  photos: Joi.array().items(Joi.string()),
  creator: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
