---
title: Import third-party MCP tools
description: Connect one fixed upstream MCP server, review its schemas, and publish selected tools under local policy.
---

DokoSoko can expose selected tools from an upstream MCP server through Private MCP. This is a managed import, not a transparent proxy: every imported tool becomes a reviewed local definition with a namespace, schema hash, grants, confirmation policy, and immutable publication lifecycle.

## Connect the upstream

1. Open **MCP connections** and choose **Connect MCP**.
2. Enter a display name, local namespace, and one fixed public HTTPS endpoint.
3. Enter the upstream service access token in the write-only field.
4. Decide whether to forward the bounded signed DokoSoko identity envelope.
5. Connect and inspect the complete upstream catalog.

The endpoint cannot redirect to an unreviewed origin or resolve to a private, loopback, link-local, or ambiguous destination outside explicit local development.

## Identity forwarding

The inbound DokoSoko bearer token is never forwarded. Every upstream call uses the connection’s separate service token.

When **Forward user identity** is enabled, DokoSoko adds a bounded `X-DokoSoko-User` envelope containing trusted opaque identity claims and signs it with the service token. The upstream must verify that signature before trusting the envelope. Disable forwarding when the upstream needs only the service identity.

## Review and import

Inspection returns untrusted names, descriptions, annotations, and schemas. Select only the intended tools, set required DokoSoko grants, keep confirmation enabled for consequential effects, and choose a bounded timeout.

Import creates or updates local drafts. Review and publish each draft from **Tools**, then bind its exact revision to an API. Nothing becomes callable merely because the upstream advertised it.

## Schema drift

Each imported definition pins the upstream schema hash. Re-inspection classifies unchanged, new, changed, and missing tools. A changed or missing schema blocks the affected local tool until an administrator reviews, republishes, rebinds, and republishes the API snapshot.

This fail-closed behavior prevents an upstream from silently widening input, output, or effect semantics.

## Protocol boundary

The connection uses the service’s fixed Stateless MCPv2 revision. Requests are self-contained HTTP calls; DokoSoko does not retain a live logical upstream session between agent calls. Request-scoped streaming is allowed only for the bounded current result.
