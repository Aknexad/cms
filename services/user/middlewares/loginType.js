const UserLogic = require('../logic/user-logic');

const logic = new UserLogic();

async function loginType(req, res, next) {
  const user = req.user;
  if (user.towFactAuth === false) return next();

  const tfa = user.tfaMethod;

  const tempToken = await logic.GenarateTempToken(user.id);

  if (tfa.email === true || tfa.phone === true) {
    const code = await logic.GenarateOtpAndSaved(user.id);

    console.log({ code });

    if (tfa.email === true)
      return res.json({
        status: 200,
        message: 'your 2fa is enabel chack your email',
        data: tempToken,
      });

    if (tfa.phone === true)
      return res.json({
        status: 200,
        message: 'your 2fa is enabel chack your phone',
        data: tempToken,
      });
  }

  return res.json({
    status: 200,
    message: 'your 2fa is enabel ',
    data: tempToken,
  });
}

function genarateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = loginType;
