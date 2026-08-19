---
title: Vendor hook contracts
description: Implement entitlement, custom-tool authorization, and fetch-mode package hooks called by DokoSoko.
---

DokoSoko calls three optional vendor-owned hooks at fixed HTTPS URLs. Use the [read-only interactive API explorer](/api/vendor-hooks/) or download the [Vendor Hooks OpenAPI contract](/hooks-openapi.yaml) for request, response, security, and error schemas.

:::caution
Request execution and authentication input are disabled in the explorer. Use it to inspect schemas and generated examples without sending calls to hook servers.
:::

The paths in the contract are illustrative. The console stores a complete URL for each hook, so vendors may use their own route layout while preserving the defined payload.

## Entitlement hook

Called during OAuth authorization with the vendor access token obtained from the configured OIDC provider:

```json
{
  "subject": "user_123",
  "vendor_organisation_id": "org_customer_42",
  "product_id": "prod_dokosoko"
}
```

Return stable identifiers and their current state:

```json
{
  "entitlements": {
    "developer.pro": true,
    "projects.create": true,
    "production.write": false
  }
}
```

Failures deny OAuth authorization. Do not return tool definitions from this hook; DokoSoko maps entitlements to configured resources.

## Tool authorization hook

Called immediately before a custom tool’s fixed API hook. The request contains argument property names—but never argument values or the inbound DokoSoko token:

```json
{
  "operation": "tool.execute",
  "tool": "billing.create_invoice",
  "product_id": "prod_dokosoko",
  "subject": "https://id.vendor.example.com|user_123",
  "vendor_organisation_id": "org_customer_42",
  "argument_keys": ["account_id", "amount", "currency"]
}
```

Return `{ "allowed": true }` to continue. A denial, malformed response, timeout, or non-2xx status stops execution.

## Package fetch hook

Fetch-mode packages call this hook with an encrypted service credential:

```json
{
  "package_id": "pkg_01",
  "ecosystem": "npm",
  "name": "@vendor/sdk",
  "version": "2.4.1"
}
```

Return a short-lived, credential-free artifact URL and integrity metadata:

```json
{
  "url": "https://downloads.vendor.example.com/leases/download_01",
  "sha256": "81b637d8f6d2c6b1f4e9d349a442e980a84161f96ea101da2c96cf86723bb7ef",
  "size": 184320,
  "expires_at": "2026-08-19T12:05:00Z"
}
```

DokoSoko does not forward the hook credential to the returned URL. It revalidates the destination and checks the exact size and SHA-256 digest when supplied.

## Custom tool API hooks

Custom tool transport is configured per tool rather than defined by one global contract:

- `GET` tools encode arguments as query parameters.
- `POST`, `PUT`, `PATCH`, and `DELETE` tools send the validated argument object as JSON.
- The response must be JSON and conform to the tool’s configured output schema.
- Request and response bodies are limited to 1 MiB, and the configured timeout is bounded from 100 to 60,000 milliseconds.

The control-plane [CreateTool request schema](/openapi.yaml) defines how to register these input and output contracts.
