const UserLogic = require('../logic/user-logic');

module.exports = async app => {
  const logic = new UserLogic();

  app.get('/', async (req, res, next) => {
    console.log('form api user');
    const num = await logic.testing(24);
    res.json({ status: 200, message: num });
  });

  app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const result = await logic.UserRegister(username, password);
    res.send(result);
  });
};
