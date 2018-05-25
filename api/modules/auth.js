const JWT = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { tokenSecret } = require('../../config');
// const User = require('');

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
  protectRoute: passport.authenticate('jwt', { session: false }),
};
