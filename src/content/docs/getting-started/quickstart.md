---
title: Quickstart
description: Run DokoSoko locally and complete the secure first-run setup.
---

Run a complete local DokoSoko stack with Docker Compose, then create the first MFA-protected root administrator.

## Prerequisites

- Docker with Compose v2
- A password manager or operating-system cryptographic random generator
- Ports `8080` available for DokoSoko

1. **Create the local configuration.**

   From `dokosoko-service`, copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. **Replace every required secret.**

   Set a strong database password and one-time setup token. `DOKOSOKO_MASTER_KEY` must be exactly 32 random bytes encoded with standard base64.

3. **Start the stack.**

   ```bash
   docker compose up --build
   ```

4. **Create the first root administrator.**

   Open `http://localhost:8080`, enter the setup token, and create the root account. The setup token and password are secret inputs and should come from your deployment configuration and password manager.

   ![The first-run root-user form with the setup token and password fields left blank.](/screenshots/root-setup.jpg)

   Add the displayed TOTP secret to an authenticator, then enter the current six-digit code. The secret shown below is illustrative; your deployment generates a different value.

   ![The mandatory TOTP enrollment step for the first root user.](/screenshots/mfa-enrollment.jpg)

   Store the one-use recovery codes in your password manager before opening the console. The codes in the screenshot are examples, not valid credentials.

   ![The final first-run step displaying one-use recovery codes.](/screenshots/recovery-codes.jpg)

5. **Check readiness.**

   ```bash
   curl http://localhost:8080/healthz
   curl http://localhost:8080/readyz
   ```

:::caution[Keep the master key stable]
Integration credentials are encrypted with `DOKOSOKO_MASTER_KEY`. Back it up securely before adding production credentials; losing it makes those credentials unrecoverable.
:::

## What runs

The Compose stack starts the Go control plane and static console, an isolated Crawlee/Playwright worker, and PostgreSQL 17 with pgvector. Database and artifact data use persistent volumes.

## Next step

Create an organisation, product, and production environment in the console. The remaining guides explain how to publish the first knowledge source and connect agent access.
