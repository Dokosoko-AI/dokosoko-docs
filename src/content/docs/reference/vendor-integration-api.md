---
title: Integration API contracts
description: Implement the separately authenticated customer identity and backend delivery operations called by DokoSoko.
---

DokoSoko calls two deliberately separate vendor-owned contracts. They may use different HTTPS origins and never share credentials.

| Contract | Purpose | Authentication |
| --- | --- | --- |
| [Customer Identity Integration API](/api/identity-integration/) | Evaluate the currently authenticated customer during private MCP authorization | Live delegated vendor access token |
| [Backend Integration API](/api/backend-integration/) | Deliver user-approved support submissions from the durable outbox | Encrypted service bearer scoped to one backend connection |

Download the canonical [identity OpenAPI contract](/identity-integration-openapi.yaml) and [backend OpenAPI contract](/backend-integration-openapi.yaml). The explorers cannot execute requests or accept credentials.

## Customer access evaluation

DokoSoko calls the fixed path on the delegated API origin:

```http
POST /v1/access/evaluations
Authorization: Bearer VENDOR_USER_ACCESS_TOKEN
Idempotency-Key: aeval_…
X-External-Request-ID: req_…
Content-Type: application/json

{}
```

Derive the user and customer from the delegated access token. The request body is intentionally empty: it cannot override token identity or choose an integration.

Return a bounded grant evaluation with an explicit expiry:

```json
{
  "id": "aeval_01JY4R8T7N6M5K4J3H2G1F0E9D",
  "grants": ["developer.pro", "voice.calls.read"],
  "expires_at": "2026-08-22T13:00:00Z",
  "policy_version": "policy_2026_08_22"
}
```

DokoSoko defines the tool catalog and required grants. The evaluation only narrows access. A timeout, transport error, non-success response, malformed body, expired result, or inactive customer denies authorization.

Retain the result for at least 10 minutes under the supplied idempotency key. Retries of one logical evaluation reuse that key and carry a new request ID.

## Backend support delivery

Bug reports and feedback share one operation on a configured backend connection:

```http
POST /v1/support-submissions
Authorization: Bearer SERVICE_DELIVERY_CREDENTIAL
Idempotency-Key: SUBMISSION_ID
X-External-Request-ID: req_…
Content-Type: application/json
```

DokoSoko sends a schema-bounded envelope containing the submission ID, creation time, user-approved report, trusted product and integration context, and contact information only when the user approved contact.

Respond with `202 Accepted`:

```json
{
  "id": "submission_01JY4S0R42",
  "status": "accepted",
  "external_id": "BUG-42",
  "external_url": "https://support.vendor.example/tickets/BUG-42"
}
```

Delivery is at least once. DokoSoko retries network failures, `408`, `429`, and `5xx` responses with the same idempotency key and a new request ID. Retain the result for at least 24 hours. Return the original result for the same key and payload, and `409` if a key is reused with a different payload. Other `4xx` responses are permanent.

## Why the contracts are separate

- A delegated customer token is not a service credential.
- Identity evaluation is synchronous and fails closed during authorization.
- Support delivery is asynchronous, durable, and at least once.
- Identity and backend systems may have different origins and operational owners.
- Disabling backend delivery must not break customer sign-in.

Usage reporting is an ordinary API operation or policy-bound tool, not a special hook. Provider-owned instance and credential lifecycle uses the separate [Access Provider API](/reference/provider-api/). Package downloads and SDK registries remain outside the runtime contract. The control plane may embed bounded metadata for one exact externally hosted package release in an Integration manifest, but registries deliver the bytes. DokoSoko rejects URL userinfo, queries, fragments, and obvious credential-bearing install-command forms; operators must keep credentials out of URL paths and all free-text metadata. A separately operated verifier should check digest, optional provenance or SBOM, and installation before operational use, but DokoSoko neither stores that evidence nor enforces that it exists. DokoSoko does not download, sign, verify, or proxy packages.
