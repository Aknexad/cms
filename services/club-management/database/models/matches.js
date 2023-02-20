const mongoose = require('mongoose');

const MatchesSchema = new mongoose.Schema({
  title: String,
  hust: String,
  gust: String,
  game_date: { type: Date, default: Date.now() },
  competition: { type: mongoose.Schema.Types.ObjectId },
});

const Matches = mongoose.model('Matches', MatchesSchema);

module.exports = Matches;
