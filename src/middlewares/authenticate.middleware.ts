import UserModel from "../resources/user/user.model";
import AppError from "../utils/errors/app.error";
import token from "../utils/token";
import { Request, Response, NextFunction } from "express";
import CustomRequest from "../utils/definitions/request.definition";
import jwt from "jsonwebtoken";

const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let accessToken: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    accessToken = req.cookies.jwt;
  }

  if (!accessToken) return next(new AppError("Unauthorized", 401));

  try {
    const payload = await token.verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError)
      return next(new AppError("Unauthorized", 401));

    const user = await UserModel.findById(payload.id);

    if (!user) return next(new AppError("This user does't exist anymore", 401));

    (req as CustomRequest).user = user;

    next();
  } catch {
    return next(new AppError("Unauthorized", 401));
  }
};

export default authenticateMiddleware;
