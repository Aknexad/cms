const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const UserRepository = require('../database/repository/user-repository');

require('dotenv').config({ path: './config/.env' });

const repository = new UserRepository();

// local strategy
async function authenticateUser(username, password, done) {
  const user = await repository.FindUser(username);

  if (user === null) {
    return done(null, false);
    console.log('user not fund');
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
      console.log(user);
    } else {
      return done(null, false);
      console.log('password not match');
    }
  } catch (error) {
    done(error);
  }
}

// JWT strategy
const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN,
};

async function jwtValadation(jwt_payload, done) {
  const user = await repository.FindUserById(jwt_payload.id);

  try {
    if (user == null) {
      return done(null, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    done(error);
  }
}

// passport config
passport.use(new LocalStrategy(authenticateUser));
passport.use(new JwtStrategy(option, jwtValadation));
