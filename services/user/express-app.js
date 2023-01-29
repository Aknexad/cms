const express = require('express');
const passport = require('passport');

const { user } = require('./api');

const initializePassport = require('./logic/passport-logic/passport-config');

module.exports = async (app, channel) => {
  // passport initialize
  initializePassport(passport);

  app.use(express.json());
  app.use(passport.initialize());

  user(app, passport, channel);
};
