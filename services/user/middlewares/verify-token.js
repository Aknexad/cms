const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

function verifyAccessToekn(token) {
  const verifyToekn = jwt.verify(
    token,
    process.env.ACCESS_TOKEN,
    (err, user) => {
      if (err) return 403;
      return user;
    }
  );
  return verifyToekn;
}

function verifyRefreshToekn(token) {
  const verifyToekn = jwt.verify(
    token,
    process.env.REFRESH_TOKEN,
    (err, user) => {
      if (err) return 403;
      return user;
    }
  );

  return verifyToekn;
}

module.exports = { verifyAccessToekn, verifyRefreshToekn };
