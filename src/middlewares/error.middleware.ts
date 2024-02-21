import { Request, Response, NextFunction } from "express";
import AppError from "utils/errors/app.error";

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message || "Something went wrong";
  const status = err.status || 500;

  res.status(status).send({
    status,
    message,
  });
};

export default errorMiddleware;
