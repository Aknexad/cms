const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

require('dotenv').config({ path: './config/.env' });

const UserRepository = require('../../database/repository/user-repository');

const userRepo = new UserRepository();

class StrategyLogic {
  //   local startgy logic for username
  async LocalAuthByUsernaem(userInput, password, done) {
    try {
      const user = await userRepo.FindByCustomFiled(userInput);

      if (!user) return done(null, false);

      if (user.otpAuth === true) throw new Error('your OTP is anabel');

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error);
    }
  }

  // tow fact auth startaegy

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

  // otp auth Strategy

  async VerifyingOtp(req, done) {
    try {
      const { userInput, password } = req.body;

      console.log(userInput, password);
      const user = await userRepo.FindByCustomFiled(userInput);

      if (!user) return done(null, false);

      if (user.otpAuth === false) throw new Error('you dont enabel otp ');
      if (user.otp === null) throw new Error('you dont have otp try agen');

      if (user.otp !== parseInt(password)) return done(null, false);
      await userRepo.UpdateOtp(user.id, null);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

module.exports = StrategyLogic;
