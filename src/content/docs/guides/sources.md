---
title: Publish knowledge
description: Crawl product documentation, review immutable snapshots, and publish trusted knowledge to MCP clients.
---

Sources turn vendor documentation into reviewed, citation-ready product knowledge. Every source begins private and unpublished.

![The Sources view showing crawl health, review state, and publication controls.](/screenshots/sources.jpg)

## Add a source

1. Open a product and choose **Sources**.
2. Choose **Add source** and select **Website**, **OpenAPI**, **Git repository**, or **SDK reference**.
3. Enter a stable name and the fixed source location. New sources are private and draft.
4. Save the source, start a crawl, and wait for the run to reach **Needs review** or another terminal state.

![The Add knowledge source form configured for an OpenAPI document.](/screenshots/source-configuration.jpg)

DokoSoko discovers pages from sitemaps first, uses a lightweight HTML parser where possible, and falls back to a browser for pages that need JavaScript. Destinations and redirects are revalidated to prevent the crawler from reaching private networks.

## Review before publishing

Each crawl creates an immutable snapshot. Review the run for:

- failed or unexpectedly redirected pages;
- quarantine findings and suspected prompt-injection text;
- unusual page-count or byte-budget changes;
- missing titles, content, or citations.

Rejected or quarantined content never becomes active knowledge. Publishing promotes a reviewed snapshot atomically, so clients see either the previous snapshot or the complete replacement.

## Choose visibility

Publication state and visibility are independent:

| State | Private MCP | Public MCP |
| --- | --- | --- |
| Draft | Hidden | Hidden |
| Published + private | Available to authorized users | Hidden |
| Published + public | Available to authorized users | Available only when Public MCP is enabled |

:::caution
Public visibility is an explicit data-publication decision. Confirm that the source contains no customer-only material before enabling it.
:::

## Refresh safely

Run a new crawl without unpublishing the current snapshot. Review the diff and findings, then publish the replacement. If a refresh is unhealthy, leave the last trusted snapshot active while you investigate.
