const mongoose = require('mongoose');

const TeamsSchema = new mongoose.Schema({
  name: { type: String },
  localTeam: { type: Boolean, default: false },
  logo: { type: String },

  squad: {
    player: [{ type: mongoose.Schema.Types.ObjectId }],
    cotch: { type: mongoose.Schema.Types.ObjectId },
  },
  competition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
});

const Teams = mongoose.model('Teams', TeamsSchema);

module.exports = Teams;
