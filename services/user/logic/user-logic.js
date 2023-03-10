const crypto = require('crypto');

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

const { RPCObserver } = require('../middlewares/message-broker');

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
    this.tokensRepositoty = new TokensRepositoty();
  }

  async UserRegister(usernaeme, passowrd) {
    const checkUserExisting = await this.repository.FindUser(usernaeme);
    console.log(checkUserExisting);

    if (checkUserExisting) throw new Error('username exist');

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
    const checkTokenDb = await this.tokensRepositoty.GetAccessToken(token);

    if (!checkTokenDb) throw new Error('token not find');

    if (checkTokenDb.accessToken !== token)
      throw new Error('unauthorized token');

    return checkTokenDb.id;
  }

  //
  //

  async CeckAccessToekn(req, res, next) {
    const accessToken = req.body.token;

    const checkTokenJwt = verifyAccessToekn(accessToken);

    if (checkTokenJwt === 403) return res.send(403);

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

      const secret = generateSecrat(id);

      const updateSecret = await this.repository.UpdateSecret(id, secret);
      if (!updateSecret) throw new Error('try agen');

      return updateStatus;
    }

    // phone
    if (method === 'phone') {
      const getUser = await this.repository.FindUserById(id);

      if (!getUser.phone) throw new Error('you dont have phone number');

      const updateStatus = await this.repository.UpdateUser2fa(
        id,
        status,
        method
      );

      return updateStatus;
    }

    // email
    if (method === 'email') {
      const getUser = await this.repository.FindUserById(id);

      if (!getUser.email) throw new Error('you dont have Email');

      const updateStatus = await this.repository.UpdateUser2fa(
        id,
        status,
        method
      );

      return updateStatus;
    }

    throw new Error('chack method');
  }

  async DisabelTowFactAuth(id, status, method) {
    console.log(status);

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
    const tempToken = generateSecrat();

    const saveToekn = await this.repository.UpdateTempToken(
      id,
      tempToken.base32
    );

    if (!saveToekn) throw new Error('somting dont work try agen');

    return saveToekn;
  }

  async GenarateOtp() {
    try {
      const code = Math.floor(100000 + Math.random() * 900000);

      return code;
    } catch (error) {
      return error;
    }
  }

  async SetOtp(id, otp) {
    try {
      const user = await this.repository.FindUserById(id);

      if (user.otp !== null) throw new Error('you have otp whit and tray agen');

      const setOtp = await this.repository.UpdateOtp(id, otp);
      return setOtp;
    } catch (error) {
      return error;
    }
  }

  async SetOtpStatus(userId, status, method) {
    // cheack for email and phone
    const getUser = await this.repository.FindUserById(userId);
    if (!getUser) throw new Error('user dosent exist');
    if (status === true) {
      if (method === 'phone' && !getUser.phone) {
        throw new Error('you dont have phone number');
      }

      if (method === 'email' && !getUser.email) {
        throw new Error('you dont have email address');
      }
    }

    // chack Otp is activ or not
    if (getUser.otpAuth === status) throw new Error(`your otp is ${status}`);

    // update reposetory
    await this.repository.UpdateStatusOfOtp(userId, status);

    return status;
  }

  //

  async RecoveryPasswordSend(email, method) {
    const getUser = await this.repository.FindUserById(id);
    if (!getUser) throw new Error('user dosent exist');

    if (method === 'phone') {
      if (!getUser.phone) throw new Error('you dont have phone number');

      const code = await this.GenarateOtp();

      await this.repository.UpdateOtp(id, code);

      return done;
    }
  }

  async RequestRestPass(userInput, method) {
    // finde user
    const user = await this.repository.FindUserByEmail(userInput);

    // if (!user) return `recavery code send to ${method}`;
    if (!user) throw new Error('user dont exit');

    if (method === 'phone') {
      const code = await this.GenarateOtp();

      await this.repository.UpdateOtp(user.id, code);

      console.log(code);

      return 'code send to yourr phone';
    }

    if (method === 'email') {
      const { base32, base16 } = await this.CryptoGenareateToken();

      const saveToekn = await this.repository.UpdateCrypteToken(
        user.id,
        base32,
        base16
      );

      const link = `${process.env.REST_PASSWORD_BASE_URL}t1=${base32}/t2=${base16}/id=${user.id}`;

      // send to email
      console.log(link);

      return 'chack your email';
    }
  }

  async VerfyRestPass(payload) {
    if (payload.method === 'phone') {
      const user = await this.repository.FindByCustomFiled(payload.userInput);

      if (!user) throw new Error('user dosent exist');

      if (user.otp !== parseInt(payload.code))
        throw new Error('code dont match');

      const hashPass = await bcrypt.hash(payload.password, 7);

      await this.repository.UpdateUserPassword(user.id, hashPass);

      return 'ok';
    }

    //

    if (payload.method === 'email') {
      const user = await this.repository.FindUserById(payload.id);

      if (!user) throw new Error('user dont exist');

      if (
        user.token[0] !== payload.token &&
        user.token[1] !== payload.subToken
      ) {
        throw new Error('token dont match ');
      }

      const hashPass = await bcrypt.hash(payload.password, 7);

      await this.repository.UpdateUserPassword(user.id, hashPass);

      return 'ok';
    }
  }

  async CryptoGenareateToken() {
    const base32 = crypto.randomBytes(32).toString('hex');
    const base16 = crypto.randomBytes(16).toString('hex');

    return { base32, base16 };
  }

  // RPC responce
  async serverRpcRequest(data) {
    const getUsername = await this.repository.FindUserById(data.data);

    if (!getUsername) return 'Anonymous Author';

    return getUsername.username;
  }
}

module.exports = UserLogic;
