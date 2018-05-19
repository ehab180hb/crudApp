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
      const res = await request.get('/api/v1/user');
      expect(res.status).to.equal(200);
      expect(res.body)
        .to.be.instanceof(Array)
        .and.to.have.lengthOf(6)
        .and.to.have.property([5])
        .which.has.property('email', 'user5@email.com');
    });

    it('should return an existing user', async () => {
      const id = '';
      const noId = '';
      const invalidId = '';
      const [res, noRes, invalidRes] = await Promise.all([
        request.get(`/api/v1/user/${id}`),
        request.get(`/api/v1/user/${noId}`),
        request.get(`/api/v1/user/${invalidId}`),
      ]);
      expect(res.status).to.equal(200);
      expect(res.body)
        .to.be.instanceOf(Object)
        .and.to.have.property('email', 'user2@email.com');

      expect(noRes.status).to.equal(404);
      expect(noRes.body).to.have.property('error', /user does not exist/);

      expect(invalidRes.status).to.equal(400);
      expect(invalidRes.body).to.have.property('error', /bad ID/);
    });

    // it('should add a new user', async () => {
    //   const email = '';
    //   const invalidEmail = '';
    //   const [res, invalidRes] = await Promise.all([
    //     request.post(`api/v1/user/${email}`),
    //     request.post(`api/v1/user/${invalidEmail}`),
    //   ]);
    //   expect(res.status).to.equal(201);
    //   expect(res.body)
    //     .to.be.instanceOf(Object)
    //     .and.to.have.property('created', true);

    //   expect(res.body)
    //     .to.have.property('user')
    //     .which.has.property('email', email);

    //   expect(invalidRes.status).to.equal(400);
    //   expect(invalidRes.body).to.have.property('error', /bad email/);
    // });

    // it('should edit user email', async () => {
    //   const id = '';
    //   const noId = '';
    //   const newEmail = '';
    //   const badNewEmail = '';

    //   const [res, noIdRes, badEmailRes] = await Promise.all([
    //     request.patch(`api/v1/user/${id}`),
    //     request.patch(`api/v1/user/${noId}`),
    //     request.patch(`api/v1/user/${id}`),
    //   ]);

    //   expect(res.status).to.equal(200);
    //   expect(res.body)
    //     .to.be.instanceOf(Object)
    //     .which.has.property('modifiedCount', 1);

    //   expect(res.body).to.have.property('matchedCount', 1);
    //   expect(res.body)
    //     .to.have.property('updated')
    //     .which.has.property('email', newEmail);

    //   expect(noIdRes.status).to.equal(404);
    //   expect(noIdRes.body).to.have.property('error', /user does not exist/);

    //   expect(badEmailRes.status).to.equal(400);
    //   expect(badEmailRes.body).to.have.property('error', /bad email/);
    // });

    // it('should delete a user', async () => {
    //   const id = '';
    //   const noId = '';
    //   const badId = '';

    //   const [res, noRes, badRes] = await Promise.all([
    //     request.delete(`api/v1/user/${id}`),
    //     request.delete(`api/v1/user/${noId}`),
    //     request.delete(`api/v1/user/${id}`),
    //   ]);

    //   expect(res.status).to.equal(200);
    //   expect(res.body).to.have.property('deletedCount', 1);

    //   expect(noRes.status).to.equal(404);
    //   expect(noRes.body).to.have.property('error', /user does not exist/);

    //   expect(badRes.status).to.equal(400);
    //   expect(badRes.body).to.have.property('error', /bad ID/);
    // });
  });
});
