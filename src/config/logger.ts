import pino from "pino";
import { env } from "./env";

const isPretty = env.nodeEnv === "local";

export const logger = pino({
  level: env.logLevel,
  ...(isPretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        },
      }
    : {}),
});
