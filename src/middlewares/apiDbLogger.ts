import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { ApiLogModel } from "../modules/apiLog/apiLog.model";
import { logger } from "../config/logger";

const safeJsonSize = (value: unknown, maxBytes: number): unknown => {
  if (value === undefined) return undefined;
  try {
    const str = JSON.stringify(value);
    if (Buffer.byteLength(str, "utf8") > maxBytes) return { truncated: true };
    return value;
  } catch {
    return { unserializable: true };
  }
};

export const apiDbLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (!env.apiDbLoggingEnabled) return next();

  const start = process.hrtime.bigint();

  res.on("finish", async () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const contentLength = res.getHeader("content-length");
    const responseBytes =
      typeof contentLength === "string"
        ? Number(contentLength)
        : Array.isArray(contentLength)
          ? Number(contentLength[0])
          : typeof contentLength === "number"
            ? contentLength
            : undefined;

    const requestBody = safeJsonSize(req.body, env.apiDbLoggingMaxBodyBytes);

    const doc: Record<string, unknown> = {
      method: req.method,
      path: req.originalUrl,
      query: req.query as Record<string, unknown>,
      params: req.params as Record<string, unknown>,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      requestBody,
    };

    if (req.ip) doc.ip = req.ip;
    const ua = req.headers["user-agent"];
    if (ua) doc.userAgent = ua;
    if (Number.isFinite(responseBytes)) doc.responseBytes = responseBytes;

    try {
      await ApiLogModel.create(doc);
    } catch (err) {
      logger.error({ err }, "Failed to write API log");
    }
  });

  next();
};
