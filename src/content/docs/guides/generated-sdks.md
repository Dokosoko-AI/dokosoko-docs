---
title: Catalogue exact SDKs
description: Manage deployment-owned SDK packages, exact releases, reviewed source evidence, and explicit API bindings.
---

DokoSoko records exact SDK identities and reviewed content for agent retrieval. External registries still deliver package bytes.

## Create or import a package

Open **SDKs and packages → Packages** and either create a package identity or import one exact release from a supported public registry or HTTPS Git repository. Supported ecosystems include npm, PyPI, Go modules, and Cargo.

Every release must use an exact version or immutable resolved commit. Version ranges, `latest`, and automatic upgrades are rejected.

An SDK release may record:

- ecosystem, coordinate, and exact version;
- a verified install command;
- optional public documentation and source URLs;
- optional digest and visibility;
- append-only lifecycle observations such as yanked or archived.

Transient import credentials are used only for that import and are not stored.

## Review SDK content

You can submit bounded UTF-8 source files for static normalization. DokoSoko does not install dependencies, execute source, compile examples, or run package code.

Review the candidate’s files, symbols, samples, diagnostics, citations, and deterministic SDK Map. Every included file and sample needs an explicit decision. A sample requires named machine evidence or non-empty structured human-review evidence before it can be approved.

Publishing creates an immutable SDK content publication for that exact release.

## Attach a release to an API

From the API’s **Resources** section, attach one exact SDK release and, when available, its reviewed content publication. Two APIs may select different releases of the same package. Adding or changing a package release never moves either binding.

Yanked or archived releases remain historically readable but cannot be used for a new binding or publication.

## Registry and supply-chain boundary

DokoSoko does not host or proxy packages, store package-manager credentials, attest provenance, verify registry bytes, or claim compatibility. Use your normal release pipeline and independent supply-chain controls to build, test, sign, and publish the SDK.

:::caution
Never put credentials in install commands, URLs, source text, metadata, or review notes. DokoSoko applies bounded checks but cannot prove arbitrary free text is secret-free.
:::

## If you generate an SDK

Treat the reviewed OpenAPI contract as the source of truth. Pin the generator and configuration, format and compile the output, run contract tests, and fail CI when regeneration produces an unexplained diff. Publish through the ecosystem’s registry, then catalogue only the exact released version in DokoSoko.
