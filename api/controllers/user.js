const { logger, ObjectId } = require('../../util');
const { User } = require('../modules/user');

module.exports = {
  async getAllUsers(req, res) {
    try {
      const { User } = req.dbModules;
      const users = await User.find().toArray();

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
      const { User } = req.dbModules;
      const { id } = req.value.params;
      const userInfo = await User.findOne(ObjectId(id));
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
      const { User } = req.dbModules;
      const { id } = req.value.params;
      const { email } = req.value.body;
      const { result } = await User.updateOne(
        { _id: ObjectId(id) },
        { $set: { email } },
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
      const { User } = req.dbModules;
      const { email } = req.value.body;

      const existsAlready = await User.findOne({ email });
      if (existsAlready) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }
      const addedUser = await User.insertOne({ email });
      res.status(201).json({ created: true });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { User } = req.dbModules;
      const { id } = req.value.params;
      const { result } = await User.remove({ _id: ObjectId(id) });
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
