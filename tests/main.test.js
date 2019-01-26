const { expect } = require('chai');
const rewire = require('rewire');
const setupTear = require('./helpers/setupTear');
const server = rewire('../server');
const supertest = require('supertest');

describe('module tests', () => {
  let app;
  let request;
  let setupFunctions;

  before(async function() {
    app = server.__get__('app');
    request = supertest.agent(app);
    await setTimeout(() => {}, 1000);
  });

  describe('health check', function() {
    it('should pass the initial health check', async () => {
      const res = await request.get('/api/v1/healthCheck');
      const { version } = require('../package.json');

      expect(res.status).to.equal(200);
      expect(res.body).to.include({
        ok: 1,
        version,
        runningEnv: process.env.NODE_ENV,
      });
    });
  });

  describe('APIs', function() {
    before(async function() {
      setupFunctions = await setupTear();
    });

    beforeEach(async function() {
      const userObjects = require('./data/users');
      await setupFunctions.refreshCollection('users', userObjects);
    });

    after(async function() {
      await setupFunctions.cleanUp();
    });
    describe('authentecation', function() {
      it('should sign a token for new signups', async function() {
        const email = 'user10@email.com';
        const badEmail = 'user99email.com';
        const existingEmail = 'user1@email.com';
        const password = 'abc123efg';

        const [res, badRes, existingRes] = await Promise.all([
          request.post('/api/v1/auth/signup').send({ email, password }),
          request
            .post('/api/v1/auth/signup')
            .send({ email: badEmail, password }),
          request
            .post('/api/v1/auth/signup')
            .send({ email: existingEmail, password }),
        ]);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');

        expect(badRes.status).to.equal(400);
        expect(badRes.body).to.have.property('error', 'Invalid email format');

        expect(existingRes.status).to.equal(409);
        expect(existingRes.body).to.have.property(
          'error',
          'User already exists',
        );
      });

      it('should allow a user to sign up, sign in and access protected resources ', async function() {
        const email = 'user11@email.com';
        const password = 'abc123efg';
        const noPasseord = '';
        const wrongPassord = 'hij456klm';

        const singupRes = await request
          .post('/api/v1/auth/signup')
          .send({ email, password });

        expect(singupRes.body).to.have.property('token');

        const [singinRes, noSinginRes, wrongSigninRes] = await Promise.all([
          request.post('/api/v1/auth/signin').send({ email, password }),
          request
            .post('/api/v1/auth/signin')
            .send({ email, password: noPasseord }),
          request
            .post('/api/v1/auth/signin')
            .send({ email, password: wrongPassord }),
        ]);

        expect(singinRes.body).to.have.property('token');
        expect(noSinginRes.body).to.have.property(
          'error',
          'Invalid password format',
        );
        expect(wrongSigninRes.text).to.equal('Unauthorized');

        const protectedEndpoint = await request
          .get('/api/v1/auth/secret')
          .set('authorization', singinRes.body.token);

        expect(protectedEndpoint.body).to.have.property('ok', 1);
      });
    });

    describe('CRUDs', function() {
      it('should list all users', async function() {
        const res = await request.get('/api/v1/user/');
        await setupFunctions.cleanUp('light');
        const badRes = await request.get('/api/v1/user/');

        expect(res.status).to.equal(200);
        expect(res.body)
          .to.be.instanceof(Array)
          .and.to.have.lengthOf(6)
          .and.to.have.property([5])
          .which.has.property('email', 'user5@email.com');

        expect(badRes.status).to.equal(204);
      });

      it('should return an existing user', async () => {
        const id = '5affe783a49ebd0355359923';
        const noId = '5affe783a49ebd0355359920';
        const invalidId = 'abc';
        const [res, noRes, invalidRes] = await Promise.all([
          request.get(`/api/v1/user/${id}/`),
          request.get(`/api/v1/user/${noId}/`),
          request.get(`/api/v1/user/${invalidId}/`),
        ]);
        expect(res.status).to.equal(200);
        expect(res.body)
          .to.be.instanceOf(Object)
          .and.to.have.property('email', 'user1@email.com');

        expect(noRes.status).to.equal(404);
        expect(noRes.body).to.have.property('error', 'User does not exist');

        expect(invalidRes.status).to.equal(400);

        expect(invalidRes.body).to.have.property(
          'error',
          'Invalid ID, must be a string of 24 hex characters',
        );
      });

      it('should add a new user', async () => {
        const email = 'user6@email.com';
        const invalidEmail = 'user7email,com';
        const existingEmail = 'user5@email.com';
        const [res, invalidRes, existingRes] = await Promise.all([
          request.post('/api/v1/user/').send({ email }),
          request.post('/api/v1/user/').send({ email: invalidEmail }),
          request.post('/api/v1/user/').send({ email: existingEmail }),
        ]);

        expect(res.status).to.equal(201);
        expect(res.body)
          .to.be.instanceOf(Object)
          .and.to.have.property('created', true);

        expect(invalidRes.status).to.equal(400);
        expect(invalidRes.body).to.have.property(
          'error',
          'Invalid email format',
        );

        expect(existingRes.status).to.equal(409);
        expect(existingRes.body)
          .to.have.property('error')
          .and.match(/User already exists/);
      });

      it('should edit user email', async () => {
        const id = '5affe783a49ebd0355359963';
        const wrongId = '5affe783a49ebd0355359964';
        const newEmail = 'user8@email.com';
        const invalidNewEmail = 'user92email.com';

        const [res, wrongIdRes, invalidEmailRes] = await Promise.all([
          request.patch(`/api/v1/user/${id}/`).send({ email: newEmail }),
          request.patch(`/api/v1/user/${wrongId}/`).send({ email: newEmail }),
          request.patch(`/api/v1/user/${id}/`).send({ email: invalidNewEmail }),
        ]);

        expect(res.status).to.equal(200);
        expect(res.body)
          .to.be.instanceOf(Object)
          .and.to.have.property('updated', true);

        expect(wrongIdRes.status).to.equal(404);
        expect(wrongIdRes.body)
          .to.have.property('error')
          .which.matches(/User not found/);

        expect(invalidEmailRes.status).to.equal(400);
        expect(invalidEmailRes.body).to.have.property(
          'error',
          'Invalid email format',
        );
      });

      it('should delete a user', async () => {
        const id = '5affe783a49ebd0355359923';
        const noId = '5affe783a49ebd0355359951';
        const badId = 'hij';

        const [res, noRes, badRes] = await Promise.all([
          request.delete(`/api/v1/user/${id}/`),
          request.delete(`/api/v1/user/${noId}/`),
          request.delete(`/api/v1/user/${badId}/`),
        ]);

        expect(res.status).to.equal(200);
        expect(res.body)
          .to.be.instanceOf(Object)
          .and.to.have.property('deleted', true);

        expect(noRes.status).to.equal(404);
        expect(noRes.body)
          .to.have.property('error')
          .and.to.match(/User not found/);

        expect(badRes.status).to.equal(400);
        expect(badRes.body).to.have.property(
          'error',
          'Invalid ID, must be a string of 24 hex characters',
        );
      });
    });
  });
});
