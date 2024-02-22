import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/errors/app.error";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length == 0) return next();

  try {
    const cloudinaryUrls: string[] = [];

    for (let file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      cloudinaryUrls.push(result.secure_url);

      // Delete file from server after uploading it to the cloud
      fs.unlinkSync(file.path);
    }

    req.cloudinaryUrls = cloudinaryUrls;

    next();
  } catch (err) {
    next(new AppError("Error Uploading image to cloudinary", 500));
  }
};

export default cloudMiddleware;
