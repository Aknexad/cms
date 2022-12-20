const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

function generateAccsessToken(payload) {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '1h',
  });
  return accessToken;
}

function genrateRefreshToken(payload) {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
  return refreshToken;
}

function checkToken(token) {
  return undefined;
}

module.exports = { generateAccsessToken, genrateRefreshToken };
