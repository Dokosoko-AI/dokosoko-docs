---
title: Provider API contract
description: Implement the vendor-owned authorization, project, credential issuance, and revocation endpoints used by DokoSoko.
---

The Provider API runs on vendor infrastructure. DokoSoko connects to one fixed HTTPS origin with an encrypted service bearer credential and validates every response before retaining metadata.

[Open the read-only interactive API explorer](/api/provider/) or [download the Provider API OpenAPI contract](/provider-openapi.yaml).

:::caution
Request execution and authentication input are disabled in the explorer. Use it to inspect schemas and generated examples, then run conformance tests against your own Provider API environment.
:::

## Endpoint summary

| Endpoint | Request | Successful response |
| --- | --- | --- |
| `POST /v1/authorize` | Subject, product, operation, and bounded operation details | `{ "allowed": true }` or an explicit denial |
| `POST /v1/projects` | Product, environment, owner, idempotency key, name, and TTL | Vendor `project_id`, state, and optional expiry |
| `POST /v1/credentials` | Product, environment, optional project, subject, scopes, idempotency key, and TTL | One-time credential plaintext, `credential_id`, and expiry |
| `POST /v1/credentials/{credential_id}/revoke` | Product and subject | `204 No Content` |

Every project, issuance, and revocation operation is preceded by `/v1/authorize`. Network failures, non-2xx responses, malformed JSON, and negative decisions fail closed.

## Authentication

All endpoints require:

```http
Authorization: Bearer VENDOR_SERVICE_CREDENTIAL
Content-Type: application/json
Accept: application/json
```

The service credential belongs to DokoSoko—not the end user—and should be independently revocable. Do not accept an inbound DokoSoko OAuth token on the Provider API.

## Authorization request

```json
{
  "operation": "credential.issue",
  "subject": "https://id.vendor.example.com|user_123",
  "vendor_organisation_id": "org_customer_42",
  "product_id": "prod_dokosoko",
  "details": {
    "environment_id": "env_production",
    "project_id": "project_local_01",
    "scopes": ["api.read", "api.write"],
    "ttl_seconds": 3600
  }
}
```

Return an explicit decision:

```json
{
  "allowed": true,
  "reason": "Account plan includes production API access."
}
```

## Project creation

Project creation is idempotent by `product_id` and `idempotency_key`. A successful response contains the vendor identifier DokoSoko will retain:

```json
{
  "project_id": "vendor_project_01",
  "state": "active",
  "expires_at": "2026-08-19T12:00:00Z"
}
```

## Credential issuance

The response is the only permitted delivery of credential plaintext:

```json
{
  "credential_id": "credential_01",
  "credential": "one-time-secret-value",
  "expires_at": "2026-08-19T12:00:00Z"
}
```

DokoSoko validates the expiry, returns the credential once to the authorized MCP caller, and persists only a SHA-256 fingerprint and lease metadata. An idempotent replay must never reveal plaintext again.

## Conformance rules

- Use HTTPS on the default port with no redirects.
- Bound response bodies to JSON and exclude secret data from errors.
- Accept TTLs from 300 seconds up to the provider connection’s configured maximum.
- Treat idempotency keys as opaque strings of at least 16 characters.
- Make revocation idempotent.
- Return stable machine-readable error codes and an operator-safe message.
- Complete requests within DokoSoko’s bounded upstream timeout.

For the integration workflow and rollout checklist, see [Implement the Provider API](/guides/provider-api/).
