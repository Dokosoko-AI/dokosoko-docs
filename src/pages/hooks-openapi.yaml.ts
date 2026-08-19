import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const prerender = true;

export async function GET() {
	const contract = await readFile(
		resolve(process.cwd(), '../dokosoko-service/api/hooks-openapi.yaml'),
		'utf8',
	);

	return new Response(contract, {
		headers: {
			'Content-Type': 'application/yaml; charset=utf-8',
			'Content-Disposition': 'inline; filename="dokosoko-hooks-openapi.yaml"',
		},
	});
}
