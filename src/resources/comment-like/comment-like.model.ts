import mongoose from "mongoose";
import CommentLike from "./comment-like.interface";

const CommentLikeSchema = new mongoose.Schema<CommentLike>({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

CommentLikeSchema.pre(
  /^find/,
  function (this: mongoose.Query<CommentLike, CommentLike>, next) {
    this.populate(["creator", "comment"]);
    next();
  },
);

export default mongoose.model<CommentLike>("CommentLike", CommentLikeSchema);
