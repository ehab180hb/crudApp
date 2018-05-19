const { logger, ObjectId } = require('../../util');
const {
  validateGetUser,
  validateAddUser,
  validateEditUser,
  validateDeleteUser,
} = require('../handlers/user/validation');

module.exports = {
  async getAllUsers(req, res) {
    try {
      const { DB: db } = req;
      const collection = db.collection('users');
      const users = await collection.find().toArray();

      if (!users.length) {
        res.status(204).end();
        return;
      }
      res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
  async getUser(req, res) {
    try {
      const { params } = req;
      const valid = validateGetUser({ id: params.id });
      if (valid.error) throw new Error(valid.error);
      const { DB: db } = req;
      const collection = db.collection('users');
      const userInfo = await collection.findOne(ObjectId(params.id));
      if (!userInfo) {
        res.status(404).json({ error: 'User does not exist' });
        return;
      }
      res.status(200).json(userInfo);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
  async editUser(req, res) {
    try {
      const { DB: db, body, params } = req;
      const valid = validateEditUser({ id: params.id, email: body.email });
      if (valid.error) throw new Error(valid.error);
      const collection = db.collection('users');
      const { result } = await collection.updateOne(
        { _id: ObjectId(params.id) },
        { $set: { email: body.email } },
      );

      if (!result.n) {
        res.status(404).json({
          error: 'User not found',
        });
        return;
      }

      if (!result.nModified) {
        res.status(304).end();
        return;
      }

      res.status(200).json({ updated: true });
      return;
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
  async addUser(req, res) {
    try {
      const { DB: db, body } = req;
      const valid = validateAddUser(body);

      if (valid.error) throw new Error(valid.error);
      const collection = db.collection('users');

      const existsAlready = await collection.findOne({ email: body.email });
      if (existsAlready) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }
      const addedUser = await collection.insertOne({ email: body.email });
      res.status(201).json({ created: true });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { DB: db, params } = req;
      const valid = validateDeleteUser(params);
      if (valid.error) throw new Error(valid.error);
      const collection = db.collection('users');
      const { result } = await collection.remove({ _id: ObjectId(params.id) });
      if (!result.n) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json({ deleted: true });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
};
