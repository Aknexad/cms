const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;

const speakeasy = require('speakeasy');

function genarateSecrate(userId) {
  const secrate = speakeasy.generateSecret();

  return secrate;
}

module.exports = genarateSecrate;
