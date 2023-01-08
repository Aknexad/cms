const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;

function genarateSecrate(userId) {
  return GoogleAuthenticator.register(userId);
}

module.exports = genarateSecrate;
