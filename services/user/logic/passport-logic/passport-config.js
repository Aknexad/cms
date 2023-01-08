const LocalStrategy = require('passport-local').Strategy;

const StrategyLogic = require('./passport-strategy-logic');
const TowFactStrategy = require('passport-2fa-totp').Strategy;

const stratgyLogic = new StrategyLogic();

function initialize(passport) {
  // local
  passport.use(new LocalStrategy(stratgyLogic.LocalAuthByUsernaem));

  // tow fact auth
  passport.use(
    new TowFactStrategy(
      { usernameField: 'token' },
      stratgyLogic.First2faCallback,
      stratgyLogic.Scend2faCallback
    )
  );
}

module.exports = initialize;
