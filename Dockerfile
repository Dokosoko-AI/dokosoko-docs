FROM node:22.14.0-alpine AS build

WORKDIR /workspace/dokosoko-docs

RUN corepack enable && corepack prepare pnpm@11.19.0 --activate

COPY dokosoko-docs/package.json dokosoko-docs/pnpm-lock.yaml dokosoko-docs/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY dokosoko-docs/ ./
COPY dokosoko-service/api/ /workspace/dokosoko-service/api/
ENV ASTRO_TELEMETRY_DISABLED=1
RUN pnpm build

FROM nginx:1.28-alpine

COPY --from=build /workspace/dokosoko-docs/dist/ /usr/share/nginx/html/
COPY dokosoko-docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --quiet --output-document=- http://127.0.0.1/ >/dev/null || exit 1
