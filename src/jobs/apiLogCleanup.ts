import cron from "node-cron";
import { ApiLogModel } from "../modules/apiLog/apiLog.model";
import { env } from "../config/env";
import { logger } from "../config/logger";

const runCleanupOnce = async (): Promise<void> => {
  const cutoff = new Date(Date.now() - env.apiLogRetentionDays * 24 * 60 * 60 * 1000);
  const result = await ApiLogModel.deleteMany({ createdAt: { $lt: cutoff } });
  logger.info(
    { deletedCount: result.deletedCount, cutoff, retentionDays: env.apiLogRetentionDays },
    "API log cleanup completed"
  );
};

export const startApiLogCleanupJob = (): void => {
  if (!env.apiDbLoggingEnabled) return;

  if (!cron.validate(env.apiLogCleanupCron)) {
    logger.warn({ cron: env.apiLogCleanupCron }, "Invalid API log cleanup cron; job not started");
    return;
  }

  cron.schedule(env.apiLogCleanupCron, async () => {
    try {
      await runCleanupOnce();
    } catch (err) {
      logger.error({ err }, "API log cleanup failed");
    }
  });

  void (async () => {
    try {
      await runCleanupOnce();
    } catch (err) {
      logger.error({ err }, "API log cleanup failed");
    }
  })();
};
