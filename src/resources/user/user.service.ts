import UserModel from "./user.model";
import token from "../../utils/token";
import User from "./user.interface";
import { Request } from "express";
import CustomRequest from "../../utils/definitions/request.definition";
import Email from "../../utils/email";
import crypo from "crypto";
import APIFeatures from "../../utils/api-features";

class UserService {
  private user = UserModel;

  async signup(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
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
    password: string,
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
        "host",
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
    newPasswordConfirm: string,
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

  async getAll(req: Request): Promise<User[]> {
    try {
      const query = this.user.find();
      const queryString = req.query;

      const features = new APIFeatures(query, queryString)
        .filter()
        .fields()
        .paginate()
        .sort();

      const users: User[] = await features.query;

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
    req: CustomRequest,
  ): Promise<User> {
    // Check for file uploads
    if (req.cloudinaryUrls) updatedFields.profilePicture = req.cloudinaryUrls;

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
