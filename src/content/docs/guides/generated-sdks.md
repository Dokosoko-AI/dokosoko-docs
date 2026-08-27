---
title: Generate SDKs from OpenAPI
description: Decide when an SDK is useful, publish it through a native registry, and optionally catalogue exact release metadata in DokoSoko.
---

You do not need an SDK package to expose an endpoint through DokoSoko. Publish the OpenAPI description and expose consequential operations as policy-bound tools. Most agent integrations can call those operations directly.

Generate an SDK only when developers benefit from language-native types, authentication helpers, retries, pagination helpers, or a stable distribution channel.

## Recommended pipeline

Treat the OpenAPI document as the source of truth:

```text
OpenAPI validation
  -> breaking-change check
  -> SDK generation
  -> language formatter and compiler
  -> generated contract tests
  -> publish to the language registry
```

Run generation in CI from a pinned generator version and a checked-in configuration. Never hand-edit generated files. Fail the build when regeneration produces an uncommitted diff or the generated client no longer compiles.

A typical repository script can wrap your chosen generator:

```json
{
  "scripts": {
    "sdk:generate": "openapi-generator-cli generate -i api/openapi.yaml -g typescript-fetch -o generated/typescript --config sdk/typescript.json",
    "sdk:check": "pnpm sdk:generate && git diff --exit-code -- generated/typescript"
  }
}
```

OpenAPI Generator is appropriate for broad language coverage. Stainless, Speakeasy, Fern, Kiota, and language-specific generators can be better when you want a more opinionated developer experience. The durable requirement is not the tool: pin the version, validate generated behavior, and make releases reproducible.

## DokoSoko widget SDK pipeline

The [Widget Runtime API](/reference/widget-runtime-api/) is intentionally separate from the Control Plane API. Its TypeScript backend package follows a two-stage approach:

1. `openapi-typescript` generates checked-in request and response types during the beta contract phase.
2. A checked-in `stainless.yml` maps `createWidgetSession` to `widgetSessions.create` and becomes the release authority after the public contract is approved.

The handwritten layer is deliberately small. It enforces server-only use, validates the API origin before sending a secret, applies bounded timeouts and retries, and exposes structured errors with request IDs. It imports generated wire types instead of restating them.

The browser loader is not generated from OpenAPI. Its job is DOM and iframe lifecycle, exact-origin messaging, and obtaining a bootstrap from the customer's same-origin endpoint. Combining it with the secret-bearing backend client would create an unsafe package boundary.

## Keep SDK release concerns separate

Registry credentials belong in CI secret storage, not DokoSoko. Publish npm, Maven, NuGet, Go, Swift, or other artifacts through their native registries. DokoSoko may optionally catalogue one bounded package identity and immutable exact release metadata, then embed the selected release metadata in an Integration manifest. That metadata is compatibility guidance, not a runtime operation, download endpoint, or registry credential.

The artifact PURL must be unversioned and its type must match the ecosystem. Each release PURL must use that exact artifact identity and include a decoded version equal to the release version. Registry, source, provenance, and SBOM URLs must use HTTPS, except for loopback HTTP in local development, and cannot contain userinfo, a query, or a fragment. DokoSoko rejects obvious credential-bearing install-command forms, but URL paths and other free-text fields are not comprehensive secret scans; never enter credentials in package metadata.

The registry remains responsible for package bytes and access. DokoSoko validates metadata shape, PURL identity and exact-version consistency, strict URL policy, obvious install-command credential patterns, and SHA-256, SHA-384, or SHA-512 digest syntax only; it does not download, execute, sign, cryptographically verify, or proxy the SDK. Before operational use, use a separately operated external verifier to check registry bytes against the declared digest, validate optional provenance or SBOM material, and test installation. This is an operator-controlled step: DokoSoko does not record the evidence or block publication or binding when it is absent. Keep verifier credentials and evidence outside package metadata.

All artifact catalogue fields are editable only while the artifact is a draft. Publishing the first immutable release activates it, and Integration bindings never follow latest. Creating a public artifact, changing a private draft to public, and publishing each public release require explicit acknowledgement; a public Integration can bind only public metadata.

Deprecation and retirement require guidance and the exact current revision. An optional replacement must be active and already have a published release. Deprecation may record a future sunset, but it makes the artifact unavailable immediately for releases, new bindings, and candidate publication; retirement is also immediate and preserves any existing sunset. Existing bindings remain readable and historical published Integration manifests are not rewritten. Remove the unavailable package from a future candidate or bind an available replacement explicitly.

Version the HTTP API independently from SDK releases. A client package may release bug fixes without changing the API, and one API version may have several package versions. Avoid encoding package versions into API paths or access policy.

## Before generating

SDK quality is downstream of API quality. Confirm that the OpenAPI contract has:

- stable operation IDs and resource-oriented names;
- explicit request and response schemas;
- consistent error envelopes;
- idempotency semantics for retried mutations;
- cursor pagination for growing collections;
- documented authentication and resource binding;
- no implementation-only fields or arbitrary URLs.

Generating clients from an unstable contract makes the instability easier to distribute. Fix the contract first.
