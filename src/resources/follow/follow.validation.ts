import Joi from "joi";
import paramsValidationSchmea from "../../utils/validation-schemas/params.validation-schema";
import queryValidationSchmea from "../../utils/validation-schemas/query.validation-schema";

export const createBody = Joi.object({
  follower: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
  followee: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
});

export const updateBody = Joi.object({
  follower: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  followee: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});

export const updateParams = paramsValidationSchmea;

export const getAllQuery = queryValidationSchmea;

export const getOneParams = paramsValidationSchmea;

export const deleteOneParams = paramsValidationSchmea;
