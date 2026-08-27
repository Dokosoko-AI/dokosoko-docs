---
title: Set up and publish an API
description: Build one reviewed API snapshot from exact developer assets, runtime access, authorization, and tools.
---

An API is an `Integration` in the service contract. It is the delivery boundary DokoSoko publishes through MCP.

Each API workspace has six sections:

| Section | Purpose |
| --- | --- |
| **Quick Start** | Readiness, blocking findings, and the next incomplete step |
| **Resources** | Exact documentation, API contract, and SDK-release bindings |
| **Keys & Access** | Fixed runtime service origins and encrypted credential versions |
| **Tools** | API-owned and attached common tools plus authorization bindings |
| **Test** | Deterministic preflight and controlled upstream checks |
| **History** | Immutable API publications, hashes, and audit evidence |

## 1. Define the API

Create an API from **Catalog → APIs**. Give it a stable family key, exact version key, display metadata, and lifecycle. New APIs are private drafts. Enabling public visibility requires a separate explicit acknowledgement.

An API is one versioned interface—not a product-release channel. DokoSoko has no Latest/LTS promotion, customer pins, staged rollout, or automatic dependency upgrade.

## 2. Attach exact resources

Open **Resources** and attach reviewed Catalog assets:

- one or more exact documentation-set revisions;
- an exact validated API-contract revision;
- exact SDK releases and, when available, their reviewed content publications.

You can attach an existing asset or create one and then attach it. A binding never follows a newer Catalog revision automatically. Detaching removes only the API binding; it does not delete the shared asset.

## 3. Configure keys and access

Open **Keys & Access** and create a fixed runtime service connection for each environment that needs tool execution. Credentials are write-only, encrypted, versioned, and independently rotatable. An agent cannot supply the origin, authentication scheme, or credential.

For customer-specific Private MCP access, configure the deployment OIDC provider separately. Register grant definitions and API authorization points before publishing tools that require them.

## 4. Build and bind tools

An API can use:

- a reviewed fixed-destination HTTP tool;
- a reviewed local import from an upstream MCP server;
- a reviewed native tool compiled into the DokoSoko build.

Validate input and output schemas, effect, identity requirement, required grants, confirmation, idempotency, timeout, redaction, and the exact runtime connection. Binding a tool selects one immutable tool and authorization revision.

## 5. Test and preflight

Use **Test** to run the network-free contract checks first. Controlled live HTTP tests require an exact revision, sanitized evidence retention, and explicit confirmation for mutations. Then run API preflight.

Preflight resolves every selected asset, SDK, authorization point, tool, and service connection. Required failures deny publication.

## 6. Publish the snapshot

Publishing records one immutable API revision with exact resource revisions, tool and policy revisions, runtime connection revisions, visibility, content hashes, and a manifest hash. New Catalog or configuration changes affect only a later publication.

After publishing, verify resource discovery, grant-filtered tool discovery, confirmation, revoked access, and one safe representative operation with the acceptance client in `dokosoko-service/examples/mcp-acceptance-client`. Run it from that separate Go module against your deployment.
