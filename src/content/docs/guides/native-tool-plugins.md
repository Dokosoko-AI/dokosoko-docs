---
title: Add native tool plugins
description: Extend DokoSoko with reviewed Go tool implementations compiled into a specific service build.
---

Native tool plugins are trusted Go packages compiled into DokoSoko. Use them when an operation is awkward or inefficient as an HTTP or upstream MCP tool and you can review the complete source and dependency tree.

They are not sandboxed extensions. DokoSoko does not load uploaded binaries, shared libraries, WASM, or source at runtime. Every change requires source review, a new service build, and a normal deployment.

## Author and register a plugin

1. Implement `Plugin.Describe` and `Plugin.Open` using the public `nativeplugin` SDK.
2. Add `plugintest.TestPlugin(t, New())` conformance coverage.
3. Run the strict source checker and review every transitive dependency.
4. Import the package in `internal/nativeplugins/registry.go` and add its constructor to `Registered`.
5. Configure only manifest-declared environment keys, then rebuild and deploy DokoSoko.
6. Inspect **Tools → Native tool plugins**, review the staged source-backed tool drafts, and publish them normally.

Registration is explicit. `init`-based discovery is forbidden.

## Manifest and tool contract

`Describe` must be deterministic and side-effect free. The manifest declares a canonical plugin ID and semantic version, SDK version `1`, configuration keys, state schema version, optional managed-network claims, and one or more tool contracts.

Every tool defines closed input and output schemas, effect, identity requirement, state scope, grants, confirmation, idempotency, timeout, concurrency, and result-size limits. Write and destructive tools require idempotency; destructive tools also require confirmation.

A published native tool executes only when plugin ID, plugin version, SDK version, manifest hash, and tool-contract hash match exactly. A code or manifest change stages a new draft and the old release fails closed until reviewed.

## Configuration and secrets

A manifest key `KEY` owned by plugin `my_plugin` maps to:

```text
DOKOSOKO_PLUGIN_MY_PLUGIN_KEY
```

Plugins can read only declared values through the host API. Secret values are redacted from responses and host-managed logs, but trusted plugin code must still keep them out of outputs, state, errors, and URLs.

Set `DOKOSOKO_NATIVE_PLUGINS_REQUIRED` to the comma-separated plugins that must be active for startup. Use `DOKOSOKO_NATIVE_PLUGINS_DISABLED` as a deployment-owned kill switch.

## Identity, state, and networking

Plugins receive only the identity view declared by the tool—opaque plugin-specific actor, customer, or installation references rather than tokens, email addresses, raw subjects, or database IDs. Identity does not replace normal publication, customer-state, grant, confirmation, and schema checks.

State uses a bounded host-owned JSON key/value API with declared `none`, `plugin`, `actor`, `customer`, or `installation` scope. Plugins receive no SQL handle.

Outbound HTTP requires the `network` capability and exact manifest claims. Calls go through the host client, which enforces public HTTPS destinations, DNS rebinding checks, redirect limits, header stripping, and body caps. Direct networking imports are rejected by the source checker.

## Operational boundary

Plugin panics are recovered, and host limits constrain cooperative work, but Go cannot preempt code that ignores context cancellation. A malicious or badly reviewed plugin can compromise or exhaust the service process. Treat native plugin review as application-code review, not as marketplace installation.
