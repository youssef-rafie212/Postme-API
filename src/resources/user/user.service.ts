import UserModel from "./user.model";
import token from "../../utils/token";
import User from "./user.interface";
import { Request } from "express";
import Email from "../../utils/email";
import crypo from "crypto";

class UserService {
  private user = UserModel;

  async signup(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.user.create({
        username,
        email,
        password,
        passwordConfirm,
      });

      const accessToken = token.createToken(user);

      return { accessToken, user };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.user.findOne({ email }).select("+password");

      if (!user) throw new Error("Wrong credentials");

      if (!(await user.isCorrectPassword(password, user.password)))
        throw new Error("Wrong credentials");

      const accessToken = token.createToken(user);

      return { accessToken, user };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async forgotPassword(email: string, req: Request): Promise<void> {
    try {
      const user = await this.user.findOne({ email });

      if (!user) throw Error("No user found with this email");

      const token = await user.createPasswordResetToken();

      const url = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/resetPassword/${token}`;

      const emailSender = new Email(process.env.EMAIL ?? "", email);
      await emailSender.sendResetMessage(url);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const hashedToken = crypo
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const user = await this.user.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: { $gt: Date.now() },
      });

      if (!user) throw new Error("Invalid or expired reset token");

      user.password = newPassword;
      user.passwordConfirm = newPasswordConfirm;
      await user.save();

      const accessToken = token.createToken(user);

      return { accessToken, user };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(userId: string): Promise<User> {
    try {
      const user = await this.user.findById(userId);

      if (!user) throw new Error("No user found with this ID");

      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const users = await this.user.find();

      return users;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    userId: string,
    updatedFields: {
      username?: string;
      email?: string;
      password?: string;
      bio?: string;
      profilePicture?: string[];
    },
    req: Request
  ): Promise<User> {
    // Check for file uploads
    if (req.cloudinaryUrls)
      updatedFields["profilePicture"] = req.cloudinaryUrls;

    try {
      const user = await this.user.findByIdAndUpdate(userId, updatedFields, {
        new: true,
        runValidators: true,
      });

      if (!user) throw new Error("No user found with that ID");

      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(userId: string): Promise<void> {
    try {
      const user = await this.user.findByIdAndDelete(userId);

      if (!user) throw new Error("No user found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.user.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default UserService;
