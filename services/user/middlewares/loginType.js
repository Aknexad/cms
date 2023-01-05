function loginType(req, res, next) {
  const tfa = req.user.tfaMethod;

  if (tfa.google === true || tfa.phone === true || tfa.email === true) {
    return res.json({ status: 200, message: 'user need for 2fa verfied' });
  }

  return next();
}

module.exports = loginType;
