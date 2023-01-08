const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },

  isAdmin: { type: Boolean, default: false },

  towFactAuth: { type: Boolean, default: false },

  tfaMethod: {
    google: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
  },

  tempToken: String,

  secret: {
    key: { type: String, default: '' },
    qrcode: { type: String, default: '`' },
  },

  token: [String],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
