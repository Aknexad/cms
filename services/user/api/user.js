const UserLogic = require('../logic/user-logic');

module.exports = async app => {
  const logic = new UserLogic();

  app.get('/', async (req, res, next) => {
    console.log('form api user');
    res.json({ status: 200, message: 'root' });
  });

  app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const result = await logic.UserRegister(username, password);
    res.send(result);
  });

  app.post('/login', async (req, res, next) => {
    //  get user input
    // send to logic
    // show result
  });

  app.get('/newToken', async (req, res, next) => {
    // get refreach token
    // cheack refrash token
    // show result
  });

  app.delete('/logout', async (req, res) => {
    // get user info
    // chack user info
    // delete token form db
    // rediract user
  });
};
