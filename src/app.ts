import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import Controller from "./utils/interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public express: Application;
  public port: number;

  constructor(port: number, controllers: Controller[]) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeDatabaseConnection(): void {
    mongoose.connect(process.env.DB_URI!).then(() => {
      console.log("DB connected");
    });
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(cookieParser());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(helmet());
    this.express.use(morgan("dev"));
    this.express.use(hpp());
    this.express.use(mongoSanitize());

    const limiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 100,
      message: "Too many requests please try again later",
    });
    this.express.use("/api", limiter);
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use("/api/v1/", controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default App;
