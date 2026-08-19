---
title: Operate DokoSoko
description: Monitor health, analytics, integration runs, and audit history without collecting sensitive payloads.
---

DokoSoko separates service health, product analytics, integration-run state, and append-only audit history so operators can answer different questions without inspecting private payloads.

![The Analytics view showing activation, MCP, tool, package, and integration-run metrics.](/screenshots/analytics.jpg)

## Health and readiness

| Endpoint | Meaning |
| --- | --- |
| `GET /healthz` | The process is running |
| `GET /readyz` | Required dependencies, including the database, are ready |
| `GET /api/v1/system/doctor` | Authenticated diagnostic checks for root administrators |

Use readiness—not only liveness—for load balancer admission and deployment rollouts.

Run **System Doctor** from **Settings** after deployment or any database, key, storage, public-origin, or worker configuration change.

![Platform settings showing database, model-hardening, identity, root-security, and System Doctor controls.](/screenshots/system-settings.jpg)

## Analytics

Product analytics track authorized and active users, MCP channel use, tools, packages, integration runs, validated success, and daily volume. They intentionally exclude raw queries, argument values, tokens, and secret plaintext.

Treat a metric change as a prompt for investigation, then use integration-run status and audit events to establish what happened.

## Integration runs

Runs are owner-scoped and move to deterministic terminal states. Record completion only after the external integration has reached a validated outcome; timeouts and partial work should finish as explicit failures rather than remaining ambiguous.

Start a run with the environment and a concrete outcome that can be verified without storing secrets or raw prompts.

![The Start integration run form with a production environment and a deterministic requested outcome.](/screenshots/integration-run-configuration.jpg)

Close each active run as **Validated** or **Failed** as soon as external evidence is available. The first-pass rate is calculated from completed runs.

![The Integration runs page showing one active, private run and its terminal-state actions.](/screenshots/integration-runs.jpg)

## Audit and recovery

The organisation audit feed records administrative and security-relevant state transitions. Forward logs and metrics to your existing observability system, and alert on repeated policy failures, crawler quarantine spikes, package-integrity errors, and readiness failures.

![The append-only Activity and audit view, which excludes secret values.](/screenshots/activity-audit.jpg)

Back up PostgreSQL and the artifact volume together. Keep the 32-byte master key in recoverable secret storage and test database, artifact, and key restoration before production onboarding.

## Routine checks

1. Confirm `/readyz` and System Doctor are healthy.
2. Review failed integration runs and policy-hook latency.
3. Review crawl quarantines and pending publication changes.
4. Check expiring provider credentials and integration certificates.
5. Export or inspect audit history for unexpected administrative actions.
6. Exercise backup restoration on a schedule.
