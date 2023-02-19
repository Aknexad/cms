const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
  title: String,
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teams' }],
});

const Competition = mongoose.model('Competition', CompetitionSchema);

module.exports = Competition;
