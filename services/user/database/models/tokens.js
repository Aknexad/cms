const mongoose = require('mongoose');

const UserTokensSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const UserTokens = mongoose.model('UserTokens', UserTokensSchema);

module.exports = UserTokens;
