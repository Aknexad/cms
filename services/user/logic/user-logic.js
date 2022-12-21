const bcrypt = require('bcrypt');
const passport = require('passport');

const UserRepository = require('../database/repository/user-repository');
const TokensRepositoty = require('../database/repository/tokens-repository');

const {
  generateAccsessToken,
  genrateRefreshToken,
} = require('../middlewares/generate-token');

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

    // if (!getUser) return '!user';
    // if (password !== getUser.password) return '!pass';

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

    // const seaveToekn = await this.repository.UpdateUserToken(
    //   getUser.id,
    //   refrashToken
    // );

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

  async NewAccessToken(id, toekn) {
    // check toekn in db
    const user = await this.repository.UserTokenMatch(id, toekn);

    if (user === false) return false;

    const payload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    // genatate new access toekn
    const newToekn = generateAccsessToken(payload);

    return { AccessToekn: newToekn };
  }

  async UserLogout(req) {
    const payload = extractVerifyJwt(req);

    if (payload === 401) return 401;

    const id = payload.id;

    const deleteToeknFromDb = await this.repository.UpdateUserToken(id, '');

    if (deleteToeknFromDb === false) return false;

    return 200;
  }
}

module.exports = UserLogic;
