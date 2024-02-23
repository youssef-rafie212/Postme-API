import mongoose from "mongoose";

interface Comment extends mongoose.Document {
  content: string;
  creator: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

export default Comment;
