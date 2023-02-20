// require('dotenv').config({ path: './config/.env' });

const ClubManagementLogic = require('../logic/club-management-logic');

module.exports = async app => {
  const logic = new ClubManagementLogic();

  //
  // Teames Endpoint
  //

  // Get Teames
  app.get('/teams', async (req, res, next) => {
    try {
      const result = await logic.GetAllTeamsLogic();

      res.json({ status: 200, massage: 'Team crated', payload: result });
    } catch (error) {
      next(error);
    }
  });

  // Crate Team
  app.post('/teams', async (req, res, next) => {
    try {
      const { name, isLocal } = req.body;

      const result = await logic.CrateTeamLogic(name, isLocal);

      res.json({ status: 200, massage: 'Team crated', payload: result });
    } catch (error) {
      next(error);
    }
  });

  // update Teame
  app.put('/teams', async (req, res, next) => {
    try {
      const { id, name } = req.body;

      const result = await logic.UpdateTeam({ id, name });

      res.json({ status: 200, massage: 'Team Updated', payload: result });
    } catch (error) {
      next(error);
    }
  });

  // delete Team
  app.delete('/teams', async (req, res, next) => {
    try {
      const id = req.body.id;
      const result = await logic.DeleteTeam(id);

      res.json({ status: 200, massage: 'Team Deleted', payload: result });
    } catch (error) {
      next(error);
    }
  });

  //
  //competitions
  //

  // Get competitions
  app.get('/competitions', async (req, res, next) => {
    try {
      const { id, teams, matches } = req.query;

      const result = await logic.GetCompetitionsLogic({ id, matches, teams });

      res.json({ status: 200, massage: '', payload: result });
    } catch (error) {
      next(error);
    }
  });

  // Create competitions
  app.post('/competitions', async (req, res, next) => {
    try {
      const { title } = req.body;
      const result = await logic.CreateNewCompetitions(title);

      res.json({
        status: 200,
        massage: 'competitions created',
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  });

  // Update competitions
  app.put('/competitions', async (req, res, next) => {
    try {
      const { id, title, teamId, matchId, runType } = req.body;

      const result = await logic.UpdateCompetitionsFild({
        id,
        title,
        teamId,
        matchId,
        runType,
      });

      res.json({ status: 200, massage: '', payload: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  // delete competitions
  app.delete('/competitions', async (req, res, next) => {
    try {
      const id = req.body.id;

      const result = await logic.DeleteComptition(id);

      res.json({ status: 200, massage: '', payload: result });
    } catch (error) {
      next(error);
    }
  });

  //
  // Matches endpoint
  //

  // get matches

  // crate

  app.post('/matches', async (req, res, next) => {
    try {
      const { title, hust, gust, cpt } = req.body;

      const result = await logic.CreateMatch({ title, hust, gust, cpt });
      res.json({ status: 200, massage: '', payload: result });
    } catch (error) {
      next(error);
    }
  });

  // update

  // delete
};
