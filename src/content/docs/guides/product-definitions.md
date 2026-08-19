---
title: Build a Product Definition
description: Automatically join API specifications, documentation, packages, repositories, tools, and MCP connections into versioned product releases.
---

A **Product Definition** is the version map for one product. It records which API capabilities the product contains, the releases available for each capability, and the exact specifications, documentation, packages, tools, and MCP connections that belong to each release.

This keeps ownership and compatibility separate: attaching an artifact says that the product owns it; a release binding says which API version it supports.

There are three distinct version layers:

| Layer | Example | Meaning |
| --- | --- | --- |
| API release | Voice API `v3` | A release of one independently versioned API capability |
| Artifact version | `@acme/voice-node` `7.2.1` | A package, specification, documentation, or tool version bound to an API release |
| Product version | `2026.8` | An immutable snapshot of one compatibility profile from one published Product Definition revision |

A Product Definition can change as DokoSoko scans new artifacts. A published product version does not: it preserves the exact profile and definition revision agents and customers received.

## User flow

1. Create the product and attach any sources, packages, custom tools, or third-party MCP connections you already know about.
2. Open **Product definition** and select **Build product automatically**.
3. Optionally paste more OpenAPI URLs, documentation sites, repository URLs, package coordinates, or MCP endpoints. One item per line is enough; the builder classifies the type.
4. Select **Build product**. DokoSoko scans the product, proposes API capabilities and release bindings, and creates a compatibility profile.
5. Review exceptions and low-confidence joins. You do not need to reconfirm high-confidence matches.
6. Publish the definition. Existing customer version pins are not moved.

![The auto-magic Product Definition builder scanning attached assets and accepting optional source locations.](/screenshots/product-definition-auto-magic.jpg)

When an enabled extraction model is configured, it proposes capability and release assignments from sanitized artifact descriptors. Model output is schema-validated and cannot publish, authorize, or call tools. If the model is unavailable, the build records that fact and uses deterministic classification. Publishing remains an explicit administrative action.

![The automatically generated Product Definition draft ready for relationship review.](/screenshots/product-definition-auto-build.jpg)

## Independent API tracks

API versions belong to a capability, not to the whole product. A single product can therefore publish this definition:

| API capability | API release | Bound artifacts |
| --- | --- | --- |
| Voice API | v3 | Voice OpenAPI v3, Voice docs v3, `@acme/voice-node` 7.2.1 |
| Messages API | v2 | Messages OpenAPI v2, Messages docs v2, `@acme/messages` 5.1.3 |

A package version is never assumed to be the API version. The binding stores both values: for example, package `7.2.1` can explicitly support Voice API `v3`.

![A published Product Definition showing Voice API v3 and Messages API v2, their bound artifacts, and a compatibility profile.](/screenshots/product-definition-published.jpg)

## Publish a product version

After publishing the Product Definition, open **Product definition → Discovery settings** or **Platform settings → Product discovery & versions**.

1. Add the concise product description agents should use during discovery.
2. Choose whether unpinned customers should prefer the **Latest** or **LTS** channel.
3. Enter a product version label, select a published compatibility profile, and choose its initial lifecycle labels.
4. Select **Publish version**. DokoSoko stores an immutable snapshot of that profile and Product Definition revision.

The first product version is automatically marked **Latest**. Only one version can be Latest; multiple supported versions may be LTS.

![Product discovery settings with an agent-facing description, AI rewrite action, default channel, and immutable product-version publisher.](/screenshots/product-discovery-settings.jpg)

## Agent-facing description and AI rewrite

The product description is returned verbatim in MCP product discovery. Write one to three factual sentences that explain what the product enables, who it serves, and important scope boundaries.

**Rewrite for agents** uses the enabled `assistant` LLM profile. DokoSoko sends a hardened prompt that treats the draft as untrusted data and prohibits invented capabilities, versions, URLs, credentials, or claims. The model returns an editable draft only. Review it and select **Save discovery settings** before agents can see it.

The rewrite audit event records the model and input/output lengths, not the raw prompt or description. The model cannot publish a version, change lifecycle labels, move a pin, authorize a user, or call a tool.

## Compatibility profiles and customer pins

A compatibility profile selects one release from every API capability, such as **Voice v3 + Messages v2**. Use profiles as tested defaults for new integrations.

Customer pins are separate. The **Customer ID** must exactly equal the vendor-organisation value resolved during sign-in. DokoSoko uses that authenticated claim as the lookup key; it does not trust a customer ID supplied in an MCP tool argument.

Publishing another definition, creating a product version, or rescanning changed sources never silently moves a pin. Promote a customer only through an explicit compatibility decision. New pins cannot target a deprecated version, but an existing pin remains fixed if its version is later deprecated.

![Published product versions labeled Latest, LTS, and Deprecated above the exact customer-pin editor.](/screenshots/product-version-catalog.jpg)

### Resolution order

For every MCP discovery request and managed custom-tool call, DokoSoko resolves the effective product version in this order:

1. exact customer pin;
2. the product's configured Latest or LTS default channel;
3. Latest fallback;
4. LTS fallback;
5. newest supported, non-deprecated version.

This resolution is deterministic. An agent sees the selected version and the selection source, but cannot override an administrative pin.

## Latest, LTS, and deprecated

- **Latest** is the normal default for customers that should track the newest supported compatibility snapshot.
- **LTS** identifies a supported long-term compatibility snapshot. Configure the product's default policy as LTS for conservative unpinned customers.
- **Deprecated** removes a version from new pins and default resolution. Add agent-facing migration guidance, an optional replacement version, and an optional sunset date.

A deprecated version cannot also be Latest or LTS. Deprecation changes discovery guidance and future selection; it does not rewrite existing customer pins.

![The product-version lifecycle editor marking a release deprecated with replacement and sunset guidance while preserving existing pins.](/screenshots/product-version-lifecycle.jpg)

## What agents discover

The `server/discover` result includes a `product` manifest with:

- product name, slug, and agent-facing description;
- default version policy and the effective product version;
- whether selection came from a customer pin, Latest, LTS, or fallback;
- the selected API releases and safe artifact metadata;
- every published product version with Latest, LTS, deprecated, replacement, and sunset metadata.

`tools/list` also exposes `product.get_manifest` and `product.versions.list`. Every discovered tool receives `com.dokosoko/productVersion` metadata containing the effective product version and selection source. Managed custom tools outside the selected compatibility snapshot are excluded from discovery and denied during execution. Private artifact URLs, evidence, credentials, and internal references are not returned to the agent.

## Validation behavior

The builder reports exceptions when it cannot establish a unique relationship:

- **Ambiguous component** — an artifact belongs to the product, but no exact API capability was established.
- **Ambiguous release** — the capability is known, but multiple releases are possible.
- **Unversioned API** — the capability exists without an explicit API release.
- **No API capabilities** — publishing is blocked until at least one API capability can be established.
- **AI enrichment unavailable** — automatic classification continued without the configured extraction model.

Warnings remain visible for review. Blocking errors prevent publication.

## MCP policy

Product Definitions support third-party MCP toolsets only through [**Stateless MCPv2 Only**](https://blog.modelcontextprotocol.io/posts/2026-07-28/). Each proxied call is independently authenticated and authorized; DokoSoko does not keep a logical upstream live session between calls. The MCP connection and its pinned tool schema appear as release bindings alongside specs, docs, and packages. The MCP protocol revision or an endpoint path such as `/v2` is never treated as the product API version.

## Control Plane API

| Operation | Endpoint |
| --- | --- |
| Get the published definition | `GET /api/v1/products/{product_id}/definition` |
| List automatic builds | `GET /api/v1/products/{product_id}/product-builds` |
| Build from attached and supplemental inputs | `POST /api/v1/products/{product_id}/product-builds` |
| Publish a reviewed build | `POST /api/v1/products/{product_id}/product-builds/{build_id}/publish` |
| Edit product discovery settings | `PATCH /api/v1/products/{product_id}` |
| Rewrite the product description as an unsaved draft | `POST /api/v1/products/{product_id}/description/rewrite` |
| List or publish immutable product versions | `GET/POST /api/v1/products/{product_id}/versions` |
| Change version lifecycle metadata | `PATCH /api/v1/products/{product_id}/versions/{version_id}` |
| List or save exact customer pins | `GET/POST /api/v1/products/{product_id}/version-pins` |
| Remove a customer pin | `DELETE /api/v1/products/{product_id}/version-pins/{pin_id}` |

The create-build request contains an `inputs` array, which can be empty when every artifact is already attached. Each entry declares a `kind`, `location`, and optional name, artifact version, ecosystem, API version, or capability hint. See the [Control Plane API reference](/reference/http-api/) for the complete schema.
