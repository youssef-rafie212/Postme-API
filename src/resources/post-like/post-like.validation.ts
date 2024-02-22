import Joi from "joi";

export const create = Joi.object({
  creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  post: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const update = Joi.object({
  creator: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  post: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
