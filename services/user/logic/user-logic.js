const bcrypt = require('bcrypt');
const passport = require('passport');

const UserRepository = require('../database/repository/user-repository');
const TokensRepositoty = require('../database/repository/tokens-repository');

const {
  generateAccsessToken,
  genrateRefreshToken,
  decodeToken,
} = require('../middlewares/generate-token');

const {
  verifyAccessToekn,
  verifyRefreshToekn,
} = require('../middlewares/verify-token');

const extractVerifyJwt = require('../middlewares/extractorJwt');

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
    this.tokensRepositoty = new TokensRepositoty();
  }

  async UserRegister(usernaem, passowrd) {
    const checkUserExisting = await this.repository.FindUser(usernaem);

    if (checkUserExisting) return 400;

    const hashedPass = await bcrypt.hash(passowrd, 7);

    const result = await this.repository.CreateUser(usernaem, hashedPass);

    return {
      id: result.id,
      usernaeme: result.username,
      isAdmin: result.isAdmin,
    };
  }

  async UserLogin(usernaeme, password) {
    const getUser = await this.repository.FindUser(usernaeme);

    // generate token
    const payload = {
      id: getUser.id,
      username: getUser.username,
      isAdmin: getUser.isAdmin,
    };

    const accessToken = generateAccsessToken(payload);
    const refrashToken = genrateRefreshToken(payload);

    // save token in db

    await this.tokensRepositoty.CreateToken(
      getUser.id,
      accessToken,
      refrashToken
    );

    // return data

    const result = {
      id: getUser.id,
      usernaeme: getUser.username,
      isAdmin: getUser.isAdmin,
      accessToken: accessToken,
      refrashToken: refrashToken,
    };
    return result;
  }

  // new Access tokeni

  async NewAccessToken(token) {
    const getUserToken = await this.tokensRepositoty.GetRefreshTokens(token);
    if (!getUserToken) return 400;

    const getUserInfo = decodeToken(token);

    const payload = {
      id: getUserInfo.id,
      usernaeme: getUserInfo.username,
      isAdmin: getUserInfo.isAdmin,
    };

    const newAccessToken = generateAccsessToken(payload);

    const updateAccessToekn = await this.tokensRepositoty.UpdateNewAccessToekn(
      token,
      newAccessToken
    );

    if (updateAccessToekn === 400) return 400;

    return updateAccessToekn;
  }

  //
  //

  async VerifyAccessToekn(token) {
    // const checkTokenJwt = verifyAccessToekn(token);

    // if (checkTokenJwt === 403) return 403;

    const checkTokenDb = await this.tokensRepositoty.GetAccessToken(token);

    if (!checkTokenDb) return 404;

    if (checkTokenDb.accessToken !== token) return 403;

    return checkTokenDb.id;
  }

  //
  //

  async CeckAccessToekn(req, res, next) {
    const token = req.body.token;

    const checkTokenJwt = verifyAccessToekn(token);

    if (checkTokenJwt === 403) return res.send(403);

    // const checkTokenDb = await this.tokensRepositoty.GetAccessToken(token);

    // if (!checkTokenDb) return res.send(404);

    // if (checkTokenDb.accessToken !== token) return res.send(403);
    req.body.token = token;

    next();
  }

  //
  //

  async UserLogout(id) {
    const deleteDocument = await this.tokensRepositoty.DeleteDocuments(id);

    if (deleteDocument === 400) return 400;

    return 200;
  }
}

module.exports = UserLogic;
