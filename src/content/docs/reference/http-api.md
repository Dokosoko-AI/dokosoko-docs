---
title: Control Plane API
description: Reference DokoSoko’s v4 administration, Catalog, OAuth, MCP, developer-asset, and operational contract.
---

The canonical v4 contract is available in the [read-only interactive explorer](/api/control-plane/) and as [OpenAPI YAML](/openapi.yaml).

The only separate vendor-owned contract is the optional [Customer Identity Integration API](/reference/vendor-integration-api/) used during Private MCP authorization.

:::caution
The interactive explorers disable request execution and authentication input. Use them for operations, schemas, and examples—not as live clients.
:::

## Protocol surfaces

| Surface | Paths | Authentication |
| --- | --- | --- |
| Health | `GET /healthz`, `GET /readyz` | None |
| Setup and root sessions | `/api/v1/setup/...`, `/api/v1/auth/...`, `/api/v1/root/users/...` | Setup token or MFA-protected root session |
| Administration | `/api/v1/...` | Root session; CSRF and exact-origin checks for browser mutations |
| OAuth metadata | `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource/mcp` | None |
| OAuth broker | `/oauth/register`, `/oauth/authorize`, `/oauth/callback`, `/oauth/token` | Public PKCE client and vendor OIDC sign-in |
| Private MCP | `POST /mcp` | Resource-bound DokoSoko bearer token |
| Public MCP | `POST /mcp/public` | Anonymous; deployment switch and visibility gates apply |
| Agent setup | `/agent-setup/private/prompt.md`, `/agent-setup/public/prompt.md` | None |

## Administrative groups

The `/api/v1` contract covers:

- deployment, organisations, API catalog, environments, root users, and System Doctor;
- exact API resource bindings, preflight, publication, runtime service connections, and credential rotation;
- grant definitions, authorization points, resource sets, and tool bindings;
- source acquisition, review, publication, and visibility;
- HTTP Tool Builder, deterministic and controlled live testing, publication, and retirement;
- upstream MCP connections, catalog inspection, local imports, and schema drift;
- OIDC configuration, test sign-in, activation, and customer accounts;
- native plugin status and deployment-owned enablement;
- recipes, evidence analysis, configurable AI workloads, prompts, budgets, and usage;
- support outbox listing and exact report inspection;
- normalized documentation, reusable documentation sets, and global publications;
- API-contract roots, sources, candidates, validation, and immutable revisions;
- SDK packages, exact releases, lifecycle events, content review, and publications;
- Query Lab, bounded retrieval traces, and developer-asset advisory runs.

## Browser mutation requirements

Cookie-authenticated mutations require:

1. the secure DokoSoko session cookie;
2. the CSRF cookie value copied into `X-CSRF-Token`;
3. an exact `Origin` matching `DOKOSOKO_PUBLIC_URL`.

Use the API’s optimistic revision fields when updating mutable roots or drafts. A stale revision returns a conflict rather than overwriting newer state.

## Immutability and secrets

Published APIs, developer-asset revisions, recipes, and tool revisions are immutable. Changes create or select a new exact revision and then publish a new API snapshot.

Credential fields are `writeOnly`. Response models expose only safe presence, fingerprint, version, expiry, and state metadata. Never log a request merely because the OpenAPI schema accepts a secret field.

## MCP requests

Both MCP endpoints use the service’s fixed Stateless MCPv2 protocol revision `2026-07-28`. Requests are self-contained JSON-RPC HTTP calls and must carry the matching protocol and method metadata. Supported discovery and runtime methods include server discovery, resource and resource-template listing, resource reads, tool listing, and tool calls where allowed by the selected surface.

## Error handling

Handle authentication failure, authorization denial, invalid state, optimistic conflict, validation failure, rate limiting, unavailable dependency, and bounded timeout separately. Retry a mutation only when its operation defines idempotency and preserve the exact logical idempotency key across retries.
