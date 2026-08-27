---
title: Collect bug reports and feedback
description: Enable consent-gated Private MCP reporting tools and operate the plaintext durable delivery outbox.
---

DokoSoko provides two optional Private MCP tools:

| Tool | Root destination |
| --- | --- |
| `support.report_bug` | Error submission URL |
| `support.submit_feedback` | Feedback submission URL |

The tools are absent until their matching deployment-level destination is configured. They never appear on Public MCP.

## Configure destinations

Open deployment settings and set either or both fixed HTTPS URLs. There is no per-API route and no separate delivery credential. Emptying a URL disables the matching tool for new submissions.

The configured destination is snapshotted into each accepted outbox record. Delivery uses pinned DNS, no redirects, a stable submission ID as the idempotency key, bounded leases, and bounded retries.

## Consent policy

Before calling either tool, the agent must:

1. establish that the report concerns the connected product;
2. prepare a concise sanitized report;
3. show the user exactly what will be shared;
4. obtain explicit approval;
5. call the tool with the required confirmation metadata.

The server also validates a closed bounded schema and rejects likely credentials, bearer tokens, private keys, and JWTs. Agents must not send complete files, unrelated conversation, invented ratings, or unapproved contact data.

## Stored context

The accepted report is stored as schema-bounded plaintext. DokoSoko adds trusted product and API publication context plus a pseudonymous reporter reference. It cannot recover prior chat history, source files, failed tool arguments, or raw requests automatically.

:::caution[The outbox is plaintext]
Restrict administrative access, never submit credentials, and treat destination systems as processors of user-approved support data.
:::

## Delivery states

```text
queued → delivering → delivered
              └────→ queued retry → failed
```

Administrators can list bounded metadata or open one exact report in the support outbox. The list includes state, attempts, safe failure category, and delivery timestamp without including full content.

## Operational checks

- Confirm unconfirmed calls create no outbox record.
- Test likely-secret rejection with disposable fake tokens.
- Submit one feedback and one bug report in staging.
- Confirm each arrives once and moves to `delivered`.
- Alert on `failed` or `queued`/`delivering` records older than 15 minutes.
- Confirm Public MCP never advertises either tool.
