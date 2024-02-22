import multer from "multer";
import { Request } from "express";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "src/uploads/imgs/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(
      null,
      `${crypto.randomBytes(32).toString("hex")}.${file.mimetype.split("/")[1]}`
    );
  },
});

const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter: filter,
});

export default uploadMiddleware;
