const bcrypt = require('bcrypt');

require('dotenv').config({ path: './config/.env' });

const UserRepository = require('../../database/repository/user-repository');

const userRepo = new UserRepository();

class StrategyLogic {
  // constructor() {
  //   this.userRepo = new UserRepository();
  // }

  //   local startgy logic for username
  async LocalAuthByUsernaem(username, password, done) {
    try {
      const user = await userRepo.FindUser(username);
      console.log(user);

      if (!user) return done(null, false);

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
}

module.exports = StrategyLogic;
