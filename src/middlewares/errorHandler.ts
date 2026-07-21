import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const httpErr = err as Partial<HttpError> & { message?: string };
  const statusCode = typeof httpErr.status === "number" ? httpErr.status : 500;

  res.status(statusCode).json({
    error: {
      message: httpErr.message ?? "Internal Server Error",
      statusCode,
    },
  });
};
