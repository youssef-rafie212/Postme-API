import Controller from "utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./post-like.validation";
import AppError from "../../utils/errors/app.error";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import restrictMiddleware from "../../middlewares/restrict.middleware";
import PostLikeService from "./post-like.service";

class PostLikeController implements Controller {
  public path = "/postLikes";
  public router = Router();
  private postLikeService = new PostLikeService();

  constructor() {
    this.initializeBinding();
    this.initializeRoutes();
  }

  private initializeBinding(): void {
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  private initializeRoutes(): void {
    this.router
      .route(`${this.path}/`)
      .post(
        authenticateMiddleware,
        validationMiddleware(validate.create),
        this.createOne
      )
      .get(authenticateMiddleware, this.getAll)
      .delete(
        authenticateMiddleware,
        restrictMiddleware("admin"),
        this.deleteAll
      );

    this.router
      .route(`${this.path}/:id`)
      .get(authenticateMiddleware, this.getOne)
      .patch(
        authenticateMiddleware,
        validationMiddleware(validate.update),
        this.updateOne
      )
      .delete(authenticateMiddleware, this.deleteOne);
  }

  private async createOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postLikeBody = req.body;

    try {
      const postLike = await this.postLikeService.createOne(postLikeBody);

      res.status(201).json({
        message: "success",
        data: {
          postLike,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async getOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.params.id;

    try {
      const postLike = await this.postLikeService.getOne(id);

      res.status(200).json({
        message: "success",
        data: {
          postLike,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postLikes = await this.postLikeService.getAll();

      res.status(200).json({
        message: "success",
        length: postLikes.length,
        data: {
          postLikes,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async updateOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.params.id;
    let updateBody = req.body;

    try {
      const updatedPostLike = await this.postLikeService.updateOne(
        id,
        updateBody
      );

      res.status(200).json({
        message: "success",
        data: {
          updatedPostLike,
        },
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }

  private async deleteOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string = req.params.id;

    try {
      await this.postLikeService.deleteOne(id);

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
    next: NextFunction
  ): Promise<void> {
    try {
      await this.postLikeService.deleteAll();

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default PostLikeController;
