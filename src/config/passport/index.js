const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../../models');
const config = require('./config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

const setupPassport = () => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

module.exports = {
  setupPassport
}; 