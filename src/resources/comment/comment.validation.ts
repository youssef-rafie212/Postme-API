import Joi from "joi";

export const create = Joi.object({
  content: Joi.string().min(3).max(400).required(),
  creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  post: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const update = Joi.object({
  content: Joi.string().min(3).max(400),
  creator: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  post: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
