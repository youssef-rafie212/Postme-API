import User from "../../resources/user/user.interface";

/**
 * Adding user property to the Request interface 
 */

declare global {
  namespace Express {
    export interface Request {
      user: User;
      cloudinaryUrls: string[];
    }
  }
}