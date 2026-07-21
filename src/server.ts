import { createApp } from "./app";
import { connectMongo, disconnectMongo } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { startApiLogCleanupJob } from "./jobs/apiLogCleanup";

const main = async () => {
  await connectMongo();
  startApiLogCleanupJob();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info({ env: env.nodeEnv, port: env.port }, "API listening");
  });

  const closeServer = async () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down");
    try {
      await closeServer();
      await disconnectMongo();
      process.exit(0);
    } catch (err) {
      logger.error({ err }, "Shutdown failed");
      process.exit(1);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

void (async () => {
  try {
    await main();
  } catch (err) {
    logger.error({ err }, "Fatal error");
    process.exit(1);
  }
})();
