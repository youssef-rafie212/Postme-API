import PostLikeModel from "./post-like.model";
import PostLike from "./post-like.interface";
import UserModel from "../../resources/user/user.model";
import PostModel from "../../resources/post/post.model";
import { Request } from "express";
import APIFeatures from "../../utils/api-features";

class PostLikeService {
  private postLike = PostLikeModel;

  async createOne(postLikeBody: PostLike): Promise<PostLike> {
    try {
      // Check if the creator exists
      const creator = await UserModel.findById(postLikeBody.creator);
      if (!creator) throw new Error("This creator doesn't exist");

      // Check if the post exists
      const post = await PostModel.findById(postLikeBody.post);
      if (!post) throw new Error("This post doesn't exist");

      const postLike = await this.postLike.create(postLikeBody);

      return postLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(postLikeId: string): Promise<PostLike> {
    try {
      const postLike = await this.postLike.findById(postLikeId);

      if (!postLike) throw new Error("No postLike found with this ID");

      return postLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(req: Request): Promise<PostLike[]> {
    try {
      const query = this.postLike.find();
      const queryString = req.query;

      const features = new APIFeatures(query, queryString)
        .filter()
        .fields()
        .paginate()
        .sort();

      const postLikes: PostLike[] = await features.query;

      return postLikes;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    postLikeId: string,
    updatedFields: {
      creator?: string;
      post?: string;
    },
  ): Promise<PostLike> {
    try {
      // Check if the creator exists
      if (updatedFields.creator) {
        const creator = await UserModel.findById(updatedFields.creator);
        if (!creator) throw new Error("This creator doesn't exist");
      }

      // Check if the post exists
      if (updatedFields.post) {
        const post = await PostModel.findById(updatedFields.post);
        if (!post) throw new Error("This post doesn't exist");
      }

      const postLike = await this.postLike.findByIdAndUpdate(
        postLikeId,
        updatedFields,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!postLike) throw new Error("No postLike found with that ID");

      return postLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(postLikeId: string): Promise<void> {
    try {
      const postLike = await this.postLike.findByIdAndDelete(postLikeId);

      if (!postLike) throw new Error("No postLike found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.postLike.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default PostLikeService;
