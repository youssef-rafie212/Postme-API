import Joi from "joi";

const queryValidationSchmea = Joi.object({
  fields: Joi.string(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  sort: Joi.string()
})

export default queryValidationSchmea;