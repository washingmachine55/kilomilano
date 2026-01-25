// import request from 'supertest';
import pactum from 'pactum';
import app from '../src/server.js';

process.loadEnvFile();
pactum.request.setBaseUrl(process.env.APP_URL);
pactum.request.setDefaultHeaders({ 'Content-Type': 'application/json' });

describe('GET /api-docs', () => {
	it('should return API docs', async () => {
		await pactum.spec().withMethod('GET').withPath('/api-docs/').expectStatus(200);
	});
});
