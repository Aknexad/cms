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

  async addStaffToTeamLogice(payload) {
    const addStaff = await this.clubRepo.AddStaffToTeam(
      payload.teamId,
      payload.playerId,
      payload.cocheId
    );

    return addStaff;
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

  //
  // Matches
  //

  // Get matches
  async GetMatchesLogic(payload) {
    if (payload.matchId) {
      const match = await this.clubRepo.GetMatchById(payload.matchId);

      if (!match) throw new Error('match with this id dont exsit');
      return match;
    }

    if (payload.competitionId) {
      const match = await this.clubRepo.GetMatchesByCompetition(
        payload.competitionId
      );

      if (!match) throw new Error('match with this competitions dont exsit');
      return match;
    }

    const allMatche = await this.clubRepo.GetAllMateches();
    return allMatche;
  }

  // create match
  async CreateMatch(data) {
    const create = await this.clubRepo.CreateMatch(data);
    return create;
  }

  // Upadate Matches
  async UpdateMatchesLogice(payload) {
    if (payload.title) {
      const updateTitle = await this.clubRepo.UpdateMatcheTitle(
        payload.id,
        payload.title
      );

      if (!updateTitle) throw new Error('math with this id Dont exist');

      return updateTitle;
    }

    if (payload.cptId) {
      const changeCompetition = await this.clubRepo.ChangeMatcheCompetiton(
        payload.id,
        payload.cptId
      );
      if (!changeCompetition) throw new Error('math with this id Dont exist');

      return changeCompetition;
    }

    const changeTeam = await this.clubRepo.ChangeMatcheTeams(
      payload.id,
      payload.hustId,
      payload.gustId
    );
    if (!changeTeam) throw new Error('math with this id Dont exist');

    return changeTeam;
  }

  // delete Matche
  async DeleteMatche(id) {
    const deleteMatch = await this.clubRepo.DeleteMatche(id);

    if (!deleteMatch) throw new Error('matche doset exist');

    return deleteMatch;
  }

  //
  // Person
  //

  // Get
  async GetPersonLogic(payload) {
    if (payload.role) {
      const persun = await this.clubRepo.GetPersonsByRole(payload.role);

      if (!persun) throw new Error('cheack yor input');
      return persun;
    }

    const everyOne = await this.clubRepo.GetAllPersons();
    return everyOne;
  }

  // Create
  async CreatePerson(payload) {
    const newPerson = await this.clubRepo.CreateNewPerson(payload);

    return newPerson;
  }

  // Update person
  async UpdatePersonLogic(payload) {
    const updatePerson = await this.clubRepo.UpdatePerson(payload);

    if (!updatePerson) throw new Error('person dosent exsit');
    return updatePerson;
  }

  // delete person
  async DeletePerson(id) {
    const deletePerson = await this.clubRepo.DeletePerson(id);
    if (!deletePerson) throw new Error('persone doset exist');
    return deletePerson;
  }
}

module.exports = ClubManagementLogic;
