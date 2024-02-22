import Controller from "utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import * as validate from "./comment.validation";
import AppError from "../../utils/errors/app.error";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import restrictMiddleware from "../../middlewares/restrict.middleware";
import CommentService from "./comment.service";

class CommentController implements Controller {
  public path = "/comments";
  public router = Router();
  private commentService = new CommentService();

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
    const commentBody = req.body;

    try {
      const comment = await this.commentService.createOne(commentBody);

      res.status(201).json({
        message: "success",
        data: {
          comment,
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
      const comment = await this.commentService.getOne(id);

      res.status(200).json({
        message: "success",
        data: {
          comment,
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
      const comments = await this.commentService.getAll();

      res.status(200).json({
        message: "success",
        length: comments.length,
        data: {
          comments,
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
      const updatedComment = await this.commentService.updateOne(
        id,
        updateBody
      );

      res.status(200).json({
        message: "success",
        data: {
          updatedComment,
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
      await this.commentService.deleteOne(id);

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
      await this.commentService.deleteAll();

      res.status(204).json({
        message: "success",
        data: null,
      });
    } catch (err: any) {
      next(new AppError(err.message, 400));
    }
  }
}

export default CommentController;
