const { signToken } = require('../modules/auth');
module.exports = {
  async signUp(req, res, next) {
    const { User } = req.dbModules;
    const { email, password } = req.value.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const user = await User.insertOne({ email, password });
    const token = signToken(user.insertedId);
    res.status(200).json({ token });
  },
  async signIn(req, res, next) {},
  async secret(req, res, next) {},
};
