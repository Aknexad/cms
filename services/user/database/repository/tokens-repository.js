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

  async getAllTokens(id) {
    const allToekns = await tokensModel.find({ userId: id });
    return allToekns;
  }

  async GetAccessTokensByUserId(id) {
    console.log(id);
    const allToekns = await tokensModel.findOne({ a });

    const accessTokens = allToekns.map(t => t.accessToken);

    return accessTokens;
  }

  async GetRefreshTokensByUserId(id) {
    const allToekns = await tokensModel.find({ userId: id });

    const refreshToken = allToekns.map(t => t.refreshToken);

    return refreshToken;
  }

  async GetRefreshTokens(token) {
    return await tokensModel.findOne({ refreshToken: token });
  }

  async GetAccessToken(token) {
    return await tokensModel.findOne({ accessToken: token });
  }

  async UpdateNewAccessToekn(token, newToken) {
    const refreshToken = await tokensModel.findOneAndUpdate(
      { refreshToken: token },
      { accessToken: newToken },
      { new: true }
    );
    if (!refreshToken) return 400;
    return refreshToken;
  }

  async DeleteDocuments(id) {
    const deleteToeken = await tokensModel.findByIdAndRemove(id);

    if (!deleteToeken) return 400;

    return 200;

    // const deleteToekns = await tokensModel.remove();
    // return deleteToekns;
  }
}
module.exports = TokensRepositoty;
