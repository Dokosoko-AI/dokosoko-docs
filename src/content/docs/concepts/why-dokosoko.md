---
title: Why DokoSoko?
description: Understand the problem DokoSoko solves and the boundaries it deliberately keeps.
---

DokoSoko gives a software vendor one self-hosted MCP connector for the reviewed material coding agents need to use its APIs: documentation, contracts, exact SDK references, recipes, credentials, and tools.

## The problem

Agent support often grows as disconnected systems: a documentation index, an MCP server, OAuth callbacks, API wrappers, and generated setup prose. Those systems can select different versions, leak credentials, or silently drift away from what the vendor reviewed.

DokoSoko publishes one immutable API snapshot that resolves exact developer assets, authorization points, tool revisions, and runtime connections. Agents receive that reviewed state instead of a mutable collection of “latest” inputs.

## Design principles

1. **Private by default.** Draft, published, and publicly visible are separate states.
2. **Exact over floating.** API publications pin exact documentation, contract, SDK, tool, and connection revisions.
3. **Policy before execution.** Identity, customer state, grants, schemas, confirmation, and idempotency are checked before a tool runs.
4. **Credentials stay server-side.** Secrets are write-only and encrypted; inbound DokoSoko tokens are never forwarded upstream.
5. **Content is untrusted evidence.** Acquired material is bounded, normalized, reviewed, and published before retrieval.
6. **AI stays advisory.** A model cannot approve, attach, execute, or publish anything.

## Who it is for

- **Platform operators** deploy DokoSoko and maintain its security and recovery boundary.
- **API teams** attach reviewed assets, configure runtime access, test tools, and publish APIs.
- **Documentation and SDK owners** manage reusable deployment-wide Catalog assets.
- **Identity teams** connect OIDC and the customer access-evaluation contract.
- **Agent developers** connect through Private MCP or the optional read-only Public MCP surface.

## What it is not

DokoSoko is not a developer portal, provisioning platform, widget runtime, package registry, registry proxy, API gateway, autonomous publishing agent, or support case-management system. It does not host package bytes, execute SDK source, invent compatibility, or automatically upgrade an API binding.
