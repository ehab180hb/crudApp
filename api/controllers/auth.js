const { signToken } = require('../modules/auth');
const { logger } = require('../../util');
module.exports = {
  async signUp(req, res) {
    try {
      const { getUser, registerNew } = req.dbModules.User.customFunctions;
      const { email, password } = req.value.body;
      const exists = await getUser(email);
      if (exists) return res.status(409).json({ error: 'User already exists' });
      const newUserId = await registerNew(email, password);
      const token = signToken(newUserId, 1);
      res.status(201).json({ token });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
  async signIn(req, res, next) {
    const { _id } = req.user;
    const token = signToken(_id);
    res.status(200).json({ token });
  },
  async secret(req, res, next) {
    res.status(200).json({ ok: 1 });
  },
};
