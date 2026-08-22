---
title: Set up a product
description: Create the product hierarchy and prepare DokoSoko for its first integration.
---

After first-run setup, create the administrative structure that knowledge, tools, and access policies will use.

The onboarding form creates the organisation, first product, and production environment together. Resources added afterward remain private until explicitly published or exposed.

![The first-product onboarding form with organisation, product, and production environment fields.](/screenshots/product-onboarding.jpg)

## 1. Create an organisation

An organisation is the top-level administrative and audit boundary. Use a stable vendor or business-unit name rather than a single application name.

## 2. Create a product

A product owns its sources, custom tools, MCP endpoints, authenticated widgets, identity configuration, access providers, analytics, and integration runs. New products begin private and have Public MCP disabled.

After attaching the first API specification, documentation site, repository, tool, or MCP connection, [build a Product Definition](/guides/product-definitions/). The builder joins those resources to independently versioned API releases and proposes a compatibility profile for review.

Before sharing MCP, open **Product discovery & versions**, write the agent-facing product description, choose the default Latest or LTS channel, and publish an immutable product-version snapshot from a reviewed compatibility profile. Register integration installations and add exact installation, environment, or customer pins only where compatibility requires them. For incompatible product lines, create separate products instead of forcing them into one version sequence.

## 3. Add environments

Create at least one non-production environment and one production environment when vendor systems distinguish them. Provider projects and credential leases are environment-scoped.

## 4. Choose the first delivery surface

Start with the smallest useful path:

- build a Product Definition from an OpenAPI specification;
- publish a documentation source for knowledge retrieval;
- publish SDK installation guidance as documentation, or [generate SDKs in CI](/guides/generated-sdks/);
- expose one fixed API action as a custom tool;
- connect the Provider API for project or short-lived credential issuance.

## 5. Configure identity

Private MCP uses the DokoSoko OAuth broker. Configure the vendor issuer, client details, external-customer claim, optional installation claim, vendor API origin, and stable integration ID before sharing the private endpoint.

Widgets do not use that OAuth token. The customer application's backend authenticates the user and creates a widget bootstrap with a separate widget secret. Configure widgets independently under **Agent access → Widgets**.

## 6. Configure support reporting

If agents should offer connector-specific bug reporting or product feedback, open **Support reporting** and enable each tool independently. Reports can remain encrypted in DokoSoko's holding inbox until you configure vendor API delivery. Review the [support reporting guide](/guides/support-reporting/) before enabling the tools so your privacy notice, retention period, and receiving system are ready.

## 7. Validate readiness

The Overview page tracks connector readiness. Confirm root MFA, database and encryption, a product and production environment, vendor identity, a published knowledge release, and authorization testing. Then run **System Doctor** from Platform settings.

![The product Overview page showing readiness requirements and the next configuration actions.](/screenshots/product-readiness.jpg)

Do not treat the readiness count as a substitute for an end-to-end test. Complete a representative [integration run](/guides/operations/#integration-runs) after the checklist is green.
