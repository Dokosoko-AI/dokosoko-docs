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
					label: 'APIs & developer assets',
					items: [
						{ label: 'Set up and publish an API', slug: 'guides/api-setup' },
						{ label: 'Configure runtime Authorization', slug: 'guides/runtime-authorization' },
						{ label: 'Define authorization policies', slug: 'guides/authorization-policies' },
						{ label: 'Manage developer assets', slug: 'guides/developer-assets' },
						{ label: 'Publish documentation', slug: 'guides/sources' },
						{ label: 'Publish API contracts', slug: 'guides/api-contracts' },
						{ label: 'Catalogue exact SDKs', slug: 'guides/generated-sdks' },
						{ label: 'Use Query Lab', slug: 'guides/query-lab' },
					],
				},
				{
					label: 'Tools & access',
					items: [
						{ label: 'Create custom tools', slug: 'guides/custom-tools' },
						{ label: 'Add native tool plugins', slug: 'guides/native-tool-plugins' },
						{ label: 'Import third-party MCP tools', slug: 'guides/mcp-bridges' },
						{ label: 'Connect identity & policy', slug: 'guides/identity' },
						{ label: 'Connect MCP clients', slug: 'guides/mcp' },
					],
				},
				{
					label: 'Delivery & operations',
					items: [
						{ label: 'Publish recipes', slug: 'guides/recipes' },
						{ label: 'Configure AI', slug: 'guides/ai-configuration' },
						{ label: 'Administer settings', slug: 'guides/settings' },
						{ label: 'Collect bug reports & feedback', slug: 'guides/support-reporting' },
						{ label: 'Operate DokoSoko', slug: 'guides/operations' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Control Plane API', slug: 'reference/http-api' },
						{ label: 'Customer identity contract', slug: 'reference/vendor-integration-api' },
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
					],
				},
			],
		}),
	],
});
