import { Document } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
  passwordConfirm: string | undefined;
  email: string;
  profilePicture: string[];
  bio: string;
  role: string;
  createdAt: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;

  isCorrectPassword(password: string, storedPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
}

export default User;
