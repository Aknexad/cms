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
      password: passowrd,
      isAdmin: false,
    });

    const result = await user.save();
    return result;
  }

  // find user
  async FindUser(username) {
    const user = await userModel.findOne({ username: username });
    return user;
  }

  async FindUserById(id) {
    const user = await userModel.findById(id);
    return user;
  }

  // update user token
  async UpdateUserToken(id, token) {
    const user = await userModel.findByIdAndUpdate(id, { token: token });
  }

  async UserTokenMatch(id, token) {
    const user = await userModel.findById(id);
    if (user.token === token) {
      return user;
    } else {
      return false;
    }
  }
}

module.exports = UserRepositoty;
