const UserRepository = require('../database/repository/user-repository');

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
  }

  async UserRegister(usernaem, passowrd) {
    const result = await this.repository.CreateUser(usernaem, passowrd);

    return result;
  }

  async UserLogin(input) {
    const { usernaem, password } = input;

    const chackUser = await this.repository.FindUser(usernaem);

    if (!chackUser) return false;

    if (password !== chackUser.password) return 'pass not match';

    // crate new tokens

    // save token in db

    // return data
  }
}

module.exports = UserLogic;
