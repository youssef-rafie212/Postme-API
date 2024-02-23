import Joi from "joi";

const paramsValidationSchmea = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),
});

export default paramsValidationSchmea;
