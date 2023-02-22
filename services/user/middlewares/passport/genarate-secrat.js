const speakeasy = require('speakeasy');

function genarateSecrate() {
  const secrate = speakeasy.generateSecret();

  return secrate;
}

module.exports = genarateSecrate;
