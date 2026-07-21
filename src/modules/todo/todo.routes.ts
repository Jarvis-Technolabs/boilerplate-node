import { Router } from "express";
import * as todoController from "./todo.controller";

export const todoRouter = Router();

// todoRouter.use(requireAuth);

todoRouter.get("/", todoController.getTodos);
todoRouter.post("/", todoController.postTodo);
todoRouter.get("/:id", todoController.getTodoById);
todoRouter.patch("/:id", todoController.patchTodo);
todoRouter.delete("/:id", todoController.deleteTodo);
