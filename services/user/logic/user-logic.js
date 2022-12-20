const UserRepository = require('../database/repository/user-repository');

const {
  generateAccsessToken,
  genrateRefreshToken,
} = require('../middlewares/generate-token');

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
  }

  async UserRegister(usernaem, passowrd) {
    const result = await this.repository.CreateUser(usernaem, passowrd);

    return result;
  }

  async UserLogin(usernaeme, password) {
    const getUser = await this.repository.FindUser(usernaeme);

    if (!getUser) return '!user';
    if (password !== getUser.password) return '!pass';

    // generate token

    const payload = {
      id: getUser.id,
      username: getUser.username,
      isAdmin: getUser.isAdmin,
    };

    const accessToken = generateAccsessToken(payload);
    const refrashToken = genrateRefreshToken(payload);

    // save token in db

    const seaveToekn = await this.repository.UpdateUserToken(
      getUser.id,
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
}

module.exports = UserLogic;
