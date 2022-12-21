const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },

  isAdmin: Boolean,

  token: [String],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
