const express = require('express');

const { blog } = require('./api');

module.exports = async app => {
  app.use(express.json());

  blog(app);
};
