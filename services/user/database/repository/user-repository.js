const userModel = require('../models/user');

class UserRepositoty {
  async CreateUser(username, passowrd) {
    const user = await userModel.create({
      username: username,
      password: passowrd,
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
    try {
      const user = await userModel.findById(id);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async FindByCustomFiled(input) {
    try {
      const byUsername = await userModel.findOne({ username: input });
      if (byUsername) return byUsername;

      const byEmail = await userModel.findOne({ email: input });
      if (byEmail) return byEmail;

      const byPhone = await userModel.findOne({ phone: input });
      if (byPhone) return byPhone;

      throw new Error('user dont exist');
    } catch (error) {
      throw new Error(error);
    }
  }

  // cheahc
  async CheackTempToken(toekn) {
    const token = await userModel.findOne({ tempToken: toekn });
    if (!token) throw new Error('token dont exsit');
    return token;
  }

  // update

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

    if (status === false) {
      user.towFactAuth = false;
      user.tfaMethod.email = false;
      user.tfaMethod.google = false;
      user.tfaMethod.phone = false;
      user.save();
      return user.towFactAuth;
    }

    if (method === 'google') {
      if (user.tfaMethod.google === true) {
        throw new Error('your method is enabel');
      }
      user.towFactAuth = status;
      user.tfaMethod.google = true;
      user.save();
    }
    if (method === 'email') {
      if (user.tfaMethod.email === true) {
        throw new Error('your method is enabel');
      }
      user.towFactAuth = status;
      user.tfaMethod.email = true;
      user.save();
    }
    if (method === 'phone') {
      if (user.tfaMethod.phone === true) {
        throw new Error('your method is enabel');
      }
      user.towFactAuth = status;
      user.tfaMethod.phone = true;
      user.save();
    }

    return { statusOf2fa: user.towFactAuth, method: method };
  }

  async UpdateSecret(id, secret) {
    const user = await userModel.findById(id);
    if (!user) throw new Error('user dont exsit');

    user.secret.key = secret.base32;
    user.secret.qrcode = secret.otpauth_url;
    await user.save();
    return secret;
  }

  async UpdateOtp(id, num) {
    try {
      const user = await userModel.findById(id);
      if (!user) throw new Error('user dont exsst');
      // if (user.otp !== null) throw new Error('please wite ');

      user.otp = num;
      user.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserRepositoty;
