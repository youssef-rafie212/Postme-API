import mongoose from "mongoose";

interface Follow extends mongoose.Document {
  follower: mongoose.Types.ObjectId;
  followee: mongoose.Types.ObjectId;
}

export default Follow;
