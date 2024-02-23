import mongoose from "mongoose";
import Follow from "./follow.interface";

const FollowSchema = new mongoose.Schema<Follow>({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

FollowSchema.pre(
  /^find/,
  function (this: mongoose.Query<Follow, Follow>, next) {
    this.populate(["follower", "followee"]);
    next();
  },
);

export default mongoose.model<Follow>("Follow", FollowSchema);
