export interface ApiLog {
  createdAt: Date;
  method: string;
  path: string;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  statusCode: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
  requestBody?: unknown;
  responseBytes?: number;
}

