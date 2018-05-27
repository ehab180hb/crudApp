const { signToken } = require('../modules/auth');
module.exports = {
  async signUp(req, res, next) {
    try {
      const { User } = req.dbModules;
      const { email, password } = req.value.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ error: 'User already exists' });
      const user = await User.insertOne({ email, password });
      const token = signToken(user.insertedId);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async signIn(req, res, next) {},
  async secret(req, res, next) {
    res.status(200).send('cool');
  },
};
