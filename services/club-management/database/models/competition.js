const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
  title: String,
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teams' }],
  match: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
});

const Competition = mongoose.model('Competition', CompetitionSchema);

module.exports = Competition;
