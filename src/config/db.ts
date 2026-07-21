import mongoose from "mongoose";
import { env } from "./env";

export const connectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;

  const options = env.mongoDbName ? { dbName: env.mongoDbName } : undefined;
  await mongoose.connect(env.mongoUri, options);
};

export const disconnectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
};
