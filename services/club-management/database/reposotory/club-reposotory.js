const teamModel = require('../models/team');

class ClubReposotory {
  //
  // Team DB opration
  //

  // GetTeams
  async GetTeams() {
    try {
      const query = await teamModel.find();
      return query;
    } catch (error) {
      throw new Error(error);
    }
  }

  // crate Teams
  async CreateTeam(name, isLocal) {
    try {
      const newTeam = await teamModel.create({
        name: name,
        localTeam: isLocal,
      });

      return newTeam;
    } catch (error) {
      throw new Error(error);
    }
  }

  // update team
  async UpdateTeam(payload) {
    try {
      const query = await teamModel.findByIdAndUpdate(payload.id, {
        name: payload.name,
      });

      return query;
    } catch (error) {
      throw new Error(error);
    }
  }

  // delete team
  async DeleteTeam(id) {
    try {
      return teamModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  //
  // comptions
  //
}

module.exports = ClubReposotory;
