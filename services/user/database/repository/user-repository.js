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
    });

    if (!user) throw new Error('Internal Server Error');

    const result = await user.save();
    return result;
  }

  // find user
  async FindUser(username) {
    const user = await userModel.findOne({ username: username });
    // if (user === null) throw new Error('user dont exsit');
    return user;
  }

  async FindUserById(id) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');
    return user;
  }

  // cheahc
  async CheackTempToken(toekn) {
    const token = await userModel.findOne({ tempToken: toekn });
    if (!token) throw new Error('token dont exsit');
    return token;
  }

  // update

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

  async UpdateTempToken(id, token) {
    const user = await userModel.findById(id);

    if (!user) throw new Error('user dont exsit');

    user.tempToken = token;

    user.save();
    return user.tempToken;
  }

  async UpdateUser2fa(id, status, type) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');

    if (status === false) {
      user.towFactAuth = false;
      user.tfaMethod.email = false;
      user.tfaMethod.google = false;
      user.tfaMethod.phone = false;
      user.save;
      return user.towFactAuth;
    }

    user.towFactAuth = status;

    user.tfaMethod.google = true;

    user.save();

    return user.towFactAuth;
  }

  async UpdateSecret(id, secret) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');

    user.secret.key = secret.secret;
    user.secret.qrcode = secret.qr;
    user.save();
    return secret;
  }
}

module.exports = UserRepositoty;
