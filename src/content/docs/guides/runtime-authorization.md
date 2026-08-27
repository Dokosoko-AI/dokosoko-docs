---
title: Configure runtime Authorization
description: Connect an API to one reusable upstream credential, fixed service endpoint, and provider-owned authorization hooks.
---

Runtime **Authorization** is the reusable upstream access profile DokoSoko uses for API-owned HTTP tools. It owns the authentication method, encrypted secret and fixed headers, environment-variable name, key-management link, and provider hooks. The API stores a separate environment-specific endpoint binding that refers to the profile.

:::note[This is not an action policy]
Runtime Authorization answers “How may DokoSoko call this upstream service?” [Action policies](/guides/authorization-policies/) answer “May this customer invoke this exact tool?” Customer identity and grants remain a separate [Private MCP identity flow](/guides/identity/).
:::

## Connect an API

The **Add API** wizard can create or reuse an Authorization while it creates the API. To configure an existing draft:

1. Open **APIs**, select the API, and open **Authorization**.
2. Choose **Use existing** to connect an active reusable Authorization from the same environment, or **Create new** to configure a separate profile.
3. For a new endpoint binding, enter the fixed API base URL. This URL belongs to the API, not to the reusable Authorization.
4. Select the authentication method and enter its write-only secret. Add any fixed encrypted headers the upstream requires.
5. Enter the environment-variable name, key-management URL, access-evaluation URL, and usage URL.
6. Choose **Create & connect**. When reusing a profile, choose **Connect Authorization** instead.

![An API Authorization workspace showing a fixed API-key header, write-only value, environment-variable name, and provider-hook configuration.](/screenshots/api-authorization.jpg)

Reusing an Authorization does not copy its secret or hooks into the API. It creates a reference to the same profile, so later credential and hook changes affect every connected API. The workspace shows the number of connected APIs and only credential-redacted metadata.

## Choose the authentication method

The console supports these reusable credential-bearing methods:

| Method | Required configuration |
| --- | --- |
| API key header | At least one fixed safe header name and write-only value |
| Bearer token | Write-only bearer token |
| Custom header | At least one fixed safe header and write-only value |
| Basic Auth | Username and write-only password |
| OAuth 2.0 client credentials | Client ID, fixed token URL, write-only client secret, and optional scopes |

Additional fixed headers may be added where required. DokoSoko rejects duplicate or unsafe routing, proxy, cookie, and framing headers. Header values and the primary credential are encrypted and never returned; responses expose only presence, state, version, expiry, and a short fingerprint.

The authentication method is immutable after creation. Create a new Authorization and rebind the API when the upstream changes method. Other metadata is updated with optimistic revision control, so a stale save returns a conflict instead of overwriting a newer change.

## Configure names and URLs

- **Environment variable** must begin with an upper-case letter and contain only upper-case letters, numbers, and underscores, up to 128 characters. It is agent-facing metadata, not the secret value, and must be unique within the deployment environment.
- **API base URL** is the fixed credential-free destination for this API’s generated HTTP tools.
- **Key management URL** is a credential-free operator link. DokoSoko stores it but never fetches it.
- **Access evaluation URL** is a required synchronous provider hook for reusable Authorizations.
- **Usage URL** is a required asynchronous provider hook for reusable Authorizations.

Remote runtime and hook destinations must use credential-free HTTPS URLs. User information, query strings, and fragments are rejected. HTTP is allowed only for explicit localhost development destinations.

## Understand the execution boundary

For an API-owned runtime tool, DokoSoko applies the boundaries in this order:

1. Resolve the exact published tool and [action-policy revision](/guides/authorization-policies/), then validate customer identity, current grants, decision freshness, arguments, and confirmation.
2. Call the Authorization’s access-evaluation hook with the same fixed upstream authentication. A timeout, transport failure, non-success status, malformed response, explicit denial, or missing decision ID denies execution before the upstream operation is called.
3. Call the API’s fixed base URL and relative operation path with the active Authorization credential and fixed headers.
4. After a successful operation, queue a usage event for asynchronous delivery to the fixed usage URL.

The runtime hook is separate from the deployment identity provider’s `/v1/access/evaluations` operation. The identity operation establishes the signed-in customer and current grant set; the runtime hook lets the upstream provider approve the exact API/tool call.

## Rotate safely

Rotation changes the active secret without changing API endpoint bindings:

1. Check the connected-API count and the operator key-management link.
2. Provision the replacement credential upstream while the old credential is still valid when the provider supports overlap.
3. In **Credential lifecycle**, choose **Rotate**, enter the new write-only value, and optionally set its expiry.
4. Test a safe operation for every affected API.
5. Revoke the retiring version in DokoSoko and retire it at the upstream provider.

The new version becomes active for every connected API immediately; the prior active version moves to **retiring**. Versions can also become **expired** or **revoked**. Revocation targets one exact version, is immediate and irreversible, and a repeated completed revoke is idempotent. Rotate before revoking the active version—otherwise every connected API loses an eligible credential.

## Recover from failures

- If the Add API wizard creates the draft but Authorization connection fails, finish the configuration from the API workspace. Do not create a duplicate API.
- An existing profile is selectable only when it is active, has an eligible credential, and belongs to the API’s environment.
- Invalid credential-free URLs, an invalid environment-variable name, unsafe headers, missing method-specific fields, or missing hook URLs block saving.
- A missing, revoked, or disabled Authorization blocks publication preflight. Tool execution independently refuses an expired or otherwise ineligible active credential, so it still fails closed if eligibility changes after preflight.
- An unavailable or denying access-evaluation hook prevents the upstream operation. Usage delivery is asynchronous and does not authorize the call.
- After configuration or rotation, run the API’s **Test** preflight and a controlled safe tool call before publishing or returning the API to service.

The canonical operations are documented in the [Control Plane API](/reference/http-api/): API binding at `/api/v1/integrations/{integration_id}/authorization`, reusable profiles at `/api/v1/authorizations`, usage inspection, rotation, and exact-version revocation.
