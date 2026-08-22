// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({
			autoTheme: true,
			enableLog: false,
			mermaidConfig: {
				flowchart: { curve: 'basis' },
				themeVariables: { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
			},
		}),
		starlight({
			title: 'DokoSoko',
			description: 'Documentation for the DokoSoko delivery control plane.',
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: { name: 'theme-color', content: '#111827' },
				},
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Why DokoSoko?', slug: 'concepts/why-dokosoko' },
						{ label: 'Quickstart', slug: 'getting-started/quickstart' },
						{ label: 'Production deployment', slug: 'getting-started/deployment' },
					],
				},
				{
					label: 'Understand DokoSoko',
					items: [
						{ label: 'Architecture', slug: 'concepts/architecture' },
						{ label: 'Security model', slug: 'concepts/security' },
					],
				},
				{
					label: 'Product guides',
					items: [
						{ label: 'Set up a product', slug: 'guides/product-setup' },
						{ label: 'Build a Product Definition', slug: 'guides/product-definitions' },
						{ label: 'Publish knowledge', slug: 'guides/sources' },
						{ label: 'Generate SDKs', slug: 'guides/generated-sdks' },
						{ label: 'Create custom tools', slug: 'guides/custom-tools' },
						{ label: 'Import third-party MCP tools', slug: 'guides/mcp-bridges' },
						{ label: 'Connect identity & policy', slug: 'guides/identity' },
						{ label: 'Implement the Provider API', slug: 'guides/provider-api' },
						{ label: 'Connect MCP', slug: 'guides/mcp-widgets' },
						{ label: 'Embed an authenticated widget', slug: 'guides/embedded-widgets' },
						{ label: 'Collect bug reports & feedback', slug: 'guides/support-reporting' },
						{ label: 'Operate DokoSoko', slug: 'guides/operations' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Control Plane API', slug: 'reference/http-api' },
						{ label: 'Widget Runtime API', slug: 'reference/widget-runtime-api' },
						{ label: 'Provider API contract', slug: 'reference/provider-api' },
						{ label: 'Integration API contracts', slug: 'reference/vendor-integration-api' },
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
					],
				},
			],
		}),
	],
});
