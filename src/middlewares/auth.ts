import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { env } from "../config/env";

export type AuthUser = {
  sub: string;
  email?: string;
  roles?: string[];
};

const parseBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = parseBearerToken(req);
  if (!token) return next(createError(401, "Missing Authorization Bearer token"));

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded !== "object" || decoded === null) {
      return next(createError(401, "Invalid token payload"));
    }

    const user: AuthUser = { sub: String((decoded as any).sub ?? "") };
    if ((decoded as any).email) user.email = String((decoded as any).email);
    if (Array.isArray((decoded as any).roles)) user.roles = (decoded as any).roles.map(String);

    if (!user.sub) return next(createError(401, "Invalid token subject"));

    req.user = user;
    next();
  } catch {
    next(createError(401, "Invalid or expired token"));
  }
};
