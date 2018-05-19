const { logger, ObjectId } = require('../../util');

module.exports = {
  getAllUsers: async function getAllUsers(req, res) {
    try {
      const { DB: db } = req;
      const collection = db.collection('users');
      const users = await collection.find().toArray();
      if (!users) {
        res.status(204).json('There are no existing users');
        return;
      }
      res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
  getUser: async function getUser(req, res) {
    try {
      const { DB: db } = req;
      const collection = db.collection('users');
      const { query } = req;
      const userInfo = await collection.findOne(ObjectId(query.id));
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
  editUser: async function editUser(req, res) {
    try {
      const { DB: db } = req;
      const collection = db.collection('users');
      const { query, body } = req;
      const { matchedCount, modifiedCount } = await collection.updateOne(
        { _id: ObjectId(query.id) },
        { $set: { email: body.email } },
      );
      if (!matchedCount) {
        res.status(404);
      } else if (!modifiedCount) {
        res.status(304);
      } else {
        res.status(200);
      }
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
};
