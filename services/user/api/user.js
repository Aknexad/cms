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
        const { username } = req.body;

        const result = await logic.UserLogin(username);

        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.post('/login-2fa', async (req, res, next) => {
    try {
      const result = await logic.UserLogin(req.body.username);

      res.json(result);
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
