---
title: Operate DokoSoko
description: Release, back up, monitor, restore, and respond to incidents in a self-hosted deployment.
---

Rehearse this runbook in a production-shaped staging environment before inviting the first customer.

## Release procedure

1. Build immutable service and crawler images from one reviewed commit. Record image digests and the migration checksum manifest.
2. Run `pnpm run verify`, `go test -race ./...`, `go vet ./...`, dependency audit, and `govulncheck ./...`.
3. Back up PostgreSQL, uploads, deployment configuration, and the exact master key. Verify the dump is readable.
4. Deploy to staging. Startup applies append-only migrations and rejects checksum drift.
5. Require `/healthz` and `/readyz` to return `200`.
6. Run the standalone MCP acceptance client against every enabled surface.
7. Deliver one staging feedback and one error report; verify both reach `delivered` exactly once.
8. Deploy production, repeat read-only checks, and watch the release indicators through one normal traffic window.

Migrations are forward-only. Roll back an application only when the older binary understands the current schema. Otherwise roll forward with a corrective migration or restore the pre-release backup into a new environment.

## Backup and restore

Back up at least daily and before each release:

- PostgreSQL in a restorable format;
- the private upload volume;
- deployment configuration and master-key escrow;
- source commit and deployed image digests.

Test a restore at least quarterly in an isolated environment. Verify readiness, root MFA, credential decryption, one reviewed document query, one safe private tool call, and the MCP acceptance suite. Destroy the drill environment and record failures and follow-up work.

## Monitoring and alerts

Alert on:

- readiness failure, restart loops, panics, sustained `5xx`, and rising latency;
- PostgreSQL exhaustion, slow queries, backup failures, storage growth, and less than 20% free disk;
- crawler or developer-asset ingestion leases beyond their budget;
- quarantine spikes, incomplete coverage, index failure, or stale ready generations;
- forbidden-evidence evaluation failures or high retrieval no-result rates;
- repeated OAuth, access-evaluation, grant, confirmation, or scope denials;
- support records in `failed`, or `queued`/`delivering` beyond 15 minutes;
- unexpected Public MCP enablement or Catalog visibility changes;
- AI schema failures and budget exhaustion.

## Incident basics

- Disable Public MCP first when exposure scope is uncertain.
- Disable or rotate the affected root, OIDC, AI, upstream MCP, runtime, or tool credential at its owning boundary.
- Preserve request IDs, audit records, publication revisions, image digests, and database timestamps.
- Avoid preserving raw tool payloads unless the customer explicitly approves it.
- For suspected master-key compromise, stop writes, preserve evidence, rotate every encrypted downstream credential, and migrate to a new deployment key. Changing only the environment value does not re-encrypt existing secrets.

## Routine checks

- Review System Doctor and readiness.
- Inspect failed or stale ingestion runs and retrieval traces.
- Review API preflight before each publication.
- Re-inspect upstream MCP schemas for drift.
- Review native plugin state and required-plugin startup policy.
- Confirm backup and restore evidence remains current.
