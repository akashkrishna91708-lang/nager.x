# NagarX production readiness

## Current architecture

The checked-in application currently runs as:

- React + Vite frontend with Leaflet maps.
- Express REST API with JWT authentication and role checks.
- SQLite via `better-sqlite3` for local persistence.
- Seeded local records for incidents, traffic snapshots, routes, users and notifications.
- Deterministic local route calculations and explicitly labelled pilot/simulation views.

## Not connected in this repository

The following services are not present or configured in the current workspace:

- PostgreSQL/PostGIS migrations and connection pool.
- Redis cache or rate limiter.
- Python/FastAPI ML service, LSTM or XGBoost model artifacts.
- OR-Tools optimization service.
- GTFS or GTFS-Realtime feed ingestion.
- External traffic, routing, weather or events provider.
- WebSocket event broker.

The application must not describe these as live. The backend exposes `GET /api/system/status` so deployment checks can inspect the provider boundary.

## Environment contract

Copy `.env.example` to the deployment environment and configure the providers that are actually available:

- `DATABASE_URL`: external database connection string.
- `REDIS_URL`: Redis connection string.
- `MAPS_API_KEY`: server-side maps/routing credential.
- `TRAFFIC_API_KEY`: traffic provider credential.
- `GTFS_STATIC_URL`: GTFS static feed URL.
- `GTFS_REALTIME_URL`: GTFS-Realtime feed URL.
- `ML_SERVICE_URL`: prediction service URL.
- `MODEL_VERSION`: deployed model identifier.
- `DATA_MODE=production`: only use after the required services are connected and validated.

Without these values, the app remains a local prototype backed by SQLite. This is intentional: it is better to expose an unavailable integration than to fabricate live traffic, transit, AI or optimization results.

## Verification

From the repository root:

```bash
npm install
npm run build
npm test
```

With the API running, inspect the integration boundary:

```bash
curl http://127.0.0.1:5000/api/system/status
```

A truthful local response reports `mode: local` and `production_ready: false`.
