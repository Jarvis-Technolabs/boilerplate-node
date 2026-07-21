import { Router } from "express";
import mongoose from "mongoose";
import { todoRouterV2 } from "../../modules/todo/todo.v2.routes";

export const v2ApiRouter = Router();

v2ApiRouter.get("/health", async (_req, res, next) => {
  try {
    const isMongoUp = mongoose.connection.readyState === 1;
    if (isMongoUp) {
      await mongoose.connection.db?.admin().ping();
    }
    res.json({ status: "ok", mongo: isMongoUp ? "up" : "down" });
  } catch (err) {
    next(err);
  }
});

v2ApiRouter.use("/todos", todoRouterV2);

