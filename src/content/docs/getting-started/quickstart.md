---
title: Quickstart
description: Run DokoSoko locally and complete the MFA-protected first-run setup.
---

Run the complete local stack with Docker Compose, then create the first root administrator.

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

   Set a long database password and one-time setup token. `DOKOSOKO_MASTER_KEY` must be the standard-base64 encoding of exactly 32 random bytes.

3. **Start the stack.**

   ```bash
   docker compose up --build
   ```

4. **Create the first root administrator.**

   Open `http://localhost:8080`, enter the setup token, and create the root account.

   ![The first-run root-user form with secret fields left blank.](/screenshots/root-setup.jpg)

   Enrol the generated TOTP secret in an authenticator and enter the current code.

   ![The mandatory TOTP enrollment step for the first root user.](/screenshots/mfa-enrollment.jpg)

   Store the one-use recovery codes in your password manager before continuing.

   ![The final first-run step displaying one-use recovery codes.](/screenshots/recovery-codes.jpg)

5. **Check readiness.**

   ```bash
   curl http://localhost:8080/healthz
   curl http://localhost:8080/readyz
   ```

:::caution[Keep the master key stable]
Stored credentials are encrypted with `DOKOSOKO_MASTER_KEY`. Losing it makes them unrecoverable.
:::

## What runs

The Compose stack starts the Go service and static console, an isolated crawler worker, and PostgreSQL 17 with pgvector. PostgreSQL and the private upload volume use durable volumes.

## Next step

Create the first API, attach reviewed documentation or an OpenAPI contract, configure runtime access if tools need it, and publish an immutable API snapshot. Follow [Set up and publish an API](/guides/api-setup/).
