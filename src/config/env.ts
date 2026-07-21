import dotenvFlow from "dotenv-flow";

dotenvFlow.config({ silent: true });

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const optionalEnv = (name: string): string | undefined => {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
};

const buildMongoUriFromParts = (parts: {
  host: string;
  port: number;
  dbName: string;
  user?: string;
  password?: string;
  authSource?: string;
}): string => {
  const credentials =
    parts.user && parts.password
      ? `${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}@`
      : "";
  const authSource = parts.authSource ? `?authSource=${encodeURIComponent(parts.authSource)}` : "";
  return `mongodb://${credentials}${parts.host}:${parts.port}/${encodeURIComponent(parts.dbName)}${authSource}`;
};

const nodeEnv = (process.env.NODE_ENV ?? "local") as "local" | "staging" | "production";

const mongoDbName =
  process.env.MONGODB_DB_NAME ??
  (nodeEnv === "production" ? requireEnv("MONGODB_DB_NAME") : undefined);

const mongoHost = process.env.MONGODB_HOST ?? "127.0.0.1";
const mongoPort = Number(process.env.MONGODB_PORT ?? 27017);
const mongoUser = optionalEnv("MONGODB_USER");
const mongoPassword = optionalEnv("MONGODB_PASSWORD");
const mongoAuthSource = optionalEnv("MONGODB_AUTH_SOURCE");

const mongoUri =
  optionalEnv("MONGODB_URI") ??
  buildMongoUriFromParts({
    host: mongoHost,
    port: mongoPort,
    dbName: mongoDbName ?? "admin",
    ...(mongoUser ? { user: mongoUser } : {}),
    ...(mongoPassword ? { password: mongoPassword } : {}),
    ...(mongoAuthSource ? { authSource: mongoAuthSource } : {}),
  });

if (nodeEnv === "production") {
  // Enforce explicit production credentials/db name.
  requireEnv("MONGODB_USER");
  requireEnv("MONGODB_PASSWORD");
  requireEnv("MONGODB_DB_NAME");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 4000),
  apiVersion: process.env.API_VERSION ?? "v1",
  mongoUri,
  mongoDbName,
  logLevel: process.env.LOG_LEVEL ?? "info",
  jwtSecret: requireEnv("JWT_SECRET"),
  apiDbLoggingEnabled: (process.env.API_DB_LOGGING_ENABLED ?? "true") === "true",
  apiDbLoggingMaxBodyBytes: Number(process.env.API_DB_LOGGING_MAX_BODY_BYTES ?? 10_000),
  apiLogRetentionDays: Number(process.env.API_LOG_RETENTION_DAYS ?? 10),
  apiLogCleanupCron: process.env.API_LOG_CLEANUP_CRON ?? "0 3 * * *",
} as const;
