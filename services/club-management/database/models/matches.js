const mongoose = require('mongoose');

const MatchesSchema = new mongoose.Schema({
  title: String,
  hust: { type: mongoose.Schema.Types.ObjectId },
  gust: { type: mongoose.Schema.Types.ObjectId },
  game_date: { type: Date, default: Date.now() },
  competition: { type: mongoose.Schema.Types.ObjectId },
});

const Matches = mongoose.model('Matches', MatchesSchema);

module.exports = Matches;
