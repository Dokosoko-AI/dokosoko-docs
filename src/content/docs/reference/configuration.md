---
title: Configuration
description: Reference for DokoSoko service, database, crawler, and development environment variables.
---

## Required Compose variables

| Variable | Purpose |
| --- | --- |
| `DOKOSOKO_DATABASE_PASSWORD` | PostgreSQL password used by Compose |
| `DOKOSOKO_MASTER_KEY` | Standard-base64 encoding of exactly 32 random bytes |
| `DOKOSOKO_SETUP_TOKEN` | Strong, one-time secret for creating the first root administrator |
| `DOKOSOKO_PUBLIC_URL` | Exact external origin; HTTPS is required outside localhost |

Keep `DOKOSOKO_MASTER_KEY` stable and backed up. Rotating or losing it makes stored integration credentials unreadable. Remove or rotate the setup token after initial setup.

## Service variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_LISTEN` | `:8080` | HTTP listen address |
| `DOKOSOKO_DATABASE_URL` | — | PostgreSQL connection string; required outside memory development |
| `DOKOSOKO_UI_DIR` | `./dist/client` | Static console build directory |
| `DOKOSOKO_DATA_DIR` | `./data` | Artifact and crawler data directory |
| `DOKOSOKO_MIGRATIONS_DIR` | `./migrations` | Checksummed database migrations |
| `DOKOSOKO_PUBLIC_URL` | `http://localhost:8080` | Must be an absolute origin with no path, query, or fragment |

## Crawler variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_CRAWLER_MAX_PAGES` | `500` | Maximum pages accepted by one crawl |
| `DOKOSOKO_CRAWLER_MAX_BYTES` | `5000000` | Maximum bytes accepted by one crawl |
| `DOKOSOKO_DATABASE_URL` | — | Same database as the control plane |
| `DOKOSOKO_DATA_DIR` | `/data` in the container | Shared artifact data directory |

## Development-only switches

| Variable | Effect |
| --- | --- |
| `DOKOSOKO_DEV_MEMORY=true` | Uses disposable in-memory state; all data is lost at restart |
| `DOKOSOKO_ALLOW_DEMO_TOKENS=true` | Enables demo bearer tokens only when memory mode is also enabled |
| `DOKOSOKO_ALLOW_INSECURE_HTTP=true` | Permits non-HTTPS public URLs outside localhost; do not use in production |

:::danger
Development switches weaken persistence or transport expectations. Do not enable them in a production deployment.
:::

