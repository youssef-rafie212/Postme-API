import "dotenv/config";
import App from "./app";
import UserController from "./resources/user/user.controller";

const app = new App(Number(process.env.PORT), [new UserController()]);

app.listen();
