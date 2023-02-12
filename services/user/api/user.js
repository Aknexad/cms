const UserLogic = require('../logic/user-logic');
const { setTimeout } = require('timers/promises');

require('dotenv').config({ path: './config/.env' });

const registerValidation = require('../middlewares/input-validation');

//middlewares
const loginType = require('../middlewares/loginType');
const {
  PublishMessage,
  SubscribMessage,
  RPCObserver,
} = require('../middlewares/message-broker');

module.exports = async (app, passport, channel) => {
  const logic = new UserLogic();

  RPCObserver('BRPC', logic);

  app.post('/register', registerValidation, async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const result = await logic.UserRegister(username, password);

      res.send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  // login
  app.post(
    '/login',
    passport.authenticate('local', { session: false }),
    loginType,
    async (req, res, next) => {
      try {
        const { userInput } = req.body;

        const data = `${userInput} login`;
        const result = await logic.UserLogin(userInput);

        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    '/login-2fa',
    passport.authenticate('verifyingTotp', { session: false }),
    async (req, res, next) => {
      try {
        const result = await logic.UserLogin(req.user.username);

        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    '/login-otp',
    passport.authenticate('otpAuth', { session: false }),
    async (req, res, next) => {
      try {
        const result = await logic.UserLogin(req.user.username);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post('/enable-2fa', async (req, res, next) => {
    try {
      const { userId, status, method } = req.body;

      const result = await logic.EnableTowFactAuth(userId, status, method);

      res.json({
        status: 200,
        message: 'your Tow fact Auth is Enable',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post(
    '/disable-2fa',
    passport.authenticate('disTotp', { session: false }),
    async (req, res, next) => {
      try {
        const { userId, status, type } = req.body;

        const result = await logic.DisabelTowFactAuth(userId, status, type);

        res.json({
          status: 200,
          message: 'your Tow fact Auth is disable',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post('/send-otp', async (req, res, next) => {
    try {
      const { userId } = req.body;

      const code = await logic.GenarateOtpAndSaved();
      await logic.SetOtp(userId, code);

      res.json({ status: 200, message: '', data: code });

      await setTimeout(5000);
      await logic.SetOtp(userId, null);
    } catch (error) {
      next(error);
    }
  });

  app.post('/newtoken', async (req, res, next) => {
    try {
      // get refreach token
      const token = req.body.token;
      // cheack refrash token
      const result = await logic.NewAccessToken(token);

      // if (result === 400) return res.sendStatus(403);

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/logout', logic.CeckAccessToekn, async (req, res, next) => {
    try {
      const token = req.body.token;
      const cheackToeknInDb = await logic.VerifyAccessToekn(token);

      const documentId = cheackToeknInDb;

      const deletTokens = await logic.UserLogout(documentId);
      res.json({ status: deletTokens, message, data });
    } catch (error) {
      next(error);
    }
  });
};
