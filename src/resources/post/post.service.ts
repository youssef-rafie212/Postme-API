import PostModel from "./post.model";
import Post from "./post.interface";
import UserModel from "../../resources/user/user.model";
import { Request } from "express";
import CustomRequest from "../../utils/definitions/request.definition";
import APIFeatures from "../../utils/api-features";

class PostService {
  private post = PostModel;

  async createOne(postBody: Post, req: CustomRequest): Promise<Post> {
    // Check for file uploads
    if (req.cloudinaryUrls) postBody.photos = req.cloudinaryUrls;

    try {
      // Check if the creator exists
      const creator = await UserModel.findById(postBody.creator);
      if (!creator) throw new Error("This creator doesn't exist");

      const post = await this.post.create(postBody);

      return post;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(postId: string): Promise<Post> {
    try {
      const post = await this.post.findById(postId);

      if (!post) throw new Error("No post found with this ID");

      return post;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(req: Request): Promise<Post[]> {
    try {
      const query = this.post.find();
      const queryString = req.query;

      const features = new APIFeatures(query, queryString)
        .filter()
        .fields()
        .paginate()
        .sort();

      const posts: Post[] = await features.query;

      return posts;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    postId: string,
    updatedFields: {
      content?: string;
      photos?: string[];
      creator?: string;
    },
    req: CustomRequest,
  ): Promise<Post> {
    // Check for file uploads
    if (req.cloudinaryUrls) updatedFields.photos = req.cloudinaryUrls;

    try {
      // Check if the creator exists
      if (updatedFields.creator) {
        const creator = await UserModel.findById(updatedFields.creator);
        if (!creator) throw new Error("This creator doesn't exist");
      }

      const post = await this.post.findByIdAndUpdate(postId, updatedFields, {
        new: true,
        runValidators: true,
      });

      if (!post) throw new Error("No post found with that ID");

      return post;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(postId: string): Promise<void> {
    try {
      const post = await this.post.findByIdAndDelete(postId);

      if (!post) throw new Error("No post found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.post.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default PostService;
