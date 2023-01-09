const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

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

  async LocalAuthByEmail(email, password, done) {
    try {
      const user = await userRepo.FindByCusromFiled('email', email);

      if (user === null) return done(null, false);

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }

  //
  async LocalAuthByPhone(Phone, password, done) {
    try {
      const user = await userRepo.FindByCusromFiled('phone', Phone);

      if (user === null) return done(null, false);

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

  async First2faCallback(username, password, done) {
    try {
      const user = await userRepo.CheackTempToken(username);

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

  //
  async VerifyingTotpFor2faRoute(req, done) {
    try {
      const { token, code } = req.body;

      const user = await userRepo.CheackTempToken(token);
      if (user === null) return done(null, false);

      if (user.otp !== null) {
        if (user.otp !== parseInt(code)) return done(null, false);

        await userRepo.UpdateOtp(user.id, null);
        await userRepo.UpdateTempToken(user.id, '');

        return done(null, user);
      }

      const Verifying = speakeasy.totp.verify({
        secret: user.secret.key,
        encoding: 'base32',
        token: code,
      });

      if (Verifying === false) return done(null, false);

      await userRepo.UpdateTempToken(user.id, '');

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }

  //
  async VerifyingTotpForDisabelRoute(req, done) {
    try {
      const { userId, code } = req.body;

      const user = await userRepo.FindUserById(userId);

      if (user === null) return done(null, false);

      if (user.otp !== null) {
        if (user.otp !== parseInt(code)) return done(null, false);

        await userRepo.UpdateOtp(user.id, null);

        return done(null, user);
      }

      const Verifying = speakeasy.totp.verify({
        secret: user.secret.key,
        encoding: 'base32',
        token: code,
      });

      if (Verifying === false) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

module.exports = StrategyLogic;
