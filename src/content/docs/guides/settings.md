---
title: Manage deployment settings
description: Configure tenant metadata, support destinations, AI, root access, and non-destructive system checks.
---

The Settings area is the root-administrator surface for deployment-wide configuration. Open `/settings` and use its tabs rather than treating configuration as part of an individual API.

| Console page | Route | Responsibility |
| --- | --- | --- |
| Overview | `/settings` | Open a settings area and run System Doctor |
| Tenant settings | `/settings/tenant` | Deployment identity and support-submission destinations |
| Configuration | `/settings/configuration` | Read-only effective startup values and their source |
| AI configuration | `/settings/ai` | Providers, Analysis limits, usage, and workflow instructions |
| Root access | `/settings/root` | MFA-protected root administrators |

## Run System Doctor

Choose **Run System Doctor** on the overview page after installation, a release, or a deployment-level configuration change. The `GET /api/v1/system/doctor` check is redacted, non-destructive, and reports an overall `ok` or `error` status for:

- database reachability and startup migrations;
- the presence of an active MFA-protected root administrator;
- the 256-bit master key and tenant-bound secret vault;
- the configured public origin;
- knowledge hardening, including quarantine, publication gates, visibility filters, and denial of model authority.

System Doctor diagnoses configuration; it does not repair it. It also does not replace `/healthz`, `/readyz`, backup verification, support-delivery checks, or the MCP acceptance suite in the [operations runbook](/guides/operations/).

## Edit tenant settings

Tenant settings update the singleton deployment through `PATCH /api/v1/deployment`.

| Field | Constraint |
| --- | --- |
| Name | Required; at most 120 characters |
| Slug | Lowercase letters, digits, and single hyphens; at most 63 characters |
| Description | At most 2,000 characters |
| Feedback submission URL | Optional; at most 2,048 characters |
| Error submission URL | Optional; at most 2,048 characters |

Submission URLs cannot contain user information, a query, or a fragment. Localhost destinations may use HTTP. Non-local destinations must use HTTPS on the default port or port 443. Leaving a destination empty intentionally disables delivery for the corresponding feedback or error-reporting tool; see [Support reporting](/guides/support-reporting/).

The page also displays the tenant/deployment ID, organisation ID, Catalog revision, and configuration revision. Saves include the current configuration revision so a concurrent change produces a conflict instead of being silently overwritten. Reload and review the newest values before retrying a conflicted save.

Fields declared in the central `control_plane.deployment` configuration are
marked as managed and disabled on this page. Change those values in the central
file or its environment override and restart the service. The API also rejects
a conflicting write with `409 configuration_managed`; fields not listed in
`managed_fields` remain editable. See the [configuration
reference](/reference/configuration/#managed-tenant-profile-and-initial-workspace).

Treat name, slug, and submission destinations as operational interfaces. Check links, automation, allowlists, and delivery ownership before changing them, then verify one representative submission after the change.

## Configure AI

Use `/settings/ai` for provider credentials, the Analysis workload, its limits and budget, one optional backup, and versioned workflow instructions. Environment-managed connections are visible but cannot be edited in the console, and provider credentials are never returned.

Follow [Configure advisory AI](/guides/ai-configuration/) for the complete setup and safety boundaries.

## Manage root access

Root access lists active and revoked administrators and their MFA state. Adding a root is a two-step enrollment: create the account, enroll TOTP, then verify a code. Recovery codes are shown once after successful completion and must be stored securely before closing the dialog.

Revoking a root ends that administrator's active sessions. DokoSoko rejects self-revocation and revocation of the last active root, preventing an administrator from removing the final recovery path.

Use individual root accounts, keep at least two independently controlled administrators for production, and remove access promptly when responsibilities change. Root mutations require the authenticated root session and CSRF protection; do not automate them by copying browser cookies.

:::caution[Settings change deployment authority]
Use a change record, capture the current revision, and test the affected path after every settings change. Never paste master keys, provider credentials, session cookies, recovery codes, or customer data into notes, screenshots, or diagnostic queries.
:::
