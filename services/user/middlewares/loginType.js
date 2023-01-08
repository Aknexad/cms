const UserLogic = require('../logic/user-logic');

const logic = new UserLogic();

function loginType(req, res, next) {
  const user = req.user;
  if (user.towFactAuth === false) return next();

  const tfa = user.tfaMethod;

  const tempToken = logic.GenarateTempToken(user.id);
  if (tfa.google === true || tfa.phone === true || tfa.email === true) {
    return res.json({
      status: 200,
      message: 'user need for 2fa verfied',
      data: tempToken,
    });
  }

  return next();
}

module.exports = loginType;
