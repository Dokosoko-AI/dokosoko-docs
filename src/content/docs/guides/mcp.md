---
title: Connect MCP clients
description: Connect authenticated or anonymous agents to DokoSoko’s Private and Public MCP endpoints.
---

DokoSoko exposes one authenticated Private MCP endpoint and an optional anonymous Public MCP endpoint.

| Surface | Endpoint | Content |
| --- | --- | --- |
| Private MCP | `POST /mcp` | Customer-authorized published resources, recipes, and tools |
| Public MCP | `POST /mcp/public` | Explicitly public, published, read-only resources only |

## Private MCP

Private MCP uses DokoSoko’s OAuth authorization server. Compatible clients discover:

- `/.well-known/oauth-protected-resource/mcp`;
- `/.well-known/oauth-authorization-server`;
- `/oauth/authorize`, `/oauth/callback`, and `/oauth/token`.

The flow requires authorization code, PKCE S256, and RFC 8707 resource binding to the exact `/mcp` resource. DokoSoko brokers sign-in through the configured vendor OIDC provider, evaluates current grants, and issues its own resource-bound bearer token.

Open **Agent access** and copy the generated private setup prompt from `/agent-setup/private/prompt.md`. Complete a real sign-in and verify that the client sees only the resources and tools allowed for that customer.

The page also provides client-specific connection guidance and an MCP button/embed snippet once customer identity is ready.

## Public MCP

Public MCP is disabled by default. Enable it only after reviewing the deployment and every resource intended for anonymous delivery.

Anonymous content must pass all applicable gates:

1. the asset has an immutable publication;
2. its visibility is explicitly public;
3. the API publication is public where the resource is API-scoped;
4. the deployment-wide Public MCP switch is enabled.

Public MCP never exposes private tools, customer data, credentials, support tools, or unpublished material. Copy `/agent-setup/public/prompt.md` only after verifying the anonymous catalog directly.

![Agent access keeps Public and Private MCP controls beside the exact resource-visibility decisions they publish.](/screenshots/agent-access.jpg)

## Verify discovery

Use **Tools → MCP preview** to inspect the exact current response for `server/discover`, `resources/list`, `resources/templates/list`, or `tools/list`. A private preview uses only the simulated grants you supply; it does not mint a customer token or impersonate an account. Preview never runs `tools/call`.

![MCP preview selects an audience, discovery method, and simulated grants before showing the exact JSON-RPC response.](/screenshots/mcp-preview.jpg)

Then run the standalone acceptance client from `dokosoko-service/examples/mcp-acceptance-client`. Cover protocol negotiation, OAuth metadata and PKCE when enabled, resource list/read, grant-filtered tool discovery, confirmation, revoked access, and request correlation.

## Agent retrieval flow

Agents should read compact Maps first, then run targeted search in the exact global or API publication scope. Results include immutable citations rather than a mutable “latest” knowledge pointer. Recipes are discovered only after the client is connected and describe product implementation—not DokoSoko setup.
