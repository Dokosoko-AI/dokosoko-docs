---
title: Why DokoSoko?
description: Understand the problem DokoSoko solves and the principles behind it.
---

DokoSoko gives software vendors one self-hosted place to make their product usable by coding agents. It combines knowledge retrieval, API tools, OAuth, access grants, credential issuance, analytics, and audit without turning an agent into a trusted administrator.

## The problem

Agent integrations tend to grow as separate systems: a documentation index, an MCP server, OAuth callbacks, custom API wrappers, and a separate analytics pipeline. Each boundary can drift, leak credentials, or apply a different publication policy.

DokoSoko brings those surfaces under one product and policy model.

## Design principles

1. **Private by default.** Sources and tools begin as drafts. Publication and anonymous visibility are separate, explicit actions.
2. **Policy before execution.** Short-lived vendor grants narrow discovery and execution.
3. **Credentials stay server-side.** Vendor secrets are encrypted. Browsers and MCP clients do not receive persistent upstream credentials.
4. **Content is untrusted input.** Crawled material is budgeted, scanned, reviewable, and can be quarantined before publication.
5. **Success is auditable.** Administrative changes, policy decisions, integration runs, and validated outcomes have distinct records.

## Who it is for

- **Platform owners** deploy DokoSoko and maintain its security boundary.
- **Product teams** publish knowledge, API contracts, and tools.
- **Identity teams** connect OIDC, customer identity, and access evaluation.
- **Agent developers** connect through private or public MCP; application developers embed authenticated widgets through their own backend identity boundary.

## What it is not

DokoSoko is not a general-purpose API gateway, identity provider, package registry, or autonomous code-execution environment. It may catalogue bounded metadata for an exact externally hosted package release, but the native registry delivers bytes. External verification is an operator-controlled process that DokoSoko does not perform, evidence, or enforce. DokoSoko coordinates developer integrations through fixed contracts and explicit policy.
