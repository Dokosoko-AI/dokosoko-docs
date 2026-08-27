---
title: Production deployment
description: Deploy DokoSoko behind TLS with durable storage, stable encryption, and operational checks.
---

DokoSoko ships as a Docker Compose stack: the Go service and console, an isolated crawler worker, and PostgreSQL 17 with pgvector.

## Before you deploy

- Choose an HTTPS origin such as `https://dokosoko.example.com`.
- Generate a strong database password and one-time setup token.
- Generate exactly 32 random bytes and encode them with standard base64 for `DOKOSOKO_MASTER_KEY`.
- Prepare persistent storage for PostgreSQL and DokoSoko artifact data.

## Configure the stack

Copy `.env.example` to `.env` in `dokosoko-service` and replace every required value:

```ini
DOKOSOKO_DATABASE_PASSWORD=use-a-long-random-password
DOKOSOKO_MASTER_KEY=standard-base64-for-exactly-32-random-bytes
DOKOSOKO_SETUP_TOKEN=use-a-long-random-one-time-token
DOKOSOKO_PUBLIC_URL=https://dokosoko.example.com
```

`DOKOSOKO_PUBLIC_URL` is a security boundary. It must be the exact external origin, without a path, query, or fragment. HTTPS is required outside localhost.

## Start and verify

```bash
docker compose up --build -d
docker compose ps
curl https://dokosoko.example.com/healthz
curl https://dokosoko.example.com/readyz
```

`/healthz` confirms the process is running. `/readyz` also checks persistence and applied migrations.

## Finish first-run setup

Open the configured origin, enter the one-time setup token, create the first root administrator, and complete TOTP enrollment. Store the one-use recovery codes in a secure password manager, then rotate or remove the setup token from deployment configuration.

## Backups and recovery

Back up PostgreSQL, the DokoSoko artifact volume, and the exact master key as one recovery set. Test a restore before onboarding production credentials.

## Breaking v3 upgrade

Back up PostgreSQL and the encryption key before applying migration `0020_contract_v3.sql`. The migration preserves installations, customer version pins, encrypted support submissions, and their delivery credentials while replacing legacy customer strings with durable customer accounts.

The migration intentionally invalidates outstanding OAuth states, authorization codes, and access tokens. It removes legacy vendor identity configuration because a fixed vendor API origin and stable integration ID cannot be inferred safely, and it disables support delivery until an administrator reviews and re-enables each route. Configure identity again, review or rotate support delivery credentials, re-enable the intended report kinds, and have MCP clients authenticate again.

Legacy package-gateway credentials, stored bytes, proxy behavior, and arbitrary hook configuration are removed because they have no faithful representation in the current contract. The later optional package catalogue is metadata-only. Before recreating bounded exact release metadata and Integration bindings, operators should use a separately operated verifier to check the registry release. That is an operational prerequisite, not evidence stored or a condition enforced by DokoSoko. Registries still deliver bytes; DokoSoko does not download, sign, verify, or proxy packages.

## Production checklist

- TLS is valid at the exact configured public origin.
- Both health endpoints are monitored.
- PostgreSQL and the artifact volume are durable and backed up together.
- The master key is stored in a secrets manager and recovery is tested.
- Root administrators use individual accounts and TOTP.
- Public MCP remains off unless anonymous access is intentionally required.
- System Doctor passes after identity and any required provider connections are configured.
