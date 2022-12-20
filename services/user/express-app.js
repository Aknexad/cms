const express = require('express');
const { user } = require('./api');

module.exports = async app => {
  app.use(express.json());
  console.log(user);
  user(app);
};
