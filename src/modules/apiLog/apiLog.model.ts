import mongoose, { Schema } from "mongoose";
import type { ApiLog } from "../../interfaces/apiLog";

const ApiLogSchema = new Schema<ApiLog>(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    query: { type: Schema.Types.Mixed, required: false },
    params: { type: Schema.Types.Mixed, required: false },
    statusCode: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    ip: { type: String, required: false },
    userAgent: { type: String, required: false },
    requestBody: { type: Schema.Types.Mixed, required: false },
    responseBytes: { type: Number, required: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ApiLogSchema.index({ createdAt: 1 });

export const ApiLogModel = mongoose.model<ApiLog>("ApiLog", ApiLogSchema);
