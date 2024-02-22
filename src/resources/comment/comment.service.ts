import CommentModel from "./comment.model";
import Comment from "./comment.interface";
import UserModel from "../../resources/user/user.model";
import PostModel from "../../resources/post/post.model";

class CommentService {
  private comment = CommentModel;

  async createOne(commentBody: Comment): Promise<Comment> {
    try {
      // Check if the creator exists
      const creator = await UserModel.findById(commentBody.creator);
      if (!creator) throw new Error("This creator doesn't exist");

      // Check if the post exists
      const post = await PostModel.findById(commentBody.post);
      if (!post) throw new Error("This post doesn't exist");

      const comment = await this.comment.create(commentBody);

      return comment;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(commentId: string): Promise<Comment> {
    try {
      const comment = await this.comment.findById(commentId);

      if (!comment) throw new Error("No comment found with this ID");

      return comment;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(): Promise<Comment[]> {
    try {
      const comments = await this.comment.find();

      return comments;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    commentId: string,
    updatedFields: {
      content?: string;
      creator?: string;
      post? : string;
    }
  ): Promise<Comment> {
    try {
      // Check if the creator exists
      const creator = await UserModel.findById(updatedFields.creator);
      if (!creator) throw new Error("This creator doesn't exist");

      // Check if the post exists
      const post = await PostModel.findById(updatedFields.post);
      if (!post) throw new Error("This post doesn't exist");

      const comment = await this.comment.findByIdAndUpdate(commentId, updatedFields, {
        new: true,
        runValidators: true,
      });

      if (!comment) throw new Error("No Comment found with that ID");

      return comment;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(commentId: string): Promise<void> {
    try {
      const comment = await this.comment.findByIdAndDelete(commentId);

      if (!comment) throw new Error("No comment found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.comment.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default CommentService;
