const { expect } = require('chai');
const rewire = require('rewire');
const setupTear = require('./helpers/setupTear');
const server = rewire('../server');
const supertest = require('supertest');

describe('module tests', () => {
  let app;
  let request;

  before(function() {
    app = server.__get__('app');
    request = supertest.agent(app);
  });

  describe('health check', function() {
    it('should pass the initial health check', async () => {
      const res = await request.get('/api/v1/healthCheck');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok', 1);
    });
  });

  describe('CRUDs', function() {
    before(async function() {
      try {
        const { refreshCollection, cleanUp } = await setupTear();
        this.refreshCollection = refreshCollection;
        this.cleanUp = cleanUp;
      } catch (error) {
        console.log(error);

        throw new Error(error);
      }
    });

    beforeEach(async function() {
      try {
        const { refreshCollection } = this;
        const userObjects = require('./data/users');
        await refreshCollection('users', userObjects);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    });

    after(async function() {
      try {
        const { cleanUp } = this;
        await cleanUp();
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    });

    it('should list all users', async function() {
      const res = await request.get('/api/v1/user/');
      expect(res.status).to.equal(200);
      expect(res.body)
        .to.be.instanceof(Array)
        .and.to.have.lengthOf(6)
        .and.to.have.property([5])
        .which.has.property('email', 'user5@email.com');
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
      expect(invalidRes.body)
        .to.have.property('error')
        .that.match(/ValidationError/);
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
        .and.to.have.property('n', 1);

      expect(invalidRes.status).to.equal(400);
      expect(invalidRes.body)
        .to.have.property('error')
        .and.match(/must be a valid email/);
    });

    it('should edit user email', async () => {
      const id = '5affe783a49ebd0355359963';
      const wrongId = '5affe783a49ebd0355359964';
      const newEmail = 'user8@email.com';
      const invalidNewEmail = 'user92email.com';

      const [res, wrongIdRes, invalidEmailRes] = await Promise.all([
        request.put(`/api/v1/user/${id}/`).send({ email: newEmail }),
        request.put(`/api/v1/user/${wrongId}/`).send({ email: newEmail }),
        request.put(`/api/v1/user/${id}/`).send({ email: invalidNewEmail }),
      ]);

      expect(res.status).to.equal(200);
      expect(res.text).which.matches(/User info changed/);

      expect(wrongIdRes.status).to.equal(404);
      expect(wrongIdRes.body)
        .to.have.property('error')
        .which.matches(/User not found/);

      expect(invalidEmailRes.status).to.equal(400);
      expect(invalidEmailRes.body)
        .to.have.property('error')
        .which.matches(/must be a valid email/);
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
      expect(res.text).to.equal('User deleted');

      expect(noRes.status).to.equal(404);
      expect(noRes.body)
        .to.have.property('error')
        .and.to.match(/User does not exist/);

      expect(badRes.status).to.equal(400);
      expect(badRes.body)
        .to.have.property('error')
        .and.to.match(/ValidationError/);
    });
  });
});
