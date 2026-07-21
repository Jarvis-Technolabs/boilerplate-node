import type { NextFunction, Request, Response } from "express";
import * as todoService from "./todo.service";

export const getTodosV2 = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await todoService.listTodos();
    res.json({ data: todos });
  } catch (err) {
    next(err);
  }
};

export const getTodoByIdV2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.getTodoById(String(req.params.id));
    res.json({ data: todo });
  } catch (err) {
    next(err);
  }
};

export const postTodoV2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = String(req.body?.title ?? "");
    const todo = await todoService.createTodo(title);
    res.status(201).json({ data: todo });
  } catch (err) {
    next(err);
  }
};

export const patchTodoV2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const title = req.body?.title;
    const completed = req.body?.completed;

    const patch: { title?: string; completed?: boolean } = {};
    if (title !== undefined) patch.title = String(title);
    if (completed !== undefined) patch.completed = Boolean(completed);

    const todo = await todoService.updateTodoById(id, patch);
    res.json({ data: todo });
  } catch (err) {
    next(err);
  }
};

export const deleteTodoV2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.deleteTodoById(String(req.params.id));
    res.json({ data: todo });
  } catch (err) {
    next(err);
  }
};
