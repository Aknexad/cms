const mongoose = require('mongoose');

const TeamsSchema = new mongoose.Schema({
  name: { type: String },
  localTeam: { type: Boolean, default: false },
  logo: { type: String },

  squad: {
    player: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
    cotch: { type: mongoose.Schema.Types.ObjectId, ref: 'Preron' },
  },
});

const Teams = mongoose.model('Teams', TeamsSchema);

module.exports = Teams;
