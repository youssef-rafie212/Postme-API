import mongoose, { model } from "mongoose";
import User from "./user.interface";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 25,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: String,
  bio: {
    type: String,
    minLength: 3,
    maxLength: 250,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
});

// UserSchema methods
UserSchema.methods.isCorrectPassword = async (
  password: string,
  storedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, storedPassword);
};

UserSchema.methods.createPasswordResetToken =
  async function (): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetToken = hashedResetToken;
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    await this.save();

    return resetToken;
  };

// Middlewares
UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashed = await bcrypt.hash(this.password, 12);

  this.password = hashed;
  this.passwordConfirm = undefined;

  next();
});

//// Update passwordChangedAt field if the user changed the password
UserSchema.pre<User>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

export default model<User>("User", UserSchema);
