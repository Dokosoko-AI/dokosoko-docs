---
title: Publish documentation
description: Acquire documentation safely, review normalized evidence, create reusable sets, and publish exact revisions.
---

Documentation moves through two explicit boundaries: source publication establishes reviewed evidence, then a documentation set selects exact evidence for global or API delivery.

## Add a source

Open **Docs → Sources**. The console can add a website or upload; the control-plane API also supports a fixed OpenAPI document URL.

![The Sources screen shows ingestion health, indexed content, visibility, and review actions.](/screenshots/documentation-sources.jpg)

Use one of the supported ingestion paths:

| Kind | Input | Important boundary |
| --- | --- | --- |
| Website | Fixed public HTTP(S) start URL | Credential-free, same-origin, redirect, DNS, page, and byte checks |
| OpenAPI | Fixed public HTTP(S) document URL through the control-plane API | Same network controls plus structured validation |
| Upload | One bounded UTF-8 document | `.md`, `.mdx`, `.txt`, `.html`, `.htm`, `.json`, `.yaml`, or `.yml`; normally up to 5 MB in the private upload volume |

The legacy `git` source kind remains reserved in the API for compatibility, but it is unsupported and hidden in the console.

Start an ingestion run and wait for a terminal review state. A run never becomes active knowledge automatically.

## Review the source publication

Inspect normalized documents and their exact sections, content hashes, diagnostics, derived Map, and acquisition lineage. Review especially:

- failed, skipped, redirected, duplicate, or unexpectedly empty content;
- quarantine, suspected secret, or prompt-injection findings;
- unexpected changes in coverage, bytes, or page count;
- missing titles, broken structure, and incomplete OpenAPI parsing.

Publish only the selected reviewed documents. The source publication is immutable and remains available as evidence after later crawls.

## Create a documentation set

Open **Docs → Documents** to search the normalized document explorer. Inspect each file's exact content, sections, Map, diagnostics, source run, and publication identity. Select reviewed files or sections, then choose **Save selection as set**. Existing sets remain available from the **Documentation sets** panel.

Selectors are applied before the set Map is built, so an excluded section cannot reappear through its parent document.

A set can be:

- published in the deployment-wide global documentation snapshot;
- attached to one or more APIs at exact revisions;
- both global and API-specific without duplicating content.

## Choose visibility

Publication and public visibility are independent. Private MCP may read published private assets within its authorized API scope. Public MCP requires an explicitly public asset, an explicitly public published API where applicable, and the deployment-wide Public MCP switch.

:::caution
Treat public visibility as a data-release decision. Review every selected document, section, citation, and Map entry before acknowledging it.
:::

## Refresh safely

Acquire and review a new source publication, then create a new documentation-set revision. The console pins every API binding to the selected revision. API clients may explicitly create a documentation binding with `follow_latest`; even then, an API publication resolves and freezes one exact revision. Existing API and global publications remain unchanged until an explicit publication action replaces them.

Use [Query Lab](/guides/query-lab/) to verify that the intended global, API, or combined scope retrieves the new publication with immutable citations.
