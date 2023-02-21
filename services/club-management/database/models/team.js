const mongoose = require('mongoose');

const TeamsSchema = new mongoose.Schema({
  name: { type: String },
  localTeam: { type: Boolean, default: false },
  logo: { type: String },

  cotch: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  player: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  competition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
});

const Teams = mongoose.model('Teams', TeamsSchema);

module.exports = Teams;
