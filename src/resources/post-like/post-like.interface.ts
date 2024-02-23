import mongoose from "mongoose";

interface PostLike extends mongoose.Document {
  creator: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

export default PostLike;
