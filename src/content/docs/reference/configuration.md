---
title: Configuration
description: Configure DokoSoko from one versioned file, mounted secrets, and explicit environment overrides.
---

## Central configuration

DokoSoko supports a strict, versioned JSON file shared by the service and the
crawler. Start from `dokosoko.config.example.json` and set
`DOKOSOKO_CONFIG_FILE` to the file's path in each process or container.

Precedence is deterministic:

1. Built-in defaults.
2. The central configuration file.
3. Non-empty environment variables.

Unknown fields, unsupported versions, invalid values, and ambiguous secret
sources stop startup. Relative paths in the central file resolve from the
configuration file's directory. Relative paths in environment variables
resolve from the process working directory. Changes take effect after the
service or crawler restarts.

Open **Settings → Configuration** to inspect the effective value and source for
each startup key. The endpoint and console are root-authenticated, return
`Cache-Control: no-store`, and never return secret values.

The service distribution includes `dokosoko.config.schema.json` for editor and
CI validation. Runtime decoding remains authoritative and rejects unknown
fields even when a separate schema check is skipped.

## Managed tenant profile and initial workspace

Use `control_plane` for stable deployment identity and the environments that
must exist:

```json
{
  "$schema": "./dokosoko.config.schema.json",
  "version": 1,
  "control_plane": {
    "organisation": {
      "name": "Example Organisation",
      "slug": "example-organisation"
    },
    "deployment": {
      "name": "Example Developer Platform",
      "slug": "example-developer-platform",
      "description": "Trusted API knowledge and tools.",
      "feedback_submission_url": "https://support.example.com/feedback",
      "error_submission_url": "https://support.example.com/errors"
    },
    "environments": [
      { "name": "Production", "slug": "production", "is_production": true },
      { "name": "Staging", "slug": "staging", "is_production": false }
    ]
  }
}
```

On an empty database, all organisation and deployment names and slugs plus at
least one environment are required. DokoSoko creates the initial workspace
before the root administrator completes setup. On an existing database,
configured organisation values must match its immutable identity. Configured
deployment values are reconciled on every service start.

Configured tenant fields are returned in `managed_fields`, displayed read-only
under **Settings → Tenant settings**, and protected from conflicting API writes
with a `409 configuration_managed` response. Environment reconciliation is
additive: missing entries are created, matching entries must retain the same
name and production role, and extra database environments are never renamed or
deleted.

Environment variables can override the organisation and deployment fields:

| Variable | Field |
| --- | --- |
| `DOKOSOKO_ORGANISATION_NAME` | Organisation name |
| `DOKOSOKO_ORGANISATION_SLUG` | Organisation slug |
| `DOKOSOKO_DEPLOYMENT_NAME` | Deployment name |
| `DOKOSOKO_DEPLOYMENT_SLUG` | Deployment slug |
| `DOKOSOKO_DEPLOYMENT_DESCRIPTION` | Deployment description |
| `DOKOSOKO_DEPLOYMENT_FEEDBACK_SUBMISSION_URL` | Feedback destination |
| `DOKOSOKO_DEPLOYMENT_ERROR_SUBMISSION_URL` | Error-report destination |

The environment list is file-only so it remains structured and reviewable.
Removing a managed deployment field from configuration returns that field to
console/API ownership after restart; it does not erase the stored value.

Do not place integrations, sources, reviewed publications, tools, recipes,
identity-provider activation, root accounts, or public MCP publication in
central configuration. Those objects have revision, review, credential-test,
publication, or MFA lifecycles and remain database-backed console/API
workflows.

## Secret references

Secrets are not accepted as plaintext central-file values. Reference exactly
one environment variable or mounted file:

```json
{
  "version": 1,
  "database": { "url": { "env": "DOKOSOKO_DATABASE_URL" } },
  "security": {
    "master_key": { "file": "/run/secrets/dokosoko_master_key" },
    "setup_token": { "env": "DOKOSOKO_SETUP_TOKEN" }
  }
}
```

The direct environment variables also have mounted-file alternatives:
`DOKOSOKO_DATABASE_URL_FILE`, `DOKOSOKO_MASTER_KEY_FILE`,
`DOKOSOKO_SETUP_TOKEN_FILE`, and `DOKOSOKO_AI_API_KEY_FILE`. Do not set a
direct variable and its `_FILE` form together.

## Required Compose variables

| Variable | Purpose |
| --- | --- |
| `DOKOSOKO_DATABASE_PASSWORD` | PostgreSQL password interpolated by Compose |
| `DOKOSOKO_MASTER_KEY` | Standard-base64 encoding of exactly 32 random bytes, unless `security.master_key` references a mounted secret file |
| `DOKOSOKO_SETUP_TOKEN` | Strong bootstrap secret for creating the first root administrator; required only until setup completes |
| `DOKOSOKO_PUBLIC_URL` | Exact browser-reachable origin; HTTPS outside localhost |

Keep the master key stable and in disaster-recovery escrow. Losing it makes encrypted credentials unrecoverable. Remove the setup token after the first MFA-protected root account is created. The service checks persisted setup state before deciding whether the token is required.

## Service variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_LISTEN` | `:8080` | HTTP listen address |
| `DOKOSOKO_CONFIG_FILE` | unset | Strict version-1 JSON configuration shared with the crawler |
| `DOKOSOKO_DATABASE_URL` | — | PostgreSQL connection string; required outside memory development |
| `DOKOSOKO_MASTER_KEY` | — | Required base64-encoded 32-byte encryption key |
| `DOKOSOKO_SETUP_TOKEN` | — | Strong bootstrap token required until initial setup completes |
| `DOKOSOKO_PUBLIC_URL` | `http://localhost:8080` | Exact origin with no path, query, or fragment |
| `DOKOSOKO_UI_DIR` | `./dist/client` | Static console build directory |
| `DOKOSOKO_MIGRATIONS_DIR` | `./migrations` | Append-only checksummed migrations |
| `DOKOSOKO_UPLOAD_DIR` | unset | Dedicated real directory for source uploads; Compose uses `/uploads` |
| `DOKOSOKO_UPLOAD_MAX_BYTES` | `5000000` | Maximum accepted upload size |
| `DOKOSOKO_TOOL_LOCALHOST_HOSTS` | empty | Exact comma-separated local `host:port` development destinations |
| `DOKOSOKO_ORGANISATION_NAME` | unset | Optional centrally managed organisation name |
| `DOKOSOKO_ORGANISATION_SLUG` | unset | Optional centrally managed organisation slug |
| `DOKOSOKO_DEPLOYMENT_NAME` | unset | Optional centrally managed deployment name |
| `DOKOSOKO_DEPLOYMENT_SLUG` | unset | Optional centrally managed deployment slug |
| `DOKOSOKO_DEPLOYMENT_DESCRIPTION` | unset | Optional centrally managed deployment description |
| `DOKOSOKO_DEPLOYMENT_FEEDBACK_SUBMISSION_URL` | unset | Optional centrally managed feedback destination |
| `DOKOSOKO_DEPLOYMENT_ERROR_SUBMISSION_URL` | unset | Optional centrally managed error-report destination |

## Crawler variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DOKOSOKO_DATABASE_URL` | — | Same PostgreSQL database as the service |
| `DOKOSOKO_DATA_DIR` | `/data` | Private crawler working data directory |
| `DOKOSOKO_UPLOAD_DIR` | unset | Read-only shared upload directory; Compose uses `/uploads` |
| `DOKOSOKO_CRAWLER_UPLOAD_DIR` | unset | Crawler-specific upload override; otherwise uses `DOKOSOKO_UPLOAD_DIR` |
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

## Deployment-managed AI

AI can be declared in the central file or environment. While present, that
provider is deployment-managed and read-only in the console. Removing the
declaration on a later restart disables the managed connection and workload;
an administrator can then provide a new credential to transfer ownership to
the console.

```json
{
  "version": 1,
  "ai": {
    "provider": "openai",
    "api_key": { "file": "/run/secrets/openai_api_key" },
    "analysis": {
      "model": "gpt-5.6-terra",
      "max_input_tokens": 128000,
      "max_output_tokens": 4096,
      "daily_token_budget": 0
    }
  }
}
```

Environment overrides remain available:

| Variable | Notes |
| --- | --- |
| `DOKOSOKO_AI_PROVIDER` | `openai`, `google`, `anthropic`, `digitalocean`, `xai`, or `deepseek` |
| `DOKOSOKO_AI_API_KEY` | Provider secret |
| `DOKOSOKO_AI_ENDPOINT` | Optional fixed compatible endpoint |
| `DOKOSOKO_AI_MODEL_ANALYSIS` | Model used for the Analysis workload |
| `DOKOSOKO_AI_MAX_INPUT_TOKENS` | Optional Analysis input-token limit |
| `DOKOSOKO_AI_MAX_OUTPUT_TOKENS` | Optional Analysis output-token limit |
| `DOKOSOKO_AI_DAILY_TOKEN_BUDGET` | Optional Analysis daily token budget; `0` disables the cap |

Restarting with deployment-managed AI no longer resets limits omitted from the
deployment configuration. Provider credentials and backup behavior remain
explicit. Invalid configuration, unsafe input, exhausted budgets, or invalid
output do not trigger silent failover.

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
