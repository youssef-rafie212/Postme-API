import Joi from "joi";
import queryValidationSchmea from "../../utils/validation-schemas/query.validation-schema";
import paramsValidationSchmea from "../../utils/validation-schemas/params.validation-schema";

export const createBody = Joi.object({
  username: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")),
});

export const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateBody = Joi.object({
  username: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  bio: Joi.string().min(3).max(250),
  profilePicture: Joi.array().items(Joi.string()),
});

export const updateParams = paramsValidationSchmea;

export const forgotPasswordBody = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordBody = Joi.object({
  newPassword: Joi.string().min(8).required(),
  newPasswordConfirm: Joi.string().required().valid(Joi.ref("newPassword")),
});

export const resetPasswordParams = Joi.object({
  resetToken: Joi.string().required()
})

export const getAllQuery = queryValidationSchmea;

export const getOneParams = paramsValidationSchmea;

export const deleteOneParams = paramsValidationSchmea;


