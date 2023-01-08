const bcrypt = require('bcrypt');
const user = require('../../api/user');

const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;

require('dotenv').config({ path: './config/.env' });

const UserRepository = require('../../database/repository/user-repository');

const userRepo = new UserRepository();

class StrategyLogic {
  //   local startgy logic for username
  async LocalAuthByUsernaem(username, password, done) {
    try {
      const user = await userRepo.FindUser(username);
      console.log(user);

      if (!user) return done(null, false);

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }

  // tow fact auth startaegy

  async t1(req, done) {
    const user = await userRepo.CheackTempToken(req.body.token);

    if (user === null) return done(null, false);
    done(null, user);
  }

  async First2faCallback(token, password, done) {
    try {
      console.log(token, password);
      const user = await userRepo.CheackTempToken(token);

      if (!user) return done(null, false);
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error);
    }
  }

  async Scend2faCallback(user, done) {
    if (!user.secret) {
      return done(new Error('Google Authenticator is not setup yet.'));
    }
    const secret = GoogleAuthenticator.decodeSecret(user.secret.key);

    done(null, secret, 30);
  }
}

module.exports = StrategyLogic;
