---
title: Configure advisory AI
description: Connect an AI provider, bound the Analysis workload, manage versioned instructions, and preserve DokoSoko's authority boundaries.
---

AI is optional and provider-neutral in DokoSoko. Open **Settings → AI configuration** at `/settings/ai` to configure the only active workload, **Analysis**, and the advisory workflows that use it.

![AI configuration showing the Analysis workload, provider connection, usage, and advanced workflow controls](/screenshots/ai-configuration.jpg)

AI output remains advisory. It cannot publish, approve, attach, index, or mutate developer assets, tools, or recipes.

## Connect a provider

Choose **Add provider**, then select OpenAI, Google, Anthropic, DigitalOcean, xAI, DeepSeek, or an OpenAI-compatible service.

1. Review the provider origin. Native provider origins are fixed by DokoSoko. An OpenAI-compatible connection requires one fixed public HTTPS origin; private-network destinations and redirects are rejected.
2. Enter the API credential and enable the connection.
3. Save, then use **Test** to make a minimal provider request. DokoSoko stores normalized health metadata rather than the provider response.

Credentials are encrypted, write-only, and never returned by the API. When managing an existing console-owned connection, leaving the credential empty retains the encrypted value already stored.

A connection created from the central configuration file or `DOKOSOKO_AI_*`
environment variables is deployment-managed and read-only in the console.
Change it at the deployment boundary and restart according to your release
procedure. Removing it disables the managed connection; enter a new credential
in the console if you want to transfer ownership back to the console. See the
[configuration reference](/reference/configuration/) for the supported fields
and overrides.

## Configure Analysis

In the workload table, select an enabled, non-backup provider connection and its model. Use **Limits** to set the workload controls:

| Control | Allowed value | Purpose |
| --- | --- | --- |
| Maximum input tokens | 256–1,000,000 | Bounds evidence and instructions sent to the provider |
| Maximum output tokens | 1–32,768 | Bounds the advisory response |
| Daily token budget | 0–10,000,000,000 | Caps daily use; `0` disables the daily cap |
| Enabled | On or off | Allows or pauses the workload |

Budget reservations are concurrency-safe even when the daily cap is disabled. Start with conservative input and output limits, then tune them from observed evidence size, latency, and usage.

## Configure one backup

An enabled provider connection can be designated as the deployment's single backup. Select its Analysis model when enabling backup status.

On a retryable transient provider failure, DokoSoko can send the same bounded prompt and evidence to that backup once. Invalid configuration, unsafe input, exhausted budgets, and invalid structured output do not silently fail over. This keeps a provider change from changing the evidence or bypassing a safety decision.

## Version workflow instructions

Open **Advanced → Workflow prompts** to review or edit the effective instructions. The console exposes these stable workflow keys:

| Area | Workflow keys |
| --- | --- |
| Integration analysis | `integration.analysis` |
| Recipes | `recipe.brief`, `recipe.authoring`, `recipe.review` |
| Documentation | `documentation.map_enrichment` |
| SDKs | `sdk.map_enrichment`, `sdk.applicability_suggestion`, `sdk.sample_review` |

Saving an override creates a new version; it does not rewrite historical runs. Instructions are limited to 32,768 UTF-8 bytes. **Reset default** creates another version that restores DokoSoko's safe built-in instructions.

The editable instructions are only the workflow-specific portion of the prompt. The service separately applies an immutable safety policy at invocation time, so an override cannot disable prompt-injection defenses, grant authority, or enable model tool calls.

## Monitor and review

The Providers section shows call, input-token, and output-token totals. The API operation `GET /api/v1/products/{product_id}/ai-usage` provides workload usage, normalized failures, token counts, and latency for a selectable reporting window.

Review failed schemas and budget exhaustion alongside the normal [operations runbook](/guides/operations/). Provider health alone is not proof that a workflow is correctly grounded: review the exact evidence and citations on each advisory artifact.

:::caution[The model has no authority]
DokoSoko treats retrieved context as untrusted, denies model authorization decisions and tool calls, and requires citations. Human review and deterministic validation remain authoritative even when an advisory completes successfully.
:::
