const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

function extractVerifyJwt(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (token == null) return 401;

  const userInfo = jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return 403;
    return user;
  });
  return userInfo;
}

module.exports = extractVerifyJwt;
