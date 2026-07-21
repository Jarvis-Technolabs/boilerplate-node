import createError from "http-errors";
import mongoose from "mongoose";
import { Todo } from "../../interfaces";
import { TodoModel } from "./todo.model";

export const listTodos = async () => {
  const data: Todo[] = await TodoModel.find().sort({ createdAt: -1 }).lean();
  return data;
};

export const getTodoById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "Invalid todo id");
  }
  const todo = await TodoModel.findById(id).lean();
  if (!todo) throw createError(404, "Todo not found");
  return todo;
};

export const createTodo = async (title: string) => {
  const trimmed = title.trim();
  if (!trimmed) {
    throw createError(400, "title is required");
  }
  const todo = await TodoModel.create({ title: trimmed });
  return todo.toObject();
};

export const updateTodoById = async (
  id: string,
  patch: { title?: string; completed?: boolean }
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "Invalid todo id");
  }

  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const trimmed = patch.title.trim();
    if (!trimmed) throw createError(400, "title must not be empty");
    update.title = trimmed;
  }
  if (patch.completed !== undefined) {
    update.completed = patch.completed;
  }
  if (Object.keys(update).length === 0) {
    throw createError(400, "No fields to update");
  }

  const todo = await TodoModel.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!todo) throw createError(404, "Todo not found");
  return todo;
};

export const deleteTodoById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "Invalid todo id");
  }
  const todo = await TodoModel.findByIdAndDelete(id).lean();
  if (!todo) throw createError(404, "Todo not found");
  return todo;
};
