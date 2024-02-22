import mongoose from "mongoose";
import PostLike from "./post-like.interface";

const PostLikeSchema = new mongoose.Schema<PostLike>({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

PostLikeSchema.pre(
  /^find/,
  function (this: mongoose.Query<PostLike, PostLike>, next) {
    this.populate(["creator", "post"]);
    next();
  }
);

export default mongoose.model<PostLike>("PostLike", PostLikeSchema);
