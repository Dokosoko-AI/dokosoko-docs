import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contracts = [
	{
		name: 'Control Plane API',
		path: resolve(docsRoot, '../dokosoko-service/api/openapi.yaml'),
		bodylessOperations: new Set([
			'logout',
			'preflightIntegration',
			'revokeAuthorizationCredentialVersion',
			'queueSourceCrawl',
			'inspectMCPConnection',
			'saveLLMProfile',
			'testAIProviderConnection',
			'answerIntegrationUnknowns',
			'createIntegrationSDKReference',
			'replaceIntegrationSDKReference',
		]),
		requiredOperations: new Map(),
	},
	{
		name: 'Customer Identity Integration API',
		path: resolve(docsRoot, '../dokosoko-service/api/identity-integration-openapi.yaml'),
		bodylessOperations: new Set(),
		requiredOperations: new Map([
			['createAccessEvaluation', {
				method: 'post',
				path: '/v1/access/evaluations',
				requestSchema: 'AccessEvaluationRequest',
				requestFields: [],
				requiredRequestFields: [],
			}],
		]),
	},
];

const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);

function fail(contract, message) {
	throw new Error(`${contract}: ${message}`);
}

function resolveReference(document, reference, contract) {
	if (!reference.startsWith('#/')) {
		fail(contract, `external reference is not supported by the validator: ${reference}`);
	}
	let current = document;
	for (const rawPart of reference.slice(2).split('/')) {
		const part = rawPart.replaceAll('~1', '/').replaceAll('~0', '~');
		if (!current || typeof current !== 'object' || !(part in current)) {
			fail(contract, `unresolved reference: ${reference}`);
		}
		current = current[part];
	}
	return current;
}

function walkReferences(value, document, contract, seen = new Set()) {
	if (!value || typeof value !== 'object' || seen.has(value)) return;
	seen.add(value);
	if (typeof value.$ref === 'string') resolveReference(document, value.$ref, contract);
	for (const child of Object.values(value)) walkReferences(child, document, contract, seen);
}

function responseDefinition(document, response, contract) {
	return response?.$ref ? resolveReference(document, response.$ref, contract) : response;
}

function validateContract(document, contract) {
	if (document?.openapi !== '3.1.0') fail(contract.name, 'openapi must be 3.1.0');
	if (!document.info?.title || !document.info?.version) fail(contract.name, 'info title and version are required');
	if (!document.paths || typeof document.paths !== 'object') fail(contract.name, 'paths are required');

	walkReferences(document, document, contract.name);
	const operationIds = new Set();
	let operationCount = 0;

	for (const [path, pathItem] of Object.entries(document.paths)) {
		const templateParameters = [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
		for (const [method, operation] of Object.entries(pathItem)) {
			if (!httpMethods.has(method)) continue;
			operationCount += 1;
			if (!operation.operationId) fail(contract.name, `${method.toUpperCase()} ${path} has no operationId`);
			if (operationIds.has(operation.operationId)) fail(contract.name, `duplicate operationId: ${operation.operationId}`);
			operationIds.add(operation.operationId);

			const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
				.map((parameter) => parameter?.$ref ? resolveReference(document, parameter.$ref, contract.name) : parameter);
			for (const name of templateParameters) {
				if (!parameters.some((parameter) => parameter?.in === 'path' && parameter.name === name && parameter.required === true)) {
					fail(contract.name, `${method.toUpperCase()} ${path} does not define required path parameter ${name}`);
				}
			}

			if (!operation.responses || Object.keys(operation.responses).length === 0) {
				fail(contract.name, `${operation.operationId} has no responses`);
			}
			for (const [status, rawResponse] of Object.entries(operation.responses)) {
				if (!/^2\d\d$/.test(status) || status === '204' || status === '302') continue;
				const response = responseDefinition(document, rawResponse, contract.name);
				if (!response?.content || Object.keys(response.content).length === 0) {
					fail(contract.name, `${operation.operationId} ${status} response has no content schema`);
				}
			}

			if (['post', 'put', 'patch'].includes(method)) {
				const declaredBodyless = contract.bodylessOperations.has(operation.operationId);
				if (declaredBodyless && operation.requestBody) {
					fail(contract.name, `${operation.operationId} is declared bodyless but defines a request body schema`);
				}
				if (!declaredBodyless && !operation.requestBody) {
					fail(contract.name, `${operation.operationId} has no request body schema`);
				}
			}
		}
	}

	if (operationCount === 0) fail(contract.name, 'contains no operations');
	for (const operationId of contract.bodylessOperations) {
		if (!operationIds.has(operationId)) {
			fail(contract.name, `declared bodyless operation does not exist: ${operationId}`);
		}
	}
	for (const [operationId, expected] of contract.requiredOperations) {
		const operation = document.paths[expected.path]?.[expected.method];
		if (operation?.operationId !== operationId) {
			fail(contract.name, `${operationId} must be ${expected.method.toUpperCase()} ${expected.path}`);
		}
		if (expected.requestSchema) {
			const rawSchema = operation.requestBody?.content?.['application/json']?.schema;
			const expectedReference = `#/components/schemas/${expected.requestSchema}`;
			if (rawSchema?.$ref !== expectedReference) {
				fail(contract.name, `${operationId} must use ${expectedReference}`);
			}
			const schema = resolveReference(document, expectedReference, contract.name);
			const fields = Object.keys(schema.properties ?? {}).sort();
			const expectedFields = [...expected.requestFields].sort();
			if (JSON.stringify(fields) !== JSON.stringify(expectedFields)) {
				fail(contract.name, `${operationId} request must contain only ${expectedFields.join(', ')}`);
			}
			const required = [...(schema.required ?? [])].sort();
			const expectedRequired = [...expected.requiredRequestFields].sort();
			if (JSON.stringify(required) !== JSON.stringify(expectedRequired)) {
				fail(contract.name, `${operationId} request must require only ${expectedRequired.join(', ')}`);
			}
		}
		if (expected.forbiddenHeaders) {
			const parameters = [...(operation.parameters ?? [])]
				.map((parameter) => parameter?.$ref ? resolveReference(document, parameter.$ref, contract.name) : parameter);
			for (const header of expected.forbiddenHeaders) {
				if (parameters.some((parameter) => parameter?.in === 'header' && parameter.name.toLowerCase() === header.toLowerCase())) {
					fail(contract.name, `${operationId} must not use redundant ${header} versioning`);
				}
			}
		}
	}
	return operationCount;
}

let total = 0;
for (const contract of contracts) {
	const source = await readFile(contract.path, 'utf8');
	const document = load(source, { filename: contract.path, json: true });
	const count = validateContract(document, contract);
	total += count;
	console.log(`✓ ${contract.name}: ${count} operations, all references resolved`);
}

console.log(`✓ API contract validation complete: ${total} operations`);
