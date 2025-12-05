export class AppError extends Error {
  statusCode: number;
  code?: string | undefined;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;

    // Restore prototype chain (important for instanceof)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", code?: string) {
    super(message, 400, code);
  }
}

export class AuthError extends AppError {
  constructor(message = "Authentication failed", code?: string) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", code?: string) {
    super(message, 404, code);
  }
}
