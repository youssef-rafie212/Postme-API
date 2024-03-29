import { RequestHandler, Request, Response, NextFunction } from "express";
import CustomRequest from "../utils/definitions/request.definition";
import AppError from "../utils/errors/app.error";

const restrictMiddleware = (...roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes((req as CustomRequest).user.role))
      return next(
        new AppError("You don't have the permission to access this route", 401),
      );
    next();
  };
};

export default restrictMiddleware;
