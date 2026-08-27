---
title: Manage developer assets
description: Understand reusable Catalog ownership, immutable publication, Maps, Query Lab, and advisory AI.
---

DokoSoko manages documentation, API contracts, and SDK packages as reusable deployment-owned Catalog assets. APIs attach exact revisions or releases instead of owning mutable copies.

## Ownership model

| Asset | Stable root | Immutable reviewed object | API selection |
| --- | --- | --- | --- |
| Documentation | Documentation set | Set revision and optional global publication | Exact revision plus selectors |
| API contract | Contract root | Validated contract revision | Exact revision |
| SDK | Package identity | Exact release and reviewed content publication | Exact release/content publication |

The Catalog owns creation, ingestion, review, visibility, lifecycle, history, and the reverse **Used by APIs** relationship. An API’s **Resources** section only attaches, changes, or detaches exact selections.

## Staged ingestion

Developer-asset ingestion is replayable and inspectable:

```text
acquire → validate → parse → normalize → segment → extract
        → build deterministic Map → quality check → review → publish → index
```

Candidates are immutable. Diagnostics, processor versions, hashes, partial coverage, skipped files, failures, and quarantine decisions remain visible. Publication always requires a human action.

## Maps and immutable retrieval

Every published asset has a compact Map or table of contents. Maps route an agent toward exact sections, operations, symbols, workflows, and approved samples; they are not approval evidence by themselves.

Retrieval resolves the scope before ranking:

```text
newest ready global documentation publication
+ exact assets in the selected API publication
```

Content attached only to another API cannot enter the candidate set. Results cite the immutable publication, entity, and content hash.

## Query Lab

Use **Docs → Query Lab** before relying on an answer in MCP. Select global, API, or combined scope, then inspect:

- resolved publication IDs and asset filters;
- Map routing and ranked evidence;
- exact citations and content hashes;
- exclusions, token estimate, and latency in the bounded trace.

A poor or empty result should lead to a source, review, selector, attachment, or index fix—not ungrounded prose.

See [Use Query Lab](/guides/query-lab/) for the complete console workflow and trace interpretation.

## Advisory AI

Administrators may explicitly run schema-constrained advisories for documentation-map enrichment, SDK-map enrichment, SDK applicability, or static SDK sample review. Each run binds one immutable reviewed scope and records prompt, evidence, input, and result hashes.

Advisory output cannot validate, approve, attach, index, mutate, or publish an asset. Deterministic Maps and human review remain authoritative.

## Immutability rules

- The console pins documentation and contract bindings to exact revisions. The control-plane API can explicitly request `follow_latest`; an API publication still resolves and freezes one exact revision.
- SDK bindings are exact-only and never advance automatically.
- Detaching a binding never deletes shared Catalog content.
- Historical publications remain readable even when a root or release is archived.
- Yanked or archived SDK releases cannot be selected for new bindings or publications.
- Global documentation can be republished independently without republishing every API.
