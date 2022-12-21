const mongoose = require('mongoose');
const tokensModel = require('../models/tokens');

class TokensRepositoty {
  async CreateToken(id, access, refrash) {
    const addToken = await tokensModel.create({
      userId: id,
      accessToken: access,
      refreshToken: refrash,
    });
  }
}
module.exports = TokensRepositoty;
