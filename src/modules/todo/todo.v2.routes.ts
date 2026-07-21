import { Router } from "express";
import * as todoV2Controller from "./todo.v2.controller";
import { requireAuth } from "../../middlewares/auth";

export const todoRouterV2 = Router();

todoRouterV2.use(requireAuth);

todoRouterV2.get("/", todoV2Controller.getTodosV2);
todoRouterV2.post("/", todoV2Controller.postTodoV2);
todoRouterV2.get("/:id", todoV2Controller.getTodoByIdV2);
todoRouterV2.patch("/:id", todoV2Controller.patchTodoV2);
todoRouterV2.delete("/:id", todoV2Controller.deleteTodoV2);
