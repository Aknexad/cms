const LocalStrategy = require('passport-local').Strategy;

const StrategyLogic = require('./passport-strategy-logic');

const stratgyLogic = new StrategyLogic();

function initialize(passport) {
  // local
  passport.use(new LocalStrategy(stratgyLogic.LocalAuthByUsernaem));
}

module.exports = initialize;
