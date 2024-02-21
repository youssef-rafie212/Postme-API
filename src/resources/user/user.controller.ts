import Controller from "utils/interfaces/controller.interface";
import UserService from "./user.service";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./user.validation";
import AppError from "../../utils/errors/app.error";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(validate.create),
      this.signup
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
  }

  private async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, email, password, passwordConfirm } = req.body;

    try {
      const token = await this.userService.signup(
        username,
        email,
        password,
        passwordConfirm
      );

      res.status(201).json({
        message: "success",
        data: {
          token,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await this.userService.login(email, password);

      res.status(201).json({
        message: "success",
        data: {
          token,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default UserController;
