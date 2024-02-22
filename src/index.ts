import "dotenv/config";
import App from "./app";
import UserController from "./resources/user/user.controller";
import PostController from "./resources/post/post.controller";

const app = new App(Number(process.env.PORT), [
  new UserController(),
  new PostController(),
]);

app.listen();
