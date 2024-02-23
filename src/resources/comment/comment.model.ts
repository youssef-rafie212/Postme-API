import Comment from "./comment.interface";
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema<Comment>({
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 400,
  },
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

CommentSchema.pre(
  /^find/,
  function (this: mongoose.Query<Comment, Comment>, next) {
    this.populate(["creator", "post"]);
    next();
  },
);

export default mongoose.model<Comment>("Comment", CommentSchema);
