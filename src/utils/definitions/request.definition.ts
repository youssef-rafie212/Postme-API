import User from "../../resources/user/user.interface";

/**
 * Adding user and cloudinaryUrls properties to the Request interface 
 */

declare global {
  namespace Express {
    export interface Request {
      user: User;
      cloudinaryUrls: string[];
    }
  }
}
