---
title: Set up a product
description: Create the product hierarchy and prepare DokoSoko for its first integration.
---

After first-run setup, create the administrative structure that all knowledge, tools, packages, and access policies will use.

The onboarding form creates the organisation, first product, and production environment together. Resources added afterward remain private until explicitly published or exposed.

![The first-product onboarding form with organisation, product, and production environment fields.](/screenshots/product-onboarding.jpg)

## 1. Create an organisation

An organisation is the top-level administrative and audit boundary. Use a stable vendor or business-unit name rather than a single application name.

## 2. Create a product

A product owns its sources, packages, custom tools, MCP endpoints, widget snippets, identity configuration, providers, analytics, and integration runs. New products begin private and have Public MCP disabled.

After attaching the first API specification, documentation site, package, repository, tool, or MCP connection, [build a Product Definition](/guides/product-definitions/). The auto-magic builder joins those artifacts to independently versioned API releases and proposes a compatibility profile for review.

Before sharing MCP, open **Product discovery & versions**, write the agent-facing product description, choose the default Latest or LTS channel, and publish an immutable product-version snapshot from a reviewed compatibility profile. Add exact customer pins only when a customer must remain on a specific snapshot.

## 3. Add environments

Create at least one non-production environment and one production environment when vendor systems distinguish them. Provider projects and credential leases are environment-scoped.

## 4. Choose the first delivery surface

Start with the smallest useful path:

- build a Product Definition from an OpenAPI specification and its SDK package;
- publish a documentation source for knowledge retrieval;
- add an SDK package for installation guidance;
- expose one fixed API action as a custom tool;
- connect the Provider API for project or short-lived credential issuance.

## 5. Configure identity

Private MCP and the private widget use the product OAuth broker. Add the vendor issuer, client details, exact redirect allowlist, entitlement hook, and optional operation authorization hook before sharing the private endpoint.

## 6. Validate readiness

The Overview page tracks connector readiness. Confirm root MFA, database and encryption, a product and production environment, vendor identity, a published knowledge release, authorization testing where required, and package gateway health when packages are used. Then run **System Doctor** from Platform settings.

![The product Overview page showing readiness requirements and the next configuration actions.](/screenshots/product-readiness.jpg)

Do not treat the readiness count as a substitute for an end-to-end test. Complete a representative [integration run](/guides/operations/#integration-runs) after the checklist is green.
