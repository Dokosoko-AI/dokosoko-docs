---
title: Validate retrieval with Query Lab
description: Query an exact published developer-asset scope and inspect its ranked evidence, citations, and trace.
---

Query Lab exercises DokoSoko's published-knowledge retrieval path without asking a model to write an answer. Open **Docs → Query Lab** at `/developer-assets/query-lab` to test what an agent can retrieve before depending on it through MCP.

![Query Lab controls for selecting a published scope, filters, and bounded result limits](/screenshots/query-lab.jpg)

Query Lab requires a connected console. It is deliberately unavailable in fixture preview because a useful result depends on live publication and index state.

## Prepare published knowledge

The lab searches immutable, indexed publications rather than drafts or ingestion candidates. Before running a query:

1. Publish the relevant global documentation or the selected API's developer assets.
2. Confirm the publication's search index is ready.
3. For API-scoped retrieval, confirm the API is attached to the exact documentation, contract, or SDK revision you intend to test.

See [Manage developer assets](/guides/developer-assets/) for the review, publication, and indexing lifecycle.

## Choose the scope

| Scope | Candidate knowledge | Required selection |
| --- | --- | --- |
| **Global** | The deployment documentation publication | None |
| **API** | The selected API developer-asset publication | API |
| **Combined** | Both exact publications above | API |

When an exact publication ID is blank, the service resolves the applicable active publication and records that immutable ID in the result. Supplying an API publication that belongs to another API is rejected instead of widening the search.

Use the exact publication fields when reproducing a result, comparing index generations, or investigating a historical citation. Otherwise, letting the service resolve the current publication is usually more convenient.

## Run a bounded query

Enter a question of at most 500 characters. The optional controls narrow the candidate set:

- asset kind: documentation, contract, or SDK;
- language and ecosystem;
- exact version or exact SDK release ID;
- result limit from 1 to 50, with a default of 10;
- context-token limit from 256 to 32,000, with a default of 4,000.

The token limit bounds the selected retrieval context; it does not invoke or configure a language model. For API clients, the equivalent operation is `POST /api/v1/developer-assets/query-lab`:

```json
{
  "scope": "combined",
  "api_id": "api-payments-v1",
  "query": "How do I authenticate the JavaScript SDK?",
  "asset_kinds": ["documentation", "sdk"],
  "exact_versions": ["1.4.0"],
  "limit": 10,
  "context_token_limit": 4000
}
```

## Read the evidence

Each response includes the resolved scope, selected context-token count, diagnostics, and a trace ID. Every ranked result exposes:

- an excerpt and its visibility;
- immutable publication, source-entity, knowledge-unit, and content-hash identity;
- citation metadata needed to reopen and verify the evidence;
- lexical, feature-hash, and rerank scores.

The value exposed as the feature-hash score is a deterministic local feature-hash cosine signal. It is not a learned embedding, a probability, or proof that the excerpt answers the question. Treat all ranking scores as diagnostics and verify the cited source.

## Diagnose a poor result

First copy the trace ID. `GET /api/v1/developer-assets/query-lab/traces/{trace_id}` returns the requested filters, resolved immutable scope, routing decision, ranked citations, and exclusions. `GET /api/v1/developer-assets/query-lab/traces` lists recent deployment-scoped traces for comparison.

For an empty or irrelevant result, check in this order:

1. The expected publication exists and its index is ready.
2. The resolved publication IDs are the revisions you intended to query.
3. The selected API has the required exact bindings and selectors.
4. Language, ecosystem, version, release, and asset-kind filters are not overly narrow.
5. The source content and Map contain the terminology an operator or agent will use.

Fix the source, review, attachment, selector, or index rather than compensating with an ungrounded answer.

:::caution[Queries become operational evidence]
Query traces are durable and deployment-scoped, and include the query text as well as its hash, filters, routing, citations, counts, and diagnostics. Do not put credentials, tokens, personal data, or other secrets in a query. Query Lab never authorizes an action and never synthesizes an AI answer.
:::
