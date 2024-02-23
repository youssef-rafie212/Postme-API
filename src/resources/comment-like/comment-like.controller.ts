import Controller from "utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./comment-like.validation";
import AppError from "../../utils/errors/app.error";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import restrictMiddleware from "../../middlewares/restrict.middleware";
import CommentLikeService from "./comment-like.service";

class CommentLikeController implements Controller {
  public path = "/commentLikes";
  public router = Router();
  private commentLikeService = new CommentLikeService();

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
        validationMiddleware({ body: validate.createBody }),
        this.createOne,
      )
      .get(
        authenticateMiddleware,
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
        validationMiddleware({
          body: validate.updateBody,
          params: validate.updateParams,
        }),
        this.updateOne,
      )
      .delete(
        authenticateMiddleware,
        validationMiddleware({ params: validate.deleteOneParams }),
        this.deleteOne,
      );
  }

  private async createOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const commentLikeBody = req.body;

    try {
      const commentLike =
        await this.commentLikeService.createOne(commentLikeBody);

      res.status(201).json({
        message: "success",
        data: {
          commentLike,
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
      const commentLike = await this.commentLikeService.getOne(id);

      res.status(200).json({
        message: "success",
        data: {
          commentLike,
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
      const commentLikes = await this.commentLikeService.getAll(req);

      res.status(200).json({
        message: "success",
        length: commentLikes.length,
        data: {
          commentLikes,
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
      const updatedCommentLike = await this.commentLikeService.updateOne(
        id,
        updateBody,
      );

      res.status(200).json({
        message: "success",
        data: {
          updatedCommentLike,
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
      await this.commentLikeService.deleteOne(id);

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
      await this.commentLikeService.deleteAll();

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default CommentLikeController;
