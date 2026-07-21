import { Router } from "express";
import mongoose from "mongoose";
import { todoRouter } from "../../modules/todo/todo.routes";

export const v1ApiRouter = Router();

v1ApiRouter.get("/health", async (_req, res, next) => {
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

v1ApiRouter.get("/null-check", (_req, res) => {
  res.json({ ok: true, value: null });
});

v1ApiRouter.use("/todos", todoRouter);

