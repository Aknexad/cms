const mongoose = require('mongoose');
const userModel = require('../models/user');

class UserRepositoty {
  async CreateUser(username, passowrd) {
    // const user = new userModel({
    //   username: username,
    //   passowrd: passowrd,
    //   token: 'qwert123',
    // });

    const user = await userModel.create({
      username: username,
      passowrd: passowrd,
      isAdmin: false,
      token: 'qwer1234',
    });

    const result = await user.save();
    return result;
  }
}

module.exports = UserRepositoty;
