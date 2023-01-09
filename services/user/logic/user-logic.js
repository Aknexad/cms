const bcrypt = require('bcrypt');

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
const generateSecrat = require('../middlewares/passport/genarate-secrat');
const genarateSecrate = require('../middlewares/passport/genarate-secrat');

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
    this.tokensRepositoty = new TokensRepositoty();
  }

  async UserRegister(usernaeme, passowrd) {
    const checkUserExisting = await this.repository.FindUser(usernaeme);

    if (checkUserExisting !== null) throw new Error('username exist ');

    const hashedPass = await bcrypt.hash(passowrd, 7);

    const result = await this.repository.CreateUser(usernaeme, hashedPass);

    return {
      id: result.id,
      usernaeme: result.username,
      isAdmin: result.isAdmin,
    };
  }

  async UserLogin(usernaeme) {
    const getUser = await this.repository.FindUser(usernaeme);

    if (!getUser) throw new Error('username not find');

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
    if (!getUserToken) throw new Error('unvaled toekn');

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

    return updateAccessToekn;
  }

  //
  //

  async VerifyAccessToekn(token) {
    // const checkTokenJwt = verifyAccessToekn(token);

    // if (checkTokenJwt === 403) return 403;

    const checkTokenDb = await this.tokensRepositoty.GetAccessToken(token);

    if (!checkTokenDb) throw new Error('token not find');

    if (checkTokenDb.accessToken !== token)
      throw new Error('unauthorized token');

    return checkTokenDb.id;
  }

  //
  //

  async CeckAccessToekn(req, res, next) {
    const { accessToken } = req.body.token;

    const checkTokenJwt = verifyAccessToekn(accessToken);

    if (checkTokenJwt === 403) return res.send(403);

    req.body.token = token;

    next();
  }

  //
  //

  async UserLogout(id) {
    const deleteDocument = await this.tokensRepositoty.DeleteDocuments(id);

    return deleteDocument;
  }

  //  Tow Fact Auth
  async EnableTowFactAuth(id, status, method) {
    if (method === 'google') {
      const updateStatus = await this.repository.UpdateUser2fa(
        id,
        status,
        method
      );
      const secret = genarateSecrate(id);
      const updateSecret = await this.repository.UpdateSecret(id, secret);
      if (!updateSecret) throw new Error('try agen');

      return updateStatus;
    }

    const updateStatus = await this.repository.UpdateUser2fa(
      id,
      status,
      method
    );

    return updateStatus;
  }

  async DisabelTowFactAuth(id, status, method) {
    const updateStatus = await this.repository.UpdateUser2fa(
      id,
      status,
      method
    );

    const updateSecret = await this.repository.UpdateSecret(id, {});

    if (!updateSecret) throw new Error('try agen');

    return updateStatus;
  }

  async GenarateTempToken(id) {
    const tempToken = generateSecrat(id);

    const saveToekn = await this.repository.UpdateTempToken(
      id,
      tempToken.secret
    );

    if (!saveToekn) throw new Error('somting dont work try agen');

    return saveToekn;
  }

  async GenarateOtpAndSaved(id) {
    try {
      const code = Math.floor(100000 + Math.random() * 900000);

      await this.repository.UpdateOtp(id, code);

      return code;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserLogic;
