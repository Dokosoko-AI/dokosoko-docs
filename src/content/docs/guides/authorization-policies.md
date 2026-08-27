---
title: Configure grants and action policies
description: Map customer grants to API actions and pin exact active policy revisions to reviewed tools.
---

An API action policy, called an `AuthorizationPoint` in the service contract, maps one stable action to the grants, confirmation, and decision freshness required for an exact tool call. It contains no callback URL or credential and does not authenticate a customer.

Use [customer identity and access evaluation](/guides/identity/) to establish the customer and current grants. Use [runtime Authorization](/guides/runtime-authorization/) separately for the fixed upstream endpoint, secret, and provider hooks.

## Understand the policy layers

| Layer | Ownership | Purpose |
| --- | --- | --- |
| Grant definition | Deployment | Registers a stable key such as `customers.read`; the definition never grants access by itself |
| Access evaluation | Identity provider integration | Returns the current signed-in customer’s bounded grant keys and evaluation time |
| Action policy | One API | Requires registered grants, an action type, confirmation, and a decision TTL |
| Tool binding | One API | Pins one exact published tool revision to one exact active action-policy revision |
| API publication | One API revision | Freezes the reviewed tool and policy selections delivered through MCP |

At runtime DokoSoko also checks the live grant registry and the current exact action-policy revision. A missing, deprecated, changed, or cross-API policy fails closed.

## Register the grant vocabulary

1. Open **APIs**, select the API, and open **Tools**.
2. Expand **Deployment grant registry — Advanced** under **Action Policies**.
3. Choose **Register grant**.
4. Enter the exact dotted lower-case key returned by your access-evaluation API, a display name, description, risk label, and state.

Grant keys must start with a lower-case letter, contain dotted lower-case segments, and may use numbers, underscores, or hyphens. A key is immutable after creation. Display metadata, risk, and state use optimistic revision control and may be updated; use **deprecated** when a key must no longer be accepted.

:::caution[Registration is not entitlement]
A grant definition is only deployment-owned vocabulary. A customer receives a grant only when the configured identity access-evaluation operation returns that exact active key.
:::

## Create an action policy

From the same **Tools** workspace:

1. In **API Action Policies**, choose **Add policy**.
2. Enter a stable dotted lower-case policy key, name, and description.
3. Choose **read**, **write**, or **destructive**.
4. Select up to 32 required active grant definitions.
5. Set the decision TTL from 0 to 3600 seconds. A value of `0` is normalized to the 300-second default.
6. Require explicit confirmation when appropriate. Destructive policies always require confirmation.
7. Save as **draft** while reviewing, then change the policy to **active** before binding a tool.

The decision TTL is the maximum accepted age of the customer’s current access evaluation for this action. A missing evaluation ID, missing evaluation time, future timestamp, or decision older than the TTL denies discovery and execution until the client obtains fresh access.

## Match the tool’s effect

The selected policy must be at least as strong as the tool’s declared effect. Where a reviewed tool has no explicit effect, DokoSoko applies the HTTP-method minimum:

| Tool operation | Minimum action policy |
| --- | --- |
| `GET` | read |
| `POST`, `PUT`, or `PATCH` | write |
| `DELETE` | destructive |

A destructive policy is forced to confirmation. A malformed or unsupported tool cannot be paired with a weaker policy. Confirmation is an exact, short-lived challenge bound to the customer, tool revision, arguments, and applicable idempotency metadata—not a free-form boolean supplied by the client.

## Bind a reviewed tool

1. Publish the [API-owned or common tool](/guides/custom-tools/) after deterministic review.
2. In the API’s **Tools** tab, choose **Attach tool**.
3. Select an eligible tool owned by this API or a reusable common tool.
4. Select one active action policy.
5. Choose **Attach tool**, then **Save API bindings**.
6. Run the API’s **Test** preflight and publish a new [API snapshot](/guides/api-setup/).

Saving replaces the API’s complete tool-binding set atomically. Every selection must resolve to the current exact, non-drifted published tool revision and the current exact active policy revision owned by the same API. A validation failure leaves the previously saved set intact.

## Change or retire policy safely

Grant definitions have **active** and **deprecated** states. Action policies move through **draft**, **active**, and **deprecated**. Neither kind has a delete workflow; lifecycle state preserves identifiers and audit evidence.

:::caution[An active policy edit is a live revocation boundary]
Editing a policy increments its revision. Existing exact bindings then become stale, and tools using the prior published revision disappear from discovery or deny execution until the new policy revision is reviewed, rebound, and included in a new API publication.
:::

Use this change sequence:

1. Identify every tool bound to the policy and decide whether the change is intended to revoke access immediately.
2. Edit the policy. Keep its stable key unchanged.
3. Review each **Stale / unresolved** tool row, select the current active policy revision, and save the complete API binding set.
4. Run preflight, exercise positive and negative grant cases, verify confirmation where required, and publish the API again.

Deprecating a required grant also removes it from the live active registry. Policies that still require it fail preflight, disappear from eligible tool discovery, and deny calls until they are revised or the grant is reactivated.

## Diagnose fail-closed results

- **Policy cannot be saved:** register every required grant as active, use a valid dotted key, keep the TTL within bounds, and enable confirmation for destructive actions.
- **Tool cannot be attached:** publish the current non-drifted tool, use a policy owned by the same API, make it active, and choose an action type at least as strong as the tool effect.
- **Binding is stale:** the tool or policy revision changed after selection. Review and pin both current exact revisions again.
- **Tool is absent from discovery:** check the exact API publication, customer grants, live grant-definition states, policy revision/state, and decision age.
- **Call requests confirmation:** complete the returned exact confirmation challenge; a raw `confirmed: true` flag is insufficient.
- **Preflight fails:** resolve every unregistered grant, inactive policy, unresolved exact binding, drifted tool, and missing customer-identity prerequisite before publishing.

Use [MCP preview and acceptance testing](/guides/mcp/) to compare positive and negative grant projections. The canonical grant, policy, and atomic tool-binding operations are available through the [Control Plane API](/reference/http-api/) at `/api/v1/grant-definitions`, `/api/v1/integrations/{integration_id}/authorization-points`, and `/api/v1/integrations/{integration_id}/tools`.
