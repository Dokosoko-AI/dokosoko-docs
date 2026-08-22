---
title: Widget Runtime API
description: Reference the authenticated widget configuration, bootstrap, session, and streaming chat contract.
---

The Widget Runtime API is the narrow data-plane contract used by customer backends and the hosted widget iframe. It is separate from the root-administrator Control Plane API.

Use the [read-only interactive explorer](/api/widget-runtime/) or download the canonical [OpenAPI YAML](/widget-runtime-openapi.yaml).

## Operations

| Operation | Caller | Authentication |
| --- | --- | --- |
| `GET /v1/widgets/{widgetId}/configuration` | Widget host | None; returns presentation fields only for an active widget |
| `POST /v1/widget-sessions` | Authenticated customer backend | Server-only `doko_wsk_...` widget secret |
| `POST /v1/widget-sessions/exchange` | Widget host | Single-use `doko_wbt_...` bootstrap and exact application origin |
| `GET /v1/widget-session` | Widget host | Short-lived `doko_wss_...` session |
| `POST /v1/widget-chat` | Widget host | Short-lived widget session; returns `text/event-stream` |

The configuration response contains only the public widget ID, name, appearance, and loader protocol version. It does not expose allowed API identifiers, origins, secrets, customer identity, or provider configuration.

## Credential lifetimes

| Credential | Lifetime | Storage rule |
| --- | --- | --- |
| Widget secret | Until rotated or revoked | Customer backend secret manager; DokoSoko stores only a digest |
| Bootstrap token | 60 seconds, single-use | Response body and exact-origin `postMessage` only |
| Widget session | 15 minutes | Iframe memory only |

All runtime requests re-check current widget state. Disabling a widget revokes its sessions. A session cannot add an API that is not selected on the active widget.

## Session creation

`userId` and optional `organizationId` are customer-owned stable identifiers. They must be derived from the customer backend's authenticated session. Never accept them from the browser merely because their shape passes validation.

The `origin` is the exact browser application origin, such as `https://app.example.com`. It must match the widget allow-list. Production origins require HTTPS; localhost HTTP is accepted for development.

`Idempotency-Key` makes an exact bootstrap request safely retryable. Retrying with the same key and the same widget, identity, and origin returns the same unexpired bootstrap. A different identity or origin is a different request and must use a different key.

## Streaming format

`POST /v1/widget-chat` accepts one message up to 4,000 characters. A successful response uses server-sent events:

```text
data: {"text":"First chunk"}

data: {"text":" and the next chunk"}

data: [DONE]

```

The hosted Chat SDK adapter consumes this stream. Clients should ignore malformed frames, stop on `[DONE]`, and request a new bootstrap when the session expires.

## SDK generation

The TypeScript backend SDK is generated from this contract and adds a server-runtime guard, bounded retries, timeouts, and typed errors. The checked-in Stainless configuration maps `createWidgetSession` to `widgetSessions.create` and explicitly disables browser use.

See [Generate SDKs from OpenAPI](/guides/generated-sdks/) for contract and release requirements, and [Embed an authenticated widget](/guides/embedded-widgets/) for the complete integration flow.
