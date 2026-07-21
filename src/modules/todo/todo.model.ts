import mongoose, { Schema } from "mongoose";
import type { Todo } from "../../interfaces/todo";

const TodoSchema = new Schema<Todo>(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const TodoModel = mongoose.model<Todo>("Todo", TodoSchema);
