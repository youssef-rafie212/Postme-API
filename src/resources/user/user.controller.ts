import Controller from "utils/interfaces/controller.interface";
import UserService from "./user.service";
import { Router, Request, Response, NextFunction } from "express";
import CustomRequest from "utils/definitions/request.definition";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./user.validation";
import AppError from "../../utils/errors/app.error";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import restrictMiddleware from "../../middlewares/restrict.middleware";
import uploadMiddleware from "../../middlewares/upload.middleware";
import resizeMiddleware from "../../middlewares/resize.middleware";
import cloudMiddleware from "../../middlewares/cloud.middleware";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeBinding();
    this.initializeRoutes();
  }

  private initializeBinding(): void {
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.getMe = this.getMe.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware({ body: validate.createBody }),
      this.signup,
    );

    this.router.post(
      `${this.path}/login`,
      validationMiddleware({ body: validate.loginBody }),
      this.login,
    );

    this.router.post(
      `${this.path}/logout`,
      authenticateMiddleware,
      this.logout,
    );

    this.router.post(
      `${this.path}/forgotPassword`,
      validationMiddleware({ body: validate.forgotPasswordBody }),
      this.forgotPassword,
    );

    this.router.patch(
      `${this.path}/resetPassword/:resetToken`,
      validationMiddleware({
        body: validate.resetPasswordBody,
        params: validate.resetPasswordParams,
      }),
      this.resetPassword,
    );

    this.router.get(`${this.path}/me`, authenticateMiddleware, this.getMe);

    this.router
      .route(`${this.path}/`)
      .get(
        authenticateMiddleware,
        restrictMiddleware("admin"),
        validationMiddleware({ query: validate.getAllQuery }),
        this.getAll,
      )
      .delete(
        authenticateMiddleware,
        restrictMiddleware("admin"),
        this.deleteAll,
      );

    this.router
      .route(`${this.path}/:id`)
      .get(
        authenticateMiddleware,
        validationMiddleware({ params: validate.getOneParams }),
        this.getOne,
      )
      .patch(
        authenticateMiddleware,
        uploadMiddleware.array("profilePicture", 1),
        validationMiddleware({
          body: validate.updateBody,
          params: validate.updateParams,
        }),
        resizeMiddleware(500, 500),
        cloudMiddleware,
        this.updateOne,
      )
      .delete(
        authenticateMiddleware,
        validationMiddleware({ params: validate.deleteOneParams }),
        this.deleteOne,
      );
  }

  private async signup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { username, email, password, passwordConfirm } = req.body;

    try {
      const { accessToken, user } = await this.userService.signup(
        username,
        email,
        password,
        passwordConfirm,
      );

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "development" ? false : true,
      });

      res.status(201).json({
        message: "success",
        data: {
          accessToken,
          user,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const { accessToken, user } = await this.userService.login(
        email,
        password,
      );

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "development" ? false : true,
      });

      res.status(201).json({
        message: "success",
        data: {
          accessToken,
          user,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private logout(req: Request, res: Response): void {
    res.cookie("jwt", "logout", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "development" ? false : true,
      expires: new Date(Date.now() + 10 * 1000), // Expires after 10 seconds
    });

    res.status(200).json({
      message: "success",
    });
  }

  private async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email } = req.body;

    try {
      await this.userService.forgotPassword(email, req);

      res.status(200).json({
        message:
          "An email is sent to your email account for reseting your password",
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { newPassword, newPasswordConfirm } = req.body;
    const resetToken = req.params.resetToken;

    try {
      const { accessToken, user } = await this.userService.resetPassword(
        resetToken,
        newPassword,
        newPasswordConfirm,
      );

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "development" ? false : true,
      });

      res.status(200).json({
        message: "success",
        data: {
          accessToken,
          user,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.getOne(
        (req as CustomRequest).user.id,
      );

      res.status(200).json({
        message: "success",
        data: {
          user,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string = req.params.id;

    try {
      const user = await this.userService.getOne(id);

      res.status(200).json({
        message: "success",
        data: {
          user,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await this.userService.getAll(req);

      res.status(200).json({
        message: "success",
        length: users.length,
        data: {
          users,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async updateOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string = req.params.id;
    const updateBody = req.body;

    try {
      const updatedUser = await this.userService.updateOne(
        id,
        updateBody,
        req as CustomRequest,
      );

      res.status(200).json({
        message: "success",
        data: {
          updatedUser,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async deleteOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string = req.params.id;

    try {
      await this.userService.deleteOne(id);

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.userService.deleteAll();

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default UserController;
