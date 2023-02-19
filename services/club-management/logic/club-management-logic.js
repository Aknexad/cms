const ClubReposotory = require('../database/reposotory/club-reposotory');

class ClubManagementLogic {
  constructor() {
    this.clubRepo = new ClubReposotory();
  }
  //
  // Teams locgic
  //

  // get teams
  async GetAllTeamsLogic() {
    const teams = await this.clubRepo.GetTeams();

    if (!teams) throw new Error('No teams Exsit');

    return teams;
  }

  // create team
  async CrateTeamLogic(name, isLocal) {
    const crateTeam = await this.clubRepo.CreateTeam(name, isLocal);

    if (!crateTeam) throw new Error('tray agen');

    return crateTeam;
  }

  //update team

  async UpdateTeam(payload) {
    const updateTeam = await this.clubRepo.UpdateTeam(payload);

    if (!updateTeam) throw new Error('team whit this id Dont exist ');
    return updateTeam;
  }

  //delete team

  async DeleteTeam(id) {
    const deleteteam = await this.clubRepo.DeleteTeam(id);

    if (!deleteteam) throw new Error('team whit this id Dont exist');

    return deleteteam;
  }
}

module.exports = ClubManagementLogic;
