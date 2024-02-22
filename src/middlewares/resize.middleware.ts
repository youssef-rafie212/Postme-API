import { Request, Response, NextFunction, RequestHandler } from "express";
import Jimp from "jimp";
import AppError from "../utils/errors/app.error";

const resizeMiddleware = (width: number, heigth: number): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length == 0) return next();
    
    try {
      for (let file of files) {
        const image = await Jimp.read(file.path);
        image.resize(width, heigth).quality(80).write(file.path);
      }

      next();
    } catch {
      next(new AppError("Error resizing the image", 500));
    }
  };
};

export default resizeMiddleware;
