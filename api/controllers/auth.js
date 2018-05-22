const JWT = require('jsonwebtoken');

module.exports = {
  async signUp(req, res, next) {
    const { email, password } = req.value.body;
  },
  async signIn(req, res, next) {},
  async secret(req, res, next) {},
};
