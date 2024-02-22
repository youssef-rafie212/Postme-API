import FollowModel from "./follow.model";
import Follow from "./follow.interface";
import UserModel from "../user/user.model";

class FollowService {
  private follow = FollowModel;

  async createOne(followBody: Follow): Promise<Follow> {
    try {
      // Check if follower and followee are the same
      if (followBody.follower == followBody.followee)
        throw new Error("A user can't follow theirselves");

      // Check if the follower exists
      const follower = await UserModel.findById(followBody.follower);
      if (!follower) throw new Error("This follower doesn't exist");

      // Check if the followee exists
      const followee = await UserModel.findById(followBody.followee);
      if (!followee) throw new Error("This followee doesn't exist");

      const follow = await this.follow.create(followBody);

      return follow;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(followId: string): Promise<Follow> {
    try {
      const follow = await this.follow.findById(followId);

      if (!follow) throw new Error("No follow found with this ID");

      return follow;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(): Promise<Follow[]> {
    try {
      const follows = await this.follow.find();

      return follows;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    followId: string,
    updatedFields: {
      follower?: string;
      followee?: string;
    }
  ): Promise<Follow> {
    try {
      // Check if the follower exists
      if (updatedFields.follower) {
        const follower = await UserModel.findById(updatedFields.follower);
        if (!follower) throw new Error("This follower doesn't exist");
      }

      // Check if the followee exists
      if (updatedFields.followee) {
        const followee = await UserModel.findById(updatedFields.followee);
        if (!followee) throw new Error("This followee doesn't exist");
      }

      const follow = await this.follow.findByIdAndUpdate(
        followId,
        updatedFields,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!follow) throw new Error("No follow found with that ID");

      return follow;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(followId: string): Promise<void> {
    try {
      const follow = await this.follow.findByIdAndDelete(followId);

      if (!follow) throw new Error("No follow found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.follow.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default FollowService;
