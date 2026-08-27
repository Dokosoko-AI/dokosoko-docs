---
title: Publish API contracts
description: Ingest OpenAPI evidence, validate immutable candidates, and attach exact contract revisions to APIs.
---

API contracts are deployment-owned Catalog assets. One validated contract revision can be attached to several APIs, while each API publication keeps its exact selected revision.

## Create the contract root

Open **Docs → API contracts**, create a stable contract root, and set its display identity, visibility, and lifecycle. The root is mutable catalog metadata; published revisions are immutable. The **Add API** wizard creates this root and starts ingestion automatically for its uploaded OpenAPI file.

## Attach OpenAPI evidence

Attach one fixed deployment source to the contract root, then start ingestion. Attaching the source does not publish or approve a candidate. DokoSoko acquires the current source evidence, creates an immutable reviewable candidate, and normalizes it into a contract graph with operations, schemas, security, diagnostics, source lineage, processor versions, and content hash.

## Review and publish

Inspect validation findings and the deterministic Contract Map. Resolve malformed references, incomplete operation schemas, ambiguous security, and quarantined evidence before publication.

Publishing creates one immutable validated revision. No model output can validate or publish a contract.

## Attach the exact revision

From an API's **Resources** section, attach the published contract revision. The console always pins the exact selected revision. The control-plane API can instead request `follow_latest`; a later API publication then resolves the newest eligible revision but still freezes that exact revision into its resource snapshot. Review downstream tool and recipe impact before publishing the API again.

## Contract quality checklist

- Stable operation IDs and resource-oriented summaries
- Explicit request, success, and error schemas
- Closed or intentionally bounded object shapes
- Documented authentication and authorization expectations
- Idempotency semantics for retried mutations
- Pagination for growing collections
- No caller-selected destination URLs or implementation-only secrets

Recipes prefer exact operations from the API’s published contract graph. Search may find candidates, but method, path, schemas, visibility, security, and drift identity are reconstructed from the immutable contract—not inferred from prose.
