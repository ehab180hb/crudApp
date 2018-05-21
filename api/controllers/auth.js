const JWT = require('jsonwebtoken');

module.exports = {
  async signUp(req, res, next) {
    console.log('signUp()');
  },
  async signIn(req, res, next) {
    console.log('signIn()');
  },
  async secret(req, res, next) {
    console.log('secret()');
  },
};
