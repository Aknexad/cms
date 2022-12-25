const UserLogic = require('../logic/user-logic');
const passport = require('passport');

module.exports = async app => {
  const logic = new UserLogic();

  app.get('/', async (req, res, next) => {
    console.log('form api user');
    res.json({ status: 200, message: 'root' });
  });

  app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    const result = await logic.UserRegister(username, password);

    if (result === 400) return res.send('username Exist');

    res.send(result);
  });

  app.post(
    '/login',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
      const { username, password } = req.body;

      const result = await logic.UserLogin(username, password);

      // if (result === '!user' || result === '!pass') {
      //   return res.send('usernaem or passowrd not match');
      // }

      res.json(result);
    }
  );

  app.post('/newtoken', async (req, res) => {
    // get refreach token
    const token = req.body.token;
    // cheack refrash token
    const result = await logic.NewAccessToken(token);

    if (result === 400) return res.sendStatus(403);

    res.send(result);
  });

  app.delete('/logout', logic.CeckAccessToekn, async (req, res) => {
    const token = req.body.token;
    const cheackToeknInDb = await logic.VerifyAccessToekn(token);

    if (cheackToeknInDb === 404) return res.send(403);
    if (cheackToeknInDb === 403) return res.send(403);

    const documentId = cheackToeknInDb;

    const deletTokens = await logic.UserLogout(documentId);

    if (deletTokens === 400) return res.sendStatus(400);

    res.sendStatus(200);
  });
};
