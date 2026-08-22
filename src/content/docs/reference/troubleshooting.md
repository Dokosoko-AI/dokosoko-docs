---
title: Troubleshooting
description: Diagnose startup, readiness, crawling, OAuth, tool, and Public MCP failures.
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

- Match the vendor IdP callback exactly: `/oauth/callback`.
- Match the client redirect URI to the exact URI in its HTTPS client metadata document.
- Confirm the PKCE verifier belongs to the original challenge.
- Check issuer and signing-key validation, clock skew, and code expiry.
- Inspect `POST /v1/access/evaluations`, its audience-bound vendor token, response expiry, and deny responses.

## A custom tool is missing or denied

Confirm the tool is published, the customer account and installation are active, and the caller has every required grant. Validate the input schema, confirmation requirement, fixed vendor-origin destination, delegated token, response schema, and timeout. Any failed check denies the operation.

## Public MCP returns no resources

All three gates must be open:

1. Public MCP is enabled for the product.
2. The source is published.
3. The resource visibility is explicitly public.

Custom tools, projects, credentials, and private resources never appear on Public MCP.

## Recovering from lost secrets

If only the setup token is lost after setup, root administrators can continue operating normally. If the master key is lost, encrypted integration credentials cannot be recovered; restore the key from secret backup or replace every affected credential. Treat database, artifact, and master-key recovery as one tested procedure.
