---
title: Troubleshooting
description: Diagnose startup, readiness, crawling, OAuth, package, tool, and Public MCP failures.
---

Start with `/readyz`, then run **System Doctor** as a root administrator. Use the product’s integration runs and organisation audit feed to correlate failures without inspecting secret payloads.

## Service does not start

- Confirm `DOKOSOKO_SETUP_TOKEN` is a strong non-empty value.
- Decode `DOKOSOKO_MASTER_KEY` and confirm it is exactly 32 bytes.
- Verify `DOKOSOKO_PUBLIC_URL` is an absolute origin with no path, query, or fragment.
- Outside localhost, use HTTPS unless you are in explicitly disposable development.
- Confirm PostgreSQL is reachable and pgvector migrations can run.

## Readiness fails

Check database connectivity, migration checksum errors, and persistent-volume permissions. A healthy process can still be unready, so do not route traffic based on `/healthz` alone.

## A crawl is quarantined or incomplete

Review the crawl’s page and byte budget, redirect findings, private-address resolution, and prompt-injection findings. Update the source or budget and create a new snapshot. Do not publish a quarantined run merely to restore freshness; the previous published snapshot remains safe to serve.

## OAuth callback or token exchange fails

- Match the vendor IdP callback exactly: `/oauth/callback/PRODUCT_ID`.
- Match the client redirect URI to an exact product allowlist entry.
- Confirm the PKCE verifier belongs to the original challenge.
- Check issuer and signing-key validation, clock skew, and code expiry.
- Inspect entitlement-hook availability and deny responses.

## A package download fails

Check fixed origin resolution, redirect policy, upstream authentication, size limits, and configured SHA-256 and byte-size metadata. Fetch-mode URLs must be short-lived and still pass destination validation.

## A custom tool is missing or denied

Confirm the tool is published, the caller has every required entitlement, and the operation-authorization hook allows the request. Validate the input schema, confirmation requirement, hook TLS, response schema, and timeout. Hook failures deny the operation by design.

## Public MCP returns no resources

All three gates must be open:

1. Public MCP is enabled for the product.
2. The source or package is published.
3. The resource visibility is explicitly public.

Custom tools, projects, credentials, and private resources never appear on Public MCP.

## Recovering from lost secrets

If only the setup token is lost after setup, root administrators can continue operating normally. If the master key is lost, encrypted integration credentials cannot be recovered; restore the key from secret backup or replace every affected credential. Treat database, artifact, and master-key recovery as one tested procedure.

