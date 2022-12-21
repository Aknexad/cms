const express = require('express');
const passport = require('passport');
const { user } = require('./api');

module.exports = async app => {
  require('./middlewares/passport-stratgy');

  app.use(express.json());
  app.use(passport.initialize());

  user(app);
};
