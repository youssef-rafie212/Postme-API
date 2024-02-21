import Joi from "joi";

export const create = Joi.object({
  username: Joi.string().max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

