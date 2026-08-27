---
title: Quickstart
description: Run DokoSoko locally and complete the MFA-protected first-run setup.
---

Run the complete local stack with Docker Compose, then create the first root administrator and initial workspace.

## Prerequisites

- Docker with Compose v2
- A password manager or cryptographic random generator
- Port `8080` available

1. **Create the local configuration.**

   From `dokosoko-service`, copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. **Replace every required secret.**

   Set a long database password and strong bootstrap setup token. `DOKOSOKO_MASTER_KEY` must be the standard-base64 encoding of exactly 32 random bytes.

3. **Start the stack.**

   ```bash
   docker compose up --build
   ```

4. **Create the first root administrator.**

   Open `http://localhost:8080`, enter the setup token, and create the root account.

   ![The first-run form for creating the root administrator.](/screenshots/root-setup.jpg)

   On the next screen, scan the QR code with an authenticator app, or enter the displayed secret manually. Enter the current six-digit TOTP code to verify the enrolment and create the root user.

   Copy the one-use recovery codes into your password manager before selecting **I saved them, open console**. They are the only fallback if the authenticator becomes unavailable.

5. **Create the initial workspace.**

   Enter the organisation, deployment name, and first environment. The environment defaults to `Production` and becomes the first production environment. Select **Create and open console** to finish onboarding.

   To provision this identity centrally instead, copy and edit
   `dokosoko.config.example.json`, mount it into both containers, and set
   `DOKOSOKO_CONFIG_FILE` to its container path before step 3. The service
   creates the configured organisation, deployment, and environments at
   startup, so root setup opens the existing workspace rather than asking for
   it again. See [Configuration](/reference/configuration/#managed-tenant-profile-and-initial-workspace).

6. **Check readiness.**

   ```bash
   curl http://localhost:8080/healthz
   curl http://localhost:8080/readyz
   ```

:::caution[Keep the master key stable]
Stored credentials are encrypted with `DOKOSOKO_MASTER_KEY`. Losing it makes them unrecoverable.
:::

`DOKOSOKO_SETUP_TOKEN` is required only until the first MFA-protected root
administrator is created. Remove it after setup. On subsequent starts, the
service reads the persisted setup state and disables bootstrap without
requiring the token.

## What runs

The Compose stack starts the Go service and static console, an isolated crawler worker, and PostgreSQL 17 with pgvector. PostgreSQL and the private upload volume use durable volumes.

## Next step

Create the first API, attach reviewed documentation or an OpenAPI contract, configure runtime access if tools need it, and publish an immutable API snapshot. Follow [Set up and publish an API](/guides/api-setup/).
