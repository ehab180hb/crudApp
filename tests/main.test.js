const { expect } = require('chai');
const rewire = require('rewire');
const server = rewire('../server');
const supertest = require('supertest');
const app = server.__get__('app');
const listener = app.listen();
const request = supertest(listener);

describe('CRUDs', () => {
  it('should pass the initial health check', async () => {
    const res = await request.get('/api/v1/healthCheck');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', 1);
  });
});
