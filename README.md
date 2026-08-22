# DokoSoko documentation

The product documentation site for DokoSoko, built with Astro and Starlight.

## Project structure

```
.
├── public/screenshots/       product console screenshots
├── src/
│   ├── content/docs/         Markdown and MDX documentation
│   ├── pages/openapi.yaml.ts generated canonical API download
│   └── styles/custom.css     DokoSoko theme overrides
└── astro.config.mjs          Starlight navigation and Mermaid setup
```

## Commands

| Command | Action |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the local documentation server |
| `pnpm build` | Generate the production site in `dist/` |
| `pnpm preview` | Preview the generated production site |

Run commands from `dokosoko-docs`. The build publishes the canonical contracts from `../dokosoko-service/api/` at `/openapi.yaml`, `/widget-runtime-openapi.yaml`, `/provider-openapi.yaml`, `/identity-integration-openapi.yaml`, and `/backend-integration-openapi.yaml`.

## Authoring

- Add guides under `src/content/docs` and register them in `astro.config.mjs`.
- Use fenced `mermaid` blocks for architecture, sequence, and policy diagrams.
- Put stable console captures in `public/screenshots` and include meaningful alt text.
- Run a production build before publishing; it validates content routes and generates the search index.
