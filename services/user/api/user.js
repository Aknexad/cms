const UserLogic = require('../logic/user-logic');
const passport = require('passport');

module.exports = async app => {
  const logic = new UserLogic();

  app.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      console.log('form api user');
      res.json({ status: 200, message: 'root' });
    }
  );

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
    const id = '63a17a9a9cfec37a12646a5d';
    // cheack refrash token
    const result = await logic.NewAccessToken(id, token);

    console.log(result);
    if (result === false) return res.sendStatus(403);

    res.send(result);
  });

  app.delete(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const result = await logic.UserLogout(req);

      if (result === false) return res.send('try agen');

      res.send(result);
    }
  );
};
