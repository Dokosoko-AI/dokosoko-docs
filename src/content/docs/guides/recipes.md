---
title: Publish recipes
description: Create immutable, evidence-grounded implementation plans for agents already connected through MCP.
---

A recipe is a deployment-owned product-integration plan for one tangible capability. It is consumed by a coding agent that is already connected to DokoSoko.

## Analyse reviewed evidence

Choose an API and run analysis against its exact published evidence. DokoSoko identifies candidate capabilities, missing prerequisites, and evidence gaps. Blocking gaps must be resolved by attaching or configuring the missing source of truth; they are not editable assertions.

AI remains optional. The generator receives bounded reviewed evidence and closed output schemas, while the service reconstructs exact operations, attachments, and validation from immutable records.

## Write a focused plan

A recipe should contain:

- product-side prerequisites;
- one coherent outcome;
- ordered implementation steps;
- observable verification checks;
- exact grounded references and relevant SDK guidance.

It must not teach the agent how to connect to DokoSoko or MCP. Prefer an exact operation from the selected published API contract. Use a reviewed tool capability only when the contract does not describe the required operation.

One recipe may attach several APIs when a coherent workflow genuinely needs exact capabilities from each. Every revision freezes each attached API publication revision and manifest hash.

## Review and publish

Generated output is always a draft. Review the structured specification and rendered Markdown together, resolve unsupported claims, and approve before publishing.

Publication creates an immutable recipe revision. If attached evidence changes, DokoSoko marks the recipe stale; it does not silently regenerate or replace the published plan.

## Discovery behavior

MCP lists compact recipe metadata. Plan selection succeeds only for one exact normalized title, slug, or outcome. Unmatched or ambiguous requests return deterministic candidates instead of choosing an arbitrary plan.

Legacy MCP-setup recipes are excluded from resource discovery. Administrators can explicitly delete obsolete recipe records and their immutable revisions; the deletion audit event remains.
