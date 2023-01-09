const LocalStrategy = require('passport-local').Strategy;

const StrategyLogic = require('./passport-strategy-logic');
const TowFactStrategy = require('passport-2fa-totp').Strategy;
const TotpStrategy = require('passport-totp').Strategy;
const CustomStrategy = require('passport-custom').Strategy;

const stratgyLogic = new StrategyLogic();

function initialize(passport) {
  // local
  passport.use(new LocalStrategy(stratgyLogic.LocalAuthByUsernaem));
  passport.use(
    'local-email',
    new LocalStrategy({ usernameField: 'email' }, stratgyLogic.LocalAuthByEmail)
  );
  passport.use(
    'local-phone',
    new LocalStrategy({ usernameField: 'phone' }, stratgyLogic.LocalAuthByEmail)
  );

  // tow fact auth
  passport.use(
    new TowFactStrategy(
      { usernameField: 'token' },
      stratgyLogic.First2faCallback,
      stratgyLogic.Scend2faCallback
    )
  );
  passport.use(
    'verifyingTotp',
    new CustomStrategy(stratgyLogic.VerifyingTotpFor2faRoute)
  );
  passport.use(
    'disTotp',
    new CustomStrategy(stratgyLogic.VerifyingTotpForDisabelRoute)
  );
}

module.exports = initialize;
