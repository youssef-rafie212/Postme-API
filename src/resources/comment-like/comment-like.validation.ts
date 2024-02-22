import Joi from "joi";

export const create = Joi.object({
  creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  comment: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const update = Joi.object({
  creator: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  comment: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
