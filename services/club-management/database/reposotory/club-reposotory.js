const Mongoose = require('mongoose');

const teamModel = require('../models/team');
const competitionsModel = require('../models/competition');
const matchesModel = require('../models/matches');
const personModel = require('../models/person');

class ClubReposotory {
  //
  // Team DB CRUD
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

  // add to player team
  async AddPlayerToTeam(id, playerId) {
    const query = await teamModel.updateOne(
      { _id: id },
      {
        $push: { player: playerId },
      }
    );
    return query;
  }

  // add coache to team

  // delete player form teams
  async DeletePlayerFormTeams(teamId, staffId) {
    const query = await teamModel.updateOne(
      { _id: teamId },
      {
        $pull: { player: staffId },
      }
    );

    return query;
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
  // competitions CRUD
  //

  // Get competitions
  async GetCompetitionOnlyTitle() {
    return competitionsModel.find().select('title');
  }
  async GetCompetitionAll(id) {
    return 'await competitionsModel.aggregate();';
  }
  async GetCompetitionWithTeams(id) {
    return await competitionsModel.aggregate([
      {
        $match: {
          _id: Mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teams',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          teams: '$result',
        },
      },
    ]);
  }
  async GetCompetitionWithMatches(id) {
    return await competitionsModel.aggregate([
      {
        $match: {
          _id: Mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'matches',
          localField: 'match',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          match: '$result',
        },
      },
    ]);
  }

  // crate competitions
  async CreateCompetition(title) {
    return await competitionsModel.create({ title: title });
  }

  // Update competitions
  async UpdateTitelOfCompetitions(id, title) {
    return await competitionsModel.findByIdAndUpdate(id, {
      title: title,
    });
  }
  async UpdateTeamsOfCompetitions(id, teamId) {
    const query = await competitionsModel.findById(id);

    if (!query) return query;

    query.teams.push(Mongoose.Types.ObjectId(teamId));
    query.save();

    return query;
  }
  async UpdateMatchesOfCompetitions(id, matchId) {
    const query = await competitionsModel.findById(id);

    if (!query) return query;

    query.match.push(Mongoose.Types.ObjectId(matchId));
    query.save();

    return query;
  }

  // delete competitions
  async DeleteCompetitionDocument(id) {
    const query = await competitionsModel.findByIdAndDelete(id);
    return query;
  }

  //
  // Matches CRUD
  //

  // Get Matches
  async GetAllMateches() {
    const query = await matchesModel.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'hust',
          foreignField: '_id',
          as: 'hust',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'gust',
          foreignField: '_id',
          as: 'gust',
        },
      },
      {
        $lookup: {
          from: 'competitions',
          localField: 'competition',
          foreignField: '_id',
          as: 'competitions',
        },
      },
      {
        $project: {
          _id: '$_id',
          hust: '$hust',
          gust: '$gust',
          competition: '$competitions',
        },
      },
    ]);
    return query;
  }
  async GetMatchById(id) {
    const query = await matchesModel.aggregate([
      {
        $match: {
          _id: Mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'hust',
          foreignField: '_id',
          as: 'hust',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'gust',
          foreignField: '_id',
          as: 'gust',
        },
      },
      {
        $lookup: {
          from: 'competitions',
          localField: 'competition',
          foreignField: '_id',
          as: 'competitions',
        },
      },
      {
        $project: {
          _id: '$_id',
          hust: '$hust',
          gust: '$gust',
          competition: '$competitions',
        },
      },
    ]);

    return query;
  }

  async GetMatchesByCompetition(id) {
    const query = await matchesModel.aggregate([
      {
        $match: {
          competition: Mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'hust',
          foreignField: '_id',
          as: 'hust',
        },
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'gust',
          foreignField: '_id',
          as: 'gust',
        },
      },
      {
        $lookup: {
          from: 'competitions',
          localField: 'competition',
          foreignField: '_id',
          as: 'competitions',
        },
      },
      {
        $project: {
          _id: '$_id',
          hust: '$hust',
          gust: '$gust',
          competition: '$competitions',
        },
      },
    ]);

    return query;
  }

  // Create Match
  async CreateMatch(data) {
    const query = await matchesModel.create({
      title: data.title,
      hust: data.hust,
      gust: data.gust,
      competition: Mongoose.Types.ObjectId(data.cpt),
    });

    return query;
  }

  // update Matches
  async UpdateMatcheTitle(id, title) {
    const query = await matchesModel.findByIdAndUpdate(id, { title: title });
    return query;
  }

  async ChangeMatcheTeams(id, hustId, gustId) {
    const query = await matchesModel.findById(id);

    if (!query) return query;

    query.hust = Mongoose.Types.ObjectId(hustId);
    query.gust = Mongoose.Types.ObjectId(gustId);

    query.save();

    return query;
  }

  async ChangeMatcheCompetiton(id, cptId) {
    const query = await matchesModel.findById(id);

    if (!query) return query;

    query.competition = Mongoose.Types.ObjectId(cptId);

    query.save();

    return query;
  }

  // delete Matche
  async DeleteMatche(id) {
    return await matchesModel.findByIdAndDelete(id);
  }

  //
  // Person CRUD
  //

  // Get person

  async GetAllPersons() {
    return await personModel.find();
  }

  async GetPersonsByRole(role) {
    return await personModel.find({ role: role });
  }

  // createPerson
  async CreateNewPerson(payload) {
    const query = await personModel.create({
      frist_name: payload.name,
      last_name: payload.lastName,
      role: payload.role,
    });
    return query;
  }

  // update person
  async UpdatePerson(payload) {
    const query = await personModel.findById(payload.id);

    if (!query) return query;

    (query.frist_name = payload.name), (query.last_name = payload.lastName);
    query.role = payload.role;
    query.save();
    return query;
  }

  // delete person
  async DeletePerson(id) {
    return await personModel.findByIdAndDelete(id);
  }
}

module.exports = ClubReposotory;
