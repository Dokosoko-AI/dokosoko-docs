---
title: Set up and publish an API
description: Create an API from OpenAPI, connect runtime Authorization, attach reviewed assets and tools, test it, and publish an immutable snapshot.
---

An API is an `Integration` in the service contract. It is the reviewed delivery boundary DokoSoko publishes through MCP.

Each API workspace has six sections:

| Section | Purpose |
| --- | --- |
| **Quick Start** | Readiness, blocking findings, and the shortest path to publication |
| **Resources** | Documentation, API-contract, and exact SDK-release bindings |
| **Authorization** | One reusable upstream authentication profile, fixed service origin, credential, and provider hooks |
| **Tools** | API-owned tools, attached common tools, and action-policy bindings |
| **Test** | Server-backed configuration preflight and acceptance scenarios |
| **History** | Immutable publications, resource snapshots, hashes, and audit evidence; open it from **More** |

## 1. Add the API

Open **APIs**, choose **Add API**, and complete the three-step wizard:

1. **OpenAPI** — enter the API name and version, choose a local JSON or YAML contract up to 5 MB, and set the fixed credential-free API base URL. The stable family key is derived from the name.
2. **Authorization** — reuse an existing Authorization or create the shared profile that owns this API's upstream authentication.
3. **Review** — confirm the API, service origin, Authorization, environment-variable name, and optional provider hooks.

![The Add API wizard begins with the OpenAPI contract, API identity, and fixed base URL.](/screenshots/add-api-wizard.jpg)

Saving creates a private API draft, uploads the OpenAPI evidence, creates and attaches its contract root, queues ingestion, and connects the selected Authorization. It does not publish the API. If a later wizard action fails, return to the created draft and finish it; do not create a duplicate.

An API represents one versioned interface—not a product-release channel. DokoSoko has no Latest/LTS promotion, customer pins, staged rollout, or automatic dependency upgrade.

## 2. Follow Quick Start

The **Quick Start** checklist resolves current server state into the next concrete task. A publishable API needs its Authorization, reviewed documentation and contract, customer-access policy where required, tool bindings, and preflight checks to agree.

![An API Quick Start checklist showing publication readiness and the six setup areas.](/screenshots/api-quick-start.jpg)

Warnings are recoverable workflow guidance. Publication blockers are server findings and cannot be bypassed in the console.

## 3. Review and attach resources

Open **Resources** to inspect publication history and attach deployment-owned assets:

- reviewed documentation-set revisions;
- a validated API-contract revision;
- exact SDK releases and, when available, their reviewed content publications.

![The API Resources section separates immutable publication history from documentation, contract, and SDK attachments.](/screenshots/api-resources.jpg)

The console creates exact bindings and does not advance them when a newer catalog revision appears. The control-plane API additionally supports an explicit `follow_latest` mode for documentation and contract bindings; SDK bindings are always exact. In either mode, publishing an API freezes the one resolved revision and its hashes into that immutable API snapshot.

Detaching removes only the API binding. It does not delete the shared asset.

## 4. Configure upstream Authorization and customer policy

The **Authorization** tab binds the API to one reusable upstream credential profile. It is distinct from customer sign-in and action policy:

- upstream Authorization controls how DokoSoko authenticates to the fixed API origin;
- customer OIDC establishes who is using Private MCP;
- action policies decide which grants and confirmations an exact tool binding requires.

See [Configure runtime Authorization](/guides/runtime-authorization/) and [Define authorization policies](/guides/authorization-policies/).

## 5. Build and bind tools

Create API-owned HTTP tools from the API's **Tools** section when operations should inherit this API's origin and Authorization. Attach a common tool from **Tools → Catalog** when it owns an independent fixed destination. Upstream MCP imports and compiled native plugins also become reviewed local tool revisions before binding.

For each binding, select an exact published tool revision and an exact active action-policy revision. Review schema bounds, effect, identity requirement, grants, confirmation, idempotency, timeout, redaction, and output validation. See [Create custom tools](/guides/custom-tools/).

## 6. Test and preflight

Testing happens at two boundaries:

1. In the tool editor, run the network-free **Contract check**, then an explicitly controlled live HTTP test when appropriate.
2. In the API **Test** section, run configuration preflight and review the acceptance scenarios for the assembled API.

![The API Test section reports server-backed preflight findings and acceptance scenarios.](/screenshots/api-test.jpg)

Preflight resolves the selected assets, Authorization, policies, tools, and fixed service connection. Required failures deny publication.

## 7. Publish and inspect history

Publishing records an immutable API revision with the resolved resource revisions, tool and policy revisions, runtime-authorization state, visibility, content hashes, and manifest hash. Later catalog or configuration changes affect only a later publication.

Open **More → History** to compare publication revisions and their frozen resource snapshot. Then run the standalone acceptance client in `dokosoko-service/examples/mcp-acceptance-client` against the published surface. Cover discovery, OAuth and grant filtering where enabled, confirmation, revoked access, and one safe representative operation.
