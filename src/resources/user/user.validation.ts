import Joi from "joi";

export const create = Joi.object({
  username: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const update = Joi.object({
  username: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  bio: Joi.string().min(3).max(250),
  profilePicture: Joi.array().items(Joi.string()),
});

export const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  newPassword: Joi.string().min(8).required(),
  newPasswordConfirm: Joi.string().required().valid(Joi.ref("newPassword")),
});
