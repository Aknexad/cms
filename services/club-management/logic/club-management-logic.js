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

  //
  // competitions Logic
  //

  // get all competitions
  async GetCompetitionsLogic(payload) {
    if (payload.id === '') {
      return await this.clubRepo.GetCompetitionOnlyTitle();
    }

    if (payload.teams === 'true' && payload.matches === 'false') {
      const competitionWithTeams = await this.clubRepo.GetCompetitionWithTeams(
        payload.id
      );

      if (competitionWithTeams.length === 0) {
        throw new Error('no competitions with this Id exist');
      }
      return competitionWithTeams;
    }

    if (payload.matches == true && payload.teams == false) {
      const competitionsWithMatches =
        await this.clubRepo.GetCompetitionWithMatches(payload.id);

      if (!competitionsWithMatches)
        throw new Error('no competitions with this Id exist');
      return competitionsWithMatches;
    }
  }

  // crate new competitions
  async CreateNewCompetitions(title) {
    const newCompetitions = await this.clubRepo.CreateCompetition(title);

    if (!newCompetitions) throw new Error('internal server error tray agen');
    return newCompetitions;
  }

  // update competitions

  async UpdateCompetitionsFild(payload) {
    if (payload.runType === 'title') {
      const updateTitle = await this.clubRepo.UpdateTitelOfCompetitions(
        payload.id,
        payload.title
      );

      if (!updateTitle) throw new Error('competitions with thsi id dont exist');

      return updateTitle;
    }

    if (payload.runType === 'addTeam') {
      const addTeam = await this.clubRepo.UpdateTeamsOfCompetitions(
        payload.id,
        payload.teamId
      );
      if (!addTeam) throw new Error('competitions with thsi id dont exist');

      return addTeam;
    }

    if (payload.runType === 'addMatch') {
      const addMatch = await this.clubRepo.UpdateMatchesOfCompetitions(
        payload.id,
        payload.matchId
      );
      if (!addMatch) throw new Error('competitions with thsi id dont exist');

      return addMatch;
    }
  }

  // delete competitions

  async DeleteComptition(id) {
    const deleteCompetition = await this.clubRepo.DeleteCompetitionDocument(id);
    return deleteCompetition;
  }
}

module.exports = ClubManagementLogic;
