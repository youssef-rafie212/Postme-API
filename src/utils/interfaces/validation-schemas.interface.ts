import Joi from "joi";

interface ValidationSchemas {
  body? : Joi.Schema;
  query? : Joi.Schema;
  params? : Joi.Schema;
}

export default ValidationSchemas;