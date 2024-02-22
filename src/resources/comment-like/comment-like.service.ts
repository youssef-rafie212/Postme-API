import CommentLikeModel from "./comment-like.model";
import CommentLike from "./comment-like.interface";
import UserModel from "../user/user.model";
import CommentModel from "../comment/comment.model";

class CommentLikeService {
  private commentLike = CommentLikeModel;

  async createOne(commentLikeBody: CommentLike): Promise<CommentLike> {
    try {
      // Check if the creator exists
      const creator = await UserModel.findById(commentLikeBody.creator);
      if (!creator) throw new Error("This creator doesn't exist");

      // Check if the comment exists
      const comment = await CommentModel.findById(commentLikeBody.comment);
      if (!comment) throw new Error("This comment doesn't exist");

      const commentLike = await this.commentLike.create(commentLikeBody);

      return commentLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getOne(commentLikeId: string): Promise<CommentLike> {
    try {
      const commentLike = await this.commentLike.findById(commentLikeId);

      if (!commentLike) throw new Error("No commentLike found with this ID");

      return commentLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getAll(): Promise<CommentLike[]> {
    try {
      const commentLikes = await this.commentLike.find();

      return commentLikes;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateOne(
    commentLikeId: string,
    updatedFields: {
      creator?: string;
      comment?: string;
    }
  ): Promise<CommentLike> {
    try {
      // Check if the creator exists
      if (updatedFields.creator) {
        const creator = await UserModel.findById(updatedFields.creator);
        if (!creator) throw new Error("This creator doesn't exist");
      }

      // Check if the comment exists
      if (updatedFields.comment) {
        const comment = await CommentModel.findById(updatedFields.comment);
        if (!comment) throw new Error("This comment doesn't exist");
      }

      const commentLike = await this.commentLike.findByIdAndUpdate(
        commentLikeId,
        updatedFields,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!commentLike) throw new Error("No commentLike found with that ID");

      return commentLike;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(commentLikeId: string): Promise<void> {
    try {
      const commentLike = await this.commentLike.findByIdAndDelete(commentLikeId);

      if (!commentLike) throw new Error("No commentLike found with this ID");
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.commentLike.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default CommentLikeService;
