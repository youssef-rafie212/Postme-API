import Joi from "joi";

export const create = Joi.object({
  follower: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  followee: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const update = Joi.object({
  follower: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  followee: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
