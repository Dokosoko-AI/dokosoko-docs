---
title: Build a Product Definition
description: Automatically join API specifications, documentation, repositories, tools, and MCP connections into versioned product releases.
---

A **Product Definition** is the version map for one product. It records which API capabilities the product contains, the releases available for each capability, and the exact specifications, documentation, repositories, tools, and MCP connections that belong to each release.

This keeps ownership and compatibility separate: attaching an artifact says that the product owns it; a release binding says which API version it supports.

There are three distinct version layers:

| Layer | Example | Meaning |
| --- | --- | --- |
| API release | Voice API `v3` | A release of one independently versioned API capability |
| Resource version | Voice specification revision `42` | A specification, documentation, repository, or tool version bound to an API release |
| Product version | `2026.8` | An immutable snapshot of one compatibility profile from one published Product Definition revision |

A Product Definition can change as DokoSoko scans new artifacts. A published product version does not: it preserves the exact profile and definition revision agents and customers received. DokoSoko gives that immutable snapshot a `sha256:` manifest hash and generates a structural diff from the preceding product version.

:::note[Keep incompatible product lines separate]
A product version is a compatible distribution snapshot, not a substitute for a product boundary. If an API line has different identity, commercial scope, authorization, or migration semantics, create another DokoSoko product. For example, one Communications product can deliberately combine Voice API v3 and Messages API v2; an incompatible successor sold and operated as a separate platform should be a different product. Generated diffs describe snapshot changes but do not guess semantic-version compatibility.
:::

## User flow

1. Create the product and attach any sources, custom tools, or third-party MCP connections you already know about.
2. Open **Product definition** and select **Build product automatically**.
3. Optionally paste more OpenAPI URLs, documentation sites, repository URLs, or MCP endpoints. One item per line is enough; the builder classifies the type.
4. Select **Build product**. DokoSoko scans the product, proposes API capabilities and release bindings, and creates a compatibility profile.
5. Review exceptions and low-confidence joins. You do not need to reconfirm high-confidence matches.
6. Publish the definition. Existing scoped version pins are not moved.

![The auto-magic Product Definition builder scanning attached assets and accepting optional source locations.](/screenshots/product-definition-auto-magic.jpg)

When an enabled extraction model is configured, it proposes capability and release assignments from sanitized artifact descriptors. Model output is schema-validated and cannot publish, authorize, or call tools. If the model is unavailable, the build records that fact and uses deterministic classification. Publishing remains an explicit administrative action.

![The automatically generated Product Definition draft ready for relationship review.](/screenshots/product-definition-auto-build.jpg)

## Independent API tracks

API versions belong to a capability, not to the whole product. A single product can therefore publish this definition:

| API capability | API release | Bound artifacts |
| --- | --- | --- |
| Voice API | v3 | Voice OpenAPI v3, Voice docs v3, voice tools |
| Messages API | v2 | Messages OpenAPI v2, Messages docs v2, messaging tools |

A resource revision is never assumed to be the API version. The binding stores both values independently.

![A published Product Definition showing Voice API v3 and Messages API v2, their bound artifacts, and a compatibility profile.](/screenshots/product-definition-published.jpg)

## Publish a product version

After publishing the Product Definition, open **Product definition → Discovery settings** or **Platform settings → Product discovery & versions**.

1. Add the concise product description agents should use during discovery.
2. Choose whether unpinned customers should prefer the **Latest** or **LTS** channel.
3. Enter a product version label, select a published compatibility profile, choose **Active** or **Preview**, set the deterministic Latest rollout percentage, and choose its requested lifecycle labels.
4. Select **Publish version**. DokoSoko stores an immutable snapshot, computes its manifest hash and release diff, and verifies that referenced published artifacts have not drifted.

The first product version requests **Latest** automatically. Only one active version can be Latest; multiple supported versions may be LTS. When independent promotion approval is enabled, a version requesting Active, Latest, or LTS remains a Preview with **Approval pending** until a different administrator reviews the generated diff and artifact health. Later channel promotions use the same separation of duties.

![Product discovery settings with an agent-facing description, AI rewrite action, default channel, and immutable product-version publisher.](/screenshots/product-discovery-settings.jpg)

## Agent-facing description and AI rewrite

The product description is returned verbatim in MCP product discovery. Write one to three factual sentences that explain what the product enables, who it serves, and important scope boundaries.

**Rewrite for agents** uses the enabled `assistant` LLM profile. DokoSoko sends a hardened prompt that treats the draft as untrusted data and prohibits invented capabilities, versions, URLs, credentials, or claims. The model returns an editable draft only. Review it and select **Save discovery settings** before agents can see it.

The rewrite uses the assistant profile's input/output limits and daily token budget. Its audit event records the model, prompt-template version, token count, and input/output lengths—not the raw prompt or description. The model cannot publish a version, change lifecycle labels, move a pin, authorize a user, or call a tool.

## Compatibility profiles, installations, and scoped pins

A compatibility profile selects one release from every API capability, such as **Voice v3 + Messages v2**. Use profiles as tested defaults for new integrations.

Pins are separate from profiles and may target a customer, environment, or integration installation. Use the narrowest scope that explains the compatibility constraint:

| Scope | Lookup identity | Typical use |
| --- | --- | --- |
| Installation | Registered installation selected by an authenticated OIDC installation claim | One deployed integration is certified on a specific snapshot |
| Environment | DokoSoko environment bound to the registered installation | All installations in production or sandbox follow one snapshot |
| Customer | Authenticated vendor-organisation claim | One customer remains on a support baseline |

Register each installation with its stable external identity, customer, and DokoSoko environment. Configure the optional OIDC **Installation claim** to name the claim containing that external identity. DokoSoko maps the signed claim to the internal installation record; it never trusts customer, environment, installation, or version values supplied in an MCP tool argument.

Publishing another definition, creating a product version, or rescanning changed sources never silently moves a pin. Each pin update uses optimistic revision checks and appends immutable assignment history. New pins cannot target a deprecated version, but an existing pin remains fixed if its version is later deprecated.

![The product-version catalog showing immutable hashes, generated diffs, rollout, approval state, and scoped pins.](/screenshots/product-version-catalog.jpg)

![Registered integration installations binding an authenticated external identity to a customer and environment.](/screenshots/product-version-installations.jpg)

### Resolution order

For every MCP discovery request and managed custom-tool call, DokoSoko resolves the effective product version in this order:

1. exact installation pin from a registered, active authenticated installation;
2. exact environment pin from that installation;
3. exact customer pin from the authenticated vendor organisation;
4. the product's configured LTS channel, when LTS is the default;
5. the active, healthy Latest channel, using the deterministic installation/customer rollout bucket;
6. prior active release for callers outside the Latest rollout;
7. active, healthy LTS fallback;
8. newest active, healthy, non-deprecated version.

This resolution is deterministic. An agent sees the selected version and selection source, but cannot override an administrative pin. Preview, pending, rejected, drifted, and deprecated versions are never chosen by ordinary channel resolution. An exact existing pin may continue to select a Preview or deprecated version for controlled testing or migration; discovery includes an operational warning, and drifted or sunset managed execution fails closed.

## Preview, Latest, LTS, and deprecated

- **Latest** is the normal default for customers that should track the newest supported compatibility snapshot.
- **LTS** identifies a supported long-term compatibility snapshot. Configure the product's default policy as LTS for conservative unpinned customers.
- **Deprecated** removes a version from new pins and default resolution. Add agent-facing migration guidance, an optional replacement version, and an optional sunset date.
- **Preview** is available only through an exact scoped pin until promotion completes.

A deprecated version cannot also be Latest or LTS. Before first deprecation, the editor shows customer, environment, and installation pins plus 30-day MCP request and tool-call impact. The administrator must acknowledge affected assignments and add migration guidance. Deprecation changes discovery guidance and future selection; it does not rewrite existing pins.

![A deprecated version showing migration guidance, replacement, sunset, 30-day request and tool-call impact, acknowledgement, and the no-silent-migration guarantee.](/screenshots/product-version-impact.jpg)

## Release integrity, drift, and cache invalidation

Every product-version response includes its immutable manifest hash. Every product has a monotonic catalog revision that changes when discovery-affecting settings, versions, installations, or pins change. MCP discovery returns both values and advertises list changes with a short cache lifetime, so clients can invalidate cached catalogs without inferring versions from tool names.

Use **Recheck artifacts** before promotion and after changing a bound source, tool, or MCP connection. Promotion always performs another drift check. A missing, unpublished, quarantined, version-mismatched, inactive, non-Stateless-MCPv2, or schema-drifted binding blocks promotion and managed execution until reconciled.

![Release review showing the immutable manifest hash, structural diff, artifact health, lifecycle channels, and deterministic Latest rollout.](/screenshots/product-version-lifecycle.jpg)

## What agents discover

The `server/discover` result includes a `product` manifest with:

- product name, slug, and agent-facing description;
- default version policy and the effective product version;
- catalog revision, immutable manifest hash, and whether selection came from an installation, environment, customer, channel, or rollout fallback;
- product-wide artifacts plus the selected API releases and their safe artifact metadata;
- active product versions with Latest, LTS, rollout, drift, deprecated, replacement, and sunset metadata; an exactly pinned Preview is included only for that caller;
- operational warnings for Preview, deprecated, drifted, or sunset selections.

`tools/list` also exposes `product.get_manifest` and `product.versions.list`. Every discovered tool receives `com.dokosoko/productVersion` metadata containing the effective version ID, manifest hash, definition and catalog revisions, selection source, environment, and installation. Managed knowledge and tools outside the selected snapshot are excluded from discovery and denied during execution. Private source URLs, evidence, credentials, and internal references are not returned to the agent.

## Validation behavior

The builder reports exceptions when it cannot establish a unique relationship:

- **Ambiguous component** — an artifact belongs to the product, but no exact API capability was established.
- **Ambiguous release** — the capability is known, but multiple releases are possible.
- **Unversioned API** — the capability exists without an explicit API release.
- **No API capabilities** — publishing is blocked until at least one API capability can be established.
- **AI enrichment unavailable** — automatic classification continued without the configured extraction model.

Warnings remain visible for review. Blocking errors prevent publication.

## MCP policy

Product Definitions support third-party MCP toolsets only through [**Stateless MCPv2 Only**](https://blog.modelcontextprotocol.io/posts/2026-07-28/). Each proxied call is independently authenticated and authorized; DokoSoko does not keep a logical upstream live session between calls. The MCP connection and its pinned tool schema appear as release bindings alongside specifications and documentation. The MCP protocol revision or an endpoint path such as `/v2` is never treated as the product API version.

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
| Read a generated diff or deprecation impact | `GET /api/v1/products/{product_id}/versions/{version_id}/diff` or `/impact` |
| Recheck artifact drift | `POST /api/v1/products/{product_id}/versions/{version_id}/reconcile` |
| Request, approve, or reject promotion | `POST /api/v1/products/{product_id}/versions/{version_id}/promotion` |
| List or save exact scoped pins | `GET/POST /api/v1/products/{product_id}/version-pins` |
| Read immutable pin history | `GET /api/v1/products/{product_id}/version-pins/history` |
| Remove a scoped pin | `DELETE /api/v1/products/{product_id}/version-pins/{pin_id}` |
| List or save integration installations | `GET/POST /api/v1/products/{product_id}/installations` |

The create-build request contains an `inputs` array, which can be empty when every resource is already attached. Each entry declares a `kind`, `location`, and optional name, resource version, API version, or capability hint. See the [Control Plane API reference](/reference/http-api/) for the complete schema.
