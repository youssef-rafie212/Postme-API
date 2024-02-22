import Joi from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validationMiddleware = (schema: Joi.Schema): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, options);
      req.body = value;
      next();
    } catch (err: any) {
      const errors: string[] = [];
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
