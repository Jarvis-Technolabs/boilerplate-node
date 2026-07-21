# Express + TypeScript + MongoDB Starter

## Quick start

1. Install dependencies
   - `npm i`
2. Set env
   - Update `.env.local` (already included in this scaffold)
3. Run
   - `npm run dev`

## Environments

Set `NODE_ENV` to `local`, `staging`, or `production`.

`dotenv-flow` loads `.env`, `.env.local`, and `.env.<NODE_ENV>` (if present).

## MongoDB (production)

In `production`, the app requires `MONGODB_USER`, `MONGODB_PASSWORD`, and `MONGODB_DB_NAME` (see `.env.production`). You can provide a full `MONGODB_URI`, or set `MONGODB_HOST`/`MONGODB_PORT` and the app will build the URI.

## Endpoints

- v1: `GET /api/v1/health`, `GET /api/v1/null-check`
- v1 Todos: `GET /api/v1/todos`, `POST /api/v1/todos`, `GET /api/v1/todos/:id`, `PATCH /api/v1/todos/:id`, `DELETE /api/v1/todos/:id`
- v2 Todos: `GET /api/v2/todos`, `POST /api/v2/todos`, `GET /api/v2/todos/:id`, `PATCH /api/v2/todos/:id`, `DELETE /api/v2/todos/:id`

## Auth

Todos endpoints require a JWT Bearer token:

- Header: `Authorization: Bearer <token>`
- Secret: `JWT_SECRET`

## Logging

- API request/response logs in MongoDB: `ApiLog` collection via `src/middlewares/apiDbLogger.ts`
- App logs: `pino` via `src/config/logger.ts` (`LOG_LEVEL` controls verbosity)

## API Log Cleanup

- Deletes `ApiLog` docs older than `API_LOG_RETENTION_DAYS` on a schedule (`API_LOG_CLEANUP_CRON`) and once at startup.
