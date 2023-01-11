const UserLogic = require('../logic/user-logic');

const logic = new UserLogic();
const userRepo = new UserRepository();

async function disabeleMethod(req, res, next) {
  const { userId } = req.body;
}

module.exports = disabeleMethod;
