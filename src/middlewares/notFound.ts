import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(createError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
