---
title: Why DokoSoko?
description: Understand the problem DokoSoko solves and the principles behind it.
---

DokoSoko gives software vendors one self-hosted place to make their product usable by coding agents. It combines knowledge retrieval, package delivery, API tools, OAuth, entitlements, credential issuance, analytics, and audit without turning an agent into a trusted administrator.

## The problem

Agent integrations tend to grow as separate systems: a documentation index, an MCP server, package download credentials, OAuth callbacks, custom API wrappers, and a separate analytics pipeline. Each boundary can drift, leak credentials, or apply a different publication policy.

DokoSoko brings those surfaces under one product and policy model.

## Design principles

1. **Private by default.** Sources, packages, and tools begin as drafts. Publication and anonymous visibility are separate, explicit actions.
2. **Policy before execution.** Entitlements narrow discovery, and a separate authorization hook can approve each sensitive operation.
3. **Credentials stay server-side.** Vendor secrets are encrypted. Browsers and MCP clients do not receive persistent upstream credentials.
4. **Content is untrusted input.** Crawled material is budgeted, scanned, reviewable, and can be quarantined before publication.
5. **Success is auditable.** Administrative changes, policy decisions, integration runs, and validated outcomes have distinct records.

## Who it is for

- **Platform owners** deploy DokoSoko and maintain its security boundary.
- **Product teams** publish knowledge, packages, and tools.
- **Identity teams** connect OIDC, entitlements, and authorization hooks.
- **Agent developers** connect through private or public MCP and optional widgets.

## What it is not

DokoSoko is not a general-purpose API gateway, an identity provider, a package registry, or an autonomous code-execution environment. It coordinates those systems through fixed contracts and explicit policy.
