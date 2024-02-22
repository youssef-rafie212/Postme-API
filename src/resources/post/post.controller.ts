import Controller from "utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./post.validation";
import AppError from "../../utils/errors/app.error";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import restrictMiddleware from "../../middlewares/restrict.middleware";
import uploadMiddleware from "../../middlewares/upload.middleware";
import resizeMiddleware from "../../middlewares/resize.middleware";
import cloudMiddleware from "../../middlewares/cloud.middleware";
import PostService from "./post.service";

class PostController implements Controller {
  public path = "/posts";
  public router = Router();
  private postService = new PostService();

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
        uploadMiddleware.array("photos", 5),
        validationMiddleware(validate.create),
        resizeMiddleware(2000, 2000),
        cloudMiddleware,
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
        uploadMiddleware.array("photos", 5),
        validationMiddleware(validate.update),
        resizeMiddleware(2000, 2000),
        cloudMiddleware,
        this.updateOne
      )
      .delete(authenticateMiddleware, this.deleteOne);
  }

  private async createOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postBody = req.body;

    try {
      const post = await this.postService.createOne(postBody, req);

      res.status(201).json({
        message: "success",
        data: {
          post,
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
      const post = await this.postService.getOne(id);

      res.status(200).json({
        message: "success",
        data: {
          post,
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
      const posts = await this.postService.getAll(req);

      res.status(200).json({
        message: "success",
        length: posts.length,
        data: {
          posts,
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
      const updatedPost = await this.postService.updateOne(id, updateBody, req);

      res.status(200).json({
        message: "success",
        data: {
          updatedPost,
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
      await this.postService.deleteOne(id);

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
      await this.postService.deleteAll();

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default PostController;
