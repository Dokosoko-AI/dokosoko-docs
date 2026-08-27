---
title: Publish documentation
description: Acquire documentation safely, review normalized evidence, create reusable sets, and publish exact revisions.
---

Documentation moves through two explicit boundaries: source publication establishes reviewed evidence, then a documentation set selects exact evidence for global or API delivery.

## Add a source

Create a source for one of the supported ingestion paths:

| Kind | Input | Important boundary |
| --- | --- | --- |
| Website | Fixed public HTTP(S) start URL | Credential-free, same-origin, redirect, DNS, page, and byte checks |
| OpenAPI | Fixed public HTTP(S) document URL | Same network controls plus structured validation |
| Upload | Bounded UTF-8 files | Private upload volume, canonical paths, byte limits, and no symlinks |

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

From **Catalog → Documentation**, create a reusable set from exact source publications, documents, or sections. Selectors are applied before the set Map is built, so an excluded section cannot reappear through its parent document.

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

Acquire and review a new source publication, create a new documentation-set revision, and deliberately update each API binding that should adopt it. Existing API and global publications remain unchanged until replaced by an explicit publication action.
