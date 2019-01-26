const { signToken } = require('../modules/auth');
const { logger } = require('../util');
const { getUserModule } = require('../modules/user');
module.exports = {
  async signUp(req, res) {
    try {
      const User = getUserModule(req.DB);

      const { getUser, registerNew } = User.customFunctions;
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
  async signIn(req, res) {
    const { _id } = req.user;
    const token = signToken(_id);
    res.status(200).json({ token });
  },
  async secret(req, res, next) {
    res.status(200).json({ ok: 1 });
  },
};
