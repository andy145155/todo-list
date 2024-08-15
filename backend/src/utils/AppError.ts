export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this);
  }
}
