---
title: Publish API contracts
description: Ingest OpenAPI evidence, validate immutable candidates, and attach exact contract revisions to APIs.
---

API contracts are deployment-owned Catalog assets. One validated contract revision can be attached to several APIs, while each API publication keeps its exact selected revision.

## Create the contract root

Open **Catalog → API contracts**, create a stable contract root, and set its display identity, visibility, and lifecycle. The root is mutable catalog metadata; published revisions are immutable.

## Attach OpenAPI evidence

Attach an exact reviewed OpenAPI source publication to the contract root. Then ingest a candidate. DokoSoko normalizes the document into a contract graph and records its operations, schemas, security, diagnostics, source lineage, processor versions, and content hash.

## Review and publish

Inspect validation findings and the deterministic Contract Map. Resolve malformed references, incomplete operation schemas, ambiguous security, and quarantined evidence before publication.

Publishing creates one immutable validated revision. No model output can validate or publish a contract.

## Attach the exact revision

From an API’s **Resources** section, attach the published contract revision. Changing the contract root or publishing a newer revision does not move the API binding. Select the newer revision explicitly and publish a new API snapshot after reviewing downstream tool and recipe impact.

## Contract quality checklist

- Stable operation IDs and resource-oriented summaries
- Explicit request, success, and error schemas
- Closed or intentionally bounded object shapes
- Documented authentication and authorization expectations
- Idempotency semantics for retried mutations
- Pagination for growing collections
- No caller-selected destination URLs or implementation-only secrets

Recipes prefer exact operations from the API’s published contract graph. Search may find candidates, but method, path, schemas, visibility, security, and drift identity are reconstructed from the immutable contract—not inferred from prose.
