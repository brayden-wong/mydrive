import { Elysia } from "elysia";

export class BadRequestError extends Error {
  public readonly status = 400;
  public readonly code = "BAD_REQUEST";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Bad Request");
  }
}

export class UnauthorizedError extends Error {
  public readonly status = 401;
  public readonly code = "UNAUTHORIZED";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Unauthorized");
  }
}

export class ForbiddenError extends Error {
  public readonly status = 403;
  public readonly code = "FORBIDDEN";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Forbidden");
  }
}

export class NotFoundError extends Error {
  public readonly status = 404;
  public readonly code = "NOT_FOUND";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Not Found");
  }
}

export class InternalServerError extends Error {
  public readonly status = 500;
  public readonly code = "INTERNAL_SERVER_ERROR";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Internal Server Error");
  }
}

export class UnprocessableEntity extends Error {
  public readonly status = 422;
  public readonly code = "UNPROCESSABLE_ENTITY";

  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? "Unprocessable Entity");
  }
}

const errors = new Elysia({ name: "errors" })
  .error("BAD_REQUEST", BadRequestError)
  .error("FORBIDDEN", ForbiddenError)
  .error("INTERNAL_SERVER_ERROR", InternalServerError)
  .error("NOT_FOUND", NotFoundError)
  .error("UNAUTHORIZED", UnauthorizedError)
  .error("UNPROCESSABLE_ENTITY", UnprocessableEntity)
  .onError(({ code, error }) => {
    switch (code) {
      case "BAD_REQUEST":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case "FORBIDDEN":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case "INTERNAL_SERVER_ERROR":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case "NOT_FOUND":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case "UNAUTHORIZED":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      case "UNPROCESSABLE_ENTITY":
        return {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      default:
        throw new Error("Invalid Error Code");
    }
  });

export { errors };
