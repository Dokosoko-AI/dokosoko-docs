---
title: Production deployment
description: Deploy DokoSoko behind TLS with durable PostgreSQL, private uploads, stable encryption, and production checks.
---

DokoSoko ships as a Compose stack containing the service and console, an isolated crawler, and PostgreSQL 17 with pgvector.

## Before you deploy

- Choose one exact external HTTPS origin, such as `https://dokosoko.example.com`.
- Generate independent high-entropy database, setup-token, and 32-byte master-key secrets.
- Prepare durable PostgreSQL storage and a private upload volume.
- Restrict outbound traffic to the API, identity, AI, crawler, upstream MCP, and support destinations you intend to use.

## Configure the stack

Copy `.env.example` to `.env` in `dokosoko-service` and replace every required
value. The direct master-key variable may be omitted only when
`security.master_key` in the mounted central file references a protected secret
file:

```ini
DOKOSOKO_DATABASE_PASSWORD=use-a-long-random-password
DOKOSOKO_MASTER_KEY=standard-base64-for-exactly-32-random-bytes
DOKOSOKO_SETUP_TOKEN=use-a-long-random-bootstrap-token
DOKOSOKO_PUBLIC_URL=https://dokosoko.example.com
```

`DOKOSOKO_PUBLIC_URL` is a security boundary. It must be the exact browser-reachable origin without a path, query, or fragment. Terminate TLS at a trusted reverse proxy and forward the original scheme and host only from that proxy.

For centrally managed startup and tenant settings, copy
`dokosoko.config.example.json`, edit its `control_plane` values, mount the same
read-only file into the service and crawler, and set its in-container path:

```ini
DOKOSOKO_CONFIG_FILE=/etc/dokosoko/dokosoko.config.json
```

```yaml
# compose.config.yaml
services:
  dokosoko:
    volumes:
      - ./dokosoko.config.json:/etc/dokosoko/dokosoko.config.json:ro
  crawler:
    volumes:
      - ./dokosoko.config.json:/etc/dokosoko/dokosoko.config.json:ro
```

Start with `docker compose -f compose.yaml -f compose.config.yaml up --build -d`.
Commit non-secret configuration through your normal review workflow; reference
secrets by environment variable or mounted file.

## Start and verify

```bash
docker compose up --build -d
docker compose ps
curl https://dokosoko.example.com/healthz
curl https://dokosoko.example.com/readyz
```

`/healthz` confirms the process is running. `/readyz` also checks persistence and migrations.

Open the configured origin, create the first root administrator, complete TOTP
enrolment, and store the recovery codes. If `control_plane` did not provision an
initial workspace, create the organisation, deployment, and first production
environment in the console. After bootstrap, remove `DOKOSOKO_SETUP_TOKEN` from
the deployment; persisted setup state keeps the bootstrap token path disabled
on later restarts.

## Backups and recovery

Back up these items before every release and at least daily:

- a PostgreSQL custom-format dump, including migration state;
- the upload volume;
- deployment configuration and the exact master key;
- deployed image digests and source commit.

Test a restore at least quarterly. Require readiness, root MFA login, credential decryption, one reviewed document query, one safe Private MCP tool call, and the acceptance suite to pass. A backup is not valid until the drill succeeds.

## Production checklist

- TLS is valid at the exact configured public origin.
- PostgreSQL uses durable storage and pgvector; memory mode is disabled.
- The upload volume and database are private.
- The exact master key is escrowed in the protected recovery system.
- `/healthz`, `/readyz`, support-outbox state, crawler leases, database health, and disk space are monitored.
- Public MCP remains disabled unless anonymous publication is intentional.
- Root-level feedback and error destinations are configured before their tools are advertised.
- The standalone MCP acceptance client passes against every enabled surface.

See [Operate DokoSoko](/guides/operations/) for the release, restore, alerting, and incident runbook.
