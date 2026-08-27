---
title: Customer Identity Integration API
description: Implement the vendor-owned access-evaluation operation DokoSoko calls during Private MCP authorization.
---

The Customer Identity Integration API is optional and deliberately narrow. DokoSoko calls one fixed vendor-owned operation using the live delegated vendor access token obtained during OIDC sign-in.

[Open the read-only explorer](/api/identity-integration/) or [download the OpenAPI contract](/identity-integration-openapi.yaml).

## Request

```http
POST /v1/access/evaluations
Authorization: Bearer VENDOR_USER_ACCESS_TOKEN
Idempotency-Key: aeval_0123456789abcdef0123456789abcdef
X-External-Request-ID: req_0123456789abcdef0123456789abcdef
Content-Type: application/json

{}
```

Derive the user and customer from the delegated token. The closed empty request body cannot override token identity or choose an API.

The token must be audience- or resource-bound to this delegated API where the provider supports that control. A DokoSoko bearer token is never sent to this endpoint.

## Response

Return current stable grant keys and an explicit expiry:

```json
{
  "id": "aeval_01JY4R8T7N6M5K4J3H2G1F0E9D",
  "grants": ["developer.pro", "voice.calls.read"],
  "expires_at": "2030-08-22T13:00:00Z",
  "policy_version": "policy_2030_08_22"
}
```

DokoSoko defines the tool catalog and required grants. This response only narrows the caller’s current access and never creates a tool or widens a published resource scope.

## Idempotency and failures

Retain the result for at least ten minutes under the supplied idempotency key. Retries of the same logical evaluation reuse that key and carry a new external request ID.

A timeout, transport error, non-success response, malformed body, expired evaluation, missing customer identity, inactive customer account, or denied grant fails closed. Return stable machine-readable errors without credential or customer-secret material.

## Deployment boundary

- Use one configured credential-free HTTPS origin; local HTTP is a development exception.
- Do not redirect the request.
- Keep responses bounded and complete within DokoSoko’s timeout.
- Authenticate only with the delegated vendor token.
- Keep access evaluation independent of support delivery, runtime tool credentials, and upstream MCP service tokens.
