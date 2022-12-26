const mongoose = require('mongoose');
const tokensModel = require('../models/tokens');

class TokensRepositoty {
  async CreateToken(id, access, refrash) {
    const addToken = await tokensModel.create({
      userId: id,
      accessToken: access,
      refreshToken: refrash,
    });

    if (!addToken) throw new Error('try agen');
    return addToken;
  }

  async getAllTokens(id) {
    const allToekns = await tokensModel.find({ userId: id });
    return allToekns;
  }

  async GetAccessTokensByUserId(id) {
    const allToekns = await tokensModel.findOne({ a });

    if (!allToekns) throw new Error('no toekn fond');

    const accessTokens = allToekns.map(t => t.accessToken);

    return accessTokens;
  }

  async GetRefreshTokensByUserId(id) {
    const allToekns = await tokensModel.find({ userId: id });

    const refreshToken = allToekns.map(t => t.refreshToken);

    return refreshToken;
  }

  async GetRefreshTokens(token) {
    const getToekn = await tokensModel.findOne({ refreshToken: token });

    if (!getToekn) throw new Error('token dont exist');
    return getToekn;
  }

  async GetAccessToken(token) {
    const getToekn = await tokensModel.findOne({ accessToken: token });

    if (!getToekn) throw new Error('token dont exist');
    return getToekn;
  }

  async UpdateNewAccessToekn(token, newToken) {
    const refreshToken = await tokensModel.findOneAndUpdate(
      { refreshToken: token },
      { accessToken: newToken },
      { new: true }
    );
    if (!refreshToken) throw new Error('somting not working try agrn');
    return refreshToken;
  }

  async DeleteDocuments(id) {
    const deleteToeken = await tokensModel.findByIdAndRemove(id);

    if (!deleteToeken) throw new Error('user not fiund');

    return 200;
  }
}
module.exports = TokensRepositoty;
