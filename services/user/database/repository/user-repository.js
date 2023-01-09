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

  async FindByCusromFiled(filed, x) {
    const user = await userModel.findOne({ filed: x });
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

  async UpdateUser2fa(id, status, method) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');

    // chack user 2fa is enabel or note
    for (const type in user.tfaMethod) {
      if (Object.hasOwnProperty.call(user.tfaMethod, type)) {
        const element = user.tfaMethod[type];

        if (element === true) throw new Error('your 2fa is enabel');
      }
    }

    if (status === false) {
      user.towFactAuth = false;
      user.tfaMethod.email = false;
      user.tfaMethod.google = false;
      user.tfaMethod.phone = false;
      user.save;
      return user.towFactAuth;
    }

    if (method === 'google') {
      user.towFactAuth = status;
      user.tfaMethod.google = true;
      user.save();
    }
    if (method === 'email') {
      user.towFactAuth = status;
      user.tfaMethod.email = true;
      user.save();
    }
    if (method === 'phone') {
      user.towFactAuth = status;
      user.tfaMethod.phone = true;
      user.save();
    }

    return { statusOf2fa: user.towFactAuth, method: method };
  }

  async UpdateSecret(id, secret) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');

    user.secret.key = secret.secret;
    user.secret.qrcode = secret.qr;
    user.save();
    return secret;
  }

  async UpdateOtp(id, num) {
    try {
      const user = await userModel.findById(id);

      if (!user) throw new Error('user dont exsst');

      user.otp = num;
      user.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserRepositoty;
