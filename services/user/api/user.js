const UserLogic = require('../logic/user-logic');

const registerValidation = require('../middlewares/input-validation');

//middlewares
const loginType = require('../middlewares/loginType');

module.exports = async (app, passport) => {
  const logic = new UserLogic();

  app.get('/', async (req, res, next) => {
    try {
      throw new Error('errorr handling test');
      console.log('form api user');
      res.json({ status: 200, message: 'root' });
    } catch (error) {
      next(error);
    }
  });

  app.post('/register', async (req, res, next) => {
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
    passport.authenticate(['local', 'local-email', 'local-phone'], {
      session: false,
    }),
    loginType,

    async (req, res, next) => {
      try {
        const { username } = req.body;

        const result = await logic.UserLogin(username);

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

      const code = await logic.GenarateOtpAndSaved(userId);
      res.json({ status: 200, message: '', data: code });
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
      res.sendStatus(deletTokens);
    } catch (error) {
      next(error);
    }
  });
};
