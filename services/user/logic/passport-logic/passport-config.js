const LocalStrategy = require('passport-local').Strategy;

const StrategyLogic = require('./passport-strategy-logic');
// const TowFactStrategy = require('passport-2fa-totp').Strategy;
// const TotpStrategy = require('passport-totp').Strategy;
const CustomStrategy = require('passport-custom').Strategy;

const stratgyLogic = new StrategyLogic();

function initialize(passport) {
  // local
  passport.use(
    new LocalStrategy(
      { usernameField: 'userInput' },
      stratgyLogic.LocalAuthByUsernaem
    )
  );

  // tow fact auth
  passport.use(
    'verifyingTotp',
    new CustomStrategy(stratgyLogic.VerifyingTotpFor2faRoute)
  );
  passport.use(
    'disTotp',
    new CustomStrategy(stratgyLogic.VerifyingTotpForDisabelRoute)
  );

  // otp auth
  passport.use('otpAuth', new CustomStrategy(stratgyLogic.VerifyingOtp));
}

module.exports = initialize;
