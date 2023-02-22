const UserLogic = require('../logic/user-logic');
const { setTimeout } = require('timers/promises');

require('dotenv').config({ path: './config/.env' });

const registerValidation = require('../middlewares/input-validation');

//middlewares
const loginType = require('../middlewares/loginType');
// const {
//   PublishMessage,
//   SubscribMessage,
//   RPCObserver,
// } = require('../middlewares/message-broker');

module.exports = async (app, passport, channel) => {
  const logic = new UserLogic();

  // RPCObserver('BRPC', logic);

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

  app.put('/set-otp', async (req, res, next) => {
    try {
      // get data
      const { userId, status, method } = req.body;
      // call

      const result = await logic.SetOtpStatus(userId, status, method);

      // return result
      res.json({
        status: 200,
        massage: `your ${method} OTP is ${result}`,
        payload: {},
      });
    } catch (error) {
      next(error);
    }
  });

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

      const code = await logic.GenarateOtp();
      await logic.SetOtp(userId, code);

      res.json({ status: 200, message: '', data: code });
      // await setTimeout(15000);
      // await logic.SetOtp(userId, null);
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

  app.delete('/logout', async (req, res, next) => {
    try {
      const accessToken = req.body.accessToken;
      const cheackToeknInDb = await logic.VerifyAccessToekn(accessToken);

      const documentId = cheackToeknInDb;

      const deletTokens = await logic.UserLogout(documentId);
      res.json({ status: 200, massage: 'logpout', payload: { deletTokens } });
    } catch (error) {
      next(error);
    }
  });

  // recavery password
  app.post('/recovery-password', async (req, res, next) => {
    try {
      const { userInput, method } = req.body;

      const result = await logic.RequestRestPass(userInput, method);

      res.json({ status: 200, massage: result, payload: {} });
    } catch (error) {
      next(error);
    }
  });

  app.post('/rp-verfi', async (req, res, next) => {
    try {
      const { userInput, method, code, password } = req.body;
      const { token, subToken, id } = req.query;

      const result = await logic.VerfyRestPass({
        userInput,
        method,
        code,
        password,
        token,
        subToken,
        id,
      });

      res.json({ status: 200, massage: result, payload: {} });
    } catch (error) {
      next(error);
    }
  });
};
