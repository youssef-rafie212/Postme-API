class AppError extends Error {
  public message: string;
  public status: number;
  public isOperational: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
    this.isOperational = true;
  }
}

export default AppError;
