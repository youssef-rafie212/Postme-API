import "dotenv/config";
import App from "./app";
import UserController from "./resources/user/user.controller";
import PostController from "./resources/post/post.controller";
import CommentController from "./resources/comment/comment.controller";
import PostLikeController from "./resources/post-like/post-like.controller";
import CommentLikeController from "./resources/comment-like/comment-like.controller";
import FollowController from "./resources/follow/follow.controller";

const app = new App(Number(process.env.PORT), [
  new UserController(),
  new PostController(),
  new CommentController(),
  new PostLikeController(),
  new CommentLikeController(),
  new FollowController(),
]);

app.listen();
