import Joi from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ValidationSchemas from "../utils/interfaces/validation-schemas.interface";

const validationMiddleware = (schemas: ValidationSchemas): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const options = {
      abortEarly: false,
    };

    try {
      const validationPromises: Promise<any>[] = [];

      // Body validation
      if (schemas.body) {
        validationPromises.push(schemas.body.validateAsync(req.body , options));
      }

      // Query Validation
      if (schemas.query) {
        validationPromises.push(schemas.query.validateAsync(req.query , options));
      }

      // Params Validation
      if (schemas.params) {
        validationPromises.push(schemas.params.validateAsync(req.params , options));
      }

      await Promise.all(validationPromises);

      next();
    } catch (err: any) {
      const errors: string[] = [];

      // Add all the validation error messages to errors array to be sent
      err.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });

      res.status(400).send({
        errors,
      });
    }
  };
};

export default validationMiddleware;
