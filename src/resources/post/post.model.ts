import Post from "./post.interface";
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema<Post>({
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500,
  },
  photos: [String],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

PostSchema.pre(/^find/, function (this: mongoose.Query<Post, Post>, next) {
  this.populate("creator");
  next();
});

export default mongoose.model<Post>("Post", PostSchema);
