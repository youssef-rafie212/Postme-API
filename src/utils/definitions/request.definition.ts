import User from "../../resources/user/user.interface";
import { Request } from "express";

/**
 * Adding user and cloudinaryUrls properties to the Request interface
 */

interface CustomRequest extends Request {
  user: User;
  cloudinaryUrls: string[];
}

export default CustomRequest;
