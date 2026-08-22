---
title: Connect MCP
description: Connect authenticated or public agents to DokoSoko's Stateless MCPv2 endpoints.
---

The **Agent access** page exposes the deployment's private and public MCP connection details. Embedded customer assistants use a separate, short-lived session boundary; see [Embed an authenticated widget](/guides/embedded-widgets/).

## Before you connect

Choose the access model first:

| Connection | Use it for | Required setup |
| --- | --- | --- |
| **Private MCP** | Signed-in developers, private knowledge, custom tools, access instances, and credentials | Vendor identity, access evaluation, an exact client redirect URI, and at least one published resource or tool |
| **Public MCP** | Anonymous access to approved knowledge | Public MCP enabled and at least one published resource explicitly marked public |

DokoSoko is **[Stateless MCPv2 Only](https://blog.modelcontextprotocol.io/posts/2026-07-28/)** and requires protocol revision `2026-07-28`. Configure a compatible remote HTTP client, not a local `stdio` command. Older clients that depend on `initialize`, logical sessions, or pre-v2 metadata cannot connect.

## Private MCP

Authenticated agent clients connect to:

```text
https://YOUR_DOKOSOKO_ORIGIN/mcp
```

Use the OAuth flow to obtain an access token bound to the exact `/mcp` resource. The private surface can expose published sources, custom tools, Access Provider capabilities, and enabled consent-gated `support.report_bug` and `support.submit_feedback` tools allowed by the caller's customer account and grants.

### Configure a private connection

1. **Configure product identity.**

   In **Settings → Identity & customer accounts**, add the vendor OIDC issuer, client credentials, external-customer claim, vendor API origin, and stable integration ID. Wildcards are rejected. See [Connect identity and customer access](/guides/identity/) for the complete setup.

2. **Copy the private endpoint and product ID.**

   Open **Agent access** and copy the private endpoint. The OAuth `client_id` is the same value as `PRODUCT_ID`.

3. **Configure the client’s OAuth connection.**

   Use the following values when the client supports a remote OAuth-backed MCP server:

   | Setting | Value |
   | --- | --- |
   | MCP URL | `https://YOUR_DOKOSOKO_ORIGIN/mcp` |
   | Authorization URL | `https://YOUR_DOKOSOKO_ORIGIN/oauth/authorize` |
   | Token URL | `https://YOUR_DOKOSOKO_ORIGIN/oauth/token` |
   | Client ID | `PRODUCT_ID` |
   | Grant | Authorization code with PKCE |
   | PKCE method | `S256` |
   | Scope returned by DokoSoko | `mcp:private` |

   The authorization request must also include `product_id=PRODUCT_ID`. The redirect URI must exactly match one of the values saved in the product identity configuration.

4. **Complete vendor sign-in.**

   Start the connection from the MCP client, sign in with the vendor identity provider, and allow DokoSoko to resolve the customer account and grants. DokoSoko issues a bearer token no longer-lived than the upstream token or access evaluation.

5. **Verify the entitled tool set.**

   Reload MCP tools and confirm the client sees the deployment manifest and only the knowledge, custom tools, Access Provider capabilities, and support-reporting tools allowed for that account and effective version. Repeat with a minimally authorized test account before rollout.

If a client cannot perform the OAuth flow itself, use an MCP-capable adapter that can complete authorization-code + PKCE and attach the resulting token as an HTTP bearer token. Do not paste a long-lived vendor credential into client configuration.

For clients that accept a short-lived token through an environment-backed header, the connection shape is:

```json
{
  "mcpServers": {
    "dokosoko-private": {
      "type": "http",
      "url": "https://YOUR_DOKOSOKO_ORIGIN/mcp",
      "headers": {
        "Authorization": "Bearer ${DOKOSOKO_ACCESS_TOKEN}"
      }
    }
  }
}
```

:::caution[Keep access tokens out of source control]
Environment-variable syntax varies by client. Store the one-hour DokoSoko access token in the client’s secret or environment facility; never commit a resolved token to a shared configuration file.
:::

## Public MCP

Anonymous clients connect to:

```text
https://YOUR_DOKOSOKO_ORIGIN/mcp/public
```

Public MCP is off by default, read-only, rate-limited, and restricted to resources that are both published and explicitly public. Tools, projects, credentials, and private resources are never available on this surface.

### Configure a public connection

1. **Publish the resources you want to expose.**

   In **Sources**, publish each approved revision and change its visibility to **Public**. Publication and public visibility are separate controls.

2. **Enable Public MCP.**

   Open **Agent access**, enable **Public MCP**, acknowledge the anonymous-access warning, and copy the public endpoint.

   ![The confirmation dialog required before authentication-free Public MCP can be enabled.](/screenshots/public-mcp-confirmation.jpg)

3. **Add the remote server to your MCP client.**

   Use these connection values:

   | Setting | Value |
   | --- | --- |
   | Name | `dokosoko-PRODUCT_ID` |
   | Transport | HTTP or Streamable HTTP |
   | URL | The copied public endpoint |
   | Authentication | None |

   Clients that use an `mcpServers` JSON object typically accept a configuration shaped like this:

   ```json
   {
     "mcpServers": {
       "dokosoko": {
         "type": "http",
         "url": "https://YOUR_DOKOSOKO_ORIGIN/mcp/public"
       }
     }
   }
   ```

4. **Reload the client and verify discovery.**

   Confirm the connection reports the `DokoSoko` server and discovers `search_knowledge`. Only tools backed by currently published public resources will return data.

:::note[Client configuration formats differ]
Some clients call the transport `http`; others call it `streamable-http` or expose it as a **Remote MCP server** form. Use the field names required by your client while preserving the URL and authentication mode above.
:::

## Verify the endpoint directly

Use a protocol request to separate endpoint or authorization problems from client configuration problems:

```bash
curl --request POST \
  --header 'Content-Type: application/json' \
  --header 'MCP-Protocol-Version: 2026-07-28' \
  --header 'Mcp-Method: tools/list' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28"}}}' \
  https://YOUR_DOKOSOKO_ORIGIN/mcp/public
```

For private MCP, use the private URL and add `--header "Authorization: Bearer $DOKOSOKO_ACCESS_TOKEN"`. A successful response contains a JSON-RPC `result.tools` array. An empty result from Public MCP usually means no resource is simultaneously published and public, or Public MCP is still disabled.

## Product and version discovery

DokoSoko resolves a product version before returning discovery or executing any managed knowledge or tool operation. A registered installation selected by the signed OIDC installation claim wins, followed by its environment pin, the authenticated customer-account pin, and then active healthy Latest/LTS channels with deterministic rollout and safe fallbacks.

Use `server/discover` to read the complete `result.product` manifest, or call these built-in tools:

| Tool | Returns |
| --- | --- |
| `product.get_manifest` | Description, catalog revision, manifest hash, effective version, selection source, product/API artifacts, operational warnings, and available versions |
| `product.versions.list` | Effective version plus active Latest, LTS, rollout, drift, deprecated, replacement, and sunset metadata |

The product version is a compatibility snapshot and may contain independently versioned APIs—for example Voice API v3 and Messages API v2. It is not the MCP protocol revision. Preview versions are visible only to an exactly pinned caller; drifted or sunset selections warn and fail closed for managed execution. See [Build a Product Definition](/guides/product-definitions/#what-agents-discover) for the complete model.

## Rollout checklist

- Test private MCP with a minimally entitled account.
- Verify denied tools are absent from discovery.
- Confirm public MCP returns only explicitly public resources.
- Review the public rate limit and publication inventory.
- Confirm analytics and audit events appear without raw queries, arguments, or secrets.
