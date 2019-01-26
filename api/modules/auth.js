const JWT = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { tokenSecret } = require('../../config');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: tokenSecret,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const { User, ObjectId } = req.dbModules;
        const user = User.findOne(ObjectId(payload.sub));
        if (!user) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async function(req, email, password, done) {
      try {
        const { getUser } = req.dbModules.User.customFunctions;
        const user = await getUser(email);
        if (!user) return done(null, false);
        const passwordValid = await passwordValidCheck(password, user.password);
        if (!passwordValid) return done(null, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

/**
 * Compare passwords to check if matches.
 * @param {string} rawPassword
 * @param {string} hashedPassword
 * @returns {Promise}
 */
function passwordValidCheck(rawPassword, hashedPassword) {
  return bcrypt.compare(rawPassword, hashedPassword);
}
module.exports = {
  /**
   * Sign a Json Web Token for the user.
   * @param {string} userId The 24 hex char ID of the user.
   * @param {number} days The number of days till expiration of the token.
   * @returns {string} The signed JWT string.
   */
  signToken(userId, days) {
    const toSign = {
      iss: 'crudApp',
      sub: userId,
      iat: new Date().getTime(),
    };
    if (days) toSign.exp = new Date().setDate(new Date().getDate() + days);
    return JWT.sign(toSign, tokenSecret);
  },
  protectRoute: passport.authenticate('jwt', { session: false }),
  refreshToken: passport.authenticate('local', { session: false }),
};
