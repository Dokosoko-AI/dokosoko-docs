---
title: Control Plane API
description: Use DokoSoko’s administration, OAuth, MCP, artifact, and widget protocol surfaces.
---

The canonical control-plane contract is available in the [read-only interactive API explorer](/api/control-plane/) or as [OpenAPI YAML](/openapi.yaml). It defines every administrative request and response, OAuth token exchange, MCP JSON-RPC envelope, artifact stream, widget loader, and structured error returned by DokoSoko.

Vendor-owned integrations use two separate contracts:

- [Provider API contract](/reference/provider-api/) for projects and short-lived credentials ([interactive explorer](/api/provider/), [OpenAPI YAML](/provider-openapi.yaml)).
- [Vendor hook contracts](/reference/vendor-hooks/) for entitlements, per-tool authorization, and fetch-mode packages ([interactive explorer](/api/vendor-hooks/), [OpenAPI YAML](/hooks-openapi.yaml)).

:::note
Generate clients and validation tests from the OpenAPI contracts rather than from examples in these guides. Secret input fields are marked `writeOnly`, and redacted response models intentionally omit their stored credential identifiers.
:::

:::caution
The interactive explorers intentionally disable request execution and authentication input. They are safe places to inspect operations, schemas, and generated request examples—not live API clients.
:::

## Protocol surfaces

| Surface | Methods and paths | Authentication |
| --- | --- | --- |
| Health | `GET /healthz`, `GET /readyz` | None |
| Setup and root auth | `/api/v1/setup/...`, `/api/v1/auth/...` | Setup token or secure root session, depending on operation |
| Administration | `/api/v1/...` | Root session + CSRF protection for mutations |
| Managed MCP imports | `/api/v1/products/{product_id}/mcp-connections/...` | Root session + CSRF protection |
| OAuth broker | `GET /oauth/authorize`, `GET /oauth/callback/{product_id}`, `POST /oauth/token` | OAuth authorization code + PKCE |
| Private MCP | `POST /mcp/{product_id}` | Product-bound DokoSoko bearer token |
| Public MCP | `POST /mcp/public/{product_id}` | Anonymous; product must enable Public MCP |
| Packages | `GET /artifacts/{product_id}/{package_id}` | Runtime package authorization |
| Widgets | `GET /widgets/{product_id}/{asset}` | Public or private loader behavior |

## Administrative resources

The `/api/v1` contract covers:

- root-user setup, MFA sessions, and System Doctor;
- organisations, products, environments, and audit events;
- source crawl, review, publication, and visibility;
- packages, custom tools, identity, provider connections, and LLM profiles;
- managed third-party MCP connections, complete catalog inspection, explicit tool import, and schema-drift reporting;
- projects, credential leases, integration runs, analytics, widgets, and distribution.

Use the web console for interactive administration. For automation, preserve the API’s optimistic state and validation semantics and never log response fields that may contain a one-time credential.

## Request requirements

Cookie-authenticated mutations require all of the following:

1. The `dokosoko_session` secure session cookie.
2. The `dokosoko_csrf` cookie value copied into `X-CSRF-Token`.
3. An exact `Origin` matching `DOKOSOKO_PUBLIC_URL`.

The setup endpoint uses the one-time deployment bearer token. Private MCP uses a short-lived, product-bound DokoSoko OAuth bearer token. Public MCP and public widgets do not accept credentials.

Both MCP endpoints are **[Stateless MCPv2 Only](https://blog.modelcontextprotocol.io/posts/2026-07-28/)**. Each request must set `MCP-Protocol-Version: 2026-07-28`, set `Mcp-Method` to the JSON-RPC method, set `Mcp-Name` for `tools/call`, and declare the same protocol revision in `params._meta`. Supported methods are `server/discover`, `tools/list`, and `tools/call`.

## Schema coverage

The contract includes reusable definitions for organisations, products, environments, sources, crawl jobs, packages, custom tools, vendor identity, providers, projects, credential leases, LLM profiles, integration runs, analytics, audit events, OAuth tokens, JSON-RPC success and error envelopes, and binary downloads.

## Error handling

Clients should handle authentication failure, authorization denial, conflict or invalid state transition, validation failure, upstream unavailability, and bounded timeout separately. Retrying a mutation is safe only when the operation defines idempotency; Provider API mutations require a stable idempotency key.
