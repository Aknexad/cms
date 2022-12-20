const UserRepository = require('../database/repository/user-repository');

// const repository = new UserRepository();

class UserLogic {
  constructor() {
    this.repository = new UserRepository();
  }

  async testing(num) {
    console.log(num);
    return num;
  }

  async UserRegister(usernaem, passowrd) {
    const result = await this.repository.CreateUser(usernaem, passowrd);

    // const creatUser = await this.repository.CreateUser(usernaem, passowrd);

    return result;
  }
}

module.exports = UserLogic;
