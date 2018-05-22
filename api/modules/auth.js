const JWT = require('jsonwebtoken');
const { tokenSecret } = require('../../config');

module.exports = {
  signToken(userId) {
    return JWT.sign(
      {
        iss: 'crudApp',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
      },
      tokenSecret,
    );
  },
};
