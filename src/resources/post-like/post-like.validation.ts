import Joi from "joi";
import paramsValidationSchmea from "../../utils/validation-schemas/params.validation-schema";
import queryValidationSchmea from "../../utils/validation-schemas/query.validation-schema";

export const createBody = Joi.object({
  creator: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),

  post: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
});

export const updateBody = Joi.object({
  creator: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  post: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});

export const updateParams = paramsValidationSchmea;

export const getAllQuery = queryValidationSchmea;

export const getOneParams = paramsValidationSchmea;

export const deleteOneParams = paramsValidationSchmea;
