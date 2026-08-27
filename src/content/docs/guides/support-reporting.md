---
title: Collect bug reports and feedback
description: Enable consent-gated Private MCP reporting tools, encrypted storage, and idempotent support delivery.
---

DokoSoko provides two optional, platform-owned Private MCP tools:

| Tool | Use |
| --- | --- |
| `support.report_bug` | Submit a connector-specific defect with reproduction details, errors, and bounded sanitized diagnostics |
| `support.submit_feedback` | Submit feedback in the user's own meaning, with optional category and user-supplied rating |

Neither tool is available on Public MCP. Each can be enabled independently.

## Configure reporting

Open **Settings → Bug reports & feedback**.

1. Enable either or both tools.
2. Enter the one support-delivery credential used with the configured vendor API origin.
3. Choose encrypted retention between 1 and 365 days.
4. Save and reload tools in an authenticated MCP client.

Enabling either submission kind requires the vendor API origin and one delivery credential. DokoSoko rejects an incomplete route instead of accepting reports it cannot deliver. A previously queued submission moves to `held` if its pinned route is later archived or disabled; reactivating that same route resumes matching held records. The credential is encrypted and never returned to the browser or MCP client.

## Agent consent policy

DokoSoko supplies a fixed platform-owned instruction through server discovery and each tool definition. Before a report is submitted, the agent must:

1. Identify that the defect or feedback is related to the connector.
2. Prepare a concise, sanitized report.
3. Show the user a preview of exactly what will be shared.
4. Obtain explicit approval.
5. Call the tool with confirmation metadata.

The server does not rely on instructions alone. It requires `_meta.confirmed=true`, validates a closed bounded schema, and rejects likely credentials, bearer tokens, private keys, and JWTs. Agents must not submit complete files, unrelated conversation, invented ratings, or unapproved contact details.

## What DokoSoko adds

The agent supplies the user-approved report body. DokoSoko adds trusted context it already knows:

- product and effective product version;
- manifest hash and catalog revision;
- selection source, environment, and installation;
- authenticated subject and external customer ID;
- request ID and confirmation time.

Because the MCP endpoint is stateless, DokoSoko cannot recover a previous conversation, error, source file, or failed argument payload automatically. The agent must include the relevant sanitized details in the reporting call.

Contact name and email are included only when `allow_contact` is explicitly approved. The authenticated subject remains available to the vendor for account-safe correlation.

## Holding and delivery

Every accepted submission is encrypted before it is stored. Only its kind, pseudonymous actor key, delivery state, attempt count, timestamps, and external ticket metadata remain plaintext for routing.

Delivery uses a durable outbox:

```text
pending → delivering → delivered
             └──────→ pending retry → failed
held ── route reactivated ──→ pending
```

The submission ID is sent as `Idempotency-Key`; every attempt receives a new provider-neutral `X-External-Request-ID`. The vendor must create no more than one external record for that ID. Network failures, `408`, `429`, and `5xx` retry with bounded backoff; other `4xx` responses are permanent. Administrators can retry held or failed records after fixing delivery.

The endpoint returns `202 Accepted` with:

```json
{
	"id": "submission_01JY4S0R42",
	"status": "accepted",
  "external_id": "BUG-42",
  "external_url": "https://support.vendor.example/tickets/BUG-42"
}
```

See the [Backend Integration API contract](/reference/vendor-integration-api/#backend-support-delivery) for the complete delivery envelope.

## Operational checklist

- Test both tools with a minimally authorized account.
- Confirm an unconfirmed call creates no inbox record.
- Verify likely-secret detection with a disposable fake token.
- Confirm Public MCP never lists or executes either tool.
- Return the same external record when a submission ID is retried.
- Review failed deliveries and retention before production rollout.
