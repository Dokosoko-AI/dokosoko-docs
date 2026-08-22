---
title: Control Plane API
description: Use DokoSoko’s administration, OAuth, MCP, and widget protocol surfaces.
---

The canonical control-plane contract is available in the [read-only interactive API explorer](/api/control-plane/) or as [OpenAPI YAML](/openapi.yaml). It defines administrative requests and responses, OAuth token exchange, MCP JSON-RPC envelopes, widget administration, and structured errors returned by DokoSoko.

The browser-facing widget data plane has its own smaller [Widget Runtime API contract](/reference/widget-runtime-api/) ([interactive explorer](/api/widget-runtime/), [OpenAPI YAML](/widget-runtime-openapi.yaml)). Keeping it separate prevents root-administration concepts and credentials from leaking into the customer integration surface.

Vendor-owned integrations use two separate contracts:

- [Access Provider API contract](/reference/provider-api/) for provider-owned instances and short-lived credentials ([interactive explorer](/api/provider/), [OpenAPI YAML](/provider-openapi.yaml)).
- [Customer Identity Integration API](/reference/vendor-integration-api/#customer-access-evaluation) for delegated access evaluation ([interactive explorer](/api/identity-integration/), [OpenAPI YAML](/identity-integration-openapi.yaml)).
- [Backend Integration API](/reference/vendor-integration-api/#backend-support-delivery) for service-authenticated support delivery ([interactive explorer](/api/backend-integration/), [OpenAPI YAML](/backend-integration-openapi.yaml)).

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
| OAuth metadata | `GET /.well-known/oauth-authorization-server`, `GET /.well-known/oauth-protected-resource/mcp` | None |
| OAuth broker | `GET /oauth/authorize`, `GET /oauth/callback`, `POST /oauth/token` | OAuth authorization code + PKCE |
| Private MCP | `POST /mcp` | Resource-bound DokoSoko bearer token |
| Public MCP | `POST /mcp/public` | Anonymous; deployment must enable Public MCP |
| Widget administration | `/api/v1/widgets/...` | Root session + CSRF protection for mutations |
| Widget bootstrap | `POST /v1/widget-sessions` | Server-only widget secret |
| Widget session | `POST /v1/widget-sessions/exchange`, `GET /v1/widget-session` | Single-use bootstrap, then short-lived widget bearer |
| Widget chat | `POST /v1/widget-chat` | Short-lived widget bearer; streamed SSE response |

## Administrative resources

The `/api/v1` contract covers:

- root-user setup, MFA sessions, and System Doctor;
- organisations, products, environments, and audit events;
- immutable product versions, generated diffs and hashes, release impact, artifact reconciliation, promotion approval, installations, scoped pins, and pin history;
- source crawl, review, publication, and visibility;
- custom tools, customer identity, access-provider connections, and LLM profiles;
- managed third-party MCP connections, complete catalog inspection, explicit tool import, and schema-drift reporting;
- encrypted bug-report and feedback holding, delivery configuration, submission inspection, and retry;
- projects, credential leases, integration runs, analytics, widgets, and distribution.

Use the web console for interactive administration. For automation, preserve the API’s optimistic state and validation semantics and never log response fields that may contain a one-time credential.

## Request requirements

Cookie-authenticated mutations require all of the following:

1. The `dokosoko_session` secure session cookie.
2. The `dokosoko_csrf` cookie value copied into `X-CSRF-Token`.
3. An exact `Origin` matching `DOKOSOKO_PUBLIC_URL`.

The setup endpoint uses the one-time deployment bearer token. Private MCP uses a short-lived DokoSoko bearer token bound to the exact `/mcp` resource. Compatible clients may use a Client ID Metadata Document or idempotent RFC 7591 registration at `/oauth/register`; registered clients are public PKCE clients and receive no secret. Public MCP and the two `/agent-setup/{kind}/prompt.md` instruction resources never accept credentials.

Widgets do not use the MCP OAuth broker. A customer backend authenticates its own user and exchanges a widget-scoped server secret for a single-use bootstrap. The hosted iframe exchanges that bootstrap for a short-lived session bound to the exact application origin.

Both MCP endpoints are **[Stateless MCPv2 Only](https://blog.modelcontextprotocol.io/posts/2026-07-28/)**. Each request must set `MCP-Protocol-Version: 2026-07-28`, set `Mcp-Method` to the JSON-RPC method, set `Mcp-Name` for `tools/call`, and declare the same protocol revision in `params._meta`. Supported methods are `server/discover`, `tools/list`, and `tools/call`.

## Schema coverage

The contract includes reusable definitions for organisations, deployments, integrations, immutable product versions, diffs, drift findings, customer accounts, installations, scoped pin history, environments, sources, crawl jobs, custom tools, vendor identity, access providers, instances, credentials, LLM profiles, integration runs, support submissions, analytics, audit events, OAuth records, and JSON-RPC envelopes.

## Error handling

Clients should handle authentication failure, authorization denial, conflict or invalid state transition, validation failure, upstream unavailability, and bounded timeout separately. Retrying a mutation is safe only when the operation defines idempotency; Provider API mutations require a stable idempotency key.
