---
title: Troubleshooting
description: Diagnose startup, readiness, ingestion, retrieval, OAuth, publication, tool, plugin, and MCP failures.
---

Start with `/readyz`, then open **Settings → Overview → Run System Doctor** as a root administrator. Correlate failures with request IDs, immutable revision IDs, ingestion stages, and audit records without inspecting secret payloads.

## Service does not start

- Before initial setup, confirm `DOKOSOKO_SETUP_TOKEN` is configured with a strong, non-empty value. It can and should be removed after setup completes.
- Decode `DOKOSOKO_MASTER_KEY` and verify it is exactly 32 bytes.
- Verify `DOKOSOKO_PUBLIC_URL` is an absolute origin without a path, query, or fragment.
- Use HTTPS outside explicit local development.
- Confirm PostgreSQL with pgvector is reachable and migration checksums match.
- If native plugins are required, confirm every ID is registered, configured, active, and not environment-disabled.

## Readiness fails

Check database connectivity, migration checksum errors, required plugin state, and persistent-volume permissions. `/healthz` can succeed while the service remains unready, so do not route production traffic on liveness alone.

## Ingestion is quarantined or incomplete

Open the exact run and review its terminal stage, URL or path findings, redirect and DNS results, file classification, prompt-injection and secret findings, page/byte budget, and partial coverage. Fix the source or configuration and create a new run. Never publish a quarantined candidate to restore freshness.

## Query Lab returns poor or no evidence

Confirm the intended global or API publication is active and indexed with the current builder and retrieval-profile versions. Inspect exact scope, selectors, asset kind, SDK version, Map routing, exclusions, and citations. Content attached only to another API is correctly excluded.

Repair the source, review decision, set selector, exact binding, or index generation. Do not compensate with an ungrounded advisory answer.

## API publication is denied

Run preflight and resolve every required resource, SDK release, authorization point, tool revision, runtime connection, and visibility gate. Archived or yanked SDKs, retired tools, drifted upstream schemas, stale revisions, missing credentials, and unacknowledged public visibility all block publication.

## OAuth callback or token exchange fails

- Match the vendor OIDC callback exactly at `/oauth/callback`.
- Match the MCP client redirect URI and PKCE verifier to the original request.
- Verify issuer discovery, signing keys, nonce, clock skew, and code expiry.
- Confirm the customer claim is present and stable.
- Inspect the fixed `/v1/access/evaluations` request, token audience/resource, grants, and expiry.
- Confirm the exact OIDC draft revision passed a real test sign-in before activation.

## A tool is missing or denied

Confirm the API and exact tool revision are published and bound, the customer account is active, and every grant is registered and present. Then check schema, authorization point, confirmation, idempotency, fixed destination, credential version, timeout, and output validation.

For an upstream MCP tool, re-inspect the connection for schema drift. For a native tool, confirm the deployed plugin and tool hashes match the published revision exactly.

## Public MCP returns no resources

Check every gate: immutable publication, explicit public visibility, public API snapshot where applicable, and the deployment-wide Public MCP switch. Tools, support reports, customer data, credentials, drafts, and private assets never appear there.

## Recovering from a lost secret

The original bootstrap setup token is not needed after an MFA-protected root
administrator exists. Remove it from the deployment; DokoSoko verifies the
persisted setup state at restart. Losing the master key makes encrypted
credentials unrecoverable; restore the exact key from escrow or replace every
affected credential. Treat PostgreSQL, uploads, configuration, and master-key
recovery as one tested procedure.
