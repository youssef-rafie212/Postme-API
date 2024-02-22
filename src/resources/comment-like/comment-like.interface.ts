import mongoose from "mongoose";

interface CommentLike extends mongoose.Document {
  creator: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
}

export default CommentLike;