const express = require('express');

const { club } = require('./api');

module.exports = async app => {
  app.use(express.json());

  club(app);
};
