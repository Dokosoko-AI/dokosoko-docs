---
title: Configuration
description: Reference the DokoSoko service, database, crawler, plugin, AI, and development environment variables.
---

## Required Compose variables

| Variable | Purpose |
| --- | --- |
| `DOKOSOKO_DATABASE_PASSWORD` | PostgreSQL password interpolated by Compose |
| `DOKOSOKO_MASTER_KEY` | Standard-base64 encoding of exactly 32 random bytes |
| `DOKOSOKO_SETUP_TOKEN` | Strong one-time secret for creating the first root administrator |
| `DOKOSOKO_PUBLIC_URL` | Exact browser-reachable origin; HTTPS outside localhost |

Keep the master key stable and in disaster-recovery escrow. Losing it makes encrypted credentials unrecoverable. Rotate or remove the setup token after initial setup.

## Service variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_LISTEN` | `:8080` | HTTP listen address |
| `DOKOSOKO_DATABASE_URL` | — | PostgreSQL connection string; required outside memory development |
| `DOKOSOKO_MASTER_KEY` | — | Required base64-encoded 32-byte encryption key |
| `DOKOSOKO_SETUP_TOKEN` | — | Required strong first-run token |
| `DOKOSOKO_PUBLIC_URL` | `http://localhost:8080` | Exact origin with no path, query, or fragment |
| `DOKOSOKO_UI_DIR` | `./dist/client` | Static console build directory |
| `DOKOSOKO_MIGRATIONS_DIR` | `./migrations` | Append-only checksummed migrations |
| `DOKOSOKO_UPLOAD_DIR` | unset | Dedicated real directory for source uploads; Compose uses `/uploads` |
| `DOKOSOKO_UPLOAD_MAX_BYTES` | `5000000` | Maximum accepted upload size |
| `DOKOSOKO_TOOL_LOCALHOST_HOSTS` | empty | Exact comma-separated local `host:port` development destinations |

## Crawler variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_DATABASE_URL` | — | Same PostgreSQL database as the service |
| `DOKOSOKO_DATA_DIR` | `/data` | Private crawler working data directory |
| `DOKOSOKO_UPLOAD_DIR` | unset | Read-only shared upload directory; Compose uses `/uploads` |
| `DOKOSOKO_CRAWLER_MAX_PAGES` | `500` | Maximum pages in one website run |
| `DOKOSOKO_CRAWLER_MAX_BYTES` | `5000000` | Maximum acquired bytes in one run |
| `DOKOSOKO_CRAWLER_WORKER_ID` | generated | Stable lease-owner label when explicitly set |
| `DOKOSOKO_CRAWLER_ALLOW_LOCALHOST_SUBDOMAINS` | `false` | Development-only local target switch |
| `DOKOSOKO_CRAWLER_LOCALHOST_HOST` | — | Local hostname mapped by Compose |
| `DOKOSOKO_CRAWLER_LOCALHOST_PORTS` | `80,443` | Exact allowed local crawler ports |

Keep local-target switches disabled in production.

## Native plugin variables

| Variable | Effect |
| --- | --- |
| `DOKOSOKO_NATIVE_PLUGINS_REQUIRED` | Comma-separated plugin IDs that must be registered and active at startup |
| `DOKOSOKO_NATIVE_PLUGINS_DISABLED` | Comma-separated deployment kill switch |
| `DOKOSOKO_PLUGIN_<PLUGIN_ID>_<KEY>` | Value for one manifest-declared plugin key |

Plugin IDs and keys are canonicalized to upper-case environment segments. A required plugin cannot also be environment-disabled.

## Environment-managed AI

The console can configure the same provider settings. Environment values are useful for deployment-owned configuration:

| Variable | Notes |
| --- | --- |
| `DOKOSOKO_AI_PROVIDER` | `openai`, `google`, `anthropic`, `digitalocean`, `xai`, or `deepseek` |
| `DOKOSOKO_AI_API_KEY` | Provider secret |
| `DOKOSOKO_AI_ENDPOINT` | Optional fixed compatible endpoint |
| `DOKOSOKO_AI_MODEL_ANALYSIS` | Model used for the Analysis workload |

Provider credentials and the configured backup behavior remain explicit. Invalid configuration, unsafe input, exhausted budgets, or invalid output do not trigger silent failover.

## Development-only switches

| Variable | Effect |
| --- | --- |
| `DOKOSOKO_DEV_MEMORY=true` | Uses disposable in-memory state |
| `DOKOSOKO_ALLOW_DEMO_TOKENS=true` | Enables demo bearer tokens only with memory mode |
| `DOKOSOKO_ALLOW_INSECURE_HTTP=true` | Permits a non-HTTPS public origin outside localhost |
| `DOKOSOKO_DEV_PROXY` | Console development proxy, normally `http://127.0.0.1:8080` |

:::danger
Do not use memory mode, demo tokens, local-target allowances, or insecure public HTTP in production.
:::
